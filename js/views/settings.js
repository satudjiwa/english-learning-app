/* Pengaturan suara, target harian, dan data lokal. */

import { icon } from "../icons.js";
import {
  getSettings,
  getStorageStatus,
  resetProgress,
  updateSettings
} from "../store.js";
import {
  getEnglishVoices,
  isSpeechSupported,
  speak,
  speechErrorID,
  stopSpeaking,
  subscribeVoices
} from "../speech.js";
import { confirmDialog, toast } from "../ui.js";
import { esc } from "../utils.js";

export const navLabel = "Pengaturan";
export const title = "Pengaturan";
export const description = "Atur suara, kecepatan bicara, dan target latihan harianmu.";

const SAMPLE = "Good morning. I’m calling from Terminal 3 Jakarta.";

function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function voiceOptionsHTML(selected) {
  const voices = getEnglishVoices();
  const exists = voices.some(voice => voice.voiceURI === selected);
  return [
    `<option value="" ${selected ? "" : "selected"}>Otomatis — pilih suara Amerika terbaik</option>`,
    ...voices.map(voice => `
      <option value="${esc(voice.voiceURI)}" ${voice.voiceURI === selected ? "selected" : ""}>
        ${esc(voice.name)} (${esc(voice.lang)})${voice.localService ? " · offline" : ""}
      </option>
    `),
    selected && !exists
      ? `<option value="${esc(selected)}" selected disabled>Suara tersimpan tidak tersedia di perangkat ini</option>`
      : ""
  ].join("");
}

function targetOptionHTML(value, selected, minutes) {
  return `
    <label class="target-option ${selected === value ? "is-selected" : ""}">
      <input type="radio" name="dailyTarget" value="${value}" ${selected === value ? "checked" : ""}>
      <span class="target-value">${value}</span>
      <span class="target-copy"><strong>frasa</strong><small>± ${minutes} menit</small></span>
      <span class="target-check">${icon("check", 15)}</span>
    </label>
  `;
}

