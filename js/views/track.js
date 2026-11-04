import {
  loadLessonIndex,
  loadTracks,
  trackById,
  trackProgress,
  unitGroupProgress
} from "../data.js";
import { getCompletedLessons } from "../store.js";
import { libraryTabs } from "../components/library-tabs.js";
import { icon } from "../icons.js";
import { esc } from "../utils.js";
import { notFoundView } from "./not-found.js";

const TYPE_LABELS = {
  pattern: "Pattern",
  expression: "Expression",
  dialogue: "Dialogue"
};

const TYPE_COUNTS = {
  pattern: "10 sentences",
  expression: "5–8 sentences",
  dialogue: "12–16 sentences"
};

function unitCode(unit) {
  if (/^PAT-D\d{2}$/.test(unit.id)) return unit.id.slice(4);
  return String(unit.number || "").padStart(2, "0");
}

function coverageBlock(group) {
  const covered = Array.isArray(group.coveredInVerbs) ? group.coveredInVerbs : [];
  const duplicates = Array.isArray(group.duplicates) ? group.duplicates : [];
  if (covered.length === 0 && duplicates.length === 0) return "";

  return `
    <div class="coverage-block">
      ${covered.length ? `
        <span class="eyebrow">Covered in Verbs</span>
        <ul class="coverage-list">
          ${covered.map(item => `
            <li class="coverage-item">
              <span>${esc(item.phrase)}</span>
              <span class="lesson-badge">Covered in Verbs · ${esc(item.coveredBy)}</span>
            </li>
          `).join("")}
        </ul>
      ` : ""}
      ${duplicates.length ? `
        <span class="eyebrow coverage-eyebrow">Listed once elsewhere</span>
        <ul class="coverage-list">
          ${duplicates.map(item => `
            <li class="coverage-item">
              <span>${esc(item.phrase)}</span>
              <span class="lesson-badge">${esc(item.includedAs)} · ${esc(item.reason)}</span>
            </li>
          `).join("")}
        </ul>
      ` : ""}
    </div>
  `;
}

function groupCard(group, index, completed) {
  const progress = unitGroupProgress(group, index, completed);
  const available = new Map(index.map(entry => [entry.id, entry]));
  const typeLabel = TYPE_LABELS[group.type] || "Unit";
  const countLabel = TYPE_COUNTS[group.type] || "";

  return `
    <article class="unit-group" aria-labelledby="group-${esc(group.id)}-title" data-track-group="${esc(group.id)}">
      <header class="unit-group-head">
        <span class="module-number" aria-hidden="true">${esc(group.code)}</span>
        <div class="module-head-copy">
          <span class="module-kicker">Group ${esc(group.code)} · ${progress.units.length} units · ${typeLabel}${countLabel ? ` · ${countLabel}` : ""}</span>
          <h2 id="group-${esc(group.id)}-title">${esc(group.title)}</h2>
        </div>
      </header>

      <p class="module-desc">${esc(group.description)}</p>
      ${group.note ? `<p class="unit-group-note">${esc(group.note)}</p>` : ""}

      <div class="module-progress">
        <div class="progress-label">
          <span>${progress.completedCount} of ${progress.units.length} completed</span>
          <span>${progress.availableCount} available</span>
        </div>
        <div class="progress-track" role="progressbar" aria-label="${esc(group.title)} completed units" aria-valuemin="0" aria-valuemax="${progress.units.length}" aria-valuenow="${progress.completedCount}">
          <span style="width:${progress.percent}%"></span>
        </div>
      </div>

      <ul class="lesson-list">
        ${progress.units.map(unit => {
          const entry = available.get(unit.id);
          const done = entry ? completed.includes(unit.id) : false;
          if (entry) {
            return `
              <li>
                <a class="lesson-link" href="#/lesson/${esc(unit.id)}" data-unit="${esc(unit.id)}" data-unit-state="available">
                  <span class="lesson-index">${esc(unitCode(unit))}</span>
                  <span class="lesson-title">${esc(entry.title || unit.title)}</span>
                  <span class="lesson-badge ${done ? "is-done" : ""}">
                    ${done ? `${icon("check", 12)} Completed` : `${icon("arrow-right", 12)} Open`}
                  </span>
                </a>
              </li>
            `;
          }
          return `
            <li>
              <span class="lesson-link lesson-soon" aria-disabled="true" data-unit="${esc(unit.id)}" data-unit-state="coming-soon">
                <span class="lesson-index">${esc(unitCode(unit))}</span>
                <span class="lesson-title">${esc(unit.title)}</span>
                <span class="lesson-badge">Coming soon</span>
              </span>
            </li>
          `;
        }).join("")}
      </ul>

      ${coverageBlock(group)}
    </article>
  `;
}

export async function trackView(root, { trackId }) {
  const [tracks, index] = await Promise.all([loadTracks(), loadLessonIndex()]);
  const track = trackById(tracks, trackId);

  if (!track || track.kind !== "unit-groups") {
    return notFoundView(root, {
      eyebrow: "Track not found",
      title: "This library track is not available.",
      message: "Go back to the library to choose Verbs, Patterns, or Expressions.",
      actionHref: "#/modules",
      actionLabel: "Back to library"
    });
  }

  const completed = getCompletedLessons(track.id);
  const progress = trackProgress(track, index, completed);

  root.innerHTML = `
    <div class="view modules-view track-view" data-track="${esc(track.id)}">
      ${libraryTabs(tracks, track.id)}

      <header class="page-head">
        <span class="eyebrow">${esc(track.eyebrow || "Library track")}</span>
        <h1>${esc(track.pageTitle || track.label)}</h1>
        <p>${esc(track.description)}</p>
        <div class="page-head-meta">
          <span class="chip">${progress.groups.length} groups</span>
          <span class="chip">${progress.unitCount} planned units</span>
          <span class="chip chip-accent">${progress.availableCount} available now</span>
        </div>
      </header>

      <div class="track-groups">
        ${progress.groups.map(group => groupCard(group, index, completed)).join("")}
      </div>

      <section class="library-note panel">
        <span class="library-note-icon" aria-hidden="true">${icon("layers", 20)}</span>
        <div>
          <h2>Only finished units are open</h2>
          <p>Unit baru ditulis satu per satu. Selama belum selesai, unit tetap terlihat sebagai “Coming soon” dan tidak bisa dibuka.</p>
        </div>
      </section>
    </div>
  `;

  return {
    title: `${track.label} · Small Steps English`,
    cleanup: () => {}
  };
}
