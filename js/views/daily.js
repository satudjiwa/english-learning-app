/*
 * Latihan Harian terdiri dari dua jalur:
 * 1. Program 35 hari (default) — lima frasa berurutan dengan pola kalimat.
 * 2. Sesi Bebas — rencana lima frasa per tanggal yang sudah ada sebelumnya.
 *
 * Progres program tidak memakai field baru. Status hari dihitung dari
 * learnedAt pada frasa yang sudah tersimpan.
 */

import { CATEGORY_BY_ID, PHRASE_BY_ID } from "../data.js";
import {
  PROGRAM_DAY_BY_NUMBER,
  PROGRAM_ITEM_BY_ID,
  PROGRAM_PATTERN_BY_ID
} from "../curriculum.js";
import { icon } from "../icons.js";
import {
  getDayProgress,
  getNextProgramDay,
  getPreviousProgramDay,
  getProgramProgress,
  getRecommendedProgramDay,
  isValidProgramDay
} from "../program.js";
import {
  getDailyPlan,
  getPhraseRecord,
  getPlanProgress,
  getSettings,
  getStats,
  learnPhrase,
  markSeen
} from "../store.js";
import {
  isSpeechSupported,
  speak,
  speechErrorID
} from "../speech.js";
import { progressBarHTML, toast } from "../ui.js";
import { dateKey, englishHTML, esc } from "../utils.js";

export const navLabel = "Latihan Harian";
export const title = "Latihan Harian";
export const description = "Program 35 hari untuk belajar lima frasa Service Engineer setiap sesi, lengkap dengan pola kalimat dan latihan.";

function audioWarningHTML() {
  if (isSpeechSupported()) return "";
  return `
    <div class="inline-notice" role="status">
      ${icon("volume-off", 18)}
      <p><strong>Audio belum tersedia di browser ini.</strong> Kamu tetap bisa membaca kalimat dan mengucapkannya sendiri. Coba browser lain untuk mendengar contoh suara.</p>
    </div>
  `;
}

function speakTextButtonHTML(text, label = "Dengarkan contoh") {
  return `
    <button class="icon-btn icon-btn--small" type="button"
      data-speak-text="${esc(text)}"
      aria-label="${esc(label)}: ${esc(text)}"
      ${isSpeechSupported() ? "" : "disabled"}>
      ${icon("volume", 16)}
    </button>
  `;
}

function patternPanelHTML(item) {
  if (!item) return "";
  const pattern = PROGRAM_PATTERN_BY_ID[item.pattern];
  if (!pattern) return "";

  return `
    <section class="lesson-pattern" aria-labelledby="lesson-pattern-title">
      <div class="lesson-section-head">
        <span class="eyebrow" id="lesson-pattern-title">Pola kalimat</span>
        <span class="pattern-name">${esc(pattern.name)}</span>
      </div>
      <p class="lesson-formula" lang="en">${esc(pattern.formula)}</p>
      <p class="lesson-explanation">${esc(pattern.explanation)}</p>
      <p class="lesson-focus"><strong>Di frasa ini:</strong> ${esc(item.focus)}</p>
      ${pattern.forms?.length ? `
        <div class="pattern-forms" aria-label="Bentuk pola">
          ${pattern.forms.map(form => `<span lang="en">${esc(form)}</span>`).join("")}
        </div>
      ` : ""}
      ${pattern.safety ? `
        <div class="lesson-safety">
          ${icon("shield", 17)}
          <p>${esc(pattern.safety)}</p>
        </div>
      ` : ""}
    </section>
  `;
}

function examplesHTML(item) {
  if (!item?.examples?.length) return "";
  return `
    <section class="lesson-examples" aria-labelledby="lesson-examples-title">
      <div class="lesson-section-head">
        <span class="eyebrow" id="lesson-examples-title">Contoh lain</span>
        <span class="lesson-section-note">${item.examples.length} kalimat</span>
      </div>
      <ul>
        ${item.examples.map(example => `
          <li>
            <span lang="en">${englishHTML(example)}</span>
            ${speakTextButtonHTML(example)}
          </li>
        `).join("")}
      </ul>
    </section>
  `;
}

