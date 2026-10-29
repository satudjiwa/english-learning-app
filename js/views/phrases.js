/* Bank frasa: pencarian dua bahasa, filter kategori, status review, dan audio. */

import { CATEGORIES, CATEGORY_BY_ID, PHRASES } from "../data.js";
import { icon } from "../icons.js";
import {
  getPhraseStatus,
  getStats
} from "../store.js";
import {
  isSpeechSupported,
  speak,
  speechErrorID
} from "../speech.js";
import { emptyStateHTML, toast } from "../ui.js";
import { esc, normalizeSearch } from "../utils.js";

export const navLabel = "Bank Frasa";
export const title = "Bank Frasa";
export const description = "Kumpulan kalimat kerja lengkap. Cari berdasarkan bahasa Inggris atau arti Indonesia.";

function categoryCount(categoryId) {
  return PHRASES.filter(phrase => phrase.category === categoryId).length;
}

function filterPhrases(ui) {
  const query = normalizeSearch(ui.query);
  return PHRASES.filter(phrase => {
    if (ui.category !== "all" && phrase.category !== ui.category) return false;
    if (!query) return true;
    const haystack = normalizeSearch(`${phrase.en} ${phrase.idText}`);
    return query.split(" ").every(token => haystack.includes(token));
  });
}

function dialogueHTML(phrase) {
  if (!Array.isArray(phrase.dialogue) || !phrase.dialogue.length) return "";
  return `
    <details class="dialogue">
      <summary>${icon("users", 16)} Contoh dialog <span class="summary-chevron">${icon("chevron-right", 15)}</span></summary>
      <div class="dialogue-body">
        ${phrase.dialogue.map(line => `
          <div class="dialogue-line ${line.speaker === "technician" ? "is-technician" : ""}">
            <span class="dialogue-speaker">${line.speaker === "technician" ? "Anda" : "Engineer"}</span>
            <p lang="en">${esc(line.en)}</p>
            <p class="dialogue-id">${esc(line.idText)}</p>
          </div>
        `).join("")}
      </div>
    </details>
  `;
}

function phraseCardHTML(phrase) {
  const category = CATEGORY_BY_ID[phrase.category];
  const status = getPhraseStatus(phrase.id);
  return `
    <article class="phrase-card" data-phrase="${esc(phrase.id)}">
      <div class="phrase-card-head">
        <span class="category-chip">${icon(category.icon, 15)} ${esc(category.label)}</span>
        <div class="phrase-card-tools">
          <span class="status-badge status-${status.tone}">${esc(status.label)}</span>
          <button class="icon-btn" type="button" data-speak-phrase="${esc(phrase.id)}" aria-label="Dengarkan: ${esc(phrase.en)}" ${isSpeechSupported() ? "" : "disabled"}>
            ${icon("volume", 18)}
          </button>
        </div>
      </div>
      <p class="phrase-en" lang="en">${esc(phrase.en)}</p>
      <p class="phrase-meaning">${esc(phrase.idText)}</p>
      <p class="phrase-note"><strong>Kapan dipakai:</strong> ${esc(phrase.note)}</p>
      ${dialogueHTML(phrase)}
    </article>
  `;
}

function cardsHTML(list) {
  if (!list.length) {
    return emptyStateHTML({
      iconName: "search",
      title: "Frasa tidak ditemukan",
      message: "Coba kata kunci lain, atau hapus filter kategori untuk melihat semua frasa.",
      action: `<button class="btn btn-secondary" type="button" data-reset-filter>${icon("rotate-ccw", 17)} Hapus filter</button>`
    });
  }
  return list.map(phraseCardHTML).join("");
}

function countText(count) {
  return `${count} frasa ditemukan`;
}

