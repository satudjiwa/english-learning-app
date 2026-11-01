import { getPreferences, updatePreferences } from "../store.js";
import { icon } from "../icons.js";
import { esc } from "../utils.js";

const PIXELS_PER_SPEED_UNIT = 10;
const MAX_FRAME_SECONDS = 0.1;
const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"]);

export function teleprompterHTML(lesson) {
  const prefs = getPreferences("teleprompter");
  return `
    <div class="tp-page" data-tp data-tp-id="${esc(lesson.id)}">
      <header class="mode-bar">
        <a class="mode-back" href="#/lesson/${esc(lesson.id)}">
          ${icon("chevron-left", 18)} <span>Lesson</span>
        </a>
        <div class="mode-bar-title">
          <span class="eyebrow">Teleprompter</span>
          <strong>${esc(lesson.title)}</strong>
        </div>
        <button class="btn btn-ghost btn-sm" type="button" data-tp-fullscreen>
          ${icon("expand", 17)} <span>Fullscreen</span>
        </button>
      </header>

      <div class="tp-stage" data-tp-stage>
        <div class="tp-center-line" aria-hidden="true">
          <span>current sentence</span>
        </div>
        <div class="tp-scroll" data-tp-scroll tabindex="0" aria-label="Teleprompter script">
          <div class="tp-spacer" data-tp-spacer></div>
          <div class="tp-script" style="--tp-font-size:${prefs.fontSize}px; --tp-line-height:${prefs.lineSpacing};">
            ${lesson.dialogue.map((line, index) => `
              <article class="tp-line" data-tp-line="${index}">
                <span class="tp-speaker">${esc(line.speaker)}</span>
                <p class="tp-en" lang="en">${esc(line.english)}</p>
                <p class="tp-id" lang="id">${esc(line.indonesian)}</p>
              </article>
            `).join("")}
          </div>
          <div class="tp-spacer" data-tp-spacer></div>
        </div>
      </div>

      <div class="tp-controls" data-tp-controls>
        <div class="tp-transport">
          <button class="btn btn-primary" type="button" data-tp-play>
            ${icon("play", 18)} <span>Play</span>
          </button>
          <button class="btn btn-secondary" type="button" data-tp-restart>
            ${icon("rotate-ccw", 17)} <span>Restart</span>
          </button>
          <button class="btn btn-secondary" type="button" data-tp-lang aria-pressed="${prefs.showIndonesian}">
            ${icon("globe", 17)} <span>${prefs.showIndonesian ? "EN + ID" : "EN only"}</span>
          </button>
        </div>

        <div class="tp-sliders">
          <label class="range-field">
            <span>${icon("gauge", 15)} Speed <output data-tp-speed-output>${prefs.speed}</output></span>
            <input type="range" min="1" max="10" step="1" value="${prefs.speed}" data-tp-speed>
          </label>
          <label class="range-field">
            <span>${icon("text-size", 15)} Text <output data-tp-font-output>${prefs.fontSize}px</output></span>
            <input type="range" min="18" max="36" step="1" value="${prefs.fontSize}" data-tp-font>
          </label>
          <label class="range-field">
            <span>${icon("line-height", 15)} Spacing <output data-tp-space-output>${prefs.lineSpacing.toFixed(1)}</output></span>
            <input type="range" min="1.2" max="2.2" step="0.1" value="${prefs.lineSpacing}" data-tp-space>
          </label>
        </div>

        <p class="tp-hint">
          ${icon("circle-help", 15)}
          <span>Play starts the scroll. Touch or scroll the script to pause. The highlighted line is the one crossing the center line.</span>
        </p>
      </div>
    </div>
  `;
}

