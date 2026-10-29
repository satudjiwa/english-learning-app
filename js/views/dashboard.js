/* Halaman beranda: ringkasan progres dan pintu masuk ke semua modul. */

import { CATEGORIES, PHRASES } from "../data.js";
import { icon } from "../icons.js";
import {
  getDailyPlan,
  getDuePhrases,
  getPlanProgress,
  getSettings,
  getStats
} from "../store.js";
import { progressBarHTML, statCardHTML } from "../ui.js";
import {
  esc,
  formatTodayID,
  getGreetingID,
  percent
} from "../utils.js";

export const navLabel = "Beranda";
export const title = "English for Service Engineer";
export const description = "Latihan bahasa Inggris praktis untuk service engineer dan teknisi bandara.";

const MODULES = [
  {
    route: "daily",
    icon: "calendar",
    title: "Latihan Harian",
    description: "Lima frasa baru dalam konteks kerja, dengan audio dan arti."
  },
  {
    route: "phrases",
    icon: "book",
    title: "Bank Frasa",
    description: "Cari kalimat lengkap berdasarkan kategori dan situasi."
  },
  {
    route: "recall",
    icon: "brain",
    title: "Latihan Recall",
    description: "Ingat kalimat Inggris dari prompt Indonesia, lalu nilai dirimu."
  },
  {
    route: "listen",
    icon: "headphones",
    title: "Listen & Speak",
    description: "Dengarkan, tirukan, dan rekam ucapanmu sendiri."
  },
  {
    route: "simulator",
    icon: "users",
    title: "Simulator Remote",
    description: "Latih percakapan dengan engineer lewat skenario nyata."
  },
  {
    route: "progress",
    icon: "chart",
    title: "Progres & Review",
    description: "Lihat jadwal review, riwayat, dan streak belajarmu."
  }
];

function ringHTML(learned, total) {
  const pct = percent(learned, total);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return `
    <div class="hero-ring" role="img" aria-label="${pct}% dari ${total} frasa sudah dipelajari">
      <svg viewBox="0 0 128 128" aria-hidden="true" focusable="false">
        <circle class="ring-track" cx="64" cy="64" r="${radius}"></circle>
        <circle class="ring-value" cx="64" cy="64" r="${radius}" stroke-dasharray="${circumference.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"></circle>
      </svg>
      <div class="ring-copy">
        <strong>${pct}%</strong>
        <span>${learned} dari ${total} frasa</span>
      </div>
    </div>
  `;
}

function recommendation({ plan, planProgress, due, stats }) {
  if (plan && !planProgress.complete) {
    return {
      eyebrow: "Langkah berikutnya",
      title: "Latihan harian",
      text: `Kamu sudah menandai ${planProgress.learned} dari ${planProgress.total} frasa hari ini. Lanjutkan sesi yang sudah dimulai.`,
      cta: planProgress.learned ? "Lanjutkan Belajar" : "Mulai Belajar",
      route: "daily",
      icon: "calendar"
    };
  }
  if (due > 0) {
    return {
      eyebrow: "Jadwal review",
      title: `${due} frasa jatuh tempo`,
      text: "Ulangi frasa ini sebelum menambah materi baru. Recall singkat lebih efektif daripada membaca ulang.",
      cta: "Mulai review",
      route: "recall",
      icon: "refresh"
    };
  }
  if (planProgress.complete) {
    return {
      eyebrow: "Target hari ini",
      title: "Latihan hari ini selesai",
      text: "Bagus. Kamu bisa menjaga ingatan dengan latihan mendengar atau roleplay singkat.",
      cta: "Latihan mendengar",
      route: "listen",
      icon: "check-circle"
    };
  }
  if (stats.learned >= stats.total) {
    return {
      eyebrow: "Semua materi",
      title: "Semua frasa sudah dipelajari",
      text: "Tidak ada frasa baru hari ini. Fokus ke review dan latihan berbicara agar tetap tajam.",
      cta: "Buka Listen & Speak",
      route: "listen",
      icon: "award"
    };
  }
  return {
    eyebrow: "Mulai dari sini",
    title: "Belum ada sesi hari ini",
    text: "Mulai dengan frasa yang paling sering dipakai saat memanggil engineer remote.",
    cta: "Mulai Belajar",
    route: "daily",
    icon: "sparkles"
  };
}

