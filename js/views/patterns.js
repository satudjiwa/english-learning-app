/* Pola pertanyaan: struktur bertanya untuk troubleshooting remote. */

import { PHRASE_BY_ID, QUESTION_PATTERNS } from "../data.js";
import { icon } from "../icons.js";
import {
  isSpeechSupported,
  speak,
  speechErrorID
} from "../speech.js";
import { toast } from "../ui.js";
import { englishHTML, esc } from "../utils.js";

export const navLabel = "Pola Pertanyaan";
export const title = "Pola Pertanyaan";
export const description = "Kuasai struktur pertanyaan, bukan hanya satu kalimat. Ganti kata kerja dan objeknya sesuai situasi.";

const FUNCTION_GUIDE = [
  {
    icon: "shield",
    title: "Meminta izin",
    pattern: "Can I / May I + verb?",
    text: "Anda meminta persetujuan untuk melakukan sesuatu. Izin tidak menggantikan LOTO, work permit, atau prosedur keselamatan."
  },
  {
    icon: "help",
    title: "Membuat permintaan",
    pattern: "Could you / Can you + verb?",
    text: "Anda meminta orang lain melakukan sesuatu. Could you terdengar lebih sopan daripada Can you."
  },
  {
    icon: "list",
    title: "Menanyakan instruksi",
    pattern: "How do I / What should I + verb?",
    text: "Anda meminta cara atau langkah yang disarankan. How do I menanyakan cara; What should I menanyakan tindakan."
  },
  {
    icon: "message",
    title: "Melaporkan informasi",
    pattern: "I’ve / The … is …",
    text: "Anda memberi fakta, hasil, atau status. Ini bukan pertanyaan, tetapi sering menjadi jawaban dari pola di atas."
  }
];

function patternCardHTML(pattern, index) {
  const examples = pattern.examples
    .map(id => PHRASE_BY_ID[id])
    .filter(Boolean);
  const audio = isSpeechSupported();

  return `
    <article class="pattern-card" aria-labelledby="pattern-${esc(pattern.id)}">
      <div class="pattern-card-head">
        <span class="pattern-number">${String(index + 1).padStart(2, "0")}</span>
        <div class="pattern-heading">
          <span class="pattern-function">${esc(pattern.label)}</span>
          <h2 id="pattern-${esc(pattern.id)}">${esc(pattern.pattern)}</h2>
        </div>
        <span class="pattern-count">${examples.length} contoh</span>
      </div>

      <p class="pattern-formula"><code>${esc(pattern.formula)}</code></p>
      <p class="pattern-explanation">${esc(pattern.explanation)}</p>
      <p class="pattern-contrast">${icon("info", 15)} ${esc(pattern.contrast)}</p>

      <div class="pattern-examples">
        ${examples.map((phrase, exampleIndex) => `
          <div class="pattern-example">
            <span class="pattern-example-index">${exampleIndex + 1}</span>
            <div class="pattern-example-copy">
              <p lang="en">${englishHTML(phrase.en)}</p>
              <span>${esc(phrase.idText)}</span>
            </div>
            <button class="icon-btn icon-btn--tiny" type="button" data-speak-pattern="${esc(phrase.id)}" aria-label="Dengarkan: ${esc(phrase.en)}" ${audio ? "" : "disabled"}>
              ${icon("volume", 16)}
            </button>
          </div>
        `).join("")}
      </div>

      <p class="pattern-drill">${icon("mic", 15)} Ucapkan setiap contoh dengan suara keras, lalu buat satu kalimat baru dengan pola yang sama.</p>
    </article>
  `;
}

export function render() {
  const totalExamples = QUESTION_PATTERNS.reduce((count, pattern) => count + pattern.examples.length, 0);
  return `
    <div class="page">
      <header class="page-heading">
        <span class="eyebrow">${QUESTION_PATTERNS.length} pola · ${totalExamples} contoh kalimat</span>
        <h1>Pola Pertanyaan</h1>
        <p>${esc(description)}</p>
      </header>

      <section class="pattern-guide" aria-labelledby="pattern-guide-title">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Bedakan fungsinya</span>
            <h2 id="pattern-guide-title">Satu pertanyaan, satu tujuan</h2>
          </div>
          <span class="section-note">Pilih pola sesuai maksud, bukan sekadar hafal kalimat.</span>
        </div>
        <div class="pattern-guide-grid">
          ${FUNCTION_GUIDE.map(item => `
            <div class="pattern-guide-card">
              <span class="pattern-guide-icon">${icon(item.icon, 20)}</span>
              <div>
                <h3>${esc(item.title)}</h3>
                <code>${esc(item.pattern)}</code>
                <p>${esc(item.text)}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </section>

      <div class="pattern-safety">
        ${icon("shield", 20)}
        <p><strong>Keselamatan lebih penting daripada kelancaran bertanya.</strong> Untuk pekerjaan listrik, membuka panel, atau mengganti komponen, tanyakan izin sekaligus konfirmasi LOTO, work permit, dan prosedur yang disetujui. Jawaban “yes” saja tidak membuat pekerjaan berisiko menjadi aman.</p>
      </div>

      <section class="pattern-list" aria-label="Daftar pola pertanyaan">
        ${QUESTION_PATTERNS.map(patternCardHTML).join("")}
      </section>

      <p class="page-note">${icon("volume", 15)} Audio memakai text-to-speech browser. Jika suara tidak tersedia, tetap ucapkan contoh dengan suara keras; tombol audio akan nonaktif secara jujur.</p>
    </div>
  `;
}

export function mount(root) {
  const onClick = event => {
    const button = event.target.closest("[data-speak-pattern]");
    if (!button) return;
    const phrase = PHRASE_BY_ID[button.dataset.speakPattern];
    if (!phrase) return;
    const result = speak(phrase.en, {
      onError: code => toast(speechErrorID(code), "error")
    });
    if (!result.ok) toast(speechErrorID(result.reason), "error");
  };

  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}