export function mountTeleprompter(root, lesson) {
  const page = root.querySelector("[data-tp]");
  if (!page) return () => {};

  const stopButton = page.querySelector("[data-tp-play]");
  const restartButton = page.querySelector("[data-tp-restart]");
  const languageButton = page.querySelector("[data-tp-lang]");
  const fullscreenButton = page.querySelector("[data-tp-fullscreen]");
  const scroll = page.querySelector("[data-tp-scroll]");
  const stage = page.querySelector("[data-tp-stage]");
  const script = page.querySelector(".tp-script");
  const speedInput = page.querySelector("[data-tp-speed]");
  const fontInput = page.querySelector("[data-tp-font]");
  const spaceInput = page.querySelector("[data-tp-space]");
  const speedOutput = page.querySelector("[data-tp-speed-output]");
  const fontOutput = page.querySelector("[data-tp-font-output]");
  const spaceOutput = page.querySelector("[data-tp-space-output]");
  const spacers = [...page.querySelectorAll("[data-tp-spacer]")];
  const lines = [...page.querySelectorAll("[data-tp-line]")];
  if (!stopButton || !scroll || !stage || !script || !lines.length) return () => {};

  let prefs = getPreferences("teleprompter");
  let playing = false;
  let raf = 0;
  let lastTime = 0;
  let wakeLock = null;
  let wakeLockRequest = null;
  let disposed = false;
  let currentIndex = -1;
  let scrollPosition = scroll.scrollTop;

  function formatSpeed(value, suffix = "") {
    return `${value}${suffix}`;
  }

  function applyPreferences() {
    script.style.setProperty("--tp-font-size", `${prefs.fontSize}px`);
    script.style.setProperty("--tp-line-height", String(prefs.lineSpacing));
    page.classList.toggle("is-id-hidden", !prefs.showIndonesian);
    languageButton?.setAttribute("aria-pressed", String(prefs.showIndonesian));
    if (languageButton) {
      languageButton.innerHTML = `${icon("globe", 17)} <span>${prefs.showIndonesian ? "EN + ID" : "EN only"}</span>`;
    }
    if (speedOutput) speedOutput.textContent = formatSpeed(prefs.speed);
    if (fontOutput) fontOutput.textContent = formatSpeed(prefs.fontSize, "px");
    if (spaceOutput) spaceOutput.textContent = prefs.lineSpacing.toFixed(1);
  }

  function updateSpacers() {
    const height = Math.max(20, Math.round(stage.clientHeight / 2));
    spacers.forEach(spacer => {
      spacer.style.height = `${height}px`;
    });
  }

  function syncScrollPosition() {
    scrollPosition = scroll.scrollTop;
  }

  function markCurrent(index) {
    if (index === currentIndex) return;
    currentIndex = index;
    lines.forEach((line, lineIndex) => {
      const active = lineIndex === index;
      line.classList.toggle("is-current", active);
      line.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  function updateCurrent() {
    const box = scroll.getBoundingClientRect();
    const center = box.top + box.height / 2;
    let winner = 0;
    let closest = Number.POSITIVE_INFINITY;

    lines.forEach((line, index) => {
      const rect = line.getBoundingClientRect();
      if (rect.top <= center && rect.bottom >= center) {
        winner = index;
        closest = -1;
      } else if (closest >= 0) {
        const distance = Math.abs((rect.top + rect.bottom) / 2 - center);
        if (distance < closest) {
          closest = distance;
          winner = index;
        }
      }
    });

    markCurrent(winner);
  }

  function renderPlayState() {
    stopButton.innerHTML = playing
      ? `${icon("pause", 18)} <span>Pause</span>`
      : `${icon("play", 18)} <span>Play</span>`;
    page.classList.toggle("is-playing", playing);
  }

  function setPlaying(next) {
    if (playing === next) {
      renderPlayState();
      return;
    }
    playing = next;
    renderPlayState();

    if (playing) {
      scrollPosition = scroll.scrollTop;
      lastTime = performance.now();
      raf = requestAnimationFrame(tick);
      requestWakeLock();
    } else {
      cancelAnimationFrame(raf);
      raf = 0;
      releaseWakeLock();
    }
  }

  function tick(time) {
    if (!playing) return;
    const delta = Math.min(MAX_FRAME_SECONDS, Math.max(0, (time - lastTime) / 1000));
    lastTime = time;

    const max = Math.max(0, scroll.scrollHeight - scroll.clientHeight);
    scrollPosition += prefs.speed * PIXELS_PER_SPEED_UNIT * delta;
    if (scrollPosition >= max) {
      scrollPosition = max;
      scroll.scrollTop = max;
      updateCurrent();
      setPlaying(false);
      return;
    }

    scroll.scrollTop = scrollPosition;
    updateCurrent();
    raf = requestAnimationFrame(tick);
  }

  async function requestWakeLock() {
    if (!("wakeLock" in navigator) || wakeLock || wakeLockRequest) return;
    wakeLockRequest = navigator.wakeLock.request("screen");
    try {
      const lock = await wakeLockRequest;
      wakeLockRequest = null;
      if (disposed || !playing) {
        try {
          await lock.release();
        } catch {
          // Wake Lock is optional.
        }
        return;
      }
      wakeLock = lock;
      lock.addEventListener?.("release", () => {
        if (wakeLock === lock) wakeLock = null;
      });
    } catch {
      wakeLockRequest = null;
      wakeLock = null;
    }
  }

  function releaseWakeLock() {
    if (!wakeLock) return;
    try {
      wakeLock.release();
    } catch {
      // Wake Lock is optional.
    }
    wakeLock = null;
  }

  function restart() {
    setPlaying(false);
    scrollPosition = 0;
    scroll.scrollTop = 0;
    updateCurrent();
  }

  function togglePlay() {
    if (!playing) {
      const max = Math.max(0, scroll.scrollHeight - scroll.clientHeight);
      if (scrollPosition >= max - 0.5) {
        scrollPosition = 0;
        scroll.scrollTop = 0;
      } else {
        scrollPosition = scroll.scrollTop;
      }
      updateCurrent();
    }
    setPlaying(!playing);
  }

  function onUserScroll() {
    if (playing) setPlaying(false);
    scrollPosition = scroll.scrollTop;
  }

  function onScroll() {
    // Programmatic scrollTop updates also emit "scroll". Never pause here;
    // pause only on real user input such as wheel, touch, pointer, or keys.
    updateCurrent();
  }

  function onSpeedInput() {
    prefs = updatePreferences("teleprompter", { speed: speedInput.value });
    applyPreferences();
  }

  function onFontInput() {
    prefs = updatePreferences("teleprompter", { fontSize: fontInput.value });
    applyPreferences();
    updateSpacers();
    syncScrollPosition();
    updateCurrent();
  }

  function onSpaceInput() {
    prefs = updatePreferences("teleprompter", { lineSpacing: spaceInput.value });
    applyPreferences();
    syncScrollPosition();
    updateCurrent();
  }

  function onLanguage() {
    prefs = updatePreferences("teleprompter", { showIndonesian: !prefs.showIndonesian });
    applyPreferences();
    syncScrollPosition();
    updateCurrent();
  }

  function onFullscreen() {
    const target = page;
    if (!document.fullscreenElement) {
      target.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  function onFullscreenChange() {
    if (!fullscreenButton) return;
    const active = document.fullscreenElement === page;
    fullscreenButton.innerHTML = active
      ? `${icon("minimize", 17)} <span>Exit full</span>`
      : `${icon("expand", 17)} <span>Fullscreen</span>`;
    window.setTimeout(() => {
      updateSpacers();
      syncScrollPosition();
      updateCurrent();
    }, 50);
  }

  function onKeydown(event) {
    if (event.target instanceof HTMLInputElement) return;

    if (event.code === "Space") {
      // Let a focused button handle Space itself, otherwise the page handler
      // and the button's click would toggle playback twice.
      if (event.target instanceof HTMLButtonElement) return;
      event.preventDefault();
      togglePlay();
      return;
    }

    if (event.key.toLowerCase() === "r") {
      restart();
      return;
    }

    if (SCROLL_KEYS.has(event.key)) {
      if (playing) setPlaying(false);
      requestAnimationFrame(syncScrollPosition);
    }
  }

  function onResize() {
    updateSpacers();
    syncScrollPosition();
    updateCurrent();
  }

  function onVisibility() {
    if (document.hidden) setPlaying(false);
  }

  stopButton.addEventListener("click", togglePlay);
  restartButton?.addEventListener("click", restart);
  languageButton?.addEventListener("click", onLanguage);
  fullscreenButton?.addEventListener("click", onFullscreen);
  speedInput?.addEventListener("input", onSpeedInput);
  fontInput?.addEventListener("input", onFontInput);
  spaceInput?.addEventListener("input", onSpaceInput);
  scroll.addEventListener("wheel", onUserScroll, { passive: true });
  scroll.addEventListener("touchstart", onUserScroll, { passive: true });
  scroll.addEventListener("pointerdown", onUserScroll);
  scroll.addEventListener("scroll", onScroll, { passive: true });
  page.addEventListener("keydown", onKeydown);
  window.addEventListener("resize", onResize);
  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("visibilitychange", onVisibility);

  applyPreferences();
  requestAnimationFrame(() => {
    updateSpacers();
    syncScrollPosition();
    updateCurrent();
  });

  return () => {
    disposed = true;
    setPlaying(false);
    scroll.removeEventListener("wheel", onUserScroll);
    scroll.removeEventListener("touchstart", onUserScroll);
    scroll.removeEventListener("pointerdown", onUserScroll);
    scroll.removeEventListener("scroll", onScroll);
    page.removeEventListener("keydown", onKeydown);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("fullscreenchange", onFullscreenChange);
    document.removeEventListener("visibilitychange", onVisibility);
    if (document.fullscreenElement === page) {
      document.exitFullscreen?.().catch(() => {});
    }
  };
}