export function render() {
  const settings = getSettings();
  const storage = getStorageStatus();
  const supported = isSpeechSupported();
  const voices = getEnglishVoices();
  const hasEnglishVoice = voices.length > 0;

  return `
    <div class="page settings-page">
      <header class="page-heading">
        <span class="eyebrow">Preferensi belajar</span>
        <h1>Pengaturan</h1>
        <p>${esc(description)}</p>
      </header>

      ${!storage.available ? `
        <div class="inline-notice" role="alert">
          ${icon("alert", 18)}
          <p><strong>Penyimpanan lokal tidak tersedia.</strong> Pengaturan dan progres tidak akan bertahan setelah tab ditutup. Coba matikan mode privat atau izinkan penyimpanan situs.</p>
        </div>
      ` : ""}

      <form id="settings-form" novalidate>
        <section class="settings-card" aria-labelledby="audio-settings-title">
          <div class="settings-head">
            <span class="settings-icon">${icon("volume", 21)}</span>
            <div>
              <h2 id="audio-settings-title">Suara dan pengucapan</h2>
              <p>Audio memakai Web Speech API di browser. Kualitas suara bergantung pada perangkat dan suara yang terpasang.</p>
            </div>
          </div>

          ${!supported ? `
            <div class="inline-notice" role="status">
              ${icon("volume-off", 18)}
              <p><strong>Browser ini tidak mendukung text-to-speech.</strong> Kamu tetap bisa membaca frasa dan berlatih menulis. Coba Chrome, Edge, atau Safari versi terbaru untuk fitur audio.</p>
            </div>
          ` : `
            <div class="settings-field">
              <label for="voice-select">Suara bahasa Inggris</label>
              <div class="select-wrap select-wrap--full">
                <select id="voice-select" ${hasEnglishVoice ? "" : "disabled"}>
                  ${voiceOptionsHTML(settings.voiceURI)}
                </select>
                ${icon("chevron-right", 16)}
              </div>
              <p class="field-help" id="voice-status">
                ${hasEnglishVoice
                  ? "Suara Amerika (en-US) diprioritaskan secara otomatis. Pilih suara lain jika lebih nyaman."
                  : "Belum ada suara bahasa Inggris yang terdeteksi. Browser kadang memuat daftar suara setelah beberapa saat."}
              </p>
            </div>

            <div class="settings-field">
              <div class="field-label-row">
                <label for="rate-range">Kecepatan bicara</label>
                <output id="rate-output" for="rate-range">${settings.rate.toFixed(2).replace(".", ",")}×</output>
              </div>
              <input id="rate-range" type="range" name="rate" min="0.6" max="1.3" step="0.05" value="${settings.rate}">
              <div class="range-labels"><span>Lambat</span><span>Normal</span><span>Cepat</span></div>
              <p class="field-help">Mulai dari 0,90× jika engineer berbicara cukup cepat. Tombol “Lebih lambat” memakai 68% dari kecepatan ini.</p>
            </div>

            <div class="settings-test">
              <button class="btn btn-secondary" type="button" id="test-voice" ${hasEnglishVoice ? "" : ""}>
                ${icon("play", 17)} Uji suara
              </button>
              <button class="btn btn-ghost" type="button" id="stop-voice">${icon("stop", 16)} Stop</button>
              <p id="test-status" role="status" aria-live="polite">Contoh: “${esc(SAMPLE)}”</p>
            </div>
          `}
        </section>

        <section class="settings-card" aria-labelledby="target-settings-title">
          <div class="settings-head">
            <span class="settings-icon">${icon("target", 21)}</span>
            <div>
              <h2 id="target-settings-title">Target harian</h2>
              <p>Pilih berapa frasa baru yang ingin kamu pelajari setiap sesi. Latihan tetap menyertakan review jika ada yang jatuh tempo.</p>
            </div>
          </div>
          <div class="target-options" role="radiogroup" aria-label="Target frasa harian">
            ${targetOptionHTML(3, settings.dailyTarget, 6)}
            ${targetOptionHTML(4, settings.dailyTarget, 9)}
            ${targetOptionHTML(5, settings.dailyTarget, 12)}
          </div>
          <p class="field-help">${icon("info", 15)} Maksimal lima frasa baru per sesi. Perubahan target berlaku untuk rencana hari berikutnya, bukan mengubah sesi yang sudah berjalan.</p>
        </section>

        <section class="settings-card" aria-labelledby="data-settings-title">
          <div class="settings-head">
            <span class="settings-icon">${icon("shield", 21)}</span>
            <div>
              <h2 id="data-settings-title">Data dan privasi</h2>
              <p>Semua progres disimpan di localStorage browser ini. Tidak ada akun, server, atau pengiriman data ke pihak lain.</p>
            </div>
          </div>
          <div class="storage-facts">
            <div><span>Lokasi data</span><strong>Browser ini saja</strong></div>
            <div><span>Ukuran data</span><strong>${formatBytes(storage.bytes)}</strong></div>
            <div><span>Akun</span><strong>Tidak diperlukan</strong></div>
          </div>
          <div class="data-actions">
            <button class="btn btn-danger-ghost" type="button" id="reset-settings">${icon("rotate-ccw", 17)} Reset progres belajar</button>
            <p>Menghapus frasa yang dipelajari, jadwal review, riwayat, dan streak. Pengaturan tetap disimpan.</p>
          </div>
        </section>

        <div class="settings-save">
          <p>${icon("lock", 15)} Perubahan disimpan di perangkat ini.</p>
          <button class="btn btn-primary" type="submit">${icon("check", 18)} Simpan pengaturan</button>
        </div>
      </form>

      <p class="page-note">${icon("info", 15)} Menghapus data situs di browser juga akan menghapus progres belajar. Aplikasi tidak memiliki salinan cadangan di server.</p>
    </div>
  `;
}

