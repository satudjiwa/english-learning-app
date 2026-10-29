/* Listen & Speak: dengarkan, sembunyikan teks, tirukan, dan rekam suara sendiri. */

import { CATEGORIES, CATEGORY_BY_ID, PHRASES } from "../data.js";
import { icon } from "../icons.js";
import { markSeen } from "../store.js";
import {
  isSpeechSupported,
  speak,
  speechErrorID
} from "../speech.js";
import { toast } from "../ui.js";
import { englishHTML, esc } from "../utils.js";

export const navLabel = "Listen & Speak";
export const title = "Listen & Speak";
export const description = "Dengarkan kalimat, tirukan dengan suara keras, lalu bandingkan rekamanmu.";

function ensureState(ctx) {
  if (!ctx.ui.listen) {
    ctx.ui.listen = {
      category: "all",
      phraseId: PHRASES[0].id,
      hideText: false,
      showTranslation: false
    };
  }
  const ui = ctx.ui.listen;
  const filtered = filteredPhrases(ui.category);
  if (!filtered.some(phrase => phrase.id === ui.phraseId)) {
    ui.phraseId = filtered[0]?.id || PHRASES[0].id;
    ui.showTranslation = false;
  }
  return ui;
}

function filteredPhrases(category) {
  return category === "all" ? PHRASES : PHRASES.filter(phrase => phrase.category === category);
}

function recordingSupported() {
  return Boolean(
    typeof navigator !== "undefined" &&
    navigator.mediaDevices?.getUserMedia &&
    typeof window.MediaRecorder !== "undefined"
  );
}

function categoryOptions(selected) {
  const levels = ["Pemula", "Menengah"];
  return [
    `<option value="all" ${selected === "all" ? "selected" : ""}>Semua kategori (${PHRASES.length})</option>`,
    ...levels.map(level => `
      <optgroup label="${level}">
        ${CATEGORIES.filter(category => category.level === level).map(category => `
          <option value="${category.id}" ${selected === category.id ? "selected" : ""}>
            ${esc(category.label)} (${PHRASES.filter(phrase => phrase.category === category.id).length})
          </option>
        `).join("")}
      </optgroup>
    `)
  ].join("");
}

function phraseOptions(category, selectedId) {
  return filteredPhrases(category).map(phrase => `
    <option value="${esc(phrase.id)}" ${selectedId === phrase.id ? "selected" : ""}>
      ${esc(phrase.en)}
    </option>
  `).join("");
}

