import { getPreferences, markPracticeStarted, updatePreferences } from "../store.js";
import { mountSheet } from "./sheet.js";
import { icon } from "../icons.js";
import { esc } from "../utils.js";
import { LessonAudio } from "../lib/audio.js";

const STEPS = [
  {
    label: "Listen",
    short: "Listen",
    description: "Dengarkan satu kalimat. Teks Inggris muncul setelah audio selesai.",
    english: "after-play",
    indonesian: true,
    sentenceMode: true,
    turnPause: false
  },
  {
    label: "Listen & Read",
    short: "Read",
    description: "Dengarkan lagi sambil membaca teks Inggris dan Indonesia.",
    english: true,
    indonesian: true,
    sentenceMode: true,
    turnPause: false
  },
  {
    label: "Repeat",
    short: "Repeat",
    description: "Audio berhenti setelah satu kalimat. Ulangi sendiri, lalu tekan Next.",
    english: true,
    indonesian: false,
    sentenceMode: true,
    turnPause: true
  },
  {
    label: "Shadow",
    short: "Shadow",
    description: "Putar terus dan bicara bersamaan. Ikuti irama dan tekanannya.",
    english: true,
    indonesian: false,
    sentenceMode: false,
    turnPause: false
  },
  {
    label: "No text",
    short: "No text",
    description: "Dengarkan dan bayangkan percakapannya tanpa membaca teks.",
    english: false,
    indonesian: false,
    sentenceMode: false,
    turnPause: false
  }
];

const SPEEDS = [0.75, 0.85, 1];

function sourceLabel(source) {
  if (source === "mp3") return "MP3 audio";
  if (source === "tts") return "Computer voice — temporary";
  if (source === "unavailable") return "Audio unavailable";
  return "Audio ready";
}

