#!/usr/bin/env node
/*
 * Pemeriksaan konten dan logika yang bisa dijalankan tanpa browser.
 * Tidak memakai dependensi eksternal.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  CATEGORIES,
  CATEGORY_BY_ID,
  PHRASES,
  PHRASE_BY_ID,
  QUESTION_PATTERNS,
  SCENARIOS
} from "../js/data.js";
import {
  PROGRAM_DAYS,
  PROGRAM_ITEM_BY_ID,
  PROGRAM_PATTERN_BY_ID,
  PROGRAM_PATTERNS,
  PROGRAM_TOTAL_DAYS,
  PROGRAM_TOTAL_PHRASES
} from "../js/curriculum.js";
import {
  MASTERY_MIN_INTERVAL,
  MASTERY_STREAK,
  isDue,
  isMastered,
  schedulePhrase
} from "../js/srs.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
let checks = 0;

function check(label, fn) {
  checks += 1;
  try {
    fn();
    console.log(`  ✓ ${label}`);
  } catch (error) {
    failures.push({ label, error });
    console.error(`  ✗ ${label}\n    ${error.message}`);
  }
}

function nonEmpty(value, label) {
  assert.equal(typeof value, "string", `${label} harus berupa teks`);
  assert.ok(value.trim().length > 0, `${label} tidak boleh kosong`);
}

function normalize(value) {
  return String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const REQUIRED_PHRASES = [
  "Good morning. I’m calling from Terminal 3 Jakarta.",
  "I’m having an issue with the machine.",
  "Could you help me, please?",
  "The sensor is not working properly.",
  "I’ve restarted the machine, but the problem is still there.",
  "The machine is still powered on.",
  "The cable is connected properly.",
  "I suspect it might be a software issue.",
  "Could we start a remote session?",
  "Please reseat the LAN cable in slot zero.",
  "Okay, I’ll do that.",
  "I’ve reseated the LAN cable.",
  "You can check it now.",
  "The power supply is switched off.",
  "I have a spare PSU.",
  "May I replace the PSU?",
  "I’ll let you know when it’s done.",
  "This will take some time.",
  "It may take a while.",
  "I’m still working on it.",
  "The test is still running.",
  "I’ll keep you updated.",
  "Could you repeat that, please?",
  "Could you explain that again?",
  "What should I do next?",
  "Is there anything else I need to check?",
  "The problem is still there.",
  "The machine is working normally now.",
  "The test is complete.",
  "I’ve completed the checks."
];

/*
 * Seluruh 107 kalimat baru dari paket Service Engineer. Daftar ini sengaja
 * ditulis ulang di test agar pemeriksaan tidak hanya membaca sumber yang sama.
 */
