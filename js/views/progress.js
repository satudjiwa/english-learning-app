/* Progres & review: semua angka dihitung dari data belajar yang tersimpan. */

import { PHRASE_BY_ID } from "../data.js";
import { icon } from "../icons.js";
import { getProgramProgress } from "../program.js";
import { RATING_META } from "../srs.js";
import {
  getActivity,
  getDuePhrases,
  getReviewHistory,
  getStats,
  getStorageStatus,
  resetProgress
} from "../store.js";
import {
  confirmDialog,
  emptyStateHTML,
  progressBarHTML,
  statCardHTML,
  toast
} from "../ui.js";
import {
  esc,
  englishHTML,
  formatDateTimeID,
  formatTodayID,
  relativeDueLabel
} from "../utils.js";

export const navLabel = "Progres & Review";
export const title = "Progres & Review";
export const description = "Pantau progres program 35 hari, frasa yang dipelajari, jadwal review, dan aktivitas belajarmu.";

function activityChartHTML(activity) {
  const max = Math.max(1, ...activity.map(day => day.count));
  if (activity.every(day => day.count === 0)) {
    return `
      <div class="chart-empty">
        <span class="chart-empty-icon">${icon("activity", 22)}</span>
        <div>
          <strong>Belum ada aktivitas dalam 14 hari terakhir</strong>
          <p>Selesaikan latihan harian atau satu sesi recall. Grafik akan terisi dari data belajarmu, bukan perkiraan.</p>
        </div>
        <a class="btn btn-secondary btn-sm" href="#/daily">Mulai latihan</a>
      </div>
    `;
  }
  return `
    <div class="activity-chart" role="list" aria-label="Frasa unik yang dilatih selama 14 hari terakhir">
      ${activity.map(day => {
        const height = day.count ? Math.max(8, Math.round((day.count / max) * 100)) : 3;
        return `
          <div class="chart-col" role="listitem" aria-label="${esc(day.label)}, ${day.count} frasa dilatih">
            <span class="chart-count" aria-hidden="true">${day.count || ""}</span>
            <span class="chart-bar ${day.count ? "has-value" : ""}" style="height:${height}%" aria-hidden="true"></span>
            <span class="chart-label" aria-hidden="true">${esc(day.label)}</span>
          </div>
        `;
      }).join("")}
    </div>
    <p class="chart-caption">Frasa unik yang dilatih lewat latihan harian dan recall. Angka berasal dari data lokal, bukan perkiraan.</p>
  `;
}

