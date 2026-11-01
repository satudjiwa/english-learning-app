import { getPreferences, markPracticeStarted, updatePreferences } from "../store.js";
import { mountSheet } from "./sheet.js";
import { icon } from "../icons.js";
import { esc } from "../utils.js";

const PIXELS_PER_SPEED_UNIT = 10;
const MAX_FRAME_SECONDS = 0.1;
const HINT_KEY = "small-steps-teleprompter-hint";
const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"]);

function hintIsDismissed() {
  try {
    return window.localStorage.getItem(HINT_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberHint() {
  try {
    window.localStorage.setItem(HINT_KEY, "1");
  } catch {
    // The hint simply appears again when storage is unavailable.
  }
}

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
      </header>

      <div class="tp-stage" data-tp-stage>
        <div class="tp-guide" data-tp-guide aria-hidden="true">
          <span>Current sentence</span>
        </div>
        <div class="tp-scroll" data-tp-scroll tabindex="0" aria-label="Teleprompter script">
          <div class="tp-spacer" data-tp-spacer="top"></div>
          <div class="tp-script" style="--tp-font-size:${prefs.fontSize}px; --tp-line-height:${prefs.lineSpacing};">
            ${lesson.dialogue.map((line, index) => `
              <article class="tp-line" data-tp-line="${index}">
                <span class="tp-speaker">${esc(line.speaker)}</span>
                <p class="tp-en" lang="en">${esc(line.english)}</p>
                <p class="tp-id" lang="id">${esc(line.indonesian)}</p>
              </article>
            `).join("")}
          </div>
          <div class="tp-spacer" data-tp-spacer="bottom"></div>
        </div>

        <div class="tp-toast" data-tp-hint role="status" hidden>
          <span>Touch the script to pause. Open Settings for speed, text size, and language.</span>
          <button class="tp-toast-close" type="button" data-tp-hint-close aria-label="Dismiss hint">
            ${icon("x", 16)}
          </button>
        </div>
      </div>

      <div class="tp-controls">
        <button class="tp-icon-btn" type="button" data-tp-restart aria-label="Restart" title="Restart">
          ${icon("rotate-ccw", 21)}
        </button>
        <button class="tp-play" type="button" data-tp-play>
          ${icon("play", 22)} <span>Play</span>
        </button>
        <button class="tp-icon-btn" type="button" data-tp-settings aria-label="Settings" title="Settings">
          ${icon("settings", 21)}
        </button>
      </div>

      <div class="sheet-layer" data-tp-sheet hidden>
        <section class="sheet" role="dialog" aria-modal="true" aria-labelledby="tp-settings-title" tabindex="-1">
          <div class="sheet-grabber" aria-hidden="true"></div>
          <header class="sheet-head">
            <h2 id="tp-settings-title">Teleprompter settings</h2>
            <button class="sheet-close" type="button" data-sheet-close data-sheet-focus aria-label="Close settings">
              ${icon("x", 20)}
            </button>
          </header>
          <div class="sheet-body">
            <label class="setting-field">
              <span class="setting-label">Speed <output data-tp-speed-output>${prefs.speed}</output></span>
              <input type="range" min="1" max="10" step="1" value="${prefs.speed}" data-tp-speed>
              <span class="setting-scale"><span>Slow</span><span>Fast</span></span>
            </label>

            <label class="setting-field">
              <span class="setting-label">Text size <output data-tp-font-output>${prefs.fontSize}px</output></span>
              <input type="range" min="18" max="36" step="1" value="${prefs.fontSize}" data-tp-font>
              <span class="setting-scale"><span>Small</span><span>Large</span></span>
            </label>

            <label class="setting-field">
              <span class="setting-label">Line spacing <output data-tp-space-output>${prefs.lineSpacing.toFixed(1)}</output></span>
              <input type="range" min="1.2" max="2.2" step="0.1" value="${prefs.lineSpacing}" data-tp-space>
              <span class="setting-scale"><span>Tight</span><span>Loose</span></span>
            </label>

            <div class="setting-field">
              <span class="setting-label">Language</span>
              <div class="segmented" role="group" aria-label="Teleprompter language">
                <button type="button" data-tp-lang-choice="en" aria-pressed="${!prefs.showIndonesian}">EN only</button>
                <button type="button" data-tp-lang-choice="both" aria-pressed="${prefs.showIndonesian}">EN + Indonesian</button>
              </div>
            </div>

            <button class="setting-row" type="button" data-tp-fullscreen>
              <span class="setting-row-label">
                ${icon("expand", 19)}
                <span data-tp-fullscreen-label>Fullscreen</span>
              </span>
              ${icon("chevron-right", 18)}
            </button>

            <button class="btn btn-primary btn-wide" type="button" data-sheet-close>Done</button>
          </div>
        </section>
      </div>
    </div>
  `;
}

export function mountTeleprompter(root, lesson) {
  const page = root.querySelector("[data-tp]");
  if (!page) return () => {};

  const playButton = page.querySelector("[data-tp-play]");
  const restartButton = page.querySelector("[data-tp-restart]");
  const settingsButton = page.querySelector("[data-tp-settings]");
  const scroll = page.querySelector("[data-tp-scroll]");
  const stage = page.querySelector("[data-tp-stage]");
  const script = page.querySelector(".tp-script");
  const speedInput = page.querySelector("[data-tp-speed]");
  const fontInput = page.querySelector("[data-tp-font]");
  const spaceInput = page.querySelector("[data-tp-space]");
  const speedOutput = page.querySelector("[data-tp-speed-output]");
  const fontOutput = page.querySelector("[data-tp-font-output]");
  const spaceOutput = page.querySelector("[data-tp-space-output]");
  const languageChoices = [...page.querySelectorAll("[data-tp-lang-choice]")];
  const fullscreenButton = page.querySelector("[data-tp-fullscreen]");
  const fullscreenLabel = page.querySelector("[data-tp-fullscreen-label]");
  const topSpacer = page.querySelector('[data-tp-spacer="top"]');
  const bottomSpacer = page.querySelector('[data-tp-spacer="bottom"]');
  const hint = page.querySelector("[data-tp-hint]");
  const hintClose = page.querySelector("[data-tp-hint-close]");
  const lines = [...page.querySelectorAll("[data-tp-line]")];
  if (!playButton || !scroll || !stage || !script || !lines.length) return () => {};

  const sheet = mountSheet({
    layer: page.querySelector("[data-tp-sheet]"),
    openButton: settingsButton,
    onOpen: () => setPlaying(false)
  });

  let prefs = getPreferences("teleprompter");
  let playing = false;
  let raf = 0;
  let lastTime = 0;
  let wakeLock = null;
  let wakeLockRequest = null;
  let disposed = false;
  let currentIndex = -1;
  let scrollPosition = scroll.scrollTop;
  let guideY = 0;

  function applyPreferences() {
    script.style.setProperty("--tp-font-size", `${prefs.fontSize}px`);
    script.style.setProperty("--tp-line-height", String(prefs.lineSpacing));
    page.classList.toggle("is-id-hidden", !prefs.showIndonesian);
    languageChoices.forEach(button => {
      button.setAttribute("aria-pressed", String(
        button.dataset.tpLangChoice === "both" ? prefs.showIndonesian : !prefs.showIndonesian
      ));
    });
    if (speedOutput) speedOutput.textContent = String(prefs.speed);
    if (fontOutput) fontOutput.textContent = `${prefs.fontSize}px`;
    if (spaceOutput) spaceOutput.textContent = prefs.lineSpacing.toFixed(1);
  }

  function updateGeometry() {
    const stageHeight = stage.clientHeight;
    const stageTop = stage.getBoundingClientRect().top;
    const comfortable = stageHeight > 160 ? 60 : 20;
    const target = window.innerHeight * 0.4 - stageTop;
    guideY = Math.round(Math.max(comfortable, Math.min(stageHeight - comfortable, target)));
    stage.style.setProperty("--tp-guide-y", `${guideY}px`);
    if (topSpacer) topSpacer.style.height = `${guideY}px`;
    if (bottomSpacer) bottomSpacer.style.height = `${Math.max(0, stageHeight - guideY)}px`;
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
    const guide = stage.getBoundingClientRect().top + guideY;
    let winner = 0;
    let closest = Number.POSITIVE_INFINITY;

    lines.forEach((line, index) => {
      const rect = line.getBoundingClientRect();
      if (rect.top <= guide && rect.bottom >= guide) {
        winner = index;
        closest = -1;
      } else if (closest >= 0) {
        const distance = Math.abs((rect.top + rect.bottom) / 2 - guide);
        if (distance < closest) {
          closest = distance;
          winner = index;
        }
      }
    });

    markCurrent(winner);
  }

  function renderPlayState() {
    playButton.innerHTML = playing
      ? `${icon("pause", 22)} <span>Pause</span>`
      : `${icon("play", 22)} <span>Play</span>`;
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
      markPracticeStarted(lesson.id);
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
    updateGeometry();
    syncScrollPosition();
    updateCurrent();
  }

  function onSpaceInput() {
    prefs = updatePreferences("teleprompter", { lineSpacing: spaceInput.value });
    applyPreferences();
    syncScrollPosition();
    updateCurrent();
  }

  function setLanguage(showIndonesian) {
    prefs = updatePreferences("teleprompter", { showIndonesian });
    applyPreferences();
    syncScrollPosition();
    updateCurrent();
  }

  function onLanguageChoice(event) {
    const button = event.target.closest("[data-tp-lang-choice]");
    if (!button) return;
    setLanguage(button.dataset.tpLangChoice === "both");
  }

  function onFullscreen() {
    sheet.close();
    if (!document.fullscreenElement) {
      page.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  function onFullscreenChange() {
    const active = document.fullscreenElement === page;
    if (fullscreenLabel) fullscreenLabel.textContent = active ? "Exit fullscreen" : "Fullscreen";
    window.setTimeout(() => {
      updateGeometry();
      syncScrollPosition();
      updateCurrent();
    }, 50);
  }

  function onHintClose() {
    hint.hidden = true;
    rememberHint();
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
    updateGeometry();
    syncScrollPosition();
    updateCurrent();
  }

  function onVisibility() {
    if (document.hidden) setPlaying(false);
  }

  playButton.addEventListener("click", togglePlay);
  restartButton?.addEventListener("click", restart);
  speedInput?.addEventListener("input", onSpeedInput);
  fontInput?.addEventListener("input", onFontInput);
  spaceInput?.addEventListener("input", onSpaceInput);
  languageChoices.forEach(button => button.addEventListener("click", onLanguageChoice));
  fullscreenButton?.addEventListener("click", onFullscreen);
  hintClose?.addEventListener("click", onHintClose);
  scroll.addEventListener("wheel", onUserScroll, { passive: true });
  scroll.addEventListener("touchstart", onUserScroll, { passive: true });
  scroll.addEventListener("pointerdown", onUserScroll);
  scroll.addEventListener("scroll", onScroll, { passive: true });
  page.addEventListener("keydown", onKeydown);
  window.addEventListener("resize", onResize);
  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("visibilitychange", onVisibility);

  applyPreferences();
  if (!hintIsDismissed() && hint) hint.hidden = false;
  requestAnimationFrame(() => {
    updateGeometry();
    syncScrollPosition();
    updateCurrent();
  });

  return () => {
    disposed = true;
    setPlaying(false);
    sheet.dispose();
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
