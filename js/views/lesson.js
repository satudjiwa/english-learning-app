import { loadLesson, loadLessonIndex, loadModules } from "../data.js";
import { hasPracticeStarted, isLessonComplete, setLastLesson, toggleLessonComplete } from "../store.js";
import { LessonAudio } from "../lib/audio.js";
import { icon } from "../icons.js";
import { esc } from "../utils.js";
import { notFoundView } from "./not-found.js";

const TABS = [
  { id: "conversation", label: "Conversation" },
  { id: "expressions", label: "Expressions" },
  { id: "patterns", label: "Patterns" },
  { id: "notes", label: "Notes" }
];

const COLLAPSED_LINES = 6;

function listOrFallback(items, render) {
  if (!Array.isArray(items) || items.length === 0) {
    return `<p class="muted-copy">Belum ada catatan untuk bagian ini.</p>`;
  }
  return render(items);
}

function expressionList(items) {
  return `
    <ul class="expression-list">
      ${items.map(item => `
        <li class="expression-item">
          <p class="expression-en" lang="en">${esc(item.english)}</p>
          <p class="expression-id" lang="id">${esc(item.indonesian)}</p>
          ${item.note ? `<p class="expression-note">${esc(item.note)}</p>` : ""}
        </li>
      `).join("")}
    </ul>
  `;
}

function patternList(items) {
  return `
    <ul class="pattern-list">
      ${items.map(item => {
        const examples = Array.isArray(item.examples) && item.examples.length
          ? item.examples
          : item.example
            ? [item.example]
            : [];
        return `
          <li class="pattern-item">
            <span class="pattern-form">${esc(item.pattern)}</span>
            <p class="pattern-explanation">${esc(item.explanation)}</p>
            ${examples.map(example => `<p class="pattern-example" lang="en">“${esc(example)}”</p>`).join("")}
          </li>
        `;
      }).join("")}
    </ul>
  `;
}

function notesPanel(lesson) {
  return `
    <div class="lesson-context-card">
      <span class="eyebrow">Situation</span>
      <p>${esc(lesson.situation)}</p>
      <span class="eyebrow">Objective</span>
      <p>${esc(lesson.objective)}</p>
    </div>

    <div class="lesson-notes-group">
      <h2>Small reminders</h2>
      ${listOrFallback(lesson.learningNotes, items => `
        <ul class="note-list">
          ${items.map(note => `<li>${esc(note)}</li>`).join("")}
        </ul>
      `)}
    </div>

    <div class="lesson-notes-group">
      <h2>American pronunciation</h2>
      ${listOrFallback(lesson.pronunciationNotes, items => `
        <ul class="pronunciation-list">
          ${items.map(item => `
            <li class="pronunciation-item">
              <span class="pronunciation-icon" aria-hidden="true">${icon("volume", 18)}</span>
              <div>
                <strong>${esc(item.title)}</strong>
                <p>${esc(item.note)}</p>
              </div>
            </li>
          `).join("")}
        </ul>
      `)}
    </div>
  `;
}

