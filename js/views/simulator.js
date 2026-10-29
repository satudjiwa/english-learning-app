/* Simulator roleplay: instruksi engineer → pilih respons → lihat penjelasan. */

import { SCENARIOS, SCENARIO_BY_ID } from "../data.js";
import { icon } from "../icons.js";
import {
  isSpeechSupported,
  speak,
  speechErrorID
} from "../speech.js";
import { emptyStateHTML, toast } from "../ui.js";
import { esc } from "../utils.js";

export const navLabel = "Simulator";
export const title = "Simulator Remote Session";
export const description = "Latih percakapan dengan engineer remote lewat skenario singkat dan realistis.";

function newSession(scenarioId) {
  return {
    scenarioId,
    step: 0,
    turns: [],
    answered: false,
    selected: null,
    revealed: false,
    wrong: [],
    lastWrong: null,
    complete: false
  };
}

function ensureSession(ctx, scenarioId) {
  let session = ctx.ui.sim;
  if (!session || session.scenarioId !== scenarioId) {
    session = newSession(scenarioId);
    ctx.ui.sim = session;
  } else if (ctx.isEntry && session.complete) {
    session = newSession(scenarioId);
    ctx.ui.sim = session;
  }
  return session;
}

function scenarioGridHTML() {
  return `
    <div class="scenario-grid">
      ${SCENARIOS.map((scenario, index) => `
        <a class="scenario-card" href="#/simulator/${esc(scenario.id)}">
          <div class="scenario-card-top">
            <span class="scenario-icon">${icon(scenario.icon, 22)}</span>
            <span class="scenario-number">Skenario ${String(index + 1).padStart(2, "0")}</span>
          </div>
          <h2>${esc(scenario.title)}</h2>
          <p>${esc(scenario.intro)}</p>
          <div class="scenario-card-foot">
            <span>${icon("list", 14)} ${scenario.steps.length} langkah</span>
            <span class="scenario-level">${esc(scenario.level)}</span>
          </div>
        </a>
      `).join("")}
    </div>
  `;
}

function bubbleHTML({ line, role, turnIndex = null, kind = "engineer" }) {
  const isTechnician = role === "technician";
  const speakAttr = turnIndex === null
    ? `data-speak-current="${kind}"`
    : `data-speak-turn="${turnIndex}" data-speak-kind="${kind}"`;
  return `
    <div class="chat-row ${isTechnician ? "is-technician" : ""}">
      <span class="chat-avatar">${isTechnician ? "A" : "E"}</span>
      <div class="chat-bubble">
        <div class="chat-meta">
          <strong>${isTechnician ? "Anda" : "Engineer"}</strong>
          <button class="icon-btn icon-btn--tiny" type="button" ${speakAttr} aria-label="Dengarkan pesan ${isTechnician ? "Anda" : "engineer"}" ${isSpeechSupported() ? "" : "disabled"}>
            ${icon("volume", 15)}
          </button>
        </div>
        <p class="chat-en" lang="en">${esc(line.en)}</p>
        <p class="chat-id">${esc(line.idText)}</p>
      </div>
    </div>
  `;
}

function transcriptHTML(turns) {
  return turns.map((turn, index) => `
    ${bubbleHTML({ line: turn.engineer, role: "engineer", turnIndex: index, kind: "engineer" })}
    ${bubbleHTML({ line: turn.response, role: "technician", turnIndex: index, kind: "response" })}
  `).join("");
}

