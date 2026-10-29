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
  SCENARIOS
} from "../js/data.js";
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

const EXPECTED_MODULES = [
  "index.html",
  "styles.css",
  "sw.js",
  "manifest.webmanifest",
  "icon.svg",
  ".nojekyll",
  "js/app.js",
  "js/data.js",
  "js/icons.js",
  "js/srs.js",
  "js/speech.js",
  "js/store.js",
  "js/ui.js",
  "js/utils.js",
  "js/views/dashboard.js",
  "js/views/daily.js",
  "js/views/phrases.js",
  "js/views/recall.js",
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

check("14 kategori dengan ID unik dan deskripsi lengkap", () => {
  assert.equal(CATEGORIES.length, 14);
  assert.equal(new Set(CATEGORIES.map(category => category.id)).size, 14);
  for (const category of CATEGORIES) {
    nonEmpty(category.label, `label kategori ${category.id}`);
    nonEmpty(category.short, `short kategori ${category.id}`);
    nonEmpty(category.description, `deskripsi kategori ${category.id}`);
    assert.ok(CATEGORY_BY_ID[category.id], `Kategori tidak terdaftar: ${category.id}`);
  }
});

check("minimal 60 frasa dengan ID dan terjemahan unik", () => {
  assert.ok(PHRASES.length >= 60, `Baru ada ${PHRASES.length} frasa`);
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

check("30 frasa wajib tersedia persis", () => {
  const available = new Set(PHRASES.map(phrase => phrase.en));
  const missing = REQUIRED_PHRASES.filter(phrase => !available.has(phrase));
  assert.deepEqual(missing, []);
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

check("minimal 10 skenario dengan satu jawaban benar per langkah", () => {
  assert.ok(SCENARIOS.length >= 10, `Baru ada ${SCENARIOS.length} skenario`);
  assert.equal(new Set(SCENARIOS.map(scenario => scenario.id)).size, SCENARIOS.length);
  for (const scenario of SCENARIOS) {
    nonEmpty(scenario.id, "ID skenario");
    nonEmpty(scenario.title, `judul ${scenario.id}`);
    nonEmpty(scenario.intro, `intro ${scenario.id}`);
    nonEmpty(scenario.level, `level ${scenario.id}`);
    assert.ok(Array.isArray(scenario.steps) && scenario.steps.length >= 2, scenario.id);
    for (const [index, step] of scenario.steps.entries()) {
      nonEmpty(step.engineer?.en, `${scenario.id} langkah ${index + 1} engineer`);
      nonEmpty(step.engineer?.idText, `${scenario.id} langkah ${index + 1} terjemahan`);
      nonEmpty(step.explanation, `${scenario.id} langkah ${index + 1} penjelasan`);
      assert.ok(Array.isArray(step.options) && step.options.length >= 2, scenario.id);
      assert.equal(
        step.options.filter(option => option.correct).length,
        1,
        `${scenario.id} langkah ${index + 1} harus punya tepat satu jawaban benar`
      );
      for (const option of step.options) {
        nonEmpty(option.en, `${scenario.id} pilihan jawaban`);
      }
    }
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
  console.log(`Konten: ${PHRASES.length} frasa · ${CATEGORIES.length} kategori · ${SCENARIOS.length} skenario · ${REQUIRED_PHRASES.length} frasa wajib.\n`);
}