export function render() {
  const now = new Date();
  const stats = getStats(now);
  const settings = getSettings();
  const plan = getDailyPlan(now);
  const planProgress = getPlanProgress(plan);
  const duePhrases = getDuePhrases(now);
  const rec = recommendation({ plan, planProgress, due: duePhrases.length, stats });
  const hourly = getGreetingID(now);
  const progressPct = percent(stats.learned, stats.total);
  const isNewLearner = stats.learned === 0 && stats.seen === 0;

  return `
    <div class="page dashboard">
      <div class="page-heading sr-only">
        <h1>English for Service Engineer</h1>
        <p>${esc(description)}</p>
      </div>

      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <span class="hero-eyebrow">${icon("headset", 16)} Bahasa Inggris untuk teknisi bandara</span>
          <h2 id="hero-title">English for<br>Service Engineer</h2>
          <p>Latihan singkat 15 menit untuk memahami instruksi engineer, melaporkan masalah, dan menyelesaikan troubleshooting dengan percaya diri.</p>
          <div class="hero-actions">
            <a class="btn btn-accent" href="#/${rec.route}">${icon("play", 18)} ${esc(rec.cta)}</a>
            <a class="hero-link" href="#/phrases">Lihat ${stats.total} frasa ${icon("arrow-right", 16)}</a>
          </div>
          <div class="hero-meta">
            <span>${icon("target", 15)} Target ${settings.dailyTarget} frasa/hari</span>
            <span>${icon("flame", 15)} ${stats.streak} hari streak</span>
          </div>
        </div>
        <div class="hero-visual">
          ${ringHTML(stats.learned, stats.total)}
          <p class="hero-visual-note">${hourly}. Progresmu tersimpan otomatis di perangkat ini.</p>
        </div>
      </section>

      <section class="cycle-card" aria-label="Alur belajar">
        <span class="cycle-label">Alur belajar</span>
        <ol class="cycle-list">
          <li><span>01</span>Listen</li>
          <li><span>02</span>Understand</li>
          <li><span>03</span>Recall</li>
          <li><span>04</span>Speak</li>
          <li><span>05</span>Review</li>
        </ol>
      </section>

      <section class="stats-grid" aria-label="Ringkasan progres">
        ${statCardHTML({
          iconName: "book",
          label: "Frasa dipelajari",
          value: `${stats.learned}<small> / ${stats.total}</small>`,
          hint: `${progressPct}% dari seluruh frasa`,
          tone: "navy"
        })}
        ${statCardHTML({
          iconName: "clock",
          label: "Jatuh tempo",
          value: `${stats.due}`,
          hint: stats.due ? "Siap diulang hari ini" : "Tidak ada review tertunda",
          tone: "amber"
        })}
        ${statCardHTML({
          iconName: "award",
          label: "Frasa dikuasai",
          value: `${stats.mastered}`,
          hint: "Butuh 4 recall sukses berturut-turut",
          tone: "green"
        })}
        ${statCardHTML({
          iconName: "flame",
          label: "Streak belajar",
          value: `${stats.streak}<small> hari</small>`,
          hint: stats.streak ? "Jaga ritme belajarmu" : "Mulai hari ini",
          tone: "blue"
        })}
      </section>

      ${isNewLearner ? `
        <section class="starter-note" aria-label="Untuk pemula">
          <span class="starter-icon">${icon("sparkles", 22)}</span>
          <div>
            <strong>Baru pertama kali di sini?</strong>
            <p>Mulai dari 5 frasa harian. Kamu tidak perlu akun, dan semua progres tersimpan di browser ini.</p>
          </div>
          <a class="btn btn-secondary btn-sm" href="#/daily">Coba sesi pertama</a>
        </section>
      ` : ""}

      <section class="section-block">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Hari ini</span>
            <h2>Rencana belajarmu</h2>
          </div>
          <a class="text-link" href="#/progress">Lihat progres ${icon("arrow-right", 15)}</a>
        </div>
        <div class="today-card">
          <span class="today-icon">${icon(rec.icon, 24)}</span>
          <div class="today-copy">
            <span class="eyebrow">${esc(rec.eyebrow)}</span>
            <h3>${esc(rec.title)}</h3>
            <p>${esc(rec.text)}</p>
            ${plan ? `
              <div class="today-progress">
                ${progressBarHTML(planProgress.percent, "Progres latihan harian")}
                <span>${planProgress.learned} / ${planProgress.total} frasa</span>
              </div>
            ` : ""}
          </div>
          <a class="btn btn-primary today-action" href="#/${rec.route}">${esc(rec.cta)} ${icon("arrow-right", 16)}</a>
        </div>
        ${duePhrases.length ? `
          <a class="due-strip" href="#/recall">
            <span class="due-strip-icon">${icon("clock", 18)}</span>
            <span><strong>${duePhrases.length} frasa menunggu review.</strong> Mulai sesi recall singkat sekarang.</span>
            ${icon("arrow-right", 17)}
          </a>
        ` : ""}
      </section>

      <section class="section-block">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Modul belajar</span>
            <h2>Latih semua kemampuan</h2>
          </div>
          <span class="section-note">${CATEGORIES.length} kategori · ${PHRASES.length} frasa</span>
        </div>
        <div class="module-grid">
          ${MODULES.map(module => `
            <a class="module-card" href="#/${module.route}">
              <span class="module-icon">${icon(module.icon, 22)}</span>
              <h3>${esc(module.title)}</h3>
              <p>${esc(module.description)}</p>
              <span class="module-link">Buka modul ${icon("arrow-up-right", 15)}</span>
            </a>
          `).join("")}
        </div>
      </section>

      <p class="dashboard-date">${esc(formatTodayID(now))} · Materi dalam bahasa Inggris Amerika, penjelasan dalam bahasa Indonesia.</p>
    </div>
  `;
}