export function render(ctx) {
  const ui = ctx.ui.phrases || { query: "", category: "all" };
  ctx.ui.phrases = ui;
  const list = filterPhrases(ui);
  const stats = getStats();

  return `
    <div class="page">
      <header class="page-heading page-heading--split">
        <div>
          <span class="eyebrow">${PHRASES.length} kalimat · ${CATEGORIES.length} kategori</span>
          <h1>Bank Frasa</h1>
          <p>${esc(description)}</p>
        </div>
        <div class="page-actions">
          <a class="btn btn-secondary" href="#/recall">${icon("brain", 17)} Latihan recall</a>
        </div>
      </header>

      <section class="phrase-toolbar" aria-label="Cari dan filter frasa">
        <div class="search-field">
          ${icon("search", 19)}
          <label class="sr-only" for="phrase-search">Cari frasa dalam bahasa Inggris atau Indonesia</label>
          <input id="phrase-search" type="search" placeholder="Cari: LAN, sensor, PSU, keterlambatan..." value="${esc(ui.query)}" autocomplete="off" spellcheck="false">
          <button class="search-clear" id="search-clear" type="button" aria-label="Hapus pencarian" ${ui.query ? "" : "hidden"}>${icon("x", 16)}</button>
        </div>

        <div class="filter-chips" role="group" aria-label="Filter kategori">
          <button class="filter-chip ${ui.category === "all" ? "is-active" : ""}" type="button" data-category="all" aria-pressed="${ui.category === "all"}">
            Semua <span>${PHRASES.length}</span>
          </button>
          ${CATEGORIES.map(category => `
            <button class="filter-chip ${ui.category === category.id ? "is-active" : ""}" type="button" data-category="${category.id}" aria-pressed="${ui.category === category.id}">
              ${esc(category.short)} <span>${categoryCount(category.id)}</span>
            </button>
          `).join("")}
        </div>

        <div class="result-bar">
          <p id="phrase-count" aria-live="polite">${countText(list.length)}</p>
          <span>${stats.learned} dari ${stats.total} frasa sudah dipelajari</span>
        </div>
      </section>

      ${!isSpeechSupported() ? `
        <div class="inline-notice" role="status">
          ${icon("volume-off", 18)}
          <p><strong>Browser ini tidak mendukung text-to-speech.</strong> Kamu masih bisa membaca, mencari, dan menghafal semua frasa.</p>
        </div>
      ` : ""}

      <section class="phrase-list" id="phrase-list" aria-label="Daftar frasa">
        ${cardsHTML(list)}
      </section>
    </div>
  `;
}

export function mount(root, ctx) {
  const ui = ctx.ui.phrases;
  if (!ui) return;
  const input = root.querySelector("#phrase-search");
  const clear = root.querySelector("#search-clear");
  const list = root.querySelector("#phrase-list");
  const count = root.querySelector("#phrase-count");
  const chips = [...root.querySelectorAll("[data-category]")];
  if (!input || !list) return;

  const update = () => {
    const filtered = filterPhrases(ui);
    list.innerHTML = cardsHTML(filtered);
    if (count) count.textContent = countText(filtered.length);
    if (clear) clear.hidden = !ui.query;
    chips.forEach(chip => {
      const active = chip.dataset.category === ui.category;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
  };

  input.addEventListener("input", () => {
    ui.query = input.value;
    update();
  });

  clear?.addEventListener("click", () => {
    ui.query = "";
    input.value = "";
    input.focus();
    update();
  });

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      ui.category = chip.dataset.category;
      update();
    });
  });

  list.addEventListener("click", event => {
    const reset = event.target.closest("[data-reset-filter]");
    if (reset) {
      ui.query = "";
      ui.category = "all";
      input.value = "";
      update();
      input.focus();
      return;
    }

    const speakButton = event.target.closest("[data-speak-phrase]");
    if (speakButton) {
      const phrase = PHRASES.find(item => item.id === speakButton.dataset.speakPhrase);
      if (!phrase) return;
      const result = speak(phrase.en, {
        onError: code => toast(speechErrorID(code), "error")
      });
      if (!result.ok) toast(speechErrorID(result.reason), "error");
    }
  });
}
