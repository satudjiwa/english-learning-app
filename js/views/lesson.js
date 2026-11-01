import { loadLesson, loadLessonIndex, loadModules } from "../data.js";
import { isLessonComplete, setLastLesson, toggleLessonComplete } from "../store.js";
import { icon } from "../icons.js";
import { esc } from "../utils.js";
import { notFoundView } from "./not-found.js";

function listOrFallback(items, render) {
  if (!Array.isArray(items) || items.length === 0) {
    return `<p class="muted-copy">Belum ada catatan untuk bagian ini.</p>`;
  }
  return render(items);
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
  setLastLesson(id);

  const lineCount = lesson.dialogue.length;
  const moduleNumber = module?.number || Number(lesson.moduleId.replace("M", "")) || 1;
  const lessonNumber = Number(id.slice(-2));
  const moduleTitle = module?.title || "Module";

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
        <div class="lesson-head-main">
          <span class="eyebrow">Module ${moduleNumber} · ${esc(moduleTitle)}</span>
          <h1>${esc(lesson.title)}</h1>
          <div class="lesson-meta-row">
            <span class="chip chip-accent">${esc(lesson.difficulty)}</span>
            <span class="chip">${lineCount} dialogue lines</span>
            <span class="chip ${completed ? "chip-success" : ""}" data-complete-chip>${completed ? "Completed" : "In progress"}</span>
          </div>
        </div>
        <button class="btn btn-secondary btn-complete ${completed ? "is-complete" : ""}" type="button" data-complete aria-pressed="${completed}">
          ${icon(completed ? "check-circle" : "check", 18)}
          <span>${completed ? "Completed" : "Mark complete"}</span>
        </button>
      </header>

      <div class="lesson-actions">
        <a class="btn btn-primary btn-lg" href="#/lesson/${esc(id)}/teleprompter">
          ${icon("text-size", 19)} <span>Teleprompter</span>
        </a>
        <a class="btn btn-secondary btn-lg" href="#/lesson/${esc(id)}/shadowing">
          ${icon("headphones", 19)} <span>Shadowing</span>
        </a>
      </div>

      <div class="lesson-brief-grid">
        <section class="panel brief-card">
          <span class="eyebrow">Situation</span>
          <p>${esc(lesson.situation)}</p>
        </section>
        <section class="panel brief-card">
          <span class="eyebrow">Objective</span>
          <p>${esc(lesson.objective)}</p>
        </section>
      </div>

      <section class="panel transcript-panel" aria-labelledby="transcript-title">
        <div class="section-heading compact">
          <div>
            <span class="eyebrow">Transcript</span>
            <h2 id="transcript-title">The conversation</h2>
          </div>
          <span class="section-note">English + Indonesian</span>
        </div>
        <p class="audio-note">
          ${icon("volume", 15)}
          <span>MP3 is used when the file is available. Otherwise, the practice modes use your browser’s computer voice — temporary.</span>
        </p>

        <ol class="dialogue-list">
          ${lesson.dialogue.map((line, index) => `
            <li class="dialogue-line">
              <span class="dialogue-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
              <div class="dialogue-copy">
                <span class="dialogue-speaker">${esc(line.speaker)}</span>
                <p class="dialogue-en" lang="en">${esc(line.english)}</p>
                <p class="dialogue-id" lang="id">${esc(line.indonesian)}</p>
              </div>
            </li>
          `).join("")}
        </ol>
      </section>

      <div class="lesson-two-col">
        <section class="panel" aria-labelledby="expressions-title">
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">Key expressions</span>
              <h2 id="expressions-title">Useful lines</h2>
            </div>
          </div>
          ${listOrFallback(lesson.keyExpressions, items => `
            <ul class="expression-list">
              ${items.map(item => `
                <li class="expression-item">
                  <p class="expression-en" lang="en">${esc(item.english)}</p>
                  <p class="expression-id" lang="id">${esc(item.indonesian)}</p>
                  ${item.note ? `<p class="expression-note">${esc(item.note)}</p>` : ""}
                </li>
              `).join("")}
            </ul>
          `)}
        </section>

        <section class="panel" aria-labelledby="patterns-title">
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">Sentence patterns</span>
              <h2 id="patterns-title">Build your own</h2>
            </div>
          </div>
          ${listOrFallback(lesson.sentencePatterns, items => `
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
          `)}
        </section>
      </div>

      <div class="lesson-two-col">
        <section class="panel" aria-labelledby="learning-notes-title">
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">Learning notes</span>
              <h2 id="learning-notes-title">Small reminders</h2>
            </div>
          </div>
          ${listOrFallback(lesson.learningNotes, items => `
            <ul class="note-list">
              ${items.map(note => `<li>${esc(note)}</li>`).join("")}
            </ul>
          `)}
        </section>

        <section class="panel" aria-labelledby="pronunciation-title">
          <div class="section-heading compact">
            <div>
              <span class="eyebrow">American pronunciation</span>
              <h2 id="pronunciation-title">Say it clearly</h2>
            </div>
          </div>
          ${listOrFallback(lesson.pronunciationNotes, items => `
            <ul class="pronunciation-list">
              ${items.map(item => `
                <li class="pronunciation-item">
                  <span class="pronunciation-icon" aria-hidden="true">${icon("volume", 17)}</span>
                  <div>
                    <strong>${esc(item.title)}</strong>
                    <p>${esc(item.note)}</p>
                  </div>
                </li>
              `).join("")}
            </ul>
          `)}
        </section>
      </div>
    </div>
  `;

  const completeButton = root.querySelector("[data-complete]");
  const completeChip = root.querySelector("[data-complete-chip]");

  function renderComplete(isComplete) {
    if (!completeButton) return;
    completeButton.classList.toggle("is-complete", isComplete);
    completeButton.setAttribute("aria-pressed", String(isComplete));
    completeButton.innerHTML = isComplete
      ? `${icon("check-circle", 18)} <span>Completed</span>`
      : `${icon("check", 18)} <span>Mark complete</span>`;
    if (completeChip) {
      completeChip.textContent = isComplete ? "Completed" : "In progress";
      completeChip.classList.toggle("chip-success", isComplete);
    }
  }

  function onComplete() {
    const next = toggleLessonComplete(id);
    renderComplete(next);
  }

  completeButton?.addEventListener("click", onComplete);

  return {
    title: `${lesson.title} · Small Steps English`,
    cleanup: () => {
      completeButton?.removeEventListener("click", onComplete);
    }
  };
}