function promptHTML(item) {
  if (!item?.prompt) return "";
  return `
    <section class="lesson-prompt" aria-labelledby="lesson-prompt-title">
      <span class="lesson-prompt-icon">${icon("message", 18)}</span>
      <div>
        <span class="eyebrow" id="lesson-prompt-title">Latihan</span>
        <p>${esc(item.prompt)}</p>
        <small>Ucapkan jawabanmu dengan pola di atas, lalu dengarkan lagi frasa modelnya.</small>
      </div>
    </section>
  `;
}

function practiceCardHTML({ phrase, item, index, total, learned, reviewing }) {
  const category = CATEGORY_BY_ID[phrase.category];
  const audioDisabled = !isSpeechSupported();
  return `
    <article class="practice-card" aria-labelledby="daily-phrase-en">
      <div class="practice-card-top">
        <span class="category-chip">${icon(category.icon, 15)} ${esc(category.label)}</span>
        <span class="practice-count">Frasa ${index + 1} dari ${total}</span>
      </div>

      <div class="practice-progress">
        ${progressBarHTML(((index + 1) / total) * 100, "Posisi frasa dalam sesi")}
      </div>

      <div class="practice-body">
        <span class="practice-label">${icon("volume", 15)} Dengarkan, lalu ucapkan</span>
        <h2 class="practice-en" id="daily-phrase-en" lang="en">${englishHTML(phrase.en)}</h2>

        <div class="audio-actions">
          <button class="btn btn-secondary" type="button" data-play="${esc(phrase.id)}" ${audioDisabled ? "disabled" : ""}>
            ${icon("play", 17)} Putar audio
          </button>
          <button class="btn btn-ghost" type="button" data-play-slow="${esc(phrase.id)}" ${audioDisabled ? "disabled" : ""}>
            ${icon("slow-down", 17)} Lebih lambat
          </button>
          <button class="btn btn-ghost" type="button" data-practice="${esc(phrase.id)}" ${audioDisabled ? "disabled" : ""}>
            ${icon("refresh", 17)} Latih lagi
          </button>
        </div>

        ${audioWarningHTML()}

        <div class="translation-wrap">
          <div class="translation-panel" id="daily-translation" hidden>
            <span class="translation-label">Arti dalam bahasa Indonesia</span>
            <p>${esc(phrase.idText)}</p>
          </div>
          <button class="btn btn-reveal" type="button" data-reveal aria-expanded="false" aria-controls="daily-translation">
            ${icon("eye", 17)} <span>Tampilkan arti</span>
          </button>
        </div>

        <div class="lesson-context">
          <span class="lesson-kicker">Konteks kerja</span>
          <p>${esc(item?.context || phrase.note)}</p>
          ${item ? `
            <details class="lesson-note">
              <summary>Catatan tambahan</summary>
              <p>${esc(phrase.note)}</p>
            </details>
          ` : `
            <p class="lesson-free-note">${icon("info", 15)} Frasa ini ada di Sesi Bebas. Penjelasan pola lengkap tersedia untuk frasa dalam program 35 hari.</p>
          `}
        </div>

        ${patternPanelHTML(item)}
        ${examplesHTML(item)}
        ${promptHTML(item)}
      </div>

      <div class="practice-footer">
        <div class="learn-state ${learned ? "is-learned" : ""}">
          <span class="learn-dot">${learned ? icon("check", 14) : ""}</span>
          <span>${learned ? "Sudah dipelajari" : "Belum ditandai"}</span>
        </div>
        <button class="btn btn-primary" type="button" data-learn="${esc(phrase.id)}" ${learned ? "disabled" : ""}>
          ${learned ? `${icon("check", 17)} Sudah dipelajari` : `${icon("check", 17)} Tandai sudah dipelajari`}
        </button>
      </div>
    </article>

    <div class="practice-nav">
      <button class="btn btn-ghost" type="button" data-prev ${index === 0 ? "disabled" : ""}>
        ${icon("arrow-left", 17)} Sebelumnya
      </button>
      <span class="practice-nav-count">${index + 1} / ${total}</span>
      <button class="btn btn-ghost" type="button" data-next ${index >= total - 1 ? "disabled" : ""}>
        Berikutnya ${icon("arrow-right", 17)}
      </button>
    </div>

    ${reviewing ? `
      <div class="review-session-bar">
        ${icon("info", 16)}
        <span>Mode ulang: frasa sudah ditandai, jadi kamu bisa fokus mendengar, membaca pola, dan mengulang.</span>
        <button class="text-link" type="button" data-back-summary>Kembali ke ringkasan</button>
      </div>
    ` : ""}
  `;
}

