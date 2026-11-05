import { loadLessonIndex, loadModules, moduleProgress } from "../data.js";
import { getCompletedLessons } from "../store.js";
import { icon } from "../icons.js";
import { esc } from "../utils.js";

export async function modulesView(root) {
  const [modules, index] = await Promise.all([loadModules(), loadLessonIndex()]);
  const completed = getCompletedLessons();
  const availableCount = index.length;
  const plannedCount = modules.reduce((sum, module) => sum + module.lessonCount, 0);

  root.innerHTML = `
    <div class="view modules-view">
      <header class="page-head">
        <span class="eyebrow">Module library</span>
        <h1>Six modules. One step at a time.</h1>
        <p>
          Mulai dari komunikasi teknis dasar, lalu lanjut ke troubleshooting, remote support,
          maintenance, komunikasi pelanggan, dan laporan teknis.
        </p>
        <div class="page-head-meta">
          <span class="chip">${modules.length} modules</span>
          <span class="chip">${plannedCount} planned lessons</span>
          <span class="chip chip-accent">${availableCount} available now</span>
        </div>
      </header>

      <div class="module-grid">
        ${modules.map(module => {
          const progress = moduleProgress(module, index, completed);
          return `
            <article class="module-card" aria-labelledby="module-${esc(module.id)}-title">
              <header class="module-head">
                <span class="module-number" aria-hidden="true">${String(module.number).padStart(2, "0")}</span>
                <div class="module-head-copy">
                  <span class="module-kicker">Module ${module.number} · ${esc(module.level)}</span>
                  <h2 id="module-${esc(module.id)}-title">${esc(module.title)}</h2>
                </div>
              </header>

              <p class="module-desc">${esc(module.description)}</p>

              <div class="module-progress">
                <div class="progress-label">
                  <span>${progress.completedCount} of ${module.lessonCount} completed</span>
                  <span>${progress.availableCount} of ${module.lessonCount} available</span>
                </div>
                <div class="progress-track" role="progressbar" aria-label="Module ${module.number} completed lessons" aria-valuemin="0" aria-valuemax="${module.lessonCount}" aria-valuenow="${progress.completedCount}">
                  <span style="width:${progress.percent}%"></span>
                </div>
              </div>

              <ul class="lesson-list">
                ${progress.lessons.map(lesson => {
                  const done = completed.includes(lesson.id);
                  if (lesson.available) {
                    return `
                      <li>
                        <a class="lesson-link" href="#/lesson/${esc(lesson.id)}">
                          <span class="lesson-index">${String(lesson.number).padStart(2, "0")}</span>
                          <span class="lesson-title">${esc(lesson.title)}</span>
                          <span class="lesson-badge ${done ? "is-done" : ""}">
                            ${done ? `${icon("check", 12)} Completed` : `${icon("arrow-right", 12)} Open`}
                          </span>
                        </a>
                      </li>
                    `;
                  }
                  return `
                    <li>
                      <span class="lesson-link lesson-soon" aria-disabled="true">
                        <span class="lesson-index">${String(lesson.number).padStart(2, "0")}</span>
                        <span class="lesson-title">Lesson ${lesson.number}</span>
                        <span class="lesson-badge">Coming soon</span>
                      </span>
                    </li>
                  `;
                }).join("")}
              </ul>
            </article>
          `;
        }).join("")}
      </div>

      <section class="library-note panel">
        <span class="library-note-icon" aria-hidden="true">${icon("layers", 20)}</span>
        <div>
          <h2>Only finished lessons are open</h2>
          <p>Setiap modul direncanakan berisi lima pelajaran. Pelajaran yang belum ditulis tetap terlihat sebagai “Coming soon” dan tidak bisa dibuka.</p>
        </div>
      </section>
    </div>
  `;

  return {
    title: "Module Library · Small Steps English",
    cleanup: () => {}
  };
}
