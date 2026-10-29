/* Latihan harian: maksimal lima frasa baru dengan alur lihat → dengar → tandai. */

import { CATEGORY_BY_ID, PHRASE_BY_ID } from "../data.js";
import { icon } from "../icons.js";
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
import { dateKey, esc } from "../utils.js";

export const navLabel = "Latihan Harian";
export const title = "Latihan Harian";
export const description = "Lima frasa baru setiap hari, lengkap dengan audio dan konteks kerja.";

function ensureUI(ctx, plan, progress) {
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

function audioWarningHTML() {
  if (isSpeechSupported()) return "";
  return `
    <div class="inline-notice" role="status">
      ${icon("volume-off", 18)}
      <p><strong>Audio belum tersedia di browser ini.</strong> Kamu tetap bisa membaca kalimat dan mengucapkannya sendiri. Coba browser lain untuk mendengar contoh suara.</p>
    </div>
  `;
}

function completionHTML({ plan, progress, stats, due, canReview }) {
  const phrases = plan.ids.map(id => PHRASE_BY_ID[id]).filter(Boolean);
  return `
    <section class="completion-card" aria-labelledby="daily-complete-title">
      <span class="completion-icon">${icon("check-circle", 34)}</span>
      <span class="eyebrow">Target harian</span>
      <h2 id="daily-complete-title">Latihan hari ini selesai</h2>
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
        ${canReview ? `<button class="btn btn-secondary" type="button" data-review-session>${icon("rotate-ccw", 18)} Lihat frasa hari ini</button>` : ""}
      </div>
    </section>

    <section class="completion-list" aria-label="Frasa yang dipelajari hari ini">
      <div class="section-heading section-heading--tight">
        <div>
          <span class="eyebrow">Ringkasan</span>
          <h2>Frasa hari ini</h2>
        </div>
      </div>
      ${phrases.map(phrase => `
        <article class="review-phrase-row">
          <span class="phrase-check">${icon("check", 16)}</span>
          <div>
            <p class="review-en" lang="en">${esc(phrase.en)}</p>
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

function phraseCardHTML({ phrase, index, total, learned, reviewing }) {
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
        <h2 class="practice-en" id="daily-phrase-en" lang="en">${esc(phrase.en)}</h2>

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

        <div class="usage-note">
          <span class="usage-icon">${icon("info", 17)}</span>
          <div>
            <strong>Kapan dipakai</strong>
            <p>${esc(phrase.note)}</p>
          </div>
        </div>
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
        <span>Mode ulang: frasa sudah ditandai, jadi kamu bisa fokus mendengar dan mengulang.</span>
        <button class="text-link" type="button" data-back-summary>Kembali ke ringkasan</button>
      </div>
    ` : ""}
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

export function render(ctx) {
  const now = new Date();
  const plan = getDailyPlan(now);
  const progress = getPlanProgress(plan);
  const stats = getStats(now);
  const due = stats.due;
  const settings = getSettings();
  const ui = ensureUI(ctx, plan, progress);
  const reviewing = Boolean(ui.reviewing) && progress.complete;
  const showCompletion = progress.complete && !reviewing;

  if (!plan) {
    return `
      <div class="page">
        <header class="page-heading">
          <span class="eyebrow">Latihan harian</span>
          <h1>Latihan Harian</h1>
          <p>${esc(description)}</p>
        </header>
        ${emptyPlanHTML({ due })}
      </div>
    `;
  }

  if (showCompletion) {
    return `
      <div class="page">
        <header class="page-heading">
          <span class="eyebrow">Latihan harian</span>
          <h1>Latihan Harian</h1>
          <p>${esc(description)}</p>
        </header>
        ${completionHTML({
          plan,
          progress,
          stats: { ...stats, streak: stats.streak },
          due,
          canReview: true
        })}
        <div class="page-note">${icon("lock", 15)} Frasa yang ditandai dijadwalkan review besok. Kamu bisa mengubah target harian di Pengaturan.</div>
      </div>
    `;
  }

  const phrase = PHRASE_BY_ID[plan.ids[ui.index]] || PHRASE_BY_ID[plan.ids[0]];
  const learned = Boolean(getPhraseRecord(phrase.id)?.learnedAt);

  return `
    <div class="page">
      <header class="page-heading">
        <span class="eyebrow">Latihan harian · target ${settings.dailyTarget} frasa</span>
        <h1>Latihan Harian</h1>
        <p>${esc(description)}</p>
      </header>

      <div class="daily-summary">
        <div class="daily-summary-copy">
          <strong>${progress.learned} dari ${progress.total} frasa ditandai</strong>
          <span>${progress.complete ? "Sesi selesai" : "Selesaikan semua frasa untuk menuntaskan target hari ini."}</span>
        </div>
        ${progressBarHTML(progress.percent, "Progres latihan harian")}
        ${due > 0 ? `<a class="daily-due-link" href="#/recall">${due} jatuh tempo ${icon("arrow-right", 14)}</a>` : ""}
      </div>

      ${phraseCardHTML({ phrase, index: ui.index, total: plan.ids.length, learned, reviewing })}

      <div class="page-note">
        ${icon("info", 15)} Audio memakai text-to-speech browser, jadi kualitas suara mengikuti perangkat. Tidak perlu akun; progres disimpan lokal.
      </div>
    </div>
  `;
}

export function mount(root, ctx) {
  const plan = getDailyPlan();
  const progress = getPlanProgress(plan);
  const ui = ctx.ui.daily;
  const reviewing = Boolean(ui?.reviewing) && progress.complete;
  if (!plan || !ui || (progress.complete && !reviewing)) {
    // Masih perlu memasang tombol audio di halaman ringkasan.
    root.querySelectorAll("[data-speak-completion]").forEach(button => {
      button.addEventListener("click", () => {
        const phrase = PHRASE_BY_ID[button.dataset.speakCompletion];
        if (!phrase) return;
        const result = speak(phrase.en, { onError: code => toast(speechErrorID(code), "error") });
        if (!result.ok) toast(speechErrorID(result.reason), "error");
      });
    });
    root.querySelector("[data-review-session]")?.addEventListener("click", () => {
      if (ctx.ui.daily) ctx.ui.daily.reviewing = true;
      ctx.refresh({ scrollTop: true });
    });
    return;
  }

  const phrase = PHRASE_BY_ID[plan.ids[ui.index]];
  if (!phrase) return;
  markSeen(phrase.id);

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

  if (!isSpeechSupported()) {
    // Tombol sudah disabled; tidak ada listener audio yang perlu dipasang.
    return;
  }
}