function phraseStatusDotsHTML(progress) {
  return `
    <span class="program-day-dots" aria-hidden="true">
      ${Array.from({ length: progress.total }, (_, index) => (
        `<span class="day-dot ${index < progress.learned ? "is-done" : ""}"></span>`
      )).join("")}
    </span>
  `;
}

function programMapHTML(program, selectedDay) {
  return `
    <section class="program-map-section" aria-labelledby="program-map-title">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Peta program</span>
          <h2 id="program-map-title">${program.completeDays} dari ${program.totalDays} hari selesai</h2>
        </div>
        <span class="section-note">${program.learnedPhrases} / ${program.totalPhrases} frasa</span>
      </div>
      <div class="program-map">
        ${program.days.map(day => {
          const selected = day.day === selectedDay;
          const isNext = !day.progress.complete && day.day === program.currentDay;
          return `
            <a class="program-day ${day.progress.complete ? "is-complete" : ""} ${selected ? "is-selected" : ""} ${isNext ? "is-next" : ""}"
              href="#/daily/${day.day}"
              aria-current="${selected ? "page" : "false"}"
              aria-label="Hari ${day.day}, ${esc(day.title)}, ${day.progress.learned} dari ${day.progress.total} frasa selesai">
              <span class="program-day-top">
                <span class="program-day-number">Hari ${day.day}</span>
                <span class="program-day-status">${day.progress.complete ? icon("check-circle", 16) : isNext ? "Berikutnya" : `${day.progress.learned}/${day.progress.total}`}</span>
              </span>
              <strong>${esc(day.title)}</strong>
              ${phraseStatusDotsHTML(day.progress)}
            </a>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function dayPickerHTML(dayNumber, program) {
  const previous = getPreviousProgramDay(dayNumber);
  const next = getNextProgramDay(dayNumber);
  return `
    <div class="program-jump">
      <label class="program-jump-label" for="program-day-select">Pilih hari</label>
      <select id="program-day-select" data-day-select>
        ${program.days.map(day => `
          <option value="${day.day}" ${day.day === dayNumber ? "selected" : ""}>
            Hari ${day.day} — ${esc(day.title)} (${day.progress.learned}/${day.progress.total})
          </option>
        `).join("")}
      </select>
      <div class="program-jump-nav">
        ${previous
          ? `<a class="btn btn-ghost btn-sm" href="#/daily/${previous}">${icon("arrow-left", 16)} Hari ${previous}</a>`
          : `<span class="btn btn-ghost btn-sm is-disabled" aria-disabled="true">${icon("arrow-left", 16)} Awal</span>`}
        ${next
          ? `<a class="btn btn-ghost btn-sm" href="#/daily/${next}">Hari ${next} ${icon("arrow-right", 16)}</a>`
          : `<span class="btn btn-ghost btn-sm is-disabled" aria-disabled="true">Hari terakhir ${icon("check", 16)}</span>`}
      </div>
    </div>
  `;
}

function programLessonHeadHTML(day, progress) {
  return `
    <div class="program-lesson-head">
      <div>
        <span class="eyebrow">Hari ${day.day} · ${esc(day.phase)}</span>
        <h2>${esc(day.title)}</h2>
        <p>${esc(day.goal)}</p>
      </div>
      <span class="day-progress-pill ${progress.complete ? "is-done" : ""}">
        ${progress.complete ? `${icon("check", 15)} Selesai` : `${progress.learned} / ${progress.total} frasa`}
      </span>
    </div>
  `;
}

function programCompletionHTML({ day, progress, program, due }) {
  const next = getNextProgramDay(day.day);
  const phrases = day.items.map(item => PHRASE_BY_ID[item.id]).filter(Boolean);
  return `
    <section class="completion-card" aria-labelledby="daily-complete-title">
      <span class="completion-icon">${icon("check-circle", 34)}</span>
      <span class="eyebrow">Hari ${day.day} dari ${program.totalDays}</span>
      <h2 id="daily-complete-title">${esc(day.title)} selesai</h2>
      <p>Kamu menandai <strong>${progress.learned} frasa</strong>. Semua sudah masuk jadwal review pertama besok, lalu jaraknya akan bertambah setelah setiap recall yang berhasil.</p>
      <div class="completion-stats">
        <span><b>${program.completeDays}</b> hari selesai</span>
        <span><b>${program.learnedPhrases}</b> / ${program.totalPhrases} frasa program</span>
        <span><b>${due}</b> jatuh tempo</span>
      </div>
      <div class="completion-actions">
        ${next
          ? `<a class="btn btn-primary" href="#/daily/${next}">${icon("arrow-right", 18)} Lanjut Hari ${next}</a>`
          : `<a class="btn btn-primary" href="#/progress">${icon("award", 18)} Lihat progres program</a>`}
        <button class="btn btn-secondary" type="button" data-review-session>${icon("rotate-ccw", 18)} Ulangi frasa hari ini</button>
        ${due > 0 ? `<a class="btn btn-ghost" href="#/recall">${icon("refresh", 18)} Review ${due} frasa</a>` : ""}
      </div>
    </section>

    <section class="completion-list" aria-label="Frasa yang dipelajari pada hari ini">
      <div class="section-heading section-heading--tight">
        <div>
          <span class="eyebrow">Ringkasan</span>
          <h2>${progress.total} frasa Hari ${day.day}</h2>
        </div>
      </div>
      ${phrases.map(phrase => `
        <article class="review-phrase-row">
          <span class="phrase-check">${icon("check", 16)}</span>
          <div>
            <p class="review-en" lang="en">${englishHTML(phrase.en)}</p>
            <p class="review-id">${esc(phrase.idText)}</p>
          </div>
          <button class="icon-btn" type="button" data-speak-completion="${esc(phrase.id)}" aria-label="Dengarkan: ${esc(phrase.en)}" ${isSpeechSupported() ? "" : "disabled"}>
            ${icon("volume", 18)}
          </button>
        </article>
      `).join("")}
    </section>
  `;
}

function emptyPlanHTML({ due }) {
  return `
    <div class="empty-state empty-state--large">
      <span class="empty-icon">${icon("award", 30)}</span>
      <h2>Semua frasa sudah dipelajari</h2>
      <p>Tidak ada frasa baru untuk sesi harian. Ini saat yang tepat untuk memperkuat ingatan lewat review atau latihan berbicara.</p>
      <div class="empty-actions">
        ${due > 0
          ? `<a class="btn btn-primary" href="#/recall">${icon("refresh", 18)} Review ${due} frasa</a>`
          : `<a class="btn btn-primary" href="#/listen">${icon("headphones", 18)} Buka Listen &amp; Speak</a>`}
        <a class="btn btn-secondary" href="#/phrases">Lihat bank frasa</a>
      </div>
    </div>
  `;
}

function ensureProgramUI(ctx, day, progress) {
  const dayNumber = day.day;
  let ui = ctx.ui.program;
  if (!ui || ui.day !== dayNumber) {
    const firstUnlearned = progress.complete
      ? 0
      : day.items.findIndex(item => !getPhraseRecord(item.id)?.learnedAt);
    ui = {
      day: dayNumber,
      index: Math.max(0, firstUnlearned),
      reviewing: false
    };
    ctx.ui.program = ui;
  }
  if (ctx.isEntry) ui.reviewing = false;
  if (ui.index >= day.items.length) ui.index = Math.max(0, day.items.length - 1);
  if (ui.index < 0) ui.index = 0;
  return ui;
}

function resolveProgramDay(ctx, params) {
  const requested = Number(params?.id);
  if (isValidProgramDay(requested)) return requested;
  // Saat memperbarui halaman setelah menandai frasa, tetap di hari yang sedang
  // dibuka agar ringkasan hari selesai tidak langsung berganti ke hari berikutnya.
  if (!ctx.isEntry && isValidProgramDay(ctx.ui.program?.day)) {
    return ctx.ui.program.day;
  }
  return getRecommendedProgramDay();
}

function renderProgram(ctx, params) {
  const now = new Date();
  const stats = getStats(now);
  const program = getProgramProgress();
  const dayNumber = resolveProgramDay(ctx, params);
  const day = PROGRAM_DAY_BY_NUMBER[dayNumber];
  const progress = getDayProgress(day);
  const ui = ensureProgramUI(ctx, day, progress);
  const reviewing = Boolean(ui.reviewing) && progress.complete;
  const showCompletion = progress.complete && !reviewing;

  const pageHeader = `
    <header class="page-heading page-heading--split">
      <div>
        <span class="eyebrow">Program ${program.totalDays} hari · ${esc(day.phase)}</span>
        <h1>Latihan Harian</h1>
        <p>${esc(description)}</p>
      </div>
      <div class="page-actions">
        <a class="btn btn-secondary" href="#/daily/free">${icon("grid", 17)} Sesi Bebas</a>
      </div>
    </header>
  `;

  const overview = `
    <section class="program-overview" aria-label="Progres program">
      <div class="program-overview-copy">
        <span class="eyebrow">Progres program</span>
        <strong>${program.completeDays} dari ${program.totalDays} hari selesai</strong>
        <span>${program.learnedPhrases} dari ${program.totalPhrases} frasa sudah ditandai</span>
      </div>
      <div class="program-overview-bar">
        ${progressBarHTML(program.percentPhrases, "Progres frasa program")}
        <span>${program.percentPhrases}%</span>
      </div>
      <div class="program-overview-side">
        <span>${icon("target", 15)} Hari berikutnya: <b>${program.allComplete ? "program tuntas" : `Hari ${program.currentDay}`}</b></span>
        ${stats.due > 0 ? `<a class="daily-due-link" href="#/recall">${stats.due} jatuh tempo ${icon("arrow-right", 14)}</a>` : ""}
      </div>
    </section>
  `;

  let lesson;
  if (showCompletion) {
    lesson = programCompletionHTML({ day, progress, program, due: stats.due });
  } else {
    const phrase = PHRASE_BY_ID[day.items[ui.index].id];
    const item = PROGRAM_ITEM_BY_ID[phrase.id];
    const learned = Boolean(getPhraseRecord(phrase.id)?.learnedAt);
    lesson = `
      ${programLessonHeadHTML(day, progress)}
      ${practiceCardHTML({ phrase, item, index: ui.index, total: day.items.length, learned, reviewing })}
    `;
  }

  return `
    <div class="page">
      ${pageHeader}
      ${overview}
      ${dayPickerHTML(dayNumber, program)}
      ${lesson}
      ${programMapHTML(program, dayNumber)}

      <div class="page-note">
        ${icon("info", 15)} Audio memakai text-to-speech browser; kualitas suara mengikuti perangkat. Progres program dihitung dari frasa yang sudah kamu tandai dan tetap tersimpan lokal.
      </div>
      <div class="page-note">
        ${icon("shield", 15)} Program ini melatih bahasa, bukan prosedur kerja. Untuk pekerjaan berisiko, ikuti LOTO, work permit, izin operasi, dan otorisasi teknis di lokasi.
      </div>
    </div>
  `;
}

/* ── Sesi Bebas: jalur lama tetap tersedia ─────────────────────────────── */

function ensureFreeUI(ctx, plan, progress) {
  const today = dateKey();
  let ui = ctx.ui.daily;
  if (!ui || ui.dateKey !== today) {
    ui = { dateKey: today, index: 0, reviewing: false };
    if (plan && !progress.complete) {
      const firstUnlearned = plan.ids.findIndex(id => !getPhraseRecord(id)?.learnedAt);
      if (firstUnlearned > 0) ui.index = firstUnlearned;
    }
    ctx.ui.daily = ui;
  }
  if (ctx.isEntry) ui.reviewing = false;
  if (!plan) {
    ui.index = 0;
  } else if (ui.index >= plan.ids.length) {
    ui.index = Math.max(0, plan.ids.length - 1);
  }
  return ui;
}

function freeCompletionHTML({ plan, progress, stats, due, canReview }) {
  const phrases = plan.ids.map(id => PHRASE_BY_ID[id]).filter(Boolean);
  return `
    <section class="completion-card" aria-labelledby="daily-complete-title">
      <span class="completion-icon">${icon("check-circle", 34)}</span>
      <span class="eyebrow">Sesi bebas</span>
      <h2 id="daily-complete-title">Latihan sesi bebas selesai</h2>
      <p>Kamu menandai <strong>${progress.learned} frasa</strong>. Semua sudah masuk jadwal review pertama besok, lalu jaraknya akan bertambah setelah setiap recall yang berhasil.</p>
      <div class="completion-stats">
        <span><b>${progress.learned}</b> frasa dipelajari</span>
        <span><b>${stats.streak}</b> hari streak</span>
        <span><b>${due}</b> jatuh tempo</span>
      </div>
      <div class="completion-actions">
        ${due > 0
          ? `<a class="btn btn-primary" href="#/recall">${icon("refresh", 18)} Review ${due} frasa</a>`
          : `<a class="btn btn-primary" href="#/listen">${icon("headphones", 18)} Latihan mendengar</a>`}
        <a class="btn btn-secondary" href="#/daily">${icon("calendar", 18)} Kembali ke program</a>
        ${canReview ? `<button class="btn btn-ghost" type="button" data-review-session>${icon("rotate-ccw", 18)} Lihat frasa sesi ini</button>` : ""}
      </div>
    </section>

    <section class="completion-list" aria-label="Frasa yang dipelajari di sesi bebas">
      <div class="section-heading section-heading--tight">
        <div>
          <span class="eyebrow">Ringkasan</span>
          <h2>Frasa sesi ini</h2>
        </div>
      </div>
      ${phrases.map(phrase => `
        <article class="review-phrase-row">
          <span class="phrase-check">${icon("check", 16)}</span>
          <div>
            <p class="review-en" lang="en">${englishHTML(phrase.en)}</p>
            <p class="review-id">${esc(phrase.idText)}</p>
          </div>
          <button class="icon-btn" type="button" data-speak-completion="${esc(phrase.id)}" aria-label="Dengarkan: ${esc(phrase.en)}" ${isSpeechSupported() ? "" : "disabled"}>
            ${icon("volume", 18)}
          </button>
        </article>
      `).join("")}
    </section>
  `;
}

function renderFree(ctx) {
  const now = new Date();
  const plan = getDailyPlan(now);
  const progress = getPlanProgress(plan);
  const stats = getStats(now);
  const due = stats.due;
  const settings = getSettings();
  const ui = ensureFreeUI(ctx, plan, progress);
  const reviewing = Boolean(ui.reviewing) && progress.complete;
  const showCompletion = progress.complete && !reviewing;

  const pageHeader = `
    <header class="page-heading page-heading--split">
      <div>
        <span class="eyebrow">Latihan harian · sesi bebas</span>
        <h1>Sesi Bebas</h1>
        <p>Frasa dari bank frasa dengan target ${settings.dailyTarget} frasa per sesi. Jalur ini mempertahankan rencana harian lama dan bisa dipakai di luar urutan program.</p>
      </div>
      <div class="page-actions">
        <a class="btn btn-secondary" href="#/daily">${icon("calendar", 17)} Kembali ke program</a>
      </div>
    </header>
  `;

  if (!plan) {
    return `
      <div class="page">
        ${pageHeader}
        ${emptyPlanHTML({ due })}
      </div>
    `;
  }

  if (showCompletion) {
    return `
      <div class="page">
        ${pageHeader}
        ${freeCompletionHTML({
          plan,
          progress,
          stats: { ...stats, streak: stats.streak },
          due,
          canReview: true
        })}
        <div class="page-note">${icon("lock", 15)} Frasa yang ditandai dijadwalkan review besok. Kamu bisa mengubah target Sesi Bebas di Pengaturan.</div>
      </div>
    `;
  }

  const phrase = PHRASE_BY_ID[plan.ids[ui.index]] || PHRASE_BY_ID[plan.ids[0]];
  const item = PROGRAM_ITEM_BY_ID[phrase.id] || null;
  const learned = Boolean(getPhraseRecord(phrase.id)?.learnedAt);

  return `
    <div class="page">
      ${pageHeader}
      <div class="daily-summary">
        <div class="daily-summary-copy">
          <strong>${progress.learned} dari ${progress.total} frasa ditandai</strong>
          <span>${progress.complete ? "Sesi selesai" : "Selesaikan semua frasa untuk menuntaskan target sesi ini."}</span>
        </div>
        ${progressBarHTML(progress.percent, "Progres sesi bebas")}
        ${due > 0 ? `<a class="daily-due-link" href="#/recall">${due} jatuh tempo ${icon("arrow-right", 14)}</a>` : ""}
      </div>

      ${practiceCardHTML({ phrase, item, index: ui.index, total: plan.ids.length, learned, reviewing })}

      <div class="page-note">
        ${icon("info", 15)} Sesi Bebas memakai target harian di Pengaturan. Frasa di luar program tetap bisa didengar dan dibaca; penjelasan pola lengkap tersedia untuk 175 frasa program.
      </div>
    </div>
  `;
}

export function render(ctx, params = {}) {
  if (params.id === "free") return renderFree(ctx);
  return renderProgram(ctx, params);
}

function bindCompletion(root) {
  root.querySelectorAll("[data-speak-completion]").forEach(button => {
    button.addEventListener("click", () => {
      const phrase = PHRASE_BY_ID[button.dataset.speakCompletion];
      if (!phrase) return;
      const result = speak(phrase.en, { onError: code => toast(speechErrorID(code), "error") });
      if (!result.ok) toast(speechErrorID(result.reason), "error");
    });
  });
}

function bindExampleAudio(root) {
  root.querySelectorAll("[data-speak-text]").forEach(button => {
    button.addEventListener("click", () => {
      const text = button.dataset.speakText;
      if (!text) return;
      const result = speak(text, { onError: code => toast(speechErrorID(code), "error") });
      if (!result.ok) toast(speechErrorID(result.reason), "error");
    });
  });
}

function bindReveal(root) {
  root.querySelector("[data-reveal]")?.addEventListener("click", event => {
    const button = event.currentTarget;
    const panel = root.querySelector("#daily-translation");
    if (!panel) return;
    const isHidden = panel.hidden;
    panel.hidden = !isHidden;
    button.setAttribute("aria-expanded", String(isHidden));
    const label = button.querySelector("span");
    if (label) label.textContent = isHidden ? "Sembunyikan arti" : "Tampilkan arti";
  });
}

function bindPracticeAudio(root, phrase) {
  const play = (slow = false) => {
    const result = speak(phrase.en, {
      slow,
      onError: code => toast(speechErrorID(code), "error")
    });
    if (!result.ok) toast(speechErrorID(result.reason), "error");
  };

  root.querySelector("[data-play]")?.addEventListener("click", () => play(false));
  root.querySelector("[data-play-slow]")?.addEventListener("click", () => play(true));
  root.querySelector("[data-practice]")?.addEventListener("click", () => {
    const panel = root.querySelector("#daily-translation");
    const reveal = root.querySelector("[data-reveal]");
    if (panel) panel.hidden = true;
    if (reveal) {
      reveal.setAttribute("aria-expanded", "false");
      const label = reveal.querySelector("span");
      if (label) label.textContent = "Tampilkan arti";
    }
    play(false);
  });
}

function mountProgram(root, ctx, params) {
  const dayNumber = resolveProgramDay(ctx, params);
  const day = PROGRAM_DAY_BY_NUMBER[dayNumber];
  const progress = getDayProgress(day);
  const ui = ensureProgramUI(ctx, day, progress);
  const reviewing = Boolean(ui.reviewing) && progress.complete;

  root.querySelector("[data-day-select]")?.addEventListener("change", event => {
    const selected = Number(event.currentTarget.value);
    if (!isValidProgramDay(selected)) return;
    location.hash = `#/daily/${selected}`;
  });

  bindExampleAudio(root);

  if (progress.complete && !reviewing) {
    bindCompletion(root);
    root.querySelector("[data-review-session]")?.addEventListener("click", () => {
      ctx.ui.program.reviewing = true;
      ctx.ui.program.index = 0;
      ctx.refresh({ scrollTop: true });
    });
    return;
  }

  const item = day.items[ui.index];
  const phrase = PHRASE_BY_ID[item.id];
  if (!phrase) return;
  markSeen(phrase.id);
  bindPracticeAudio(root, phrase);
  bindReveal(root);

  root.querySelector("[data-learn]")?.addEventListener("click", () => {
    const changed = learnPhrase(phrase.id);
    if (!changed) return;

    const updated = getDayProgress(day);
    if (updated.complete) {
      toast(`Hari ${day.day} selesai. Lanjut ke hari berikutnya saat kamu siap.`, "success");
    } else {
      toast("Frasa ditandai. Review pertama dijadwalkan besok.", "success");
    }

    let nextUnlearned = day.items.findIndex((entry, index) => (
      index > ui.index && !getPhraseRecord(entry.id)?.learnedAt
    ));
    if (nextUnlearned === -1) {
      nextUnlearned = day.items.findIndex(entry => !getPhraseRecord(entry.id)?.learnedAt);
    }
    if (nextUnlearned !== -1) ui.index = nextUnlearned;
    ctx.refresh({ scrollTop: true });
  });

  root.querySelector("[data-prev]")?.addEventListener("click", () => {
    if (ui.index <= 0) return;
    ui.index -= 1;
    ctx.refresh({ scrollTop: true });
  });

  root.querySelector("[data-next]")?.addEventListener("click", () => {
    if (ui.index >= day.items.length - 1) return;
    ui.index += 1;
    ctx.refresh({ scrollTop: true });
  });

  root.querySelector("[data-back-summary]")?.addEventListener("click", () => {
    if (ctx.ui.program) ctx.ui.program.reviewing = false;
    ctx.refresh({ scrollTop: true });
  });
}

function mountFree(root, ctx) {
  const plan = getDailyPlan();
  const progress = getPlanProgress(plan);
  const ui = ctx.ui.daily;
  const reviewing = Boolean(ui?.reviewing) && progress.complete;

  if (!plan || !ui || (progress.complete && !reviewing)) {
    bindCompletion(root);
    root.querySelector("[data-review-session]")?.addEventListener("click", () => {
      if (ctx.ui.daily) ctx.ui.daily.reviewing = true;
      ctx.refresh({ scrollTop: true });
    });
    return;
  }

  const phrase = PHRASE_BY_ID[plan.ids[ui.index]];
  if (!phrase) return;
  markSeen(phrase.id);
  bindPracticeAudio(root, phrase);
  bindReveal(root);
  bindExampleAudio(root);

  root.querySelector("[data-learn]")?.addEventListener("click", () => {
    const changed = learnPhrase(phrase.id);
    if (!changed) return;
    toast("Frasa ditandai. Review pertama dijadwalkan besok.", "success");

    const nextUnlearned = plan.ids.findIndex((id, index) => (
      index > ui.index && !getPhraseRecord(id)?.learnedAt
    ));
    if (nextUnlearned !== -1) ctx.ui.daily.index = nextUnlearned;
    ctx.refresh({ scrollTop: true });
  });

  root.querySelector("[data-prev]")?.addEventListener("click", () => {
    if (ui.index <= 0) return;
    ui.index -= 1;
    ctx.refresh({ scrollTop: true });
  });

  root.querySelector("[data-next]")?.addEventListener("click", () => {
    if (ui.index >= plan.ids.length - 1) return;
    ui.index += 1;
    ctx.refresh({ scrollTop: true });
  });

  root.querySelector("[data-back-summary]")?.addEventListener("click", () => {
    if (ctx.ui.daily) ctx.ui.daily.reviewing = false;
    ctx.refresh({ scrollTop: true });
  });
}

export function mount(root, ctx, params = {}) {
  if (params.id === "free") {
    mountFree(root, ctx);
    return;
  }
  mountProgram(root, ctx, params);
}
