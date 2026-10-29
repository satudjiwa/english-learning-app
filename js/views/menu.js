/* Menu "Lainnya" untuk navigasi ponsel dan halaman daftar modul. */

import { PHRASES } from "../data.js";
import { icon } from "../icons.js";
import { getStats } from "../store.js";
import { esc } from "../utils.js";

export const navLabel = "Menu";
export const title = "Semua Modul";
export const description = "Pilih modul belajar yang ingin dibuka.";

const ITEMS = [
  {
    route: "daily",
    icon: "calendar",
    title: "Latihan Harian",
    description: "Frasa baru dengan audio, arti, dan catatan penggunaan."
  },
  {
    route: "phrases",
    icon: "book",
    title: "Bank Frasa",
    description: `Cari ${PHRASES.length} kalimat kerja berdasarkan kategori.`
  },
  {
    route: "recall",
    icon: "brain",
    title: "Latihan Recall",
    description: "Uji ingatan dari prompt Indonesia dan atur jadwal review."
  },
  {
    route: "patterns",
    icon: "message",
    title: "Pola Pertanyaan",
    description: "Pelajari struktur Can I, Could you, How do I, dan pola tanya lain."
  },
  {
    route: "listen",
    icon: "headphones",
    title: "Listen & Speak",
    description: "Dengarkan, tirukan, dan rekam suaramu."
  },
  {
    route: "simulator",
    icon: "users",
    title: "Simulator Remote",
    description: "Roleplay percakapan dengan engineer remote."
  },
  {
    route: "progress",
    icon: "chart",
    title: "Progres & Review",
    description: "Lihat statistik, jadwal, dan riwayat belajar."
  },
  {
    route: "settings",
    icon: "settings",
    title: "Pengaturan",
    description: "Pilih suara, kecepatan bicara, dan target harian."
  },
  {
    route: "home",
    icon: "home",
    title: "Beranda",
    description: "Rencana hari ini dan ringkasan progres."
  }
];

export function render() {
  const stats = getStats();
  return `
    <div class="page">
      <header class="page-heading">
        <span class="eyebrow">Navigasi · ${stats.learned}/${stats.total} frasa dipelajari</span>
        <h1>Semua Modul</h1>
        <p>${esc(description)}</p>
      </header>
      <div class="menu-grid">
        ${ITEMS.map(item => `
          <a class="menu-card" href="#/${item.route}">
            <span class="menu-icon">${icon(item.icon, 22)}</span>
            <div>
              <h2>${esc(item.title)}</h2>
              <p>${esc(item.description)}</p>
            </div>
            ${icon("chevron-right", 18)}
          </a>
        `).join("")}
      </div>
      <div class="menu-note">
        ${icon("lock", 18)}
        <p><strong>Tidak perlu akun.</strong> Semua progres tersimpan di browser ini. Kamu bisa menutup aplikasi dan melanjutkan nanti di perangkat yang sama.</p>
      </div>
    </div>
  `;
}
