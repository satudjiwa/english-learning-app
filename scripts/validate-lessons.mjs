import { statSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const LESSON_ID = /^M[1-6]-L\d{2}$/;
const MODULE_ID = /^M[1-6]$/;
const AUDIO_PATH = /^public\/audio\/M([1-6])\/(M[1-6]-L\d{2})\/(sentence-(\d{2})|full)\.mp3$/;
const LEVEL_RANGES = new Map([
  ["Beginner", [12, 16]],
  ["Beginner–Elementary", [12, 18]],
  ["Elementary", [12, 18]],
  ["Elementary–Intermediate", [14, 20]],
  ["Intermediate", [14, 20]]
]);

const errors = [];
const files = [];

function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

function present(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function audioFileExists(relativePath) {
  try {
    return statSync(path.join(ROOT, relativePath)).isFile();
  } catch {
    return false;
  }
}

function normalizeLevel(value) {
  return String(value || "").replace(/\s*[-–]\s*/g, "–");
}

async function readJSON(relativePath) {
  try {
    return JSON.parse(await readFile(path.join(ROOT, relativePath), "utf8"));
  } catch (error) {
    fail(relativePath, `cannot be read as JSON (${error.message})`);
    return null;
  }
}

console.log("Small Steps English — lesson validation");
console.log("");

const modules = await readJSON("data/modules.json");
const index = await readJSON("data/lessons/index.json");
const lessonDir = path.join(ROOT, "data/lessons");
let dirEntries = [];

try {
  dirEntries = await readdir(lessonDir, { withFileTypes: true });
} catch (error) {
  fail("data/lessons", `cannot be read (${error.message})`);
}

const lessonFiles = dirEntries
  .filter(entry => entry.isFile() && entry.name.endsWith(".json") && entry.name !== "index.json")
  .map(entry => entry.name)
  .sort();

const moduleIds = new Set();

if (Array.isArray(modules)) {
  if (modules.length !== 6) {
    fail("data/modules.json", `expected 6 modules, found ${modules.length}`);
  }

  modules.forEach((module, position) => {
    const file = "data/modules.json";
    if (!module || typeof module !== "object") {
      fail(file, `module at position ${position + 1} is not an object`);
      return;
    }
    if (!MODULE_ID.test(String(module.id || ""))) {
      fail(file, `module ${position + 1} has an invalid id: ${JSON.stringify(module.id)}`);
    } else if (moduleIds.has(module.id)) {
      fail(file, `duplicate module id: ${module.id}`);
    } else {
      moduleIds.add(module.id);
    }
    if (module.number !== position + 1) {
      fail(file, `${module.id || `module ${position + 1}`} number should be ${position + 1}`);
    }
    if (!present(module.title)) fail(file, `${module.id}: title is missing`);
    if (!present(module.level)) fail(file, `${module.id}: level is missing`);
    if (!present(module.description)) fail(file, `${module.id}: description is missing`);
    if (module.lessonCount !== 5) {
      fail(file, `${module.id}: lessonCount should be 5, found ${module.lessonCount}`);
    }
  });
  console.log(`  OK  data/modules.json — ${modules.length} modules`);
} else {
  fail("data/modules.json", "must contain an array");
}

const indexIds = new Set();

if (Array.isArray(index)) {
  index.forEach((entry, position) => {
    const file = "data/lessons/index.json";
    if (!entry || typeof entry !== "object") {
      fail(file, `entry at position ${position + 1} is not an object`);
      return;
    }
    if (!LESSON_ID.test(String(entry.id || ""))) {
      fail(file, `entry ${position + 1} has an invalid lesson id: ${JSON.stringify(entry.id)}`);
    } else if (indexIds.has(entry.id)) {
      fail(file, `duplicate lesson id: ${entry.id}`);
    } else {
      indexIds.add(entry.id);
    }
    if (!present(entry.title)) fail(file, `${entry.id}: title is missing`);
    if (!present(entry.difficulty)) fail(file, `${entry.id}: difficulty is missing`);
    if (!MODULE_ID.test(String(entry.moduleId || ""))) {
      fail(file, `${entry.id}: invalid moduleId ${JSON.stringify(entry.moduleId)}`);
    } else if (!moduleIds.has(entry.moduleId)) {
      fail(file, `${entry.id}: moduleId ${entry.moduleId} does not exist in modules.json`);
    } else if (!String(entry.id).startsWith(`${entry.moduleId}-`)) {
      fail(file, `${entry.id}: moduleId ${entry.moduleId} does not match the lesson id`);
    }
  });
  console.log(`  OK  data/lessons/index.json — ${index.length} available lesson${index.length === 1 ? "" : "s"}`);
} else {
  fail("data/lessons/index.json", "must contain an array");
}

const allIds = new Set();
const lessonsById = new Map();
const indexedIds = new Set((Array.isArray(index) ? index : []).map(entry => entry?.id).filter(Boolean));

for (const filename of lessonFiles) {
  const relativePath = `data/lessons/${filename}`;
  const lesson = await readJSON(relativePath);
  if (!lesson || typeof lesson !== "object") continue;

  const fileId = filename.replace(/\.json$/, "");
  if (!LESSON_ID.test(String(lesson.id || ""))) {
    fail(relativePath, `invalid lesson id: ${JSON.stringify(lesson.id)}`);
  }
  if (lesson.id !== fileId) {
    fail(relativePath, `lesson id ${JSON.stringify(lesson.id)} does not match the filename`);
  }
  if (allIds.has(lesson.id)) {
    fail(relativePath, `duplicate lesson id: ${lesson.id}`);
  }
  allIds.add(lesson.id);
  lessonsById.set(lesson.id, { lesson, relativePath });

  if (!indexedIds.has(lesson.id)) {
    fail(relativePath, `lesson ${lesson.id} is not listed in data/lessons/index.json`);
  }

  if (!MODULE_ID.test(String(lesson.moduleId || ""))) {
    fail(relativePath, `invalid moduleId: ${JSON.stringify(lesson.moduleId)}`);
  } else if (!moduleIds.has(lesson.moduleId)) {
    fail(relativePath, `moduleId ${lesson.moduleId} does not exist in modules.json`);
  } else if (!String(lesson.id).startsWith(`${lesson.moduleId}-`)) {
    fail(relativePath, `moduleId ${lesson.moduleId} does not match lesson id ${lesson.id}`);
  }

  for (const field of ["title", "difficulty", "situation", "objective"]) {
    if (!present(lesson[field])) fail(relativePath, `${field} is missing`);
  }

  const level = normalizeLevel(lesson.difficulty);
  const range = LEVEL_RANGES.get(level);
  if (!range) {
    fail(relativePath, `unknown difficulty level: ${JSON.stringify(lesson.difficulty)}`);
  }

  const dialogue = lesson.dialogue;
  if (!Array.isArray(dialogue) || dialogue.length === 0) {
    fail(relativePath, "dialogue must be a non-empty array");
  } else {
    if (range && (dialogue.length < range[0] || dialogue.length > range[1])) {
      fail(relativePath, `${dialogue.length} dialogue lines is outside the ${level} range ${range[0]}–${range[1]}`);
    }

    dialogue.forEach((line, lineIndex) => {
      const position = `dialogue[${lineIndex}]`;
      if (!line || typeof line !== "object") {
        fail(relativePath, `${position} is not an object`);
        return;
      }
      for (const field of ["speaker", "english", "indonesian"]) {
        if (!present(line[field])) fail(relativePath, `${position}.${field} is missing`);
      }

      if (line.audio !== undefined && line.audio !== null && line.audio !== "") {
        const match = AUDIO_PATH.exec(String(line.audio));
        if (!match) {
          fail(relativePath, `${position}.audio has an invalid path: ${JSON.stringify(line.audio)}`);
        } else {
          const [, moduleNumber, audioLessonId, , sentenceNumber] = match;
          if (lesson.moduleId && moduleNumber !== String(lesson.moduleId).slice(1)) {
            fail(relativePath, `${position}.audio is in M${moduleNumber}, not ${lesson.moduleId}`);
          }
          if (audioLessonId !== lesson.id) {
            fail(relativePath, `${position}.audio points to ${audioLessonId}, not ${lesson.id}`);
          }
          if (!sentenceNumber) {
            fail(relativePath, `${position}.audio must use a sentence file, not full.mp3`);
          } else if (Number(sentenceNumber) !== lineIndex + 1) {
            fail(relativePath, `${position}.audio should use sentence-${String(lineIndex + 1).padStart(2, "0")}.mp3`);
          }
          if (!audioFileExists(line.audio)) {
            fail(relativePath, `${position}.audio points to a missing file: ${line.audio}`);
          }
        }
      }
    });
  }

  if (lesson.fullAudio !== undefined && lesson.fullAudio !== null && lesson.fullAudio !== "") {
    const match = AUDIO_PATH.exec(String(lesson.fullAudio));
    if (!match || !match[0].endsWith("/full.mp3")) {
      fail(relativePath, `fullAudio has an invalid path: ${JSON.stringify(lesson.fullAudio)}`);
    } else {
      const [, moduleNumber, audioLessonId] = match;
      if (lesson.moduleId && moduleNumber !== String(lesson.moduleId).slice(1)) {
        fail(relativePath, `fullAudio is in M${moduleNumber}, not ${lesson.moduleId}`);
      }
      if (audioLessonId !== lesson.id) {
        fail(relativePath, `fullAudio points to ${audioLessonId}, not ${lesson.id}`);
      }
      if (!audioFileExists(lesson.fullAudio)) {
        fail(relativePath, `fullAudio points to a missing file: ${lesson.fullAudio}`);
      }
    }
  }

  for (const field of ["keyExpressions", "sentencePatterns", "learningNotes"]) {
    if (!Array.isArray(lesson[field]) || lesson[field].length === 0) {
      fail(relativePath, `${field} must be a non-empty array`);
    }
  }

  if (!Array.isArray(lesson.pronunciationNotes) ||
      lesson.pronunciationNotes.length < 1 ||
      lesson.pronunciationNotes.length > 2) {
    fail(relativePath, "pronunciationNotes must contain 1–2 notes");
  }

  if (errors.length === 0 || !errors.some(message => message.startsWith(relativePath))) {
    const count = Array.isArray(dialogue) ? dialogue.length : 0;
    const rangeLabel = range ? `${range[0]}–${range[1]}` : "unknown";
    console.log(`  OK  ${lesson.id || fileId} — ${count} sentences (${level}, allowed ${rangeLabel}), audio paths valid`);
    files.push({ id: lesson.id, count });
  }
}

for (const entry of Array.isArray(index) ? index : []) {
  if (entry?.id && !allIds.has(entry.id)) {
    fail("data/lessons/index.json", `${entry.id} is listed but data/lessons/${entry.id}.json does not exist`);
    continue;
  }
  const match = entry?.id ? lessonsById.get(entry.id) : null;
  if (!match) continue;
  if (entry.title !== match.lesson.title) {
    fail("data/lessons/index.json", `${entry.id} title does not match the lesson file`);
  }
  if (normalizeLevel(entry.difficulty) !== normalizeLevel(match.lesson.difficulty)) {
    fail("data/lessons/index.json", `${entry.id} difficulty does not match the lesson file`);
  }
  if (entry.moduleId !== match.lesson.moduleId) {
    fail("data/lessons/index.json", `${entry.id} moduleId does not match the lesson file`);
  }
}

console.log("");

if (errors.length > 0) {
  console.error(`Validation failed with ${errors.length} error${errors.length === 1 ? "" : "s"}:`);
  errors.forEach(error => console.error(`  FAIL ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validation passed: ${files.length} lesson${files.length === 1 ? "" : "s"}, ${moduleIds.size} modules, ${indexIds.size} available lesson${indexIds.size === 1 ? "" : "s"}.`);
}