export function shadowingHTML(lesson) {
  const prefs = getPreferences("shadowing");
  const first = lesson.dialogue[0];
  return `
    <div class="sh-page" data-sh data-sh-id="${esc(lesson.id)}">
      <header class="mode-bar">
        <a class="mode-back" href="#/lesson/${esc(lesson.id)}">
          ${icon("chevron-left", 18)} <span>Lesson</span>
        </a>
        <div class="mode-bar-title">
          <span class="eyebrow">Shadowing</span>
          <strong>${esc(lesson.title)}</strong>
        </div>
        <span class="mode-count" data-sh-top-count>1 / ${lesson.dialogue.length}</span>
        <button class="mode-icon-btn" type="button" data-sh-settings aria-label="Shadowing settings">
          ${icon("settings", 20)}
        </button>
      </header>

      <details class="how-to">
        <summary>
          <span>How to practice</span>
          <small>5 steps</small>
        </summary>
        <ol class="how-to-list">
          ${STEPS.map((step, index) => `
            <li>
              <span class="how-to-number">${index + 1}</span>
              <div>
                <strong>${esc(step.label)}</strong>
                <p>${esc(step.description)}</p>
              </div>
            </li>
          `).join("")}
        </ol>
      </details>

      <section class="sh-stepper" aria-labelledby="sh-step-heading">
        <div class="sh-stepper-top">
          <div class="sh-stepper-title">
            <span class="eyebrow" id="sh-step-heading">Practice step</span>
            <strong data-sh-step-label>Step 1 · ${STEPS[0].label}</strong>
          </div>
          <button class="btn btn-secondary btn-sm sh-next-step" type="button" data-sh-next-step>
            <span data-sh-next-label>Next step</span>
            ${icon("chevron-right", 16)}
          </button>
        </div>
        <div class="sh-step-track" role="group" aria-label="Choose practice step">
          ${STEPS.map((step, index) => `
            <button
              class="sh-step-dot ${index === 0 ? "is-active" : ""}"
              type="button"
              data-sh-step="${index}"
              aria-pressed="${index === 0}"
              aria-label="Step ${index + 1}: ${esc(step.label)}"
            >
              <span>${index + 1}</span>
              <small>${esc(step.short)}</small>
            </button>
          `).join("")}
        </div>
        <p class="sh-step-note" data-sh-step-note>${esc(STEPS[0].description)}</p>
      </section>

      <div class="sh-layout">
        <section class="sh-player" aria-labelledby="sh-player-title">
          <div class="sh-player-head">
            <span class="eyebrow" id="sh-player-title">Sentence practice</span>
            <span class="sh-count" data-sh-count aria-live="polite">1 / ${lesson.dialogue.length}</span>
          </div>

          <div class="progress-track sh-progress" role="progressbar" aria-label="Shadowing progress" aria-valuemin="0" aria-valuemax="${lesson.dialogue.length}" aria-valuenow="1">
            <span data-sh-progress style="width:${100 / lesson.dialogue.length}%"></span>
          </div>

          <div class="sh-current">
            <span class="sh-speaker" data-sh-speaker>${esc(first.speaker)}</span>
            <p class="sh-en" lang="en" data-sh-en>${esc(first.english)}</p>
            <p class="sh-text-hint" data-sh-text-hint>Listen first — English appears after this sentence.</p>
            <p class="sh-id" lang="id" data-sh-id-text>${esc(first.indonesian)}</p>
            <span class="audio-status" data-sh-audio-status data-state="idle" aria-live="polite">
              ${icon("volume", 15)} <span>Audio ready</span>
            </span>
            <p class="sh-turn-hint" data-sh-turn-hint hidden>Your turn — repeat the sentence, then tap Next.</p>
          </div>
        </section>
      </div>

      <details class="sh-transcript-card" data-sh-transcript-card>
        <summary>
          <span>Transcript</span>
          <small>${lesson.dialogue.length} sentences</small>
        </summary>
        <div class="sh-transcript" data-sh-transcript>
          ${lesson.dialogue.map((line, index) => `
            <button class="sh-line ${index === 0 ? "is-current" : ""}" type="button" data-sh-line="${index}" aria-current="${index === 0 ? "true" : "false"}">
              <span class="sh-line-number">${String(index + 1).padStart(2, "0")}</span>
              <span class="sh-line-copy">
                <span class="sh-line-speaker">${esc(line.speaker)}</span>
                <span class="sh-line-en" lang="en">${esc(line.english)}</span>
                <span class="sh-line-id" lang="id">${esc(line.indonesian)}</span>
              </span>
            </button>
          `).join("")}
        </div>
      </details>

      <div class="sh-player-dock">
        <div class="sh-dock-inner">
          <div class="sh-dock-controls">
            <button class="sh-dock-btn" type="button" data-sh-prev aria-label="Previous sentence">
              ${icon("skip-back", 22)}
            </button>
            <button class="sh-dock-play" type="button" data-sh-play>
              ${icon("play", 24)} <span>Play</span>
            </button>
            <button class="sh-dock-btn" type="button" data-sh-next aria-label="Next sentence">
              ${icon("skip-forward", 22)}
            </button>
            <button class="sh-dock-btn" type="button" data-sh-replay aria-label="Replay sentence">
              ${icon("repeat", 21)}
            </button>
          </div>
          <div class="speed-picker sh-dock-speed" role="group" aria-label="Audio speed">
            ${SPEEDS.map(speed => `
              <button type="button" class="chip ${speed === prefs.speed ? "is-active" : ""}" data-sh-speed="${speed}" aria-pressed="${speed === prefs.speed}">
                ${speed.toFixed(2).replace(/0$/, "")}×
              </button>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="sheet-layer" data-sh-sheet hidden>
        <section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-settings-title" tabindex="-1">
          <div class="sheet-grabber" aria-hidden="true"></div>
          <header class="sheet-head">
            <h2 id="sh-settings-title">Shadowing settings</h2>
            <button class="sheet-close" type="button" data-sheet-close data-sheet-focus aria-label="Close settings">
              ${icon("x", 20)}
            </button>
          </header>
          <div class="sheet-body">
            <label class="check-row">
              <input type="checkbox" data-sh-sentence-mode ${STEPS[0].sentenceMode ? "checked" : ""}>
              <span>Sentence by sentence</span>
            </label>
            <label class="check-row">
              <input type="checkbox" data-sh-repeat-sentence>
              <span>Repeat current sentence</span>
            </label>
            <label class="check-row">
              <input type="checkbox" data-sh-repeat-lesson>
              <span>Repeat lesson</span>
            </label>
            <label class="check-row">
              <input type="checkbox" data-sh-translation ${STEPS[0].indonesian ? "checked" : ""}>
              <span>Indonesian translation</span>
            </label>
            <p class="sheet-note">Choosing a step sets these options for that step. You can adjust them here at any time.</p>
            <button class="btn btn-primary btn-wide" type="button" data-sheet-close>Done</button>
          </div>
        </section>
      </div>
    </div>
  `;
}

export function mountShadowing(root, lesson) {
  const page = root.querySelector("[data-sh]");
  if (!page) return () => {};
  const lines = lesson.dialogue;
  const total = lines.length;
  const audio = new LessonAudio();

  const playButton = page.querySelector("[data-sh-play]");
  const replayButton = page.querySelector("[data-sh-replay]");
  const previousButton = page.querySelector("[data-sh-prev]");
  const nextButton = page.querySelector("[data-sh-next]");
  const speedButtons = [...page.querySelectorAll("[data-sh-speed]")];
  const sentenceModeInput = page.querySelector("[data-sh-sentence-mode]");
  const repeatSentenceInput = page.querySelector("[data-sh-repeat-sentence]");
  const repeatLessonInput = page.querySelector("[data-sh-repeat-lesson]");
  const translationInput = page.querySelector("[data-sh-translation]");
  const transcript = page.querySelector("[data-sh-transcript]");
  const transcriptCard = page.querySelector("[data-sh-transcript-card]");
  const transcriptLines = [...page.querySelectorAll("[data-sh-line]")];
  const stepButtons = [...page.querySelectorAll("[data-sh-step]")];
  const stepLabel = page.querySelector("[data-sh-step-label]");
  const stepNote = page.querySelector("[data-sh-step-note]");
  const nextStepButton = page.querySelector("[data-sh-next-step]");
  const nextStepLabel = page.querySelector("[data-sh-next-label]");
  const countNode = page.querySelector("[data-sh-count]");
  const topCount = page.querySelector("[data-sh-top-count]");
  const progressNode = page.querySelector("[data-sh-progress]");
  const progressTrack = page.querySelector(".sh-progress");
  const speakerNode = page.querySelector("[data-sh-speaker]");
  const englishNode = page.querySelector("[data-sh-en]");
  const indonesianNode = page.querySelector("[data-sh-id-text]");
  const textHint = page.querySelector("[data-sh-text-hint]");
  const turnHint = page.querySelector("[data-sh-turn-hint]");
  const audioStatus = page.querySelector("[data-sh-audio-status]");

  if (!playButton || !transcript || !countNode) return () => {};

  const sheet = mountSheet({
    layer: page.querySelector("[data-sh-sheet]"),
    openButton: page.querySelector("[data-sh-settings]"),
    onOpen: () => pause()
  });

  const prefs = getPreferences("shadowing");
  let index = 0;
  let playing = false;
  let sentenceMode = STEPS[0].sentenceMode;
  let speed = prefs.speed;
  let showIndonesian = STEPS[0].indonesian;
  let repeatSentence = false;
  let repeatLesson = false;
  let step = 0;
  let runToken = 0;
  let englishRevealed = STEPS[0].english === true;
  let showTurnHint = false;

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  function setSource(source) {
    if (!audioStatus) return;
    audioStatus.dataset.state = source;
    audioStatus.innerHTML = `${icon(source === "unavailable" ? "volume-off" : "volume", 15)} <span>${sourceLabel(source)}</span>`;
  }

  function updatePlayButton() {
    playButton.innerHTML = playing
      ? `${icon("pause", 24)} <span>Pause</span>`
      : `${icon("play", 24)} <span>Play</span>`;
    playButton.setAttribute("aria-pressed", String(playing));
    page.classList.toggle("is-playing", playing);
  }

  function renderVisibility() {
    const config = STEPS[step];
    const englishVisible = config.english === true || (config.english === "after-play" && englishRevealed);
    page.classList.toggle("is-en-hidden", !englishVisible);
    page.classList.toggle("is-all-en-hidden", config.english === false);
    page.classList.toggle("is-id-hidden", !showIndonesian);

    let hint = "";
    if (!englishVisible && config.english === "after-play") {
      hint = "Listen first — English appears after this sentence.";
    } else if (config.english === false) {
      hint = "No text mode. Listen and shadow without reading.";
    }
    if (textHint) {
      textHint.textContent = hint;
      textHint.hidden = !hint;
    }
    if (turnHint) turnHint.hidden = !showTurnHint;
  }

  function renderCurrent(scroll = false) {
    const line = lines[index];
    if (!line) return;

    speakerNode.textContent = line.speaker;
    englishNode.textContent = line.english;
    indonesianNode.textContent = line.indonesian;
    countNode.textContent = `${index + 1} / ${total}`;
    if (topCount) topCount.textContent = `${index + 1} / ${total}`;
    if (progressNode) progressNode.style.width = `${((index + 1) / total) * 100}%`;
    if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(index + 1));

    transcriptLines.forEach((lineNode, lineIndex) => {
      const current = lineIndex === index;
      lineNode.classList.toggle("is-current", current);
      lineNode.setAttribute("aria-current", current ? "true" : "false");
    });

    if (previousButton) previousButton.disabled = index === 0;
    if (nextButton) nextButton.disabled = index === total - 1;
    renderVisibility();
    updatePlayButton();

    if (scroll && transcript && transcriptCard?.open) {
      const active = transcriptLines[index];
      if (active) {
        const top = active.offsetTop - transcript.clientHeight / 2 + active.clientHeight / 2;
        transcript.scrollTo({
          top: Math.max(0, top),
          behavior: reduceMotion ? "auto" : "smooth"
        });
      }
    }
  }

  function updateStep() {
    const config = STEPS[step];
    stepButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === step;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (stepLabel) stepLabel.textContent = `Step ${step + 1} · ${config.label}`;
    if (stepNote) stepNote.textContent = config.description;
    if (nextStepButton) {
      const last = step >= STEPS.length - 1;
      nextStepButton.disabled = last;
      if (nextStepLabel) nextStepLabel.textContent = last ? "Last step" : "Next step";
    }
  }

  function pause() {
    runToken += 1;
    audio.stop();
    playing = false;
    showTurnHint = false;
    if (turnHint) turnHint.hidden = true;
    updatePlayButton();
  }

  async function playCurrent(token, { once = false } = {}) {
    if (token !== runToken) return;
    const result = await audio.playLine(lines[index], {
      rate: speed,
      onSource: source => {
        if (token === runToken) setSource(source);
      }
    });
    if (token !== runToken) return;

    if (result === "unavailable" || result === "failed") {
      playing = false;
      updatePlayButton();
      setSource(result === "failed" ? "unavailable" : result);
      return;
    }

    if (result !== "ended") {
      playing = false;
      updatePlayButton();
      return;
    }

    const config = STEPS[step];
    if (config.english === "after-play") {
      englishRevealed = true;
      renderVisibility();
    }

    if (once) {
      playing = false;
      updatePlayButton();
      return;
    }

    if (repeatSentence) {
      await playCurrent(token);
      return;
    }

    if (!sentenceMode) {
      if (index < total - 1) {
        index += 1;
        englishRevealed = STEPS[step].english === true;
        showTurnHint = false;
        renderCurrent(true);
        await playCurrent(token);
        return;
      }
      if (repeatLesson) {
        index = 0;
        englishRevealed = STEPS[step].english === true;
        showTurnHint = false;
        renderCurrent(true);
        await playCurrent(token);
        return;
      }
      playing = false;
      updatePlayButton();
      return;
    }

    playing = false;
    showTurnHint = config.turnPause;
    renderCurrent(false);
  }

  function startPlayback({ fromStart = false, once = false } = {}) {
    if (fromStart) {
      index = 0;
      englishRevealed = STEPS[step].english === true;
    }
    runToken += 1;
    const token = runToken;
    audio.stop();
    playing = true;
    showTurnHint = false;
    markPracticeStarted(lesson.id);
    setSource("idle");
    renderCurrent(true);
    updatePlayButton();
    playCurrent(token, { once });
  }

  function togglePlay() {
    if (playing) {
      pause();
    } else {
      startPlayback();
    }
  }

  function replay() {
    pause();
    startPlayback({ once: true });
  }

  function goTo(nextIndex) {
    if (nextIndex < 0 || nextIndex >= total) return;
    pause();
    index = nextIndex;
    englishRevealed = STEPS[step].english === true;
    showTurnHint = false;
    renderCurrent(true);
  }

  function setSpeed(next) {
    const value = Number(next);
    if (!SPEEDS.includes(value)) return;
    speed = value;
    updatePreferences("shadowing", { speed });
    speedButtons.forEach(button => {
      const active = Number(button.dataset.shSpeed) === value;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (playing) {
      runToken += 1;
      const token = runToken;
      audio.stop();
      playing = true;
      playCurrent(token);
    }
  }

  function setTranslation(next) {
    showIndonesian = Boolean(next);
    updatePreferences("shadowing", { showIndonesian });
    if (translationInput) translationInput.checked = showIndonesian;
    renderVisibility();
  }

  function selectStep(next) {
    if (!STEPS[next]) return;
    pause();
    step = next;
    const config = STEPS[next];
    sentenceMode = config.sentenceMode;
    showIndonesian = config.indonesian;
    englishRevealed = config.english === true;
    showTurnHint = false;
    if (sentenceModeInput) sentenceModeInput.checked = sentenceMode;
    if (translationInput) translationInput.checked = showIndonesian;
    updatePreferences("shadowing", { showIndonesian });
    updateStep();
    renderCurrent(false);
  }

  function onNextStep() {
    if (step < STEPS.length - 1) selectStep(step + 1);
  }

  function onSentenceMode() {
    sentenceMode = sentenceModeInput.checked;
  }

  function onRepeatSentence() {
    repeatSentence = repeatSentenceInput.checked;
  }

  function onRepeatLesson() {
    repeatLesson = repeatLessonInput.checked;
  }

  function onTranslation() {
    setTranslation(translationInput.checked);
  }

  function onTranscriptClick(event) {
    const button = event.target.closest("[data-sh-line]");
    if (!button) return;
    goTo(Number(button.dataset.shLine));
  }

  function onKeydown(event) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement) return;
    if (event.code === "Space") {
      event.preventDefault();
      togglePlay();
    } else if (event.key.toLowerCase() === "r") {
      replay();
    }
  }

  playButton.addEventListener("click", togglePlay);
  replayButton?.addEventListener("click", replay);
  previousButton?.addEventListener("click", () => goTo(index - 1));
  nextButton?.addEventListener("click", () => goTo(index + 1));
  nextStepButton?.addEventListener("click", onNextStep);
  speedButtons.forEach(button => {
    button.addEventListener("click", () => setSpeed(button.dataset.shSpeed));
  });
  sentenceModeInput?.addEventListener("change", onSentenceMode);
  repeatSentenceInput?.addEventListener("change", onRepeatSentence);
  repeatLessonInput?.addEventListener("change", onRepeatLesson);
  translationInput?.addEventListener("change", onTranslation);
  transcript?.addEventListener("click", onTranscriptClick);
  stepButtons.forEach(button => {
    button.addEventListener("click", () => selectStep(Number(button.dataset.shStep)));
  });
  page.addEventListener("keydown", onKeydown);

  setSource("idle");
  updateStep();
  renderCurrent(false);

  return () => {
    runToken += 1;
    audio.stop();
    sheet.dispose();
    page.removeEventListener("keydown", onKeydown);
    transcript?.removeEventListener("click", onTranscriptClick);
  };
}