const REQUIRED_EXPANSION_PHRASES = [
  "I’m on site now.",
  "I’m checking the machine.",
  "The machine stopped at around 08:15, and the alarm is still active.",
  "The HMI shows error code E-204.",
  "The system is running, but it’s very slow.",
  "I can’t access the server. It doesn’t respond to ping.",
  "The power supply LED is off.",
  "The LAN link light is blinking, but there’s no connection.",
  "I can see a burn mark on the connector.",
  "The cable looks loose at the terminal.",
  "There’s an unusual noise coming from the motor.",
  "The temperature inside the panel is higher than normal.",
  "I measured 24 volts at the input, which is normal.",
  "I measured 0 volts at the output.",
  "There is no voltage at the power supply terminal.",
  "Could you repeat that more slowly, please?",
  "Sorry, I didn’t understand. Could you explain it another way?",
  "Can you send me the wiring diagram?",
  "Which terminal should I check first?",
  "Should I restart the server or only the service?",
  "Is it safe to power off the system now?",
  "Could you check the logs from your side?",
  "Could you check the sensor?",
  "Could you check the connection?",
  "Could you guide me through the process?",
  "What should I check first?",
  "What should I do if the problem persists?",
  "Who is available for a remote session?",
  "Is anyone available to provide remote support?",
  "Are you available for a remote session?",
  "Could someone assist me remotely?",
  "Could you start a remote session?",
  "Understood. I’ll do it now.",
  "Let me confirm: I should replace the LAN cable, then reboot the switch. Is that correct?",
  "I’ve done step 3. What’s next?",
  "I’ll let you know as soon as I finish.",
  "Please wait a moment. I’m opening the panel now.",
  "I’m sending you a photo of the connector now.",
  "I’m sharing the screen so you can see the HMI.",
  "Could you show me which cable I need to check?",
  "I replaced the power supply, and the system is back online.",
  "I reseated the connector, but the problem is still there.",
  "I tightened all the terminal screws.",
  "I swapped the LAN cable, and the connection is stable now.",
  "The service is running again after the restart.",
  "I’m running a test now to make sure it works properly.",
  "It looks like the problem was caused by a loose cable.",
  "I’ve checked the cable and the power supply.",
  "Everything looks normal now.",
  "The test passed.",
  "The test failed.",
  "We need to run another test.",
  "I need to lock out the machine before I start working.",
  "Please stop the operation until the work is finished.",
  "I need a work permit before I can open the panel.",
  "I need to coordinate with the operations team to take the system offline.",
  "I’ll need about one hour to fix this.",
  "We need a spare part, and I’ll check the stock.",
  "Is it safe to restart the machine?",
  "Can I disconnect this cable?",
  "Can I replace the PSU?",
  "Can I run the test again?",
  "The issue has been resolved, and the machine is in normal operation.",
  "The root cause is a faulty power supply.",
  "This needs further investigation, so I’m escalating it.",
  "I’ll prepare the report after the test.",
  "I’ll monitor it for one more hour to make sure it stays stable.",
  "I’ll let you know if the problem happens again.",
  "I’ll call you back if the problem comes back.",
  "I’ll leave the site at [time].",
  "Team [name] will take over after I leave.",
  "I’ll be leaving the site at [time]. Team [name] will take over and continue the work.",
  "I’ll let the next team know about the current machine status.",
  "I’ll brief the next team before I leave.",
  "The machine is still under observation.",
  "The issue has not been fully resolved yet.",
  "The next team needs to continue troubleshooting.",
  "I’ve informed the next team about the problem.",
  "I’ll leave the site at 4 PM. Team B will take over and continue the work.",
  "I’m doing the routine inspection on the control panel.",
  "I cleaned the dust from the fan and the filter.",
  "All cable connections are secure, and no damage was found.",
  "Next inspection is scheduled for next month.",
  "I recommend replacing this part.",
  "Can I restart the machine?",
  "Can I access the machine remotely?",
  "Could you check it from your side?",
  "How do I restart the machine?",
  "How do I check the sensor?",
  "How do I access the settings?",
  "How do I replace the PSU?",
  "How do I run the diagnostic test?",
  "What is the next step?",
  "What is the error message?",
  "What is causing the problem?",
  "What is the status of the test?",
  "What is the problem?",
  "What should I check after replacing the PSU?",
  "Why is the sensor not working?",
  "Why is the machine offline?",
  "Why is the test taking so long?",
  "Where is the power supply?",
  "Where is the LAN port?",
  "Where can I find the configuration settings?",
  "Is it connected properly?",
  "Is the machine working now?",
  "Is the test complete?"
];

const EXPECTED_CATEGORY_COUNTS = {
  "initial-status": 8,
  observations: 7,
  "help-clarification": 12,
  "remote-availability": 5,
  "following-instructions": 8,
  "checks-repairs": 12,
  "safety-coordination": 10,
  "customer-operations": 26,
  "reporting-team": 7,
  "site-handover": 10,
  "preventive-maintenance": 5,
  "question-patterns": 23
};

