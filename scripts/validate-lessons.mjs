import { statSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const MODULE_ID = /^[A-Z]{2,5}$/;
const VERB_LESSON_ID = /^[A-Z]{2,5}-P\d{2}$/;
const PATTERN_LESSON_ID = /^PAT-D\d{2}$/;
const EXPRESSION_LESSON_ID = /^EXP-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;
const TRACK_ID = /^[a-z][a-z0-9-]*$/;
const GROUP_ID = /^[a-z][a-z0-9-]*$/;
const AUDIO_PATH = /^public\/audio\/([A-Z]+)\/([A-Z0-9-]+)\/(sentence-(\d{2})|full)\.mp3$/;

const TYPE_LIMITS = {
  verb: { min: 3, max: 8, label: "verb part" },
  pattern: { min: 10, max: 10, label: "pattern" },
  expression: { min: 5, max: 8, label: "expression" },
  dialogue: { min: 12, max: 16, label: "dialogue" }
};

const PARTS_PER_MODULE = 5;

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

async function readJSON(relativePath) {
  try {
    return JSON.parse(await readFile(path.join(ROOT, relativePath), "utf8"));
  } catch (error) {
    fail(relativePath, `cannot be read as JSON (${error.message})`);
    return null;
  }
}

function lessonTrack(id) {
  const value = String(id || "");
  if (PATTERN_LESSON_ID.test(value)) return "patterns";
  if (EXPRESSION_LESSON_ID.test(value)) return "expressions";
  if (VERB_LESSON_ID.test(value)) return "verbs";
  return null;
}

function limitsFor(type) {
  return TYPE_LIMITS[type] || TYPE_LIMITS.verb;
}

function audioFolderForTrack(track) {
  if (track === "patterns") return "PATTERNS";
  if (track === "expressions") return "EXPRESSIONS";
  return null;
}

console.log("Small Steps English — lesson validation");
console.log("");

const modules = await readJSON("data/modules.json");
const tracks = await readJSON("data/tracks.json");
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
const declaredParts = new Set();
const declaredPartMeta = new Map();

if (Array.isArray(modules)) {
  if (modules.length === 0) {
    fail("data/modules.json", "must declare at least one module");
  }

  modules.forEach((module, position) => {
    const file = "data/modules.json";
    if (!module || typeof module !== "object") {
      fail(file, `module at position ${position + 1} is not an object`);
      return;
    }
    if (!MODULE_ID.test(String(module.id || ""))) {
      fail(file, `module ${position + 1} has an invalid id: ${JSON.stringify(module.id)}`);
      return;
    }
    if (moduleIds.has(module.id)) {
      fail(file, `duplicate module id: ${module.id}`);
      return;
    }
    moduleIds.add(module.id);

    if (module.number !== position + 1) {
      fail(file, `${module.id} number should be ${position + 1}`);
    }
    if (!present(module.verb)) fail(file, `${module.id}: verb is missing`);
    if (!present(module.title)) fail(file, `${module.id}: title is missing`);
    if (!present(module.subtitle)) fail(file, `${module.id}: subtitle is missing`);
    if (!present(module.level)) fail(file, `${module.id}: level is missing`);
    if (!present(module.description)) fail(file, `${module.id}: description is missing`);
    if (present(module.verb) && module.title && !module.title.startsWith(String(module.verb))) {
      fail(file, `${module.id}: title should start with the verb ${module.verb}`);
    }

    if (!Array.isArray(module.parts) || module.parts.length !== PARTS_PER_MODULE) {
      fail(file, `${module.id}: parts should contain ${PARTS_PER_MODULE} entries`);
      return;
    }

    module.parts.forEach((part, partIndex) => {
      const expectedId = `${module.id}-P${String(partIndex + 1).padStart(2, "0")}`;
      if (!part || typeof part !== "object") {
        fail(file, `${module.id}: parts[${partIndex}] is not an object`);
        return;
      }
      if (part.number !== partIndex + 1) {
        fail(file, `${expectedId}: number should be ${partIndex + 1}`);
      }
      if (part.id !== expectedId) {
        fail(file, `${module.id}: parts[${partIndex}] id should be ${expectedId}, found ${JSON.stringify(part.id)}`);
      } else if (declaredParts.has(part.id)) {
        fail(file, `duplicate part id: ${part.id}`);
      } else {
        declaredParts.add(part.id);
        declaredPartMeta.set(part.id, { moduleId: module.id, title: part.title });
      }
      if (!present(part.title)) fail(file, `${expectedId}: title is missing`);
    });
  });
  console.log(`  OK  data/modules.json — ${modules.length} modules, ${declaredParts.size} planned parts`);
} else {
  fail("data/modules.json", "must contain an array");
}

const trackIds = new Set();
const unitCatalog = new Map();
const groupIds = new Set();
const duplicateReferences = [];
const patternNumbers = [];
let patternUnitCount = 0;
let expressionUnitCount = 0;

if (Array.isArray(tracks)) {
  if (tracks.length === 0) {
    fail("data/tracks.json", "must declare at least one track");
  }

  tracks.forEach((track, position) => {
    const file = "data/tracks.json";
    if (!track || typeof track !== "object") {
      fail(file, `track at position ${position + 1} is not an object`);
      return;
    }
    if (!TRACK_ID.test(String(track.id || ""))) {
      fail(file, `track ${position + 1} has an invalid id: ${JSON.stringify(track.id)}`);
      return;
    }
    if (trackIds.has(track.id)) {
      fail(file, `duplicate track id: ${track.id}`);
      return;
    }
    trackIds.add(track.id);

    if (!present(track.label)) fail(file, `${track.id}: label is missing`);
    if (!present(track.route) || !String(track.route).startsWith("#/")) {
      fail(file, `${track.id}: route must start with #/`);
    }
    if (track.kind !== "modules" && track.kind !== "unit-groups") {
      fail(file, `${track.id}: kind must be "modules" or "unit-groups"`);
      return;
    }

    if (track.kind === "modules") {
      if (track.id !== "verbs") {
        fail(file, `${track.id}: only the verbs track may use kind "modules"`);
      }
      if (track.groups !== undefined) {
        fail(file, `${track.id}: a modules track cannot declare groups`);
      }
      return;
    }

    if (track.id === "verbs") {
      fail(file, "verbs must use kind \"modules\"");
      return;
    }

    if (!Array.isArray(track.groups) || track.groups.length === 0) {
      fail(file, `${track.id}: groups must be a non-empty array`);
      return;
    }

    track.groups.forEach((group, groupIndex) => {
      const groupPosition = `${track.id}.groups[${groupIndex}]`;
      if (!group || typeof group !== "object") {
        fail(file, `${groupPosition} is not an object`);
        return;
      }
      if (!GROUP_ID.test(String(group.id || ""))) {
        fail(file, `${groupPosition} has an invalid id: ${JSON.stringify(group.id)}`);
        return;
      }
      if (groupIds.has(group.id)) {
        fail(file, `duplicate group id: ${group.id}`);
      } else {
        groupIds.add(group.id);
      }
      if (!present(group.code)) fail(file, `${groupPosition}: code is missing`);
      if (!present(group.title)) fail(file, `${groupPosition}: title is missing`);
      if (!present(group.description)) fail(file, `${groupPosition}: description is missing`);
      if (!Object.hasOwn(TYPE_LIMITS, group.type) || group.type === "verb") {
        fail(file, `${groupPosition}: type must be pattern, expression, or dialogue`);
        return;
      }
      if (!Array.isArray(group.units) || group.units.length === 0) {
        fail(file, `${groupPosition}: units must be a non-empty array`);
        return;
      }

      group.units.forEach((unit, unitIndex) => {
        const unitPosition = `${groupPosition}.units[${unitIndex}]`;
        if (!unit || typeof unit !== "object") {
          fail(file, `${unitPosition} is not an object`);
          return;
        }

        const idTrack = lessonTrack(unit.id);
        if (!present(unit.id) || !idTrack) {
          fail(file, `${unitPosition}: invalid unit id ${JSON.stringify(unit.id)}`);
          return;
        }
        if (idTrack !== track.id) {
          fail(file, `${unit.id}: id belongs to ${idTrack}, not ${track.id}`);
        }
        if (unitCatalog.has(unit.id) || declaredParts.has(unit.id)) {
          fail(file, `duplicate unit id: ${unit.id}`);
        } else {
          unitCatalog.set(unit.id, {
            trackId: track.id,
            groupId: group.id,
            groupTitle: group.title,
            type: group.type,
            unit
          });
        }

        if (!present(unit.title)) fail(file, `${unit.id}: title is missing`);
        if (group.type === "pattern") {
          if (!PATTERN_LESSON_ID.test(unit.id)) {
            fail(file, `${unit.id}: pattern units must use PAT-Dnn ids`);
          } else {
            const numeric = Number(String(unit.id).slice(-2));
            if (unit.number !== numeric) {
              fail(file, `${unit.id}: number should be ${numeric}`);
            }
            patternNumbers.push(numeric);
            patternUnitCount += 1;
          }
          if (!unit.titlePending && !present(unit.pattern)) {
            fail(file, `${unit.id}: pattern is missing`);
          }
        }

        if (group.type === "expression") {
          if (!EXPRESSION_LESSON_ID.test(unit.id)) {
            fail(file, `${unit.id}: expression units must use EXP-… ids`);
          } else {
            expressionUnitCount += 1;
          }
          if (!present(unit.expression)) {
            fail(file, `${unit.id}: expression is missing`);
          }
        }

        if (group.type === "dialogue") {
          if (!EXPRESSION_LESSON_ID.test(unit.id)) {
            fail(file, `${unit.id}: dialogue units must use EXP-… ids`);
          } else {
            expressionUnitCount += 1;
          }
          if (!present(unit.scenario)) {
            fail(file, `${unit.id}: scenario is missing`);
          }
        }
      });

      if (Array.isArray(group.coveredInVerbs)) {
        group.coveredInVerbs.forEach((item, itemIndex) => {
          if (!item || typeof item !== "object") {
            fail(file, `${groupPosition}.coveredInVerbs[${itemIndex}] is not an object`);
            return;
          }
          if (!present(item.phrase)) {
            fail(file, `${groupPosition}.coveredInVerbs[${itemIndex}]: phrase is missing`);
          }
          if (!declaredParts.has(item.coveredBy)) {
            fail(file, `${groupPosition}.coveredInVerbs[${itemIndex}]: ${JSON.stringify(item.coveredBy)} is not a declared verb part`);
          }
        });
      }

      if (Array.isArray(group.duplicates)) {
        group.duplicates.forEach((item, itemIndex) => {
          if (!item || typeof item !== "object") {
            fail(file, `${groupPosition}.duplicates[${itemIndex}] is not an object`);
            return;
          }
          if (!present(item.phrase)) {
            fail(file, `${groupPosition}.duplicates[${itemIndex}]: phrase is missing`);
          }
          if (!present(item.includedAs)) {
            fail(file, `${groupPosition}.duplicates[${itemIndex}]: includedAs is missing`);
          } else {
            duplicateReferences.push({
              file,
              position: `${groupPosition}.duplicates[${itemIndex}]`,
              target: item.includedAs
            });
          }
        });
      }
    });
  });

  patternNumbers.sort((a, b) => a - b);
  patternNumbers.forEach((value, index) => {
    if (value !== index + 1) {
      fail("data/tracks.json", `pattern numbering must be contiguous from PAT-D01; found D${String(value).padStart(2, "0")} at position ${index + 1}`);
    }
  });

  for (const reference of duplicateReferences) {
    if (!unitCatalog.has(reference.target)) {
      fail(reference.file, `${reference.position}: target ${reference.target} does not exist`);
    }
  }

  if (!trackIds.has("verbs")) {
    fail("data/tracks.json", "the verbs track is required");
  }
  if (!trackIds.has("patterns")) {
    fail("data/tracks.json", "the patterns track is required");
  }
  if (!trackIds.has("expressions")) {
    fail("data/tracks.json", "the expressions track is required");
  }

  console.log(`  OK  data/tracks.json — ${tracks.length} tracks, ${patternUnitCount} pattern units, ${expressionUnitCount} expression units`);
} else {
  fail("data/tracks.json", "must contain an array");
}

const indexIds = new Set();

if (Array.isArray(index)) {
  index.forEach((entry, position) => {
    const file = "data/lessons/index.json";
    if (!entry || typeof entry !== "object") {
      fail(file, `entry at position ${position + 1} is not an object`);
      return;
    }

    const entryTrack = entry.track || "verbs";
    if (!present(entry.id) || !lessonTrack(entry.id)) {
      fail(file, `entry ${position + 1} has an invalid lesson id: ${JSON.stringify(entry.id)}`);
    } else if (indexIds.has(entry.id)) {
      fail(file, `duplicate lesson id: ${entry.id}`);
    } else {
      indexIds.add(entry.id);
    }
    if (!present(entry.title)) fail(file, `${entry.id}: title is missing`);

    if (!trackIds.has(entryTrack)) {
      fail(file, `${entry.id}: track ${JSON.stringify(entryTrack)} does not exist in tracks.json`);
      return;
    }
    if (lessonTrack(entry.id) !== entryTrack) {
      fail(file, `${entry.id}: id does not match track ${entryTrack}`);
    }

    if (entryTrack === "verbs") {
      if (!MODULE_ID.test(String(entry.moduleId || ""))) {
        fail(file, `${entry.id}: invalid moduleId ${JSON.stringify(entry.moduleId)}`);
      } else if (!moduleIds.has(entry.moduleId)) {
        fail(file, `${entry.id}: moduleId ${entry.moduleId} does not exist in modules.json`);
      } else if (!String(entry.id).startsWith(`${entry.moduleId}-P`)) {
        fail(file, `${entry.id}: moduleId ${entry.moduleId} does not match the lesson id`);
      }
      if (declaredParts.size > 0 && !declaredParts.has(entry.id)) {
        fail(file, `${entry.id} is not declared in the parts list of modules.json`);
      }
      return;
    }

    if (entry.track !== entryTrack) {
      fail(file, `${entry.id}: non-verb entries must declare track ${entryTrack}`);
    }
    const catalog = unitCatalog.get(entry.id);
    if (!catalog) {
      fail(file, `${entry.id} is not declared in data/tracks.json`);
      return;
    }
    if (!present(entry.groupId) || entry.groupId !== catalog.groupId) {
      fail(file, `${entry.id}: groupId should be ${catalog.groupId}`);
    }
    if (entry.type !== catalog.type) {
      fail(file, `${entry.id}: type should be ${catalog.type}`);
    }
  });
  console.log(`  OK  data/lessons/index.json — ${index.length} available unit${index.length === 1 ? "" : "s"}`);
} else {
  fail("data/lessons/index.json", "must contain an array");
}

const allIds = new Set();
const lessonsById = new Map();
const indexedIds = new Set((Array.isArray(index) ? index : []).map(entry => entry?.id).filter(Boolean));
const indexById = new Map((Array.isArray(index) ? index : []).filter(Boolean).map(entry => [entry.id, entry]));

for (const filename of lessonFiles) {
  const relativePath = `data/lessons/${filename}`;
  const lesson = await readJSON(relativePath);
  if (!lesson || typeof lesson !== "object") continue;

  const fileId = filename.replace(/\.json$/, "");
  if (!present(lesson.id) || !lessonTrack(lesson.id)) {
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

  const indexEntry = indexById.get(lesson.id);
  const track = lesson.track || indexEntry?.track || lessonTrack(lesson.id);
  if (!track) {
    fail(relativePath, `cannot determine the track for ${lesson.id}`);
    continue;
  }
  if (lessonTrack(lesson.id) !== track) {
    fail(relativePath, `track ${track} does not match lesson id ${lesson.id}`);
  }

  if (track === "verbs") {
    if (!MODULE_ID.test(String(lesson.moduleId || ""))) {
      fail(relativePath, `invalid moduleId: ${JSON.stringify(lesson.moduleId)}`);
    } else if (!moduleIds.has(lesson.moduleId)) {
      fail(relativePath, `moduleId ${lesson.moduleId} does not exist in modules.json`);
    } else if (!String(lesson.id).startsWith(`${lesson.moduleId}-P`)) {
      fail(relativePath, `moduleId ${lesson.moduleId} does not match lesson id ${lesson.id}`);
    }
  } else {
    const catalog = unitCatalog.get(lesson.id);
    if (!catalog) {
      fail(relativePath, `${lesson.id} is not declared in data/tracks.json`);
      continue;
    }
    if (lesson.track !== track) {
      fail(relativePath, `lesson must declare track ${track}`);
    }
    if (lesson.groupId !== catalog.groupId) {
      fail(relativePath, `groupId should be ${catalog.groupId}`);
    }
    if (lesson.type !== catalog.type) {
      fail(relativePath, `type should be ${catalog.type}`);
    }
    if (catalog.type === "pattern" && !present(lesson.pattern)) {
      fail(relativePath, "pattern is missing");
    }
    if (catalog.type === "expression" && !present(lesson.expression)) {
      fail(relativePath, "expression is missing");
    }
    if (catalog.type === "dialogue" && !present(lesson.scenario)) {
      fail(relativePath, "scenario is missing");
    }
  }

  const requiredFields = ["title", "situation", "objective"];
  if (track === "verbs") requiredFields.push("partTitle");
  for (const field of requiredFields) {
    if (!present(lesson[field])) fail(relativePath, `${field} is missing`);
  }

  const type = track === "verbs" ? "verb" : unitCatalog.get(lesson.id)?.type;
  const limits = limitsFor(type);
  const dialogue = lesson.dialogue;
  if (!Array.isArray(dialogue) || dialogue.length === 0) {
    fail(relativePath, "dialogue must be a non-empty array");
  } else {
    if (dialogue.length < limits.min || dialogue.length > limits.max) {
      fail(relativePath, `${dialogue.length} sentences is outside the allowed range for a ${limits.label} (${limits.min}–${limits.max})`);
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

      if (type === "dialogue" && !["Technician", "Remote Engineer", "Supervisor"].includes(line.speaker)) {
        fail(relativePath, `${position}.speaker must be Technician, Remote Engineer, or Supervisor`);
      }

      if (line.audio !== undefined && line.audio !== null && line.audio !== "") {
        const match = AUDIO_PATH.exec(String(line.audio));
        if (!match) {
          fail(relativePath, `${position}.audio has an invalid path: ${JSON.stringify(line.audio)}`);
        } else {
          const [, folderName, audioLessonId, , sentenceNumber] = match;
          if (track === "verbs") {
            if (lesson.moduleId && folderName !== lesson.moduleId) {
              fail(relativePath, `${position}.audio is in ${folderName}, not ${lesson.moduleId}`);
            }
          } else {
            const expectedFolder = audioFolderForTrack(track);
            if (folderName !== expectedFolder) {
              fail(relativePath, `${position}.audio is in ${folderName}, not ${expectedFolder}`);
            }
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
      const [, folderName, audioLessonId] = match;
      if (track === "verbs") {
        if (lesson.moduleId && folderName !== lesson.moduleId) {
          fail(relativePath, `fullAudio is in ${folderName}, not ${lesson.moduleId}`);
        }
      } else {
        const expectedFolder = audioFolderForTrack(track);
        if (folderName !== expectedFolder) {
          fail(relativePath, `fullAudio is in ${folderName}, not ${expectedFolder}`);
        }
      }
      if (audioLessonId !== lesson.id) {
        fail(relativePath, `fullAudio points to ${audioLessonId}, not ${lesson.id}`);
      }
      if (!audioFileExists(lesson.fullAudio)) {
        fail(relativePath, `fullAudio points to a missing file: ${lesson.fullAudio}`);
      }
    }
  }

  for (const field of ["keyExpressions", "learningNotes"]) {
    if (!Array.isArray(lesson[field]) || lesson[field].length === 0) {
      fail(relativePath, `${field} must be a non-empty array`);
    }
  }

  if (Array.isArray(lesson.keyExpressions)) {
    lesson.keyExpressions.forEach((item, itemIndex) => {
      if (!item || typeof item !== "object") {
        fail(relativePath, `keyExpressions[${itemIndex}] is not an object`);
        return;
      }
      for (const field of ["english", "indonesian"]) {
        if (!present(item[field])) {
          fail(relativePath, `keyExpressions[${itemIndex}].${field} is missing`);
        }
      }
    });
  }

  if (Array.isArray(lesson.learningNotes)) {
    lesson.learningNotes.forEach((note, noteIndex) => {
      if (!present(note)) fail(relativePath, `learningNotes[${noteIndex}] is empty`);
    });
  }

  if (errors.length === 0 || !errors.some(message => message.startsWith(relativePath))) {
    const count = Array.isArray(dialogue) ? dialogue.length : 0;
    console.log(`  OK  ${lesson.id || fileId} — ${count} sentences (${limits.label}, ${limits.min}–${limits.max}), audio paths valid`);
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
  const entryTrack = entry.track || "verbs";
  const lessonTrackId = match.lesson.track || entryTrack;
  if (entryTrack !== lessonTrackId) {
    fail("data/lessons/index.json", `${entry.id} track does not match the lesson file`);
  }

  if (entryTrack === "verbs") {
    if (entry.moduleId !== match.lesson.moduleId) {
      fail("data/lessons/index.json", `${entry.id} moduleId does not match the lesson file`);
    }
  } else {
    if (entry.groupId !== match.lesson.groupId) {
      fail("data/lessons/index.json", `${entry.id} groupId does not match the lesson file`);
    }
    if (entry.type !== match.lesson.type) {
      fail("data/lessons/index.json", `${entry.id} type does not match the lesson file`);
    }
  }
}

console.log("");

if (errors.length > 0) {
  console.error(`Validation failed with ${errors.length} error${errors.length === 1 ? "" : "s"}:`);
  errors.forEach(error => console.error(`  FAIL ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Validation passed: ${files.length} available unit${files.length === 1 ? "" : "s"}, ${moduleIds.size} verb modules, ${patternUnitCount} patterns, ${expressionUnitCount} expressions, ${indexIds.size} available.`);
}