function historyHTML(history) {
  if (!history.length) {
    return emptyStateHTML({
      iconName: "refresh",
      title: "Belum ada riwayat review",
      message: "Selesaikan satu sesi Recall untuk mulai membangun riwayat dan jadwal review.",
      action: `<a class="btn btn-primary" href="#/recall">Mulai sesi recall</a>`
    });
  }
  return `
    <div class="history-list">
      ${history.map(entry => {
        const meta = RATING_META[entry.rating] || RATING_META.hard;
        const phrase = entry.phrase || PHRASE_BY_ID[entry.phraseId];
        return `
          <article class="history-row">
            <span class="history-rating rating-${meta.tone}">${esc(meta.short)}</span>
            <div class="history-copy">
              <p class="history-en" lang="en">${englishHTML(phrase?.en || "Frasa tidak ditemukan")}</p>
              <p class="history-meta">${esc(formatDateTimeID(entry.at))} · Berikutnya: ${esc(relativeDueLabel(entry.dueAt))}</p>
            </div>
            <span class="history-arrow">${icon("chevron-right", 16)}</span>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function dueListHTML(duePhrases) {
  if (!duePhrases.length) {
    return emptyStateHTML({
      iconName: "check-circle",
      title: "Tidak ada review tertunda",
      message: "Semua frasa yang sudah dipelajari masih dalam jadwal. Kamu bisa menambah materi baru atau berlatih listening.",
      action: `<a class="btn btn-secondary" href="#/daily">Buka latihan harian</a>`
    });
  }
  return `
    <div class="due-list">
      ${duePhrases.slice(0, 5).map(({ phrase, record }) => `
        <div class="due-row">
          <span class="due-row-icon">${icon("clock", 17)}</span>
          <div>
            <p lang="en">${englishHTML(phrase.en)}</p>
            <span>${esc(phrase.idText)}</span>
          </div>
          <span class="due-row-label">${esc(relativeDueLabel(record.dueAt))}</span>
        </div>
      `).join("")}
    </div>
    ${duePhrases.length > 5 ? `<p class="due-more">+${duePhrases.length - 5} frasa lainnya</p>` : ""}
    <a class="btn btn-primary btn-wide" href="#/recall">${icon("refresh", 18)} Mulai review sekarang</a>
  `;
}

export function render(ctx) {
  const now = new Date();
  const stats = getStats(now);
  const program = getProgramProgress();
  const duePhrases = getDuePhrases(now);
  const activity = getActivity(14, now);
  const history = getReviewHistory(10);
  const storage = getStorageStatus();
  const overall = stats.total ? Math.round((stats.learned / stats.total) * 100) : 0;
  const mastery = stats.total ? Math.round((stats.mastered / stats.total) * 100) : 0;

  return `
    <div class="page">
      <header class="page-heading page-heading--split">
        <div>
          <span class="eyebrow">Data lokal · ${formatTodayID(now)}</span>
          <h1>Progres &amp; Review</h1>
          <p>${esc(description)}</p>
        </div>
        <div class="page-actions">
          <a class="btn btn-secondary" href="#/phrases">${icon("book", 17)} Bank frasa</a>
        </div>
      </header>

      ${!storage.available ? `
        <div class="inline-notice" role="alert">
          ${icon("alert", 18)}
          <p><strong>Penyimpanan browser tidak tersedia.</strong> Progres hanya bertahan selama tab ini terbuka. Periksa mode privat atau izin penyimpanan browser.</p>
        </div>
      ` : ""}

      <section class="stats-grid stats-grid--progress" aria-label="Statistik belajar">
        ${statCardHTML({
          iconName: "book",
          label: "Frasa dipelajari",
          value: `${stats.learned}<small> / ${stats.total}</small>`,
          hint: `${overall}% dari seluruh frasa`,
          tone: "navy"
        })}
        ${statCardHTML({
          iconName: "eye",
          label: "Frasa ditemui",
          value: `${stats.seen}<small> / ${stats.total}</small>`,
          hint: "Pernah dibuka di latihan",
          tone: "blue"
        })}
        ${statCardHTML({
          iconName: "clock",
          label: "Jatuh tempo",
          value: `${stats.due}`,
          hint: stats.due ? "Siap diulang sekarang" : "Tidak ada review tertunda",
          tone: "amber"
        })}
        ${statCardHTML({
          iconName: "award",
          label: "Dikuasai",
          value: `${stats.mastered}`,
          hint: "4 recall sukses berturut-turut",
          tone: "green"
        })}
      </section>

      <div class="progress-grid">
        <section class="overview-card">
          <div class="overview-head">
            <div>
              <span class="eyebrow">Progres keseluruhan</span>
              <h2>${overall}% frasa dipelajari</h2>
            </div>
            <span class="streak-badge">${icon("flame", 17)} ${stats.streak} hari</span>
          </div>
          ${progressBarHTML(overall, "Progres keseluruhan")}
          <div class="overview-meta">
            <span><b>${stats.learned}</b> dipelajari</span>
            <span><b>${stats.mastered}</b> dikuasai</span>
            <span><b>${stats.total - stats.learned}</b> belum dipelajari</span>
          </div>
          <div class="mastery-row">
            <div class="mastery-copy">
              <span>Mastery</span>
              <small>${mastery}% dari seluruh frasa</small>
            </div>
            ${progressBarHTML(mastery, "Progres mastery", "progress--green")}
          </div>
          <p class="overview-foot">${icon("info", 15)} Frasa dianggap dikuasai setelah 4 recall sukses berturut-turut dengan interval minimal 14 hari.</p>
        </section>

        <section class="daily-progress-card program-progress-card">
          <div class="overview-head">
            <div>
              <span class="eyebrow">Program ${program.totalDays} hari</span>
              <h2>${program.completeDays} dari ${program.totalDays} hari selesai</h2>
            </div>
            <span class="daily-status-badge ${program.allComplete ? "is-done" : ""}">${program.allComplete ? "Tuntas" : `Hari ${program.currentDay}`}</span>
          </div>
          ${progressBarHTML(program.percentPhrases, "Progres frasa program")}
          <p class="daily-progress-note">${program.allComplete
            ? "Seluruh hari program sudah dipelajari. Ulangi hari mana pun atau fokus ke review."
            : `${program.learnedPhrases} dari ${program.totalPhrases} frasa program sudah ditandai. Hari berikutnya: Hari ${program.currentDay}.`}</p>
          <div class="daily-progress-actions">
            <a class="btn btn-primary btn-sm" href="#/daily/${program.currentDay}">${program.allComplete ? "Ulangi hari terakhir" : `Lanjut Hari ${program.currentDay}`}</a>
            <a class="btn btn-ghost btn-sm" href="#/daily/free">${icon("grid", 15)} Sesi Bebas</a>
            ${stats.due > 0 ? `<a class="btn btn-ghost btn-sm" href="#/recall">Review ${stats.due}</a>` : ""}
          </div>
          <div class="streak-explainer">
            ${icon("info", 17)}
            <span>Hari dianggap selesai jika kelima frasa sudah ditandai. Progres dihitung dari data belajar yang sudah ada.</span>
          </div>
        </section>
      </div>

      <section class="panel-section">
        <div class="section-heading">
          <div>
            <span class="eyebrow">14 hari terakhir</span>
            <h2>Aktivitas belajar</h2>
          </div>
          <span class="section-note">${stats.reviewCount} total penilaian</span>
        </div>
        <div class="chart-card">${activityChartHTML(activity)}</div>
      </section>

      <div class="progress-lists">
        <section class="panel-section">
          <div class="section-heading section-heading--tight">
            <div>
              <span class="eyebrow">Jadwal</span>
              <h2>Perlu diulang</h2>
            </div>
            <span class="count-pill">${duePhrases.length}</span>
          </div>
          <div class="panel-card">${dueListHTML(duePhrases)}</div>
        </section>

        <section class="panel-section">
          <div class="section-heading section-heading--tight">
            <div>
              <span class="eyebrow">Riwayat</span>
              <h2>Review terakhir</h2>
            </div>
          </div>
          <div class="panel-card panel-card--flush">${historyHTML(history)}</div>
        </section>
      </div>

      <section class="danger-zone" aria-labelledby="danger-title">
        <div class="danger-copy">
          <span class="danger-icon">${icon("alert", 20)}</span>
          <div>
            <h2 id="danger-title">Hapus progres belajar</h2>
            <p>Menghapus semua frasa yang dipelajari, jadwal review, riwayat, dan streak. Pengaturan suara dan target tetap disimpan. Tindakan ini tidak bisa dibatalkan.</p>
          </div>
        </div>
        <button class="btn btn-danger-ghost" type="button" data-reset-progress>${icon("rotate-ccw", 17)} Reset progres</button>
      </section>
    </div>
  `;
}

export function mount(root, ctx) {
  root.querySelector("[data-reset-progress]")?.addEventListener("click", async () => {
    const confirmed = await confirmDialog({
      title: "Hapus semua progres?",
      message: "Semua frasa yang dipelajari, jadwal review, riwayat, dan streak akan dihapus dari browser ini. Pengaturan tetap disimpan. Tindakan ini tidak bisa dibatalkan.",
      confirmLabel: "Ya, hapus progres",
      cancelLabel: "Batal",
      tone: "danger",
      iconName: "alert"
    });
    if (!confirmed) return;

    resetProgress({ keepSettings: true });
    Object.keys(ctx.ui).forEach(key => delete ctx.ui[key]);
    toast("Progres belajar sudah dihapus.", "success");
    ctx.refresh({ scrollTop: true });
  });
}
