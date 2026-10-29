/* Recall training: prompt Indonesia → ingat kalimat Inggris → nilai keyakinan. */

import { CATEGORY_BY_ID, PHRASE_BY_ID, PHRASES } from "../data.js";
import { icon } from "../icons.js";
import { isMastered, RATING_META } from "../srs.js";
import {
  getDuePhrases,
  getPhraseRecord,
  getStats,
  markSeen,
  ratePhrase
} from "../store.js";
import {
  isSpeechSupported,
  speak,
  speechErrorID
} from "../speech.js";
import { progressBarHTML, toast } from "../ui.js";
import { dateKey, esc, relativeDueLabel } from "../utils.js";

export const navLabel = "Latihan Recall";
export const title = "Latihan Recall";
export const description = "Lihat prompt bahasa Indonesia, ingat kalimat Inggrisnya, lalu nilai keyakinanmu.";

const MAX_DUE_CARDS = 12;
const FREE_CARDS = 8;

function shuffle(items) {
  const list = [...items];
  for (let index = list.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [list[index], list[swap]] = [list[swap], list[index]];
  }
  return list;
}

function buildSession(now = new Date()) {
  const due = getDuePhrases(now);
  if (due.length) {
    return {
      dateKey: dateKey(now),
      queue: due.slice(0, MAX_DUE_CARDS).map(item => item.phrase.id),
      index: 0,
      mode: "due",
      startDue: due.length,
      ratings: { again: 0, hard: 0, good: 0 },
      done: false
    };
  }

  const candidates = PHRASES.filter(phrase => !isMastered(getPhraseRecord(phrase.id)));
  const pool = candidates.length ? candidates : PHRASES;
  return {
    dateKey: dateKey(now),
    queue: shuffle(pool).slice(0, FREE_CARDS).map(phrase => phrase.id),
    index: 0,
    mode: "free",
    startDue: 0,
    ratings: { again: 0, hard: 0, good: 0 },
    done: false
  };
}

function startSession(ctx) {
  ctx.ui.recall = buildSession();
  return ctx.ui.recall;
}

function ensureSession(ctx) {
  let session = ctx.ui.recall;
  const today = dateKey();
  if (!session || session.dateKey !== today) session = startSession(ctx);
  if (ctx.isEntry && session.done) session = startSession(ctx);
  if (!session.queue.length) session = startSession(ctx);
  return session;
}

function sessionSummaryHTML({ session, stats }) {
  const totalRated = session.ratings.again + session.ratings.hard + session.ratings.good;
  const due = stats.due;
  return `
    <section class="completion-card recall-summary" aria-labelledby="recall-summary-title">
      <span class="completion-icon">${icon("check-circle", 34)}</span>
      <span class="eyebrow">Sesi recall</span>
      <h2 id="recall-summary-title">Sesi selesai</h2>
      <p>Kamu menilai <strong>${totalRated} kartu</strong>. Penilaian ini sudah masuk ke jadwal review berikutnya.</p>
      <div class="rating-summary">
        <div class="rating-summary-item is-danger">
          <span>${icon("rotate-ccw", 18)}</span>
          <b>${session.ratings.again}</b>
          <small>Belum ingat</small>
        </div>
        <div class="rating-summary-item is-warning">
          <span>${icon("clock", 18)}</span>
          <b>${session.ratings.hard}</b>
          <small>Agak ingat</small>
        </div>
        <div class="rating-summary-item is-success">
          <span>${icon("check", 18)}</span>
          <b>${session.ratings.good}</b>
          <small>Sudah ingat</small>
        </div>
      </div>
      <div class="completion-stats">
        <span><b>${due}</b> frasa jatuh tempo</span>
        <span><b>${stats.mastered}</b> frasa dikuasai</span>
        <span><b>${stats.streak}</b> hari streak</span>
      </div>
      ${due > 0 ? `<p class="summary-note">${icon("info", 16)} Masih ada ${due} frasa yang perlu diulang. Sesi berikutnya akan mengambil frasa yang paling lama jatuh tempo.</p>` : ""}
      <div class="completion-actions">
        <button class="btn btn-primary" type="button" data-new-session>${icon("refresh", 18)} Mulai sesi baru</button>
        ${due > 0 ? `<a class="btn btn-secondary" href="#/recall" data-reload-recall>Review berikutnya</a>` : `<a class="btn btn-secondary" href="#/home">Kembali ke beranda</a>`}
      </div>
    </section>
  `;
}

function ratingButtonHTML(rating) {
  const meta = RATING_META[rating];
  const iconName = rating === "again" ? "rotate-ccw" : rating === "hard" ? "clock" : "check";
  return `
    <button class="rating-btn rating-${rating}" type="button" data-rating="${rating}" aria-pressed="false">
      <span class="rating-icon">${icon(iconName, 20)}</span>
      <span class="rating-label">${meta.label}</span>
      <span class="rating-desc">${meta.description}</span>
    </button>
  `;
}