export async function lessonView(root, { id }) {
  const [modules, index] = await Promise.all([loadModules(), loadLessonIndex()]);
  const entry = index.find(item => item.id === id);

  if (!entry) {
    return notFoundView(root, {
      eyebrow: "Coming soon",
      title: "This lesson is not available yet.",
      message: "Only finished lessons can be opened. Go back to the module library to see what is available now.",
      actionHref: "#/modules",
      actionLabel: "Back to module library"
    });
  }

  const [lesson] = await Promise.all([loadLesson(id)]);
  const module = modules.find(item => item.id === lesson.moduleId);
  const completed = isLessonComplete(id);
  const canComplete = completed || hasPracticeStarted(id);
  const currentIndex = index.findIndex(item => item.id === id);
  const nextEntry = currentIndex >= 0 ? index[currentIndex + 1] : null;
  setLastLesson(id);

  const lineCount = lesson.dialogue.length;
  const moduleNumber = module?.number || Number(lesson.moduleId.replace("M", "")) || 1;
  const lessonNumber = Number(id.slice(-2));
  const moduleTitle = module?.title || "Module";

  const nextAction = nextEntry
    ? `
      <a class="lesson-bar-btn" href="#/lesson/${esc(nextEntry.id)}">
        ${icon("arrow-right", 18)}
        <span>Next lesson</span>
      </a>
    `
    : `
      <button class="lesson-bar-btn" type="button" disabled aria-label="Next lesson, coming soon">
        ${icon("arrow-right", 18)}
        <span>Next lesson</span>
        <small>Coming soon</small>
      </button>
    `;

  root.innerHTML = `
    <div class="view lesson-view">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="#/modules">Module Library</a>
        <span aria-hidden="true">/</span>
        <span>Module ${moduleNumber}</span>
        <span aria-hidden="true">/</span>
        <span>Lesson ${lessonNumber}</span>
      </nav>

      <header class="lesson-head">
        <span class="eyebrow">Module ${moduleNumber} · ${esc(moduleTitle)}</span>
        <h1>${esc(lesson.title)}</h1>
        <div class="lesson-meta-row">
          <span class="chip chip-accent">${esc(lesson.difficulty)}</span>
          <span class="chip">${lineCount} dialogue lines</span>
          <span class="chip ${completed ? "chip-success" : ""}" data-complete-chip>${completed ? "Completed" : "Not completed"}</span>
        </div>
        <div class="lesson-actions">
          <a class="btn btn-primary btn-lg" href="#/lesson/${esc(id)}/shadowing">
            ${icon("mic", 19)} <span>Start practice</span>
          </a>
          <a class="btn btn-secondary btn-lg" href="#/lesson/${esc(id)}/teleprompter">
            ${icon("text-size", 19)} <span>Read aloud</span>
          </a>
        </div>
      </header>

      <div class="lesson-tabs" role="tablist" aria-label="Lesson content">
        ${TABS.map((tab, tabIndex) => `
          <button
            class="lesson-tab"
            type="button"
            role="tab"
            id="lesson-tab-${tab.id}"
            aria-controls="lesson-panel-${tab.id}"
            aria-selected="${tabIndex === 0}"
            tabindex="${tabIndex === 0 ? "0" : "-1"}"
            data-lesson-tab="${tab.id}"
          >${tab.label}</button>
        `).join("")}
      </div>

      <section
        class="lesson-panel"
        id="lesson-panel-conversation"
        role="tabpanel"
        aria-labelledby="lesson-tab-conversation"
        data-lesson-panel="conversation"
      >
        <ol class="dialogue-list">
          ${lesson.dialogue.map((line, index) => `
            <li class="dialogue-line ${index >= COLLAPSED_LINES ? "is-collapsed" : ""}" data-dialogue-line>
              <div class="dialogue-copy">
                <div class="dialogue-top">
                  <span class="dialogue-speaker">${esc(line.speaker)}</span>
                  <span class="dialogue-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
                </div>
                <p class="dialogue-en" lang="en">${esc(line.english)}</p>
                <p class="dialogue-id" lang="id">${esc(line.indonesian)}</p>
              </div>
              <button
                class="line-audio"
                type="button"
                data-lesson-audio="${index}"
                aria-label="Play sentence ${index + 1}"
                aria-pressed="false"
              >${icon("play", 18)}</button>
            </li>
          `).join("")}
        </ol>
        ${lineCount > COLLAPSED_LINES ? `
          <button class="btn btn-secondary btn-wide conversation-more" type="button" data-show-all aria-expanded="false">
            Show all ${lineCount} lines
          </button>
        ` : ""}
      </section>

      <section
        class="lesson-panel"
        id="lesson-panel-expressions"
        role="tabpanel"
        aria-labelledby="lesson-tab-expressions"
        data-lesson-panel="expressions"
        hidden
      >
        <div class="lesson-panel-head">
          <span class="eyebrow">Key expressions</span>
          <h2>Useful lines</h2>
        </div>
        ${listOrFallback(lesson.keyExpressions, expressionList)}
      </section>

      <section
        class="lesson-panel"
        id="lesson-panel-patterns"
        role="tabpanel"
        aria-labelledby="lesson-tab-patterns"
        data-lesson-panel="patterns"
        hidden
      >
        <div class="lesson-panel-head">
          <span class="eyebrow">Sentence patterns</span>
          <h2>Build your own</h2>
        </div>
        ${listOrFallback(lesson.sentencePatterns, patternList)}
      </section>

      <section
        class="lesson-panel"
        id="lesson-panel-notes"
        role="tabpanel"
        aria-labelledby="lesson-tab-notes"
        data-lesson-panel="notes"
        hidden
      >
        ${notesPanel(lesson)}
      </section>

      <div class="lesson-sticky-bar" aria-label="Lesson actions">
        <div class="lesson-sticky-inner">
          <a class="lesson-bar-btn is-primary" href="#/lesson/${esc(id)}/shadowing">
            ${icon("mic", 18)}
            <span>Start practice</span>
          </a>
          <button
            class="lesson-bar-btn ${completed ? "is-complete" : ""}"
            type="button"
            data-complete
            aria-pressed="${completed}"
            aria-describedby="lesson-complete-note"
            ${canComplete ? "" : "disabled"}
          >
            <span data-complete-icon>${icon(completed ? "check-circle" : "check", 18)}</span>
            <span data-complete-label>${completed ? "Completed" : "Mark complete"}</span>
            <small id="lesson-complete-note" data-complete-note ${canComplete ? "hidden" : ""}>After practice</small>
          </button>
          ${nextAction}
        </div>
      </div>
    </div>
  `;

  const tabs = [...root.querySelectorAll("[data-lesson-tab]")];
  const tabList = root.querySelector(".lesson-tabs");
  const panels = [...root.querySelectorAll("[data-lesson-panel]")];
  const completeButton = root.querySelector("[data-complete]");
  const completeChip = root.querySelector("[data-complete-chip]");
  const completeIcon = root.querySelector("[data-complete-icon]");
  const completeLabel = root.querySelector("[data-complete-label]");
  const completeNote = root.querySelector("[data-complete-note]");
  const showAllButton = root.querySelector("[data-show-all]");
  const collapsedLines = [...root.querySelectorAll(".dialogue-line.is-collapsed")];
  const audioButtons = [...root.querySelectorAll("[data-lesson-audio]")];
  const audio = new LessonAudio();
  let activeLine = -1;
  let audioToken = 0;

  function selectTab(tabId, { focus = false } = {}) {
    tabs.forEach(tab => {
      const selected = tab.dataset.lessonTab === tabId;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panels.forEach(panel => {
      panel.hidden = panel.dataset.lessonPanel !== tabId;
    });
  }

  function onTabClick(event) {
    const tab = event.target.closest("[data-lesson-tab]");
    if (tab) selectTab(tab.dataset.lessonTab);
  }

  function onTabKeydown(event) {
    const current = event.target.closest("[data-lesson-tab]");
    if (!current) return;
    const currentIndex = tabs.indexOf(current);
    let nextIndex = null;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      selectTab(tabs[nextIndex].dataset.lessonTab, { focus: true });
    }
  }

  function renderLineAudio() {
    audioButtons.forEach((button, index) => {
      const active = index === activeLine;
      button.classList.toggle("is-playing", active);
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute("aria-label", `${active ? "Pause" : "Play"} sentence ${index + 1}`);
      button.innerHTML = icon(active ? "pause" : "play", 18);
    });
  }

  async function onLineAudio(event) {
    const button = event.target.closest("[data-lesson-audio]");
    if (!button) return;
    const index = Number(button.dataset.lessonAudio);

    if (index === activeLine) {
      audioToken += 1;
      audio.stop();
      activeLine = -1;
      renderLineAudio();
      return;
    }

    audioToken += 1;
    const token = audioToken;
    audio.stop();
    activeLine = index;
    renderLineAudio();

    await audio.playLine(lesson.dialogue[index], { rate: 1 });
    if (token !== audioToken) return;
    activeLine = -1;
    renderLineAudio();
  }

  function onShowAll() {
    const expanded = showAllButton.getAttribute("aria-expanded") === "true";
    const next = !expanded;
    showAllButton.setAttribute("aria-expanded", String(next));
    showAllButton.textContent = next ? "Show fewer lines" : `Show all ${lineCount} lines`;
    collapsedLines.forEach(line => line.classList.toggle("is-collapsed", !next));
  }

  function renderComplete(isComplete) {
    if (!completeButton) return;
    completeButton.disabled = false;
    completeButton.classList.toggle("is-complete", isComplete);
    completeButton.setAttribute("aria-pressed", String(isComplete));
    if (completeIcon) completeIcon.innerHTML = icon(isComplete ? "check-circle" : "check", 18);
    if (completeLabel) completeLabel.textContent = isComplete ? "Completed" : "Mark complete";
    if (completeNote) completeNote.hidden = true;
    if (completeChip) {
      completeChip.textContent = isComplete ? "Completed" : "Not completed";
      completeChip.classList.toggle("chip-success", isComplete);
    }
  }

  function onComplete() {
    renderComplete(toggleLessonComplete(id));
  }

  tabList?.addEventListener("click", onTabClick);
  tabList?.addEventListener("keydown", onTabKeydown);
  showAllButton?.addEventListener("click", onShowAll);
  audioButtons.forEach(button => button.addEventListener("click", onLineAudio));
  completeButton?.addEventListener("click", onComplete);

  return {
    title: `${lesson.title} · Small Steps English`,
    cleanup: () => {
      audioToken += 1;
      audio.stop();
      tabList?.removeEventListener("click", onTabClick);
      tabList?.removeEventListener("keydown", onTabKeydown);
      showAllButton?.removeEventListener("click", onShowAll);
      audioButtons.forEach(button => button.removeEventListener("click", onLineAudio));
      completeButton?.removeEventListener("click", onComplete);
    }
  };
}
