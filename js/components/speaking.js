import { getPreferences, markPracticeStarted, updatePreferences } from "../store.js";
import { mountSheet } from "./sheet.js";
import { icon } from "../icons.js";
import { esc } from "../utils.js";
import { LessonAudio } from "../lib/audio.js";

const SPEEDS = [0.75, 0.85, 1];

function sourceLabel(source) {
  if (source === "mp3") return "MP3 audio";
  if (source === "tts") return "Computer voice — temporary";
  if (source === "unavailable") return "Audio unavailable";
  return "Audio ready";
}

function speedLabel(speed) {
  return speed === 1 ? "1×" : `${speed}×`;
}

export function speakingHTML(lesson) {
  const prefs = getPreferences("speaking");
  const total = lesson.dialogue.length;
  const first = lesson.dialogue[0];

  return `
    <div class="sp-page" data-sp data-sp-id="${esc(lesson.id)}">
      <header class="mode-bar">
        <a class="mode-back" href="#/lesson/${esc(lesson.id)}">
          ${icon("chevron-left", 18)} <span>Lesson</span>
        </a>
        <div class="mode-bar-title">
          <span class="eyebrow">Speaking</span>
          <strong>${esc(lesson.title)}</strong>
        </div>
        <span class="mode-count" data-sp-top-count>1 / ${total}</span>
        <button class="mode-icon-btn" type="button" data-sp-settings aria-label="Speaking settings">
          ${icon("settings", 20)}
        </button>
      </header>

      <main class="sp-main">
        <h1 class="sr-only">Speaking practice: ${esc(lesson.title)}</h1>

        <section class="sp-card" aria-labelledby="sp-card-title">
          <div class="sp-card-head">
            <div>
              <span class="eyebrow" id="sp-card-title">Sentence practice</span>
              <span class="sp-count" data-sp-count>1 / ${total}</span>
            </div>
            <span class="sp-mode-chip" data-sp-mode-chip>Speak first</span>
          </div>

          <div class="progress-track sp-progress" role="progressbar" aria-label="Speaking progress" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="1">
            <span data-sp-progress style="width:${100 / total}%"></span>
          </div>

          <div class="sp-prompt">
            <span class="sp-label">Say this in English</span>
            <p class="sp-id" lang="id" data-sp-id-text>${esc(first.indonesian)}</p>
            <p class="sp-id-note" data-sp-id-note hidden>Translation is off. Listen to the audio, then say it in English.</p>
          </div>

          <div class="sp-reveal">
            <div class="sp-cover" data-sp-cover>
              <span class="sp-cover-icon" aria-hidden="true">${icon("eye-off", 22)}</span>
              <strong>English hidden</strong>
              <p>Speak first. Show the English when you want to check your sentence.</p>
            </div>
            <div class="sp-english" data-sp-english hidden>
              <span class="sp-label">English</span>
              <p class="sp-en" lang="en" data-sp-en>${esc(first.english)}</p>
            </div>
          </div>

          <div class="sp-audio-row">
            <span class="audio-status" id="sp-audio-status" data-sp-audio-status data-state="idle" aria-live="polite">
              ${icon("volume", 15)} <span>Audio ready</span>
            </span>
            <span class="sp-audio-hint">No microphone. You check yourself.</span>
          </div>

          <div class="sp-actions">
            <button class="sp-action sp-action-secondary" type="button" data-sp-replay aria-label="Replay audio" aria-pressed="false" aria-controls="sp-audio-status">
              ${icon("repeat", 20)} <span>Replay audio</span>
            </button>
            <button class="sp-action sp-action-primary" type="button" data-sp-reveal aria-pressed="false">
              <span data-sp-reveal-icon aria-hidden="true">${icon("eye", 20)}</span>
              <span data-sp-reveal-label>Show English</span>
            </button>
          </div>
        </section>

        <p class="sp-tip">
          ${icon("circle-help", 16)}
          <span>Read the Indonesian, say the sentence in English, then show the text to check. Tap Next when you are ready.</span>
        </p>

        <p class="sr-only" data-sp-live aria-live="polite"></p>
      </main>

      <div class="sp-dock">
        <div class="sp-dock-inner">
          <button class="sp-dock-btn" type="button" data-sp-prev aria-label="Previous sentence" disabled>
            ${icon("skip-back", 22)}
          </button>
          <button class="sp-dock-next" type="button" data-sp-next aria-label="Next sentence">
            <span data-sp-next-label>Next sentence</span>
            <span data-sp-next-icon aria-hidden="true">${icon("arrow-right", 20)}</span>
          </button>
        </div>
      </div>

      <div class="sheet-layer" data-sp-sheet hidden>
        <section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sp-settings-title" tabindex="-1">
          <div class="sheet-grabber" aria-hidden="true"></div>
          <header class="sheet-head">
            <h2 id="sp-settings-title">Speaking settings</h2>
            <button class="sheet-close" type="button" data-sheet-close data-sheet-focus aria-label="Close settings">
              ${icon("x", 20)}
            </button>
          </header>
          <div class="sheet-body">
            <div class="setting-field">
              <span class="setting-label">Audio speed</span>
              <div class="segmented sp-speed" role="group" aria-label="Audio speed">
                ${SPEEDS.map(speed => `
                  <button type="button" data-sp-speed="${speed}" aria-pressed="${speed === prefs.speed}">
                    ${speedLabel(speed)}
                  </button>
                `).join("")}
              </div>
            </div>

            <label class="check-row">
              <input type="checkbox" data-sp-translation ${prefs.showIndonesian ? "checked" : ""}>
              <span>Indonesian translation</span>
            </label>

            <p class="sheet-note">Speaking mode does not use a microphone or speech recognition. Listen, speak, and reveal the text to check yourself.</p>

            <button class="btn btn-primary btn-wide" type="button" data-sheet-close>Done</button>
          </div>
        </section>
      </div>
    </div>
  `;
}

