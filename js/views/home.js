import { loadLessonIndex, loadModules, moduleProgress } from "../data.js";
import { getCompletedLessons, getLastLessonId, isStorageAvailable } from "../store.js";
import { icon } from "../icons.js";
import { esc } from "../utils.js";

export async function homeView(root) {
  const [modules, index] = await Promise.all([loadModules(), loadLessonIndex()]);
  const completed = getCompletedLessons();
  const lastId = getLastLessonId();

  const plannedLessons = modules.reduce((sum, module) => sum + module.lessonCount, 0);
  const availableLessons = index.filter(entry => modules.some(module => module.id === entry.moduleId));
  const completedCount = modules.reduce((sum, module) => {
    return sum + moduleProgress(module, index, completed).completedCount;
  }, 0);
  const percent = plannedLessons ? Math.round((completedCount / plannedLessons) * 100) : 0;

  const target = availableLessons.find(entry => entry.id === lastId) || availableLessons[0] || null;
  const targetModule = modules.find(module => module.id === target?.moduleId) || null;
  const returning = Boolean(target && lastId === target.id);
  const primaryLabel = returning ? "Continue lesson" : "Start first lesson";
  const storageText = isStorageAvailable()
    ? "Progress is saved on this device."
    : "Progress cannot be saved in this browser.";

  root.innerHTML = `
    <div class="view home-view">
      <section class="home-hero">
        <div class="hero-copy">
          <span class="eyebrow">Small Steps English</span>
          <h1>English for Service Engineers</h1>
          <p class="hero-subtitle">Percakapan teknis untuk service engineer bandara Indonesia.</p>
          <p class="hero-text">
            Latih satu percakapan pendek setiap hari. Baca dengan tenang di Teleprompter,
            lalu ikuti irama suara lewat Shadowing. Tanpa akun, tanpa biaya.
          </p>
          <div class="hero-actions">
            ${target ? `
              <a class="btn btn-primary btn-lg" href="#/lesson/${esc(target.id)}">
                ${icon("play", 18)} <span>${esc(primaryLabel)}</span>
              </a>
            ` : ""}
            <a class="btn btn-secondary btn-lg" href="#/modules">
              ${icon("library", 18)} <span>Browse modules</span>
            </a>
          </div>
          <p class="hero-note">${icon("shield", 15)} <span>${esc(storageText)} No login needed.</span></p>
        </div>

        <aside class="hero-progress panel" aria-labelledby="home-progress-title">
          <div class="panel-heading">
            <span class="eyebrow" id="home-progress-title">Your progress</span>
            <span class="chip">${percent}%</span>
          </div>
          <p class="stat-number"><strong>${completedCount}</strong><span>/ ${plannedLessons} planned lessons</span></p>
          <div class="progress-track" role="progressbar" aria-label="Planned lessons completed" aria-valuemin="0" aria-valuemax="${plannedLessons}" aria-valuenow="${completedCount}">
            <span style="width:${percent}%"></span>
          </div>
          <dl class="mini-stats">
            <div>
              <dt>Available now</dt>
              <dd>${availableLessons.length} lesson${availableLessons.length === 1 ? "" : "s"}</dd>
            </div>
            <div>
              <dt>Completed</dt>
              <dd>${completedCount}</dd>
            </div>
            <div>
              <dt>Last opened</dt>
              <dd>${lastId ? esc(lastId) : "Not started"}</dd>
            </div>
            <div>
              <dt>Audio</dt>
              <dd>MP3 or computer voice</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section class="section" aria-labelledby="continue-title">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Keep going</span>
            <h2 id="continue-title">Continue learning</h2>
          </div>
          <span class="section-note">${returning ? "Pick up where you stopped" : "Your first conversation"}</span>
        </div>

        ${target ? `
          <article class="continue-card">
            <span class="continue-icon" aria-hidden="true">${icon("book", 22)}</span>
            <div class="continue-copy">
              <span class="continue-meta">
                Module ${esc(targetModule?.number || "1")} · Lesson ${esc(target.id.slice(-2))} ·
                ${esc(target.difficulty || targetModule?.level || "Beginner")}
              </span>
              <h3>${esc(target.title)}</h3>
              <p>${esc(targetModule?.title || "Basic Technical Communication")}</p>
            </div>
            <a class="btn btn-primary" href="#/lesson/${esc(target.id)}">
              <span>${returning ? "Continue" : "Open lesson"}</span> ${icon("arrow-right", 17)}
            </a>
          </article>
        ` : `
          <article class="continue-card">
            <span class="continue-icon" aria-hidden="true">${icon("clock", 22)}</span>
            <div class="continue-copy">
              <h3>The first lesson is being prepared</h3>
              <p>Browse the module library to see what is planned.</p>
            </div>
            <a class="btn btn-secondary" href="#/modules">Browse modules</a>
          </article>
        `}
      </section>

      <section class="section" aria-labelledby="modes-title">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Two practice modes</span>
            <h2 id="modes-title">Read it. Then follow it.</h2>
          </div>
          <span class="section-note">Same conversation, two different skills</span>
        </div>

        <div class="mode-grid">
          ${target ? `
            <a class="mode-card" href="#/lesson/${esc(target.id)}/teleprompter">
              <span class="mode-card-icon" aria-hidden="true">${icon("text-size", 21)}</span>
              <div>
                <h3>Teleprompter</h3>
                <p>Auto-scroll the conversation at your own pace. The sentence crossing the center line stays highlighted.</p>
                <span class="text-link">Open Teleprompter ${icon("arrow-right", 15)}</span>
              </div>
            </a>
            <a class="mode-card" href="#/lesson/${esc(target.id)}/shadowing">
              <span class="mode-card-icon" aria-hidden="true">${icon("headphones", 21)}</span>
              <div>
                <h3>Shadowing</h3>
                <p>Listen, repeat, and speak along with the audio. Five short steps, one sentence at a time.</p>
                <span class="text-link">Open Shadowing ${icon("arrow-right", 15)}</span>
              </div>
            </a>
          ` : ""}
        </div>
      </section>

      <section class="section home-note-panel panel">
        <div class="home-note-icon" aria-hidden="true">${icon("target", 21)}</div>
        <div>
          <h2>A small, clear goal</h2>
          <p>Use one lesson until the sentences feel natural. Short practice that you repeat is better than a long session you skip.</p>
        </div>
        <a class="btn btn-secondary" href="#/modules">See all modules</a>
      </section>
    </div>
  `;

  return {
    title: "Small Steps English — English for Service Engineers",
    cleanup: () => {}
  };
}