export function render(ctx) {
  const now = new Date();
  const stats = getStats(now);
  const session = ensureSession(ctx);
  const audioAvailable = isSpeechSupported();

  if (session.done) {
    return `
      <div class="page">
        <header class="page-heading">
          <span class="eyebrow">Recall · ${stats.learned} frasa dipelajari</span>
          <h1>Latihan Recall</h1>
          <p>${esc(description)}</p>
        </header>
        ${sessionSummaryHTML({ session, stats })}
        <div class="page-note">${icon("info", 15)} Review berikutnya dihitung dari penilaian terakhir, bukan dari berapa kali frasa ditampilkan.</div>
      </div>
    `;
  }

  const phrase = PHRASE_BY_ID[session.queue[session.index]];
  if (!phrase) {
    session.done = true;
    ctx.refresh();
    return "";
  }
  const progress = session.queue.length
    ? Math.round((session.index / session.queue.length) * 100)
    : 0;

  return `
    <div class="page">
      <header class="page-heading">
        <span class="eyebrow">Recall · ${session.mode === "due" ? "review terjadwal" : "latihan bebas"}</span>
        <h1>Latihan Recall</h1>
        <p>${esc(description)}</p>
      </header>

      <div class="recall-layout">
        <div class="recall-main">
          <div class="session-strip">
            <span class="session-mode ${session.mode === "due" ? "is-due" : ""}">
              ${icon(session.mode === "due" ? "clock" : "sparkles", 15)}
              ${session.mode === "due" ? "Review terjadwal" : "Latihan bebas"}
            </span>
            <span class="session-count" data-session-count>Kartu ${session.index + 1} dari ${session.queue.length}</span>
            <div class="session-progress">${progressBarHTML(progress, "Progres sesi recall")}</div>
          </div>

          <article class="recall-card" aria-labelledby="recall-prompt">
            <div class="recall-card-top">
              <span class="category-chip">${icon(CATEGORY_BY_ID[phrase.category].icon, 15)} ${esc(CATEGORY_BY_ID[phrase.category].label)}</span>
              <span class="recall-hint">${icon("brain", 15)} Active recall</span>
            </div>

            <div class="recall-prompt-wrap">
              <span class="prompt-label">Ucapkan dalam bahasa Inggris</span>
              <h2 class="recall-prompt" id="recall-prompt">${esc(phrase.idText)}</h2>
              <p class="recall-instruction">Coba ucapkan kalimat lengkapnya dengan suara keras sebelum membuka jawaban. Jangan hanya mengingat artinya.</p>
            </div>

            <div id="recall-before">
              <button class="btn btn-primary btn-wide" type="button" data-reveal-answer>
                ${icon("eye", 18)} Tampilkan Jawaban
              </button>
            </div>

            <div id="recall-after" hidden>
              <div class="answer-block" id="recall-answer" tabindex="-1">
                <span class="answer-label">Jawaban</span>
                <p class="answer-en" lang="en">${esc(phrase.en)}</p>
                <div class="answer-actions">
                  <button class="btn btn-secondary btn-sm" type="button" data-answer-play ${audioAvailable ? "" : "disabled"}>
                    ${icon("play", 16)} Putar
                  </button>
                  <button class="btn btn-ghost btn-sm" type="button" data-answer-slow ${audioAvailable ? "" : "disabled"}>
                    ${icon("slow-down", 16)} Pelan
                  </button>
                </div>
                <div class="answer-note">
                  <strong>Kapan dipakai:</strong> ${esc(phrase.note)}
                </div>
              </div>

              <div class="rating-section">
                <div class="rating-heading">
                  <h3>Seberapa yakin kamu?</h3>
                  <p>Penilaian menentukan jadwal review berikutnya.</p>
                </div>
                <div class="rating-grid" role="group" aria-label="Nilai keyakinan">
                  ${ratingButtonHTML("again")}
                  ${ratingButtonHTML("hard")}
                  ${ratingButtonHTML("good")}
                </div>
                <p class="rating-feedback" id="recall-schedule" role="status"></p>
              </div>
            </div>

            <div class="recall-footer">
              <button class="btn btn-ghost" type="button" data-recall-next>
                ${icon("arrow-right", 17)} Kalimat Berikutnya
              </button>
              <span class="skip-note">Melewati tanpa menilai tidak mengubah jadwal.</span>
            </div>
          </article>
        </div>

        <aside class="recall-aside">
          <section class="side-card">
            <span class="side-card-icon">${icon("target", 20)}</span>
            <h2>Cara menilai</h2>
            <ul class="plain-list">
              <li><span class="dot dot-danger"></span><strong>Belum ingat</strong> — akan muncul lagi di sesi ini.</li>
              <li><span class="dot dot-warning"></span><strong>Agak ingat</strong> — review besok.</li>
              <li><span class="dot dot-success"></span><strong>Sudah ingat</strong> — review 3 hari lagi, lalu makin lama.</li>
            </ul>
          </section>

          <section class="side-card side-card--soft">
            <span class="side-card-icon">${icon("chart", 20)}</span>
            <h2>Sesi ini</h2>
            <div class="side-stat"><span>Jatuh tempo</span><b data-side-due>${stats.due}</b></div>
            <div class="side-stat"><span>Dipelajari</span><b data-side-learned>${stats.learned}/${stats.total}</b></div>
            <div class="side-stat"><span>Dikuasai</span><b data-side-mastered>${stats.mastered}</b></div>
            <p class="side-note">${session.mode === "due"
              ? "Sesi mengambil frasa yang paling lama jatuh tempo."
              : "Belum ada frasa jatuh tempo. Sesi ini berisi latihan bebas; penilaianmu tetap disimpan."}</p>
          </section>

          ${!audioAvailable ? `
            <div class="inline-notice inline-notice--compact" role="status">
              ${icon("volume-off", 18)}
              <p>Audio tidak didukung browser ini. Tetap ucapkan jawaban dengan suara keras.</p>
            </div>
          ` : ""}
        </aside>
      </div>

      <div class="keyboard-note">${icon("info", 15)} Tips: tekan Tab untuk berpindah kontrol, lalu Enter atau Spasi untuk memilih.</div>
    </div>
  `;
}