export function mount(root, ctx) {
  const form = root.querySelector("#settings-form");
  const rate = root.querySelector("#rate-range");
  const rateOutput = root.querySelector("#rate-output");
  const voiceSelect = root.querySelector("#voice-select");
  const testButton = root.querySelector("#test-voice");
  const stopButton = root.querySelector("#stop-voice");
  const testStatus = root.querySelector("#test-status");
  const voiceStatus = root.querySelector("#voice-status");
  const targetInputs = [...root.querySelectorAll('input[name="dailyTarget"]')];
  let unsubscribe = null;

  const markTargets = () => {
    targetInputs.forEach(input => {
      input.closest(".target-option")?.classList.toggle("is-selected", input.checked);
    });
  };

  targetInputs.forEach(input => input.addEventListener("change", markTargets));

  const updateRateUI = () => {
    if (!rate) return;
    const value = Number(rate.value);
    const minimum = Number(rate.min) || 0;
    const maximum = Number(rate.max) || 1;
    const fill = ((value - minimum) / (maximum - minimum)) * 100;
    rate.style.setProperty("--range-fill", `${Math.max(0, Math.min(100, fill))}%`);
    if (rateOutput) rateOutput.textContent = `${value.toFixed(2).replace(".", ",")}×`;
  };

  updateRateUI();
  rate?.addEventListener("input", updateRateUI);

  if (testButton) {
    testButton.addEventListener("click", () => {
      const result = speak(SAMPLE, {
        voiceURI: voiceSelect?.value || "",
        rate: rate ? Number(rate.value) : undefined,
        onError: code => {
          if (testStatus) testStatus.textContent = speechErrorID(code);
        }
      });
      if (!result.ok) {
        if (testStatus) testStatus.textContent = speechErrorID(result.reason);
        return;
      }
      if (testStatus) testStatus.textContent = `Memutar contoh dengan ${result.voice}.`;
    });
  }

  stopButton?.addEventListener("click", () => {
    stopSpeaking();
    if (testStatus) testStatus.textContent = "Pemutaran dihentikan.";
  });

  // Suara dapat dimuat terlambat di Chrome. Perbarui pilihan tanpa kehilangan input lain.
  unsubscribe = subscribeVoices(voices => {
    if (!voiceSelect) return;
    const selected = voiceSelect.value;
    voiceSelect.innerHTML = voiceOptionsHTML(selected);
    const hasVoice = voices.length > 0;
    voiceSelect.disabled = !hasVoice;
    if (testButton) testButton.disabled = !hasVoice;
    if (voiceStatus) {
      voiceStatus.textContent = hasVoice
        ? "Suara Amerika (en-US) diprioritaskan secara otomatis. Pilih suara lain jika lebih nyaman."
        : "Belum ada suara bahasa Inggris yang terdeteksi. Browser kadang memuat daftar suara setelah beberapa saat.";
    }
  });

  form?.addEventListener("submit", event => {
    event.preventDefault();
    const current = getSettings();
    const data = new FormData(form);
    const targetValue = data.get("dailyTarget");
    const rateField = data.get("rate");
    const target = targetValue !== null ? Number(targetValue) : current.dailyTarget;
    const rateValue = rateField !== null && rateField !== ""
      ? Number(rateField)
      : current.rate;
    // Saat Web Speech API tidak tersedia, kontrol suara tidak dirender.
    // Jangan hapus preferensi yang sudah tersimpan hanya karena itu.
    const voiceURI = voiceSelect ? voiceSelect.value : current.voiceURI;
    updateSettings({ dailyTarget: target, rate: rateValue, voiceURI });
    toast("Pengaturan disimpan.", "success");
    ctx.refresh();
  });

  root.querySelector("#reset-settings")?.addEventListener("click", async () => {
    const confirmed = await confirmDialog({
      title: "Reset progres belajar?",
      message: "Semua frasa yang dipelajari, jadwal review, riwayat, dan streak akan dihapus dari browser ini. Pengaturan suara dan target tetap disimpan.",
      confirmLabel: "Ya, reset progres",
      cancelLabel: "Batal",
      tone: "danger",
      iconName: "rotate-ccw"
    });
    if (!confirmed) return;

    resetProgress({ keepSettings: true });
    Object.keys(ctx.ui).forEach(key => delete ctx.ui[key]);
    toast("Progres belajar sudah dihapus.", "success");
    ctx.navigate("home");
  });

  return () => {
    stopSpeaking();
    unsubscribe?.();
  };
}