const EXPECTED_MODULES = [
  "index.html",
  "styles.css",
  "sw.js",
  "manifest.webmanifest",
  "icon.svg",
  ".nojekyll",
  "js/app.js",
  "js/curriculum.js",
  "js/data.js",
  "js/expansion.js",
  "js/icons.js",
  "js/program.js",
  "js/srs.js",
  "js/speech.js",
  "js/store.js",
  "js/ui.js",
  "js/utils.js",
  "js/views/dashboard.js",
  "js/views/daily.js",
  "js/views/phrases.js",
  "js/views/recall.js",
  "js/views/patterns.js",
  "js/views/listen.js",
  "js/views/simulator.js",
  "js/views/progress.js",
  "js/views/settings.js",
  "js/views/menu.js"
];

console.log("\nService English — pemeriksaan konten dan logika\n");

console.log("Struktur dan konten");

check("semua berkas aplikasi tersedia", () => {
  for (const file of EXPECTED_MODULES) {
    assert.ok(fs.existsSync(path.join(ROOT, file)), `Berkas hilang: ${file}`);
  }
});

check("index.html memuat shell aplikasi dengan path relatif", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  assert.match(html, /href="styles\.css\?v=/);
  assert.match(html, /src="\.\/js\/app\.js\?v=/);
  assert.match(html, /id="app-content"/);
  assert.match(html, /id="mobile-nav"/);
});

check("manifest valid dan memakai nama baru", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.webmanifest"), "utf8"));
  assert.equal(manifest.name, "English for Service Engineer");
  assert.equal(manifest.start_url, "./");
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0);
});

