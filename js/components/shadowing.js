import { getPreferences, updatePreferences } from "../store.js";
import { icon } from "../icons.js";
import { esc } from "../utils.js";
import { LessonAudio } from "../lib/audio.js";

const STEPS = [
  {
    label: "Listen",
    description: "Dengarkan satu kalimat tanpa membaca terjemahan.",
    showIndonesian: true,
    sentenceMode: true
  },
  {
    label: "Listen & Read",
    description: "Dengarkan lagi sambil membaca teks Inggris dan Indonesia.",
    showIndonesian: true,
    sentenceMode: true
  },
  {
    label: "Repeat",
    description: "Ulangi kalimat dengan tempo lambat, satu per satu.",
    showIndonesian: false,
    sentenceMode: true
  },
  {
    label: "Shadow",
    description: "Bicara bersamaan dengan audio. Ikuti irama dan tekanannya.",
    showIndonesian: false,
    sentenceMode: true
  },
  {
    label: "Without translation",
    description: "Latih tanpa terjemahan dan tanpa jeda bantuan.",
    showIndonesian: false,
    sentenceMode: false
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
      </header>

      <div class="sh-layout">
        <section class="sh-player" aria-labelledby="sh-player-title">
          <div class="sh-player-head">
            <div>
              <span class="eyebrow" id="sh-player-title">Sentence practice</span>
              <h1 data-sh-step-label>Step 1 · Listen</h1>
            </div>
            <span class="sh-count" data-sh-count aria-live="polite">1 / ${lesson.dialogue.length}</span>
          </div>

          <div class="progress-track sh-progress" role="progressbar" aria-label="Shadowing progress" aria-valuemin="0" aria-valuemax="${lesson.dialogue.length}" aria-valuenow="1">
            <span data-sh-progress style="width:${100 / lesson.dialogue.length}%"></span>
          </div>

          <div class="sh-current">
            <span class="sh-speaker" data-sh-speaker>${esc(lesson.dialogue[0].speaker)}</span>
            <p class="sh-en" lang="en" data-sh-en>${esc(lesson.dialogue[0].english)}</p>
            <p class="sh-id" lang="id" data-sh-id-text>${esc(lesson.dialogue[0].indonesian)}</p>
            <span class="audio-status" data-sh-audio-status data-state="idle" aria-live="polite">
              ${icon("volume", 15)} <span>Audio ready</span>
            </span>
          </div>

          <div class="sh-transport">
            <button class="btn btn-primary btn-wide" type="button" data-sh-play>
              ${icon("play", 19)} <span>Play sentence</span>
            </button>
            <button class="btn btn-secondary" type="button" data-sh-replay>
              ${icon("repeat", 17)} <span>Replay</span>
            </button>
            <button class="btn btn-secondary" type="button" data-sh-whole>
              ${icon("list", 17)} <span>Whole conversation</span>
            </button>
          </div>

          <div class="sh-options">
            <div class="speed-picker" role="group" aria-label="Audio speed">
              <span>Speed</span>
              ${SPEEDS.map(speed => `
                <button type="button" class="chip ${speed === prefs.speed ? "is-active" : ""}" data-sh-speed="${speed}" aria-pressed="${speed === prefs.speed}">
                  ${speed.toFixed(2).replace(/0$/, "")}×
                </button>
              `).join("")}
            </div>

            <label class="check-row">
              <input type="checkbox" data-sh-sentence-mode checked>
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
              <input type="checkbox" data-sh-translation ${prefs.showIndonesian ? "checked" : ""}>
              <span>Indonesian translation</span>
            </label>
          </div>
        </section>

        <section class="sh-transcript-card" aria-labelledby="sh-transcript-title">
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">Transcript</span>
              <h2 id="sh-transcript-title">Follow along</h2>
            </div>
            <span class="section-note">Tap a sentence to jump</span>
          </div>
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
        </section>
      </div>

      <section class="shadow-guide" aria-labelledby="shadow-guide-title">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Practice path</span>
            <h2 id="shadow-guide-title">5-step shadowing guide</h2>
          </div>
          <span class="section-note">Slow is smooth. Smooth is fast.</span>
        </div>
        <ol class="step-guide">
          ${STEPS.map((step, index) => `
            <li>
              <button type="button" class="step-button ${index === 0 ? "is-active" : ""}" data-sh-step="${index}" aria-pressed="${index === 0}">
                <span class="step-number">${index + 1}</span>
                <strong>${esc(step.label)}</strong>
                <small>${esc(step.description)}</small>
              </button>
            </li>
          `).join("")}
        </ol>
      </section>
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
  const wholeButton = page.querySelector("[data-sh-whole]");
  const speedButtons = [...page.querySelectorAll("[data-sh-speed]")];
  const sentenceModeInput = page.querySelector("[data-sh-sentence-mode]");
  const repeatSentenceInput = page.querySelector("[data-sh-repeat-sentence]");
  const repeatLessonInput = page.querySelector("[data-sh-repeat-lesson]");
  const translationInput = page.querySelector("[data-sh-translation]");
  const transcript = page.querySelector("[data-sh-transcript]");
  const transcriptLines = [...page.querySelectorAll("[data-sh-line]")];
  const stepButtons = [...page.querySelectorAll("[data-sh-step]")];
  const stepLabel = page.querySelector("[data-sh-step-label]");
  const countNode = page.querySelector("[data-sh-count]");
  const topCount = page.querySelector("[data-sh-top-count]");
  const progressNode = page.querySelector("[data-sh-progress]");
  const progressTrack = page.querySelector(".sh-progress");
  const speakerNode = page.querySelector("[data-sh-speaker]");
  const englishNode = page.querySelector("[data-sh-en]");
  const indonesianNode = page.querySelector("[data-sh-id-text]");
  const audioStatus = page.querySelector("[data-sh-audio-status]");

  if (!playButton || !transcript || !countNode) return () => {};

  const prefs = getPreferences("shadowing");
  let index = 0;
  let playing = false;
  let mode = "sentence";
  let speed = prefs.speed;
  let showIndonesian = prefs.showIndonesian;
  let repeatSentence = false;
  let repeatLesson = false;
  let step = 0;
  let runToken = 0;
  let audioSource = "idle";

  function setSource(source) {
    audioSource = source;
    if (!audioStatus) return;
    audioStatus.dataset.state = source;
    audioStatus.innerHTML = `${icon(source === "unavailable" ? "volume-off" : "volume", 15)} <span>${sourceLabel(source)}</span>`;
  }

  function updatePlayButton() {
    playButton.innerHTML = playing
      ? `${icon("pause", 19)} <span>Pause</span>`
      : `${icon("play", 19)} <span>Play sentence</span>`;
    page.classList.toggle("is-playing", playing);
  }

  function renderCurrent(scroll = false) {
    const line = lines[index];
    if (!line) return;

    speakerNode.textContent = line.speaker;
    englishNode.textContent = line.english;
    indonesianNode.textContent = line.indonesian;
    indonesianNode.hidden = !showIndonesian;
    countNode.textContent = `${index + 1} / ${total}`;
    if (topCount) topCount.textContent = `${index + 1} / ${total}`;
    if (progressNode) progressNode.style.width = `${((index + 1) / total) * 100}%`;
    if (progressTrack) {
      progressTrack.setAttribute("aria-valuenow", String(index + 1));
    }

    transcriptLines.forEach((lineNode, lineIndex) => {
      const current = lineIndex === index;
      lineNode.classList.toggle("is-current", current);
      lineNode.setAttribute("aria-current", current ? "true" : "false");
      const idNode = lineNode.querySelector(".sh-line-id");
      if (idNode) idNode.hidden = !showIndonesian;
    });

    if (scroll && transcript) {
      const active = transcriptLines[index];
      if (active) {
        const top = active.offsetTop - transcript.clientHeight / 2 + active.clientHeight / 2;
        transcript.scrollTo({
          top: Math.max(0, top),
          behavior: "smooth"
        });
      }
    }
    updatePlayButton();
  }

  function updateTranslation() {
    indonesianNode.hidden = !showIndonesian;
    transcriptLines.forEach(lineNode => {
      const idNode = lineNode.querySelector(".sh-line-id");
      if (idNode) idNode.hidden = !showIndonesian;
    });
  }

  function updateStep() {
    stepButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === step;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (stepLabel) stepLabel.textContent = `Step ${step + 1} · ${STEPS[step].label}`;
  }

  function pause() {
    runToken += 1;
    audio.stop();
    playing = false;
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

    if (once) {
      playing = false;
      updatePlayButton();
      return;
    }

    if (repeatSentence) {
      await playCurrent(token);
      return;
    }

    if (index < total - 1) {
      if (mode === "lesson") {
        index += 1;
        renderCurrent(true);
        await playCurrent(token);
        return;
      }
      playing = false;
      updatePlayButton();
      return;
    }

    if (repeatLesson) {
      index = 0;
      renderCurrent(true);
      await playCurrent(token);
      return;
    }

    playing = false;
    updatePlayButton();
  }

  function startPlayback({ fromStart = false, once = false } = {}) {
    if (fromStart) index = 0;
    runToken += 1;
    const token = runToken;
    audio.stop();
    playing = true;
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

  function playWhole() {
    pause();
    mode = "lesson";
    if (sentenceModeInput) sentenceModeInput.checked = false;
    startPlayback({ fromStart: true });
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
    updateTranslation();
  }

  function selectStep(next) {
    if (!STEPS[next]) return;
    step = next;
    updateStep();
    setTranslation(STEPS[next].showIndonesian);
    mode = STEPS[next].sentenceMode ? "sentence" : "lesson";
    if (sentenceModeInput) sentenceModeInput.checked = mode === "sentence";
  }

  function onSentenceMode() {
    mode = sentenceModeInput.checked ? "sentence" : "lesson";
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
    pause();
    index = Number(button.dataset.shLine);
    renderCurrent(false);
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
  wholeButton?.addEventListener("click", playWhole);
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
    page.removeEventListener("keydown", onKeydown);
    transcript?.removeEventListener("click", onTranscriptClick);
  };
}