export function mountSpeaking(root, lesson) {
  const page = root.querySelector("[data-sp]");
  if (!page) return () => {};

  const lines = lesson.dialogue;
  const total = lines.length;
  const audio = new LessonAudio();

  const previousButton = page.querySelector("[data-sp-prev]");
  const nextButton = page.querySelector("[data-sp-next]");
  const nextLabel = page.querySelector("[data-sp-next-label]");
  const nextIcon = page.querySelector("[data-sp-next-icon]");
  const revealButton = page.querySelector("[data-sp-reveal]");
  const revealLabel = page.querySelector("[data-sp-reveal-label]");
  const revealIcon = page.querySelector("[data-sp-reveal-icon]");
  const replayButton = page.querySelector("[data-sp-replay]");
  const cover = page.querySelector("[data-sp-cover]");
  const englishBlock = page.querySelector("[data-sp-english]");
  const englishNode = page.querySelector("[data-sp-en]");
  const indonesianNode = page.querySelector("[data-sp-id-text]");
  const indonesianNote = page.querySelector("[data-sp-id-note]");
  const countNode = page.querySelector("[data-sp-count]");
  const topCount = page.querySelector("[data-sp-top-count]");
  const progressNode = page.querySelector("[data-sp-progress]");
  const progressTrack = page.querySelector(".sp-progress");
  const modeChip = page.querySelector("[data-sp-mode-chip]");
  const audioStatus = page.querySelector("[data-sp-audio-status]");
  const live = page.querySelector("[data-sp-live]");
  const speedButtons = [...page.querySelectorAll("[data-sp-speed]")];
  const translationInput = page.querySelector("[data-sp-translation]");

  if (!revealButton || !nextButton || !replayButton || !countNode) return () => {};

  const prefs = getPreferences("speaking");
  let index = 0;
  let revealed = false;
  let speed = prefs.speed;
  let showIndonesian = prefs.showIndonesian;
  let playing = false;
  let runToken = 0;

  const sheet = mountSheet({
    layer: page.querySelector("[data-sp-sheet]"),
    openButton: page.querySelector("[data-sp-settings]"),
    onOpen: () => stopAudio()
  });

  function markStarted() {
    markPracticeStarted(lesson.id);
  }

  function setSource(source) {
    if (!audioStatus) return;
    audioStatus.dataset.state = source;
    audioStatus.innerHTML = `${icon(source === "unavailable" ? "volume-off" : "volume", 15)} <span>${sourceLabel(source)}</span>`;
  }

  function updateAudioButton() {
    replayButton.innerHTML = playing
      ? `${icon("pause", 20)} <span>Stop audio</span>`
      : `${icon("repeat", 20)} <span>Replay audio</span>`;
    replayButton.setAttribute("aria-label", playing ? "Stop audio" : "Replay audio");
    replayButton.setAttribute("aria-pressed", String(playing));
    page.classList.toggle("is-playing", playing);
  }

  function render() {
    const line = lines[index];
    if (!line) return;

    countNode.textContent = `${index + 1} / ${total}`;
    if (topCount) topCount.textContent = `${index + 1} / ${total}`;
    if (progressNode) progressNode.style.width = `${((index + 1) / total) * 100}%`;
    if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(index + 1));

    indonesianNode.textContent = line.indonesian;
    indonesianNode.hidden = !showIndonesian;
    if (indonesianNote) indonesianNote.hidden = showIndonesian;

    englishNode.textContent = line.english;
    englishBlock.hidden = !revealed;
    cover.hidden = revealed;
    page.classList.toggle("is-revealed", revealed);
    page.classList.toggle("is-id-hidden", !showIndonesian);

    revealButton.setAttribute("aria-pressed", String(revealed));
    if (revealLabel) revealLabel.textContent = revealed ? "Hide English" : "Show English";
    if (revealIcon) revealIcon.innerHTML = icon(revealed ? "eye-off" : "eye", 20);
    if (modeChip) modeChip.textContent = revealed ? "Check yourself" : "Speak first";

    previousButton.disabled = index === 0;

    const last = index === total - 1;
    if (nextLabel) nextLabel.textContent = last ? "Finish practice" : "Next sentence";
    if (nextIcon) nextIcon.innerHTML = icon(last ? "check" : "arrow-right", 20);
    nextButton.setAttribute("aria-label", last ? "Finish practice and return to lesson" : "Next sentence");

    speedButtons.forEach(button => {
      const active = Number(button.dataset.spSpeed) === speed;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (translationInput) translationInput.checked = showIndonesian;

    updateAudioButton();
  }

  function stopAudio() {
    runToken += 1;
    audio.stop();
    playing = false;
    updateAudioButton();
  }

  async function playCurrent() {
    markStarted();
    runToken += 1;
    const token = runToken;
    audio.stop();
    playing = true;
    setSource("idle");
    updateAudioButton();

    const result = await audio.playLine(lines[index], {
      rate: speed,
      onSource: source => {
        if (token === runToken) setSource(source);
      }
    });

    if (token !== runToken) return;
    playing = false;
    updateAudioButton();
    if (result === "unavailable" || result === "failed") {
      setSource("unavailable");
    }
  }

  function toggleAudio() {
    if (playing) {
      stopAudio();
    } else {
      playCurrent();
    }
  }

  function setRevealed(next) {
    markStarted();
    revealed = Boolean(next);
    render();
    if (live) live.textContent = revealed ? "English shown." : "English hidden.";
  }

  function goTo(nextIndex) {
    if (nextIndex < 0 || nextIndex >= total) return;
    markStarted();
    stopAudio();
    index = nextIndex;
    revealed = false;
    setSource("idle");
    render();
    if (live) live.textContent = `Sentence ${index + 1} of ${total}.`;
  }

  function onNext() {
    markStarted();
    if (index === total - 1) {
      location.hash = `#/lesson/${lesson.id}`;
      return;
    }
    goTo(index + 1);
  }

  function onSpeed(event) {
    const button = event.target.closest("[data-sp-speed]");
    if (!button) return;
    const next = Number(button.dataset.spSpeed);
    if (!SPEEDS.includes(next)) return;
    speed = next;
    updatePreferences("speaking", { speed });
    render();
  }

  function onTranslation() {
    showIndonesian = translationInput.checked;
    updatePreferences("speaking", { showIndonesian });
    render();
    if (live) live.textContent = showIndonesian
      ? "Indonesian translation shown."
      : "Indonesian translation hidden.";
  }

  function onVisibility() {
    if (document.hidden) stopAudio();
  }

  function onKeydown(event) {
    if (event.target instanceof HTMLInputElement) return;
    if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      onNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key.toLowerCase() === "r") {
      event.preventDefault();
      toggleAudio();
    } else if (event.key.toLowerCase() === "h") {
      event.preventDefault();
      setRevealed(!revealed);
    }
  }

  revealButton.addEventListener("click", () => setRevealed(!revealed));
  replayButton.addEventListener("click", toggleAudio);
  previousButton?.addEventListener("click", () => goTo(index - 1));
  nextButton.addEventListener("click", onNext);
  speedButtons.forEach(button => button.addEventListener("click", onSpeed));
  translationInput?.addEventListener("change", onTranslation);
  page.addEventListener("keydown", onKeydown);
  document.addEventListener("visibilitychange", onVisibility);

  setSource("idle");
  render();

  return () => {
    stopAudio();
    sheet.dispose();
    page.removeEventListener("keydown", onKeydown);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