function scenarioViewHTML(scenario, session) {
  if (session.complete) {
    const due = session.turns.length;
    return `
      <div class="simulator-detail">
        <a class="back-link" href="#/simulator">${icon("arrow-left", 16)} Semua skenario</a>
        <section class="completion-card simulator-complete">
          <span class="completion-icon">${icon("check-circle", 34)}</span>
          <span class="eyebrow">Roleplay selesai</span>
          <h2>${esc(scenario.title)}</h2>
          <p>Kamu menyelesaikan ${due} langkah percakapan. Baca ulang transkripnya, lalu ulangi skenario ini tanpa melihat pilihan jika sudah siap.</p>
          <div class="completion-actions">
            <button class="btn btn-primary" type="button" data-restart-scenario>${icon("rotate-ccw", 18)} Ulangi skenario</button>
            <a class="btn btn-secondary" href="#/simulator">Pilih skenario lain</a>
          </div>
        </section>
        <section class="transcript-panel" aria-labelledby="sim-transcript-title">
          <div class="section-heading section-heading--tight">
            <div>
              <span class="eyebrow">Transkrip</span>
              <h2 id="sim-transcript-title">Percakapan lengkap</h2>
            </div>
          </div>
          <div class="chat-thread">${transcriptHTML(session.turns)}</div>
        </section>
      </div>
    `;
  }

  const step = scenario.steps[session.step];
  const progress = Math.round((session.step / scenario.steps.length) * 100);
  const correctIndex = step.options.findIndex(option => option.correct);
  const selected = session.selected;

  return `
    <div class="simulator-detail">
      <a class="back-link" href="#/simulator">${icon("arrow-left", 16)} Semua skenario</a>

      <header class="scenario-header">
        <div>
          <span class="eyebrow">${esc(scenario.level)} · ${scenario.steps.length} langkah</span>
          <h1>${esc(scenario.title)}</h1>
          <p>${esc(scenario.intro)}</p>
        </div>
        <span class="scenario-header-icon">${icon(scenario.icon, 28)}</span>
      </header>

      <div class="sim-progress">
        <div class="sim-progress-copy">
          <span>Langkah ${session.step + 1} dari ${scenario.steps.length}</span>
          <strong>${progress}%</strong>
        </div>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}" aria-label="Progres skenario">
          <span class="progress-fill" style="width:${progress}%"></span>
        </div>
      </div>

      <div class="chat-thread chat-thread--live">
        ${transcriptHTML(session.turns)}
        ${bubbleHTML({ line: step.engineer, role: "engineer", kind: "engineer" })}

        ${session.answered ? `
          ${bubbleHTML({
            line: { en: selected?.en || step.options[correctIndex].en, idText: step.options.find(option => option.en === (selected?.en || step.options[correctIndex].en))?.idText || "" },
            role: "technician",
            kind: "response"
          })}
        ` : ""}
      </div>

      <section class="response-panel" aria-labelledby="response-title">
        <div class="response-heading">
          <div>
            <span class="eyebrow">Giliran Anda</span>
            <h2 id="response-title">${session.answered ? "Respons yang cocok" : "Pilih respons yang tepat"}</h2>
          </div>
          <span class="response-step">${icon("message", 15)} Langkah ${session.step + 1}</span>
        </div>

        <div class="option-list">
          ${step.options.map((option, index) => {
            const isWrong = session.wrong.includes(index);
            const isCorrect = session.answered && index === correctIndex;
            const isSelected = session.answered && selected?.en === option.en;
            return `
              <button class="option-btn ${isCorrect ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""} ${isSelected ? "is-selected" : ""}" type="button" data-option="${index}" ${session.answered || isWrong ? "disabled" : ""}>
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                <span class="option-copy">
                  <span lang="en">${esc(option.en)}</span>
                  <small>${esc(option.idText || "")}</small>
                </span>
                <span class="option-mark">${isCorrect ? icon("check", 18) : isWrong ? icon("x", 18) : ""}</span>
              </button>
            `;
          }).join("")}
        </div>

        ${session.answered ? `
          <div class="sim-feedback is-correct" role="status">
            <span class="feedback-icon">${icon("check-circle", 20)}</span>
            <div>
              <strong>${session.revealed ? "Contoh jawaban yang tepat" : "Tepat!"}</strong>
              <p>${esc(step.explanation)}</p>
            </div>
          </div>
          <div class="sim-actions">
            <button class="btn btn-primary" type="button" data-next-step>
              ${session.step >= scenario.steps.length - 1 ? "Selesaikan skenario" : "Lanjut ke langkah berikutnya"} ${icon("arrow-right", 17)}
            </button>
            <button class="btn btn-ghost" type="button" data-speak-current="response" ${isSpeechSupported() ? "" : "disabled"}>
              ${icon("volume", 17)} Dengarkan respons
            </button>
          </div>
        ` : `
          <div class="sim-actions sim-actions--between">
            <button class="text-link" type="button" data-reveal-answer>${icon("eye", 16)} Lihat contoh jawaban</button>
            ${session.lastWrong ? `<p class="wrong-hint" role="status">${icon("info", 15)} Belum cocok. Baca lagi instruksi engineer, lalu coba pilihan lain.</p>` : `<p class="wrong-hint"></p>`}
          </div>
        `}
      </section>
    </div>
  `;
}