export function mount(root, ctx) {
  const session = ctx.ui.recall;
  if (!session || session.done) {
    root.querySelector("[data-new-session]")?.addEventListener("click", () => {
      startSession(ctx);
      ctx.refresh({ scrollTop: true });
    });
    root.querySelector("[data-reload-recall]")?.addEventListener("click", event => {
      event.preventDefault();
      startSession(ctx);
      ctx.refresh({ scrollTop: true });
    });
    return;
  }

  const phrase = PHRASE_BY_ID[session.queue[session.index]];
  if (!phrase) return;
  const revealButton = root.querySelector("[data-reveal-answer]");
  const before = root.querySelector("#recall-before");
  const after = root.querySelector("#recall-after");
  const schedule = root.querySelector("#recall-schedule");
  const ratingButtons = [...root.querySelectorAll("[data-rating]")];
  const nextButton = root.querySelector("[data-recall-next]");
  const answer = root.querySelector("#recall-answer");
  let rated = false;

  const play = (slow = false) => {
    const result = speak(phrase.en, {
      slow,
      onError: code => toast(speechErrorID(code), "error")
    });
    if (!result.ok) toast(speechErrorID(result.reason), "error");
  };

  root.querySelector("[data-answer-play]")?.addEventListener("click", () => play(false));
  root.querySelector("[data-answer-slow]")?.addEventListener("click", () => play(true));

  revealButton?.addEventListener("click", () => {
    if (before) before.hidden = true;
    if (after) after.hidden = false;
    markSeen(phrase.id);
    if (answer) {
      answer.hidden = false;
      answer.focus({ preventScroll: true });
    }
  });

  ratingButtons.forEach(button => {
    button.addEventListener("click", () => {
      if (rated) return;
      const rating = button.dataset.rating;
      let result;
      try {
        result = ratePhrase(phrase.id, rating);
      } catch (error) {
        console.error(error);
        toast("Penilaian tidak dapat disimpan. Coba lagi.", "error");
        return;
      }
      rated = true;
      session.ratings[rating] += 1;

      if (rating === "again") {
        const insertAt = Math.min(session.queue.length, session.index + 4);
        session.queue.splice(insertAt, 0, phrase.id);
        const countEl = root.querySelector("[data-session-count]");
        if (countEl) countEl.textContent = `Kartu ${session.index + 1} dari ${session.queue.length}`;
      }

      ratingButtons.forEach(item => {
        item.disabled = true;
        item.classList.toggle("is-selected", item.dataset.rating === rating);
        item.setAttribute("aria-pressed", String(item.dataset.rating === rating));
      });

      if (schedule) {
        if (rating === "again") {
          schedule.textContent = "Frasa ini akan muncul lagi di sesi ini. Jadwal review tetap jatuh tempo.";
        } else if (rating === "hard") {
          schedule.textContent = "Review berikutnya: besok.";
        } else {
          schedule.textContent = `Review berikutnya: ${relativeDueLabel(result.scheduled.dueAt)} (${result.scheduled.intervalDays} hari).`;
        }
        schedule.classList.add("is-visible");
      }
      nextButton?.classList.add("is-primary-next");

      const latest = getStats();
      const dueEl = root.querySelector("[data-side-due]");
      const learnedEl = root.querySelector("[data-side-learned]");
      const masteredEl = root.querySelector("[data-side-mastered]");
      if (dueEl) dueEl.textContent = String(latest.due);
      if (learnedEl) learnedEl.textContent = `${latest.learned}/${latest.total}`;
      if (masteredEl) masteredEl.textContent = String(latest.mastered);
    });
  });

  nextButton?.addEventListener("click", () => {
    session.index += 1;
    if (session.index >= session.queue.length) {
      session.done = true;
    }
    ctx.refresh({ scrollTop: true });
  });
}