export function render(ctx) {
  const ui = ensureState(ctx);
  const phrase = PHRASES.find(item => item.id === ui.phraseId) || PHRASES[0];
  const category = CATEGORY_BY_ID[phrase.category];
  const available = isSpeechSupported();
  const canRecord = recordingSupported();
  const filtered = filteredPhrases(ui.category);
  const index = filtered.findIndex(item => item.id === phrase.id);

  return `
    <div class="page">
      <header class="page-heading">
        <span class="eyebrow">Mendengar · Menirukan · Merekam</span>
        <h1>Listen &amp; Speak</h1>
        <p>${esc(description)}</p>
      </header>

      <section class="listen-picker" aria-label="Pilih frasa">
        <div class="field">
          <label for="listen-category">Kategori</label>
          <div class="select-wrap">
            <select id="listen-category">${categoryOptions(ui.category)}</select>
            ${icon("chevron-right", 16)}
          </div>
        </div>
        <div class="field field--grow">
          <label for="listen-phrase">Frasa <span>${index + 1} dari ${filtered.length}</span></label>
          <div class="select-wrap">
            <select id="listen-phrase">${phraseOptions(ui.category, phrase.id)}</select>
            ${icon("chevron-right", 16)}
          </div>
        </div>
        <div class="listen-picker-nav">
          <button class="icon-btn icon-btn--bordered" type="button" data-listen-prev aria-label="Frasa sebelumnya" ${index <= 0 ? "disabled" : ""}>${icon("chevron-left", 18)}</button>
          <button class="icon-btn icon-btn--bordered" type="button" data-listen-next aria-label="Frasa berikutnya" ${index >= filtered.length - 1 ? "disabled" : ""}>${icon("chevron-right", 18)}</button>
        </div>
      </section>

      <div class="listen-layout">
        <article class="listen-card" aria-labelledby="listen-sentence">
          <div class="listen-card-head">
            <div class="listen-card-tags">
              <span class="category-chip">${icon(category.icon, 15)} ${esc(category.label)}</span>
              <span class="level-badge">${esc(category.level)}</span>
            </div>
            <span class="listen-step">${icon("headphones", 15)} Frasa ${index + 1} / ${filtered.length}</span>
          </div>

          <div class="listen-sentence-wrap ${ui.hideText ? "is-text-hidden" : ""}" id="listen-sentence-wrap">
            <span class="listen-label">${ui.hideText ? "Teks disembunyikan" : "Dengarkan dan tirukan"}</span>
            <h2 class="listen-sentence" id="listen-sentence" lang="en">${englishHTML(phrase.en)}</h2>
            <div class="hidden-sentence" aria-hidden="${ui.hideText ? "false" : "true"}">
              ${icon("volume", 22)}
              <p>Teks disembunyikan untuk latihan listening-first. Dengarkan dulu, lalu tekan “Tampilkan teks”.</p>
            </div>
          </div>

          <p class="listen-instruction">${icon("info", 15)} Tekan putar, dengarkan tanpa membaca, lalu ulangi kalimatnya dengan suara keras.</p>

          <div class="listen-audio-actions">
            <button class="btn btn-primary" type="button" data-listen-play ${available ? "" : "disabled"}>
              ${icon("play", 18)} Putar
            </button>
            <button class="btn btn-secondary" type="button" data-listen-replay ${available ? "" : "disabled"}>
              ${icon("refresh", 18)} Ulangi
            </button>
            <button class="btn btn-ghost" type="button" data-listen-slow ${available ? "" : "disabled"}>
              ${icon("slow-down", 18)} Lebih lambat
            </button>
          </div>

          ${!available ? `
            <div class="inline-notice" role="status">
              ${icon("volume-off", 18)}
              <p><strong>Browser ini tidak mendukung text-to-speech.</strong> Kamu tetap bisa membaca kalimat, mengucapkannya sendiri, dan merekam suara jika mikrofon tersedia.</p>
            </div>
          ` : ""}

          <div class="listen-toggle-row">
            <button class="toggle-btn ${ui.hideText ? "is-active" : ""}" type="button" data-toggle-text aria-pressed="${ui.hideText}">
              ${icon(ui.hideText ? "eye" : "eye-off", 18)}
              <span>${ui.hideText ? "Tampilkan teks" : "Sembunyikan teks"}</span>
            </button>
            <button class="toggle-btn ${ui.showTranslation ? "is-active" : ""}" type="button" data-toggle-translation aria-pressed="${ui.showTranslation}" aria-controls="listen-translation">
              ${icon("translate", 18)}
              <span>${ui.showTranslation ? "Sembunyikan arti" : "Tampilkan arti"}</span>
            </button>
          </div>

          <div class="translation-panel listen-translation" id="listen-translation" ${ui.showTranslation ? "" : "hidden"}>
            <span class="translation-label">Arti dalam bahasa Indonesia</span>
            <p>${esc(phrase.idText)}</p>
            <p class="translation-note"><strong>Kapan dipakai:</strong> ${esc(phrase.note)}</p>
          </div>

          <div class="listen-footer">
            <span>${icon("lock", 14)} Audio memakai text-to-speech browser, bukan rekaman profesional.</span>
            <button class="text-link" type="button" data-reset-listen>${icon("rotate-ccw", 15)} Mulai ulang tampilan</button>
          </div>
        </article>

        <aside class="listen-aside">
          <section class="side-card">
            <span class="side-card-icon">${icon("target", 20)}</span>
            <h2>Urutan latihan</h2>
            <ol class="numbered-list">
              <li><strong>Listen</strong><span>Dengarkan sekali tanpa membaca.</span></li>
              <li><strong>Repeat</strong><span>Ucapkan dengan suara keras, samakan ritmenya.</span></li>
              <li><strong>Record</strong><span>Rekam dan bandingkan dengan contoh.</span></li>
              <li><strong>Review</strong><span>Ulangi besok lewat modul Recall.</span></li>
            </ol>
          </section>

          <section class="record-card">
            <div class="record-head">
              <span class="record-icon">${icon("mic", 20)}</span>
              <div>
                <h2>Rekam suaramu</h2>
                <p>Maksimal 20 detik. Rekaman tidak diunggah ke mana pun.</p>
              </div>
            </div>
            <button class="btn btn-secondary btn-wide" type="button" data-record ${canRecord ? "" : "disabled"}>
              ${icon("mic", 18)} <span>Mulai merekam</span>
            </button>
            <p class="record-status" id="record-status" role="status" aria-live="polite">
              ${canRecord ? "Mikrofon akan diminta saat kamu menekan tombol." : "Perekaman tidak tersedia di browser ini. Kamu tetap bisa berlatih dengan suara keras."}
            </p>
            <audio class="record-playback" id="record-playback" controls hidden aria-label="Putar rekaman suara sendiri"></audio>
          </section>

          <div class="side-note-card">
            ${icon("shield", 19)}
            <p><strong>Privasi:</strong> audio hanya ada di memori tab ini dan hilang saat kamu berpindah halaman.</p>
          </div>
        </aside>
      </div>
    </div>
  `;
}