check("workflow GitHub Pages menyalin modul js dan .nojekyll", () => {
  const workflow = fs.readFileSync(path.join(ROOT, ".github/workflows/pages.yml"), "utf8");
  assert.match(workflow, /cp -r js _site\//);
  assert.match(workflow, /touch _site\/\.nojekyll/);
  assert.doesNotMatch(workflow, /lessons\.json|reading-plan\.json|audio/);
});

check("26 kategori dengan ID unik, level, dan deskripsi lengkap", () => {
  assert.equal(CATEGORIES.length, 26);
  assert.equal(new Set(CATEGORIES.map(category => category.id)).size, 26);
  for (const category of CATEGORIES) {
    nonEmpty(category.label, `label kategori ${category.id}`);
    nonEmpty(category.short, `short kategori ${category.id}`);
    nonEmpty(category.description, `deskripsi kategori ${category.id}`);
    assert.ok(["Pemula", "Menengah"].includes(category.level), `level kategori ${category.id}`);
    assert.ok(CATEGORY_BY_ID[category.id], `Kategori tidak terdaftar: ${category.id}`);
  }
});

check("minimal 224 frasa dengan ID dan terjemahan unik", () => {
  assert.ok(PHRASES.length >= 224, `Baru ada ${PHRASES.length} frasa`);
  assert.equal(new Set(PHRASES.map(phrase => phrase.id)).size, PHRASES.length);
  assert.equal(new Set(PHRASES.map(phrase => normalize(phrase.en))).size, PHRASES.length);
  for (const phrase of PHRASES) {
    nonEmpty(phrase.id, "ID frasa");
    nonEmpty(phrase.en, `frasa Inggris ${phrase.id}`);
    nonEmpty(phrase.idText, `terjemahan ${phrase.id}`);
    nonEmpty(phrase.note, `catatan ${phrase.id}`);
    assert.ok(CATEGORY_BY_ID[phrase.category], `Kategori tidak valid pada ${phrase.id}`);
    assert.equal(PHRASE_BY_ID[phrase.id].id, phrase.id);
  }
});

check("setiap kategori memiliki frasa", () => {
  for (const category of CATEGORIES) {
    const count = PHRASES.filter(phrase => phrase.category === category.id).length;
    assert.ok(count > 0, `Kategori ${category.id} kosong`);
  }
});

check("kategori baru memiliki jumlah frasa sesuai paket", () => {
  for (const [categoryId, expected] of Object.entries(EXPECTED_CATEGORY_COUNTS)) {
    const actual = PHRASES.filter(phrase => phrase.category === categoryId).length;
    assert.equal(actual, expected, `Kategori ${categoryId}: ${actual}, seharusnya ${expected}`);
  }
});

check("30 frasa inti lama tersedia persis", () => {
  const available = new Set(PHRASES.map(phrase => phrase.en));
  const missing = REQUIRED_PHRASES.filter(phrase => !available.has(phrase));
  assert.deepEqual(missing, []);
});

check("107 frasa tambahan tersedia persis", () => {
  const available = new Set(PHRASES.map(phrase => phrase.en));
  const missing = REQUIRED_EXPANSION_PHRASES.filter(phrase => !available.has(phrase));
  assert.deepEqual(missing, []);
});

check("kurikulum program berisi 35 hari berurutan dengan lima frasa per hari", () => {
  assert.equal(PROGRAM_TOTAL_DAYS, 35);
  assert.equal(PROGRAM_TOTAL_PHRASES, 175);
  assert.equal(PROGRAM_DAYS.length, 35);
  assert.equal(new Set(PROGRAM_DAYS.map(day => day.day)).size, 35);
  PROGRAM_DAYS.forEach((day, index) => {
    assert.equal(day.day, index + 1, `Nomor hari tidak berurutan pada indeks ${index}`);
    nonEmpty(day.phase, `fase hari ${day.day}`);
    nonEmpty(day.title, `judul hari ${day.day}`);
    nonEmpty(day.goal, `tujuan hari ${day.day}`);
    assert.equal(day.items.length, 5, `Hari ${day.day} harus berisi lima frasa`);
  });
});

check("175 frasa program unik dan semuanya ada di bank frasa", () => {
  const ids = PROGRAM_DAYS.flatMap(day => day.items.map(item => item.id));
  assert.equal(ids.length, 175);
  assert.equal(new Set(ids).size, 175);
  for (const id of ids) {
    assert.ok(PHRASE_BY_ID[id], `Frasa program tidak ditemukan: ${id}`);
    assert.ok(PROGRAM_ITEM_BY_ID[id], `Item program tidak terdaftar: ${id}`);
    assert.equal(PROGRAM_ITEM_BY_ID[id].id, id);
  }
});

check("setiap frasa program memiliki pola, konteks, fokus, 2–3 contoh, dan latihan", () => {
  const exampleTexts = [];
  for (const day of PROGRAM_DAYS) {
    for (const item of day.items) {
      const pattern = PROGRAM_PATTERN_BY_ID[item.pattern];
      assert.ok(pattern, `Pola ${item.pattern} tidak ditemukan pada ${item.id}`);
      nonEmpty(item.focus, `fokus ${item.id}`);
      nonEmpty(item.context, `konteks ${item.id}`);
      nonEmpty(item.prompt, `latihan ${item.id}`);
      assert.ok(Array.isArray(item.examples), `contoh ${item.id} harus berupa array`);
      assert.ok(item.examples.length >= 2 && item.examples.length <= 3, `contoh ${item.id}: ${item.examples.length}`);
      const target = PHRASE_BY_ID[item.id].en;
      for (const example of item.examples) {
        nonEmpty(example, `contoh ${item.id}`);
        assert.notEqual(normalize(example), normalize(target), `Contoh ${item.id} mengulang frasa target`);
        exampleTexts.push(example);
      }
    }
  }
  assert.equal(new Set(exampleTexts).size, exampleTexts.length, "Ada contoh kalimat yang duplikat antar frasa");
});

check("pola program memiliki formula, penjelasan, dan bentuk yang lengkap", () => {
  assert.ok(PROGRAM_PATTERNS.length >= 40, `Pola program baru ${PROGRAM_PATTERNS.length}`);
  assert.equal(new Set(PROGRAM_PATTERNS.map(pattern => pattern.id)).size, PROGRAM_PATTERNS.length);
  const used = new Set(PROGRAM_DAYS.flatMap(day => day.items.map(item => item.pattern)));
  for (const pattern of PROGRAM_PATTERNS) {
    nonEmpty(pattern.name, `nama pola ${pattern.id}`);
    nonEmpty(pattern.formula, `formula ${pattern.id}`);
    nonEmpty(pattern.explanation, `penjelasan ${pattern.id}`);
    assert.ok(Array.isArray(pattern.forms) && pattern.forms.length > 0, `bentuk pola ${pattern.id}`);
    assert.ok(used.has(pattern.id), `Pola tidak dipakai: ${pattern.id}`);
  }
  for (const id of used) {
    assert.ok(PROGRAM_PATTERN_BY_ID[id], `Pola tidak terdaftar: ${id}`);
  }
});

check("program mencakup seluruh frasa pelanggan, handover, perawatan, dan laporan", () => {
  const requiredCategories = {
    "customer-operations": 26,
    "site-handover": 10,
    "preventive-maintenance": 5,
    "reporting-team": 7
  };
  for (const [categoryId, expected] of Object.entries(requiredCategories)) {
    const categoryIds = PHRASES
      .filter(phrase => phrase.category === categoryId)
      .map(phrase => phrase.id);
    assert.equal(categoryIds.length, expected, `Kategori ${categoryId} berubah`);
    const missing = categoryIds.filter(id => !PROGRAM_ITEM_BY_ID[id]);
    assert.deepEqual(missing, [], `Frasa ${categoryId} belum masuk program: ${missing.join(", ")}`);
  }
});

check("pola izin dan keselamatan tetap membedakan LOTO dan work permit", () => {
  for (const id of ["canq", "could", "may"]) {
    const pattern = PROGRAM_PATTERN_BY_ID[id];
    assert.ok(pattern, `Pola ${id} hilang`);
    assert.match(pattern.safety || "", /LOTO/i, `Pola ${id} tidak menyebut LOTO`);
    assert.match(pattern.safety || "", /work permit/i, `Pola ${id} tidak menyebut work permit`);
  }
  const risky = PROGRAM_DAYS
    .flatMap(day => day.items)
    .filter(item => ["psu-04", "safe-09", "rst-02", "help-06"].includes(item.id));
  assert.ok(risky.length >= 4, "Frasa berisiko tidak lengkap di program");
  for (const item of risky) {
    const phrase = PHRASE_BY_ID[item.id];
    assert.match(phrase.note.toLowerCase(), /loto|work permit|prosedur|izin/, `Catatan keselamatan ${item.id}`);
  }
});

check("placeholder [time] dan [name] serta contoh handover tersedia", () => {
  const handover = PHRASES.filter(phrase => phrase.category === "site-handover");
  assert.ok(handover.some(phrase => phrase.en.includes("[time]")), "Placeholder [time] hilang");
  assert.ok(handover.some(phrase => phrase.en.includes("[name]")), "Placeholder [name] hilang");
  assert.ok(
    handover.some(phrase => phrase.en === "I’ll leave the site at 4 PM. Team B will take over and continue the work."),
    "Contoh handover konkret hilang"
  );
});

check("delapan pola pertanyaan lengkap dengan 34 contoh yang valid", () => {
  assert.equal(QUESTION_PATTERNS.length, 8);
  assert.equal(new Set(QUESTION_PATTERNS.map(pattern => pattern.id)).size, 8);
  const exampleIds = QUESTION_PATTERNS.flatMap(pattern => pattern.examples);
  assert.equal(exampleIds.length, 34);
  assert.equal(new Set(exampleIds).size, 34);
  for (const pattern of QUESTION_PATTERNS) {
    nonEmpty(pattern.pattern, `pola ${pattern.id}`);
    nonEmpty(pattern.label, `label pola ${pattern.id}`);
    nonEmpty(pattern.formula, `formula pola ${pattern.id}`);
    nonEmpty(pattern.explanation, `penjelasan pola ${pattern.id}`);
    nonEmpty(pattern.contrast, `perbedaan pola ${pattern.id}`);
    assert.ok(["permission", "request", "instruction", "information", "confirmation"].includes(pattern.function), `fungsi pola ${pattern.id}`);
    assert.ok(pattern.examples.length >= 3, `contoh pola ${pattern.id} terlalu sedikit`);
    for (const id of pattern.examples) {
      assert.ok(PHRASE_BY_ID[id], `Contoh pola ${pattern.id} tidak ditemukan: ${id}`);
    }
  }
});

check("frasa keselamatan memuat LOTO, izin kerja, dan peringatan prosedur", () => {
  const safety = PHRASES.filter(phrase => phrase.category === "safety-coordination");
  assert.equal(safety.length, 10);
  const combined = safety.map(phrase => phrase.note).join(" ").toLowerCase();
  assert.match(combined, /loto|lockout\/tagout|lockout/);
  assert.match(combined, /work permit|izin kerja/);
  assert.match(combined, /prosedur/);
  const risky = ["safe-08", "safe-09"].map(id => PHRASE_BY_ID[id].note.toLowerCase()).join(" ");
  assert.match(risky, /bukan pengganti/);
  assert.match(risky, /loto/);
  assert.match(risky, /work permit|izin kerja/);
});

check("dialog contoh memiliki penutur dan terjemahan yang valid", () => {
  for (const phrase of PHRASES) {
    if (!phrase.dialogue) continue;
    assert.ok(Array.isArray(phrase.dialogue) && phrase.dialogue.length > 0, phrase.id);
    for (const line of phrase.dialogue) {
      assert.ok(["engineer", "technician"].includes(line.speaker), `Penutur ${phrase.id}`);
      nonEmpty(line.en, `dialog Inggris ${phrase.id}`);
      nonEmpty(line.idText, `dialog Indonesia ${phrase.id}`);
    }
  }
});

check("minimal 17 skenario dengan satu jawaban benar per langkah", () => {
  assert.ok(SCENARIOS.length >= 17, `Baru ada ${SCENARIOS.length} skenario`);
  assert.equal(new Set(SCENARIOS.map(scenario => scenario.id)).size, SCENARIOS.length);
  for (const scenario of SCENARIOS) {
    nonEmpty(scenario.id, "ID skenario");
    nonEmpty(scenario.title, `judul ${scenario.id}`);
    nonEmpty(scenario.intro, `intro ${scenario.id}`);
    nonEmpty(scenario.level, `level ${scenario.id}`);
    assert.ok(["Pemula", "Menengah"].includes(scenario.level), `level ${scenario.id}`);
    assert.ok(Array.isArray(scenario.steps) && scenario.steps.length >= 2, scenario.id);
    for (const [index, step] of scenario.steps.entries()) {
      nonEmpty(step.engineer?.en, `${scenario.id} langkah ${index + 1} engineer`);
      nonEmpty(step.engineer?.idText, `${scenario.id} langkah ${index + 1} terjemahan`);
      nonEmpty(step.explanation, `${scenario.id} langkah ${index + 1} penjelasan`);
      assert.ok(Array.isArray(step.options) && step.options.length >= 2, scenario.id);
      const correct = step.options.filter(option => option.correct);
      assert.equal(correct.length, 1, `${scenario.id} langkah ${index + 1} harus punya tepat satu jawaban benar`);
      assert.doesNotMatch(
        correct[0].en,
        /skip|bypass|without (a )?(work )?permit|don’t need|do not need/i,
        `${scenario.id} langkah ${index + 1} menyarankan melewati keselamatan`
      );
      for (const option of step.options) {
        nonEmpty(option.en, `${scenario.id} pilihan jawaban`);
      }
    }
  }
});

check("roleplay PSU memuat LOTO, work permit, dan verifikasi tegangan nol", () => {
  const scenario = SCENARIOS.find(item => item.id === "psu-safety");
  assert.ok(scenario, "Skenario psu-safety hilang");
  const text = JSON.stringify(scenario).toLowerCase();
  assert.match(text, /lockout|lock out/);
  assert.match(text, /work permit/);
  assert.match(text, /zero voltage/);
  assert.match(text, /approved safety procedure/);
});

check("roleplay baru mencakup laporan awal, remote, jaringan, eskalasi, dan handover", () => {
  const required = [
    "initial-report",
    "remote-availability",
    "network-troubleshooting",
    "escalation",
    "site-handover"
  ];
  for (const id of required) {
    assert.ok(SCENARIOS.some(scenario => scenario.id === id), `Skenario hilang: ${id}`);
  }
});

console.log("\nPenjadwalan spaced repetition");

const NOW = new Date("2026-10-29T08:00:00+07:00");

check("rating 'again' mengulang di sesi yang sama", () => {
  const result = schedulePhrase({ successStreak: 2, intervalDays: 7, lapses: 1 }, "again", NOW);
  assert.equal(result.intervalDays, 0);
  assert.equal(result.successStreak, 0);
  assert.equal(result.lapses, 2);
  assert.equal(result.dueAt, NOW.toISOString());
  assert.equal(isDue({ learnedAt: NOW.toISOString(), dueAt: result.dueAt }, NOW), true);
});

check("rating 'hard' menjadwalkan besok", () => {
  const result = schedulePhrase({ successStreak: 3, intervalDays: 15 }, "hard", NOW);
  assert.equal(result.intervalDays, 1);
  assert.equal(result.successStreak, 0);
  const due = new Date(result.dueAt);
  assert.ok(due > NOW);
  assert.ok(due - NOW <= 25 * 60 * 60 * 1000);
});

check("rating 'good' memperpanjang interval secara progresif", () => {
  let record = {};
  const expected = [3, 7, 15, 33, 60, 60];
  for (const [index, days] of expected.entries()) {
    const scheduled = schedulePhrase(record, "good", NOW);
    assert.equal(scheduled.intervalDays, days, `Iterasi ${index + 1}`);
    assert.equal(scheduled.successStreak, index + 1);
    record = { ...record, ...scheduled };
  }
});

check("mastery membutuhkan streak dan interval minimum", () => {
  const almost = {
    learnedAt: NOW.toISOString(),
    successStreak: MASTERY_STREAK - 1,
    intervalDays: MASTERY_MIN_INTERVAL
  };
  const mastered = {
    learnedAt: NOW.toISOString(),
    successStreak: MASTERY_STREAK,
    intervalDays: MASTERY_MIN_INTERVAL
  };
  assert.equal(isMastered(almost), false);
  assert.equal(isMastered(mastered), true);
  assert.equal(isMastered({ learnedAt: NOW.toISOString(), successStreak: 9, intervalDays: 7 }), false);
});

check("frasa baru belum dianggap jatuh tempo", () => {
  assert.equal(isDue({ seenAt: NOW.toISOString() }, NOW), false);
  assert.equal(isDue({ learnedAt: NOW.toISOString(), dueAt: new Date(NOW.getTime() + 1000).toISOString() }, NOW), false);
});

console.log("");
if (failures.length) {
  console.error(`GAGAL: ${failures.length} dari ${checks} pemeriksaan tidak lolos.`);
  process.exitCode = 1;
} else {
  console.log(`LULUS: ${checks} pemeriksaan berhasil.`);
  console.log(`Konten: ${PHRASES.length} frasa · ${CATEGORIES.length} kategori · ${SCENARIOS.length} skenario · ${QUESTION_PATTERNS.length} pola · ${REQUIRED_EXPANSION_PHRASES.length} frasa tambahan wajib.\n`);
}