export function render(ctx, params) {
  if (!params?.id) {
    return `
      <div class="page">
        <header class="page-heading">
          <span class="eyebrow">${SCENARIOS.length} skenario · roleplay</span>
          <h1>Simulator Remote Session</h1>
          <p>${esc(description)} Pilih satu skenario, baca instruksi engineer, lalu pilih respons yang paling cocok.</p>
        </header>
        <div class="sim-note">
          ${icon("users", 20)}
          <p><strong>Anggap ini panggilan sungguhan.</strong> Ucapkan jawabanmu dengan suara keras sebelum memilih. Tidak ada penilaian otomatis untuk pelafalan.</p>
        </div>
        ${scenarioGridHTML()}
      </div>
    `;
  }

  const scenario = SCENARIO_BY_ID[params.id];
  if (!scenario) {
    return `
      <div class="page">
        <header class="page-heading">
          <span class="eyebrow">Simulator</span>
          <h1>Skenario tidak ditemukan</h1>
        </header>
        ${emptyStateHTML({
          iconName: "search",
          title: "Skenario ini tidak tersedia",
          message: "Mungkin tautannya sudah berubah. Kembali ke daftar skenario untuk memilih latihan lain.",
          action: `<a class="btn btn-primary" href="#/simulator">Lihat semua skenario</a>`
        })}
      </div>
    `;
  }

  const session = ensureSession(ctx, scenario.id);
  return `<div class="page">${scenarioViewHTML(scenario, session)}</div>`;
}

export function mount(root, ctx, params) {
  if (!params?.id) return;
  const scenario = SCENARIO_BY_ID[params.id];
  if (!scenario) return;
  const session = ctx.ui.sim;
  if (!session) return;

  const speakLine = line => {
    const result = speak(line.en, {
      onError: code => toast(speechErrorID(code), "error")
    });
    if (!result.ok) toast(speechErrorID(result.reason), "error");
  };

  const onClick = event => {
    const speakButton = event.target.closest("[data-speak-current], [data-speak-turn]");
    if (speakButton) {
      if (speakButton.dataset.speakCurrent === "engineer" && !session.complete) {
        speakLine(scenario.steps[session.step].engineer);
      } else if (speakButton.dataset.speakCurrent === "response" && session.step < scenario.steps.length) {
        const step = scenario.steps[session.step];
        const correct = step.options.find(option => option.correct);
        speakLine(session.selected || correct);
      } else if (speakButton.dataset.speakTurn !== undefined) {
        const turn = session.turns[Number(speakButton.dataset.speakTurn)];
        if (!turn) return;
        speakLine(speakButton.dataset.speakKind === "response" ? turn.response : turn.engineer);
      }
      return;
    }

    const optionButton = event.target.closest("[data-option]");
    if (optionButton && !session.answered) {
      const index = Number(optionButton.dataset.option);
      if (session.wrong.includes(index)) return;
      const option = scenario.steps[session.step].options[index];
      if (!option) return;
      if (option.correct) {
        session.answered = true;
        session.selected = option;
        session.revealed = false;
      } else {
        session.wrong.push(index);
        session.lastWrong = option;
      }
      ctx.refresh();
      return;
    }

    if (event.target.closest("[data-reveal-answer]")) {
      const step = scenario.steps[session.step];
      session.answered = true;
      session.selected = step.options.find(option => option.correct) || null;
      session.revealed = true;
      ctx.refresh();
      return;
    }

    if (event.target.closest("[data-next-step]")) {
      const step = scenario.steps[session.step];
      if (!step) return;
      const response = session.selected || step.options.find(option => option.correct);
      session.turns.push({ engineer: step.engineer, response });
      session.step += 1;
      session.answered = false;
      session.selected = null;
      session.revealed = false;
      session.wrong = [];
      session.lastWrong = null;
      if (session.step >= scenario.steps.length) {
        session.complete = true;
        ctx.refresh({ scrollTop: true });
      } else {
        ctx.refresh({ scrollTop: true });
      }
      return;
    }

    if (event.target.closest("[data-restart-scenario]")) {
      ctx.ui.sim = newSession(scenario.id);
      ctx.refresh({ scrollTop: true });
    }
  };

  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}