export function mount(root, ctx) {
  const ui = ctx.ui.listen;
  if (!ui) return;
  const phrase = PHRASES.find(item => item.id === ui.phraseId) || PHRASES[0];
  const categorySelect = root.querySelector("#listen-category");
  const phraseSelect = root.querySelector("#listen-phrase");
  const wrap = root.querySelector("#listen-sentence-wrap");
  const hiddenSentence = root.querySelector(".hidden-sentence");
  const translation = root.querySelector("#listen-translation");
  const textToggle = root.querySelector("[data-toggle-text]");
  const translationToggle = root.querySelector("[data-toggle-translation]");

  markSeen(phrase.id);

  categorySelect?.addEventListener("change", () => {
    ui.category = categorySelect.value;
    const first = filteredPhrases(ui.category)[0];
    ui.phraseId = first ? first.id : PHRASES[0].id;
    ui.showTranslation = false;
    ctx.refresh({ scrollTop: true });
  });

  phraseSelect?.addEventListener("change", () => {
    ui.phraseId = phraseSelect.value;
    ui.showTranslation = false;
    ctx.refresh({ scrollTop: true });
  });

  const step = direction => {
    const filtered = filteredPhrases(ui.category);
    const index = filtered.findIndex(item => item.id === ui.phraseId);
    const next = filtered[index + direction];
    if (!next) return;
    ui.phraseId = next.id;
    ui.showTranslation = false;
    ctx.refresh({ scrollTop: true });
  };

  root.querySelector("[data-listen-prev]")?.addEventListener("click", () => step(-1));
  root.querySelector("[data-listen-next]")?.addEventListener("click", () => step(1));

  const play = (slow = false) => {
    const result = speak(phrase.en, {
      slow,
      onError: code => toast(speechErrorID(code), "error")
    });
    if (!result.ok) toast(speechErrorID(result.reason), "error");
  };

  root.querySelector("[data-listen-play]")?.addEventListener("click", () => play(false));
  root.querySelector("[data-listen-replay]")?.addEventListener("click", () => play(false));
  root.querySelector("[data-listen-slow]")?.addEventListener("click", () => play(true));

  textToggle?.addEventListener("click", () => {
    ui.hideText = !ui.hideText;
    wrap?.classList.toggle("is-text-hidden", ui.hideText);
    textToggle.classList.toggle("is-active", ui.hideText);
    textToggle.setAttribute("aria-pressed", String(ui.hideText));
    const label = textToggle.querySelector("span");
    if (label) label.textContent = ui.hideText ? "Tampilkan teks" : "Sembunyikan teks";
    const svg = textToggle.querySelector("svg");
    if (svg) svg.outerHTML = icon(ui.hideText ? "eye" : "eye-off", 18);
    if (hiddenSentence) hiddenSentence.setAttribute("aria-hidden", String(!ui.hideText));
  });

  translationToggle?.addEventListener("click", () => {
    ui.showTranslation = !ui.showTranslation;
    if (translation) translation.hidden = !ui.showTranslation;
    translationToggle.classList.toggle("is-active", ui.showTranslation);
    translationToggle.setAttribute("aria-pressed", String(ui.showTranslation));
    const label = translationToggle.querySelector("span");
    if (label) label.textContent = ui.showTranslation ? "Sembunyikan arti" : "Tampilkan arti";
  });

  root.querySelector("[data-reset-listen]")?.addEventListener("click", () => {
    ui.hideText = false;
    ui.showTranslation = false;
    ctx.refresh({ scrollTop: true });
  });

  // ── Perekaman opsional ─────────────────────────────────────────────────
  const recordButton = root.querySelector("[data-record]");
  const recordStatus = root.querySelector("#record-status");
  const playback = root.querySelector("#record-playback");
  let recorder = null;
  let stream = null;
  let chunks = [];
  let timer = null;
  let objectUrl = null;
  let recording = false;

  if (!recordingSupported() || !recordButton) {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }

  const setStatus = message => {
    if (recordStatus) recordStatus.textContent = message;
  };

  const setButton = (isRecording, label) => {
    recordButton.classList.toggle("is-recording", isRecording);
    recordButton.innerHTML = `${icon(isRecording ? "stop" : "mic", 18)} <span>${esc(label)}</span>`;
  };

  const cleanupStream = () => {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
    stream?.getTracks().forEach(track => track.stop());
    stream = null;
    recorder = null;
    chunks = [];
    recording = false;
  };

  const finish = () => {
    if (!recorder || recorder.state === "inactive") return;
    recorder.stop();
  };

  recordButton.addEventListener("click", async () => {
    if (recording) {
      finish();
      return;
    }

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
    if (playback) {
      playback.hidden = true;
      playback.removeAttribute("src");
    }

    try {
      setStatus("Meminta izin mikrofon...");
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      recorder = new MediaRecorder(stream);
      recorder.addEventListener("dataavailable", event => {
        if (event.data && event.data.size) chunks.push(event.data);
      });
      recorder.addEventListener("stop", () => {
        const type = recorder?.mimeType || "audio/webm";
        const blob = new Blob(chunks, { type });
        cleanupStream();
        setButton(false, "Rekam lagi");
        if (blob.size) {
          objectUrl = URL.createObjectURL(blob);
          if (playback) {
            playback.src = objectUrl;
            playback.hidden = false;
          }
          setStatus("Rekaman siap. Putar dan bandingkan dengan audio contoh.");
        } else {
          setStatus("Rekaman kosong. Coba lagi dengan suara yang lebih jelas.");
        }
      });
      recorder.start();
      recording = true;
      setButton(true, "Berhenti merekam");
      setStatus("Merekam... ucapkan kalimatnya dengan jelas. Berhenti otomatis setelah 20 detik.");
      timer = window.setTimeout(finish, 20_000);
    } catch (error) {
      cleanupStream();
      setButton(false, "Coba rekam lagi");
      if (error?.name === "NotAllowedError" || error?.name === "SecurityError") {
        setStatus("Akses mikrofon ditolak. Izinkan mikrofon di browser, atau lanjut berlatih tanpa rekaman.");
      } else if (error?.name === "NotFoundError") {
        setStatus("Mikrofon tidak ditemukan. Kamu tetap bisa berlatih mengucapkan kalimat dengan suara keras.");
      } else {
        setStatus("Rekaman tidak dapat dimulai. Coba browser lain atau lanjut tanpa rekaman.");
      }
    }
  });

  return () => {
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        // Abaikan; stream tetap dihentikan di bawah.
      }
    }
    cleanupStream();
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
  };
}
