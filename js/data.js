import { retainKnownLessons } from "./store.js";

const MODULE_ID = /^[A-Z]{2,5}$/;
const VERB_LESSON_ID = /^[A-Z]{2,5}-P\d{2}$/;
const PATTERN_LESSON_ID = /^PAT-D\d{2}$/;
const EXPRESSION_LESSON_ID = /^EXP-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

let modulesPromise = null;
let tracksPromise = null;
let lessonIndexPromise = null;
const lessonPromises = new Map();

function dataURL(path) {
  return new URL(`../data/${path}`, import.meta.url);
}

async function fetchJSON(path) {
  const response = await fetch(dataURL(path), { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Could not load ${path} (${response.status})`);
  }
  return response.json();
}

export function lessonTrackId(value) {
  const id = String(value || "");
  if (PATTERN_LESSON_ID.test(id)) return "patterns";
  if (EXPRESSION_LESSON_ID.test(id)) return "expressions";
  if (VERB_LESSON_ID.test(id)) return "verbs";
  return null;
}

export function isLessonId(value) {
  return lessonTrackId(value) !== null;
}

export function isModuleId(value) {
  return MODULE_ID.test(String(value || ""));
}

export function loadModules() {
  if (!modulesPromise) {
    modulesPromise = fetchJSON("modules.json").catch(error => {
      modulesPromise = null;
      throw error;
    });
  }
  return modulesPromise;
}

export function loadTracks() {
  if (!tracksPromise) {
    tracksPromise = fetchJSON("tracks.json").catch(error => {
      tracksPromise = null;
      throw error;
    });
  }
  return tracksPromise;
}

export function trackById(tracks, trackId) {
  return (Array.isArray(tracks) ? tracks : []).find(track => track.id === trackId) || null;
}

export function trackForLessonId(tracks, id) {
  return trackById(tracks, lessonTrackId(id));
}

export function findTrackUnit(track, id) {
  for (const group of track?.groups || []) {
    const unit = (group.units || []).find(item => item.id === id);
    if (unit) return { group, unit };
  }
  return null;
}

export function trackUnitIds(track) {
  return (track?.groups || []).flatMap(group => (group.units || []).map(unit => unit.id));
}

export function loadLessonIndex() {
  if (!lessonIndexPromise) {
    lessonIndexPromise = fetchJSON("lessons/index.json")
      .then(index => {
        // Progress saved by a removed or renamed part is dropped once the
        // current index is known. Each track only retains ids that are still
        // listed in data/lessons/index.json.
        if (Array.isArray(index)) {
          retainKnownLessons(index.map(entry => entry.id));
        }
        return index;
      })
      .catch(error => {
        lessonIndexPromise = null;
        throw error;
      });
  }
  return lessonIndexPromise;
}

export function loadLesson(id) {
  const lessonId = String(id || "");
  if (!isLessonId(lessonId)) {
    return Promise.reject(new Error("Invalid lesson id."));
  }
  if (!lessonPromises.has(lessonId)) {
    const promise = fetchJSON(`lessons/${lessonId}.json`).catch(error => {
      lessonPromises.delete(lessonId);
      return Promise.reject(error);
    });
    lessonPromises.set(lessonId, promise);
  }
  return lessonPromises.get(lessonId);
}

export function moduleParts(module, index) {
  const available = new Map((index || []).map(entry => [entry.id, entry]));
  const parts = Array.isArray(module.parts) ? module.parts : [];
  return parts.map(part => ({
    id: part.id,
    number: part.number,
    available: available.has(part.id),
    title: available.get(part.id)?.title || part.title || `Part ${part.number}`
  }));
}

export function moduleProgress(module, index, completedLessons) {
  const parts = moduleParts(module, index);
  const available = parts.filter(part => part.available);
  const completed = available.filter(part => completedLessons.includes(part.id));
  return {
    parts,
    availableCount: available.length,
    completedCount: completed.length,
    percent: parts.length
      ? Math.round((completed.length / parts.length) * 100)
      : 0
  };
}

export function unitGroupProgress(group, index, completedLessons) {
  const available = new Set((index || []).map(entry => entry.id));
  const units = Array.isArray(group?.units) ? group.units : [];
  const completed = units.filter(unit => available.has(unit.id) && completedLessons.includes(unit.id));
  return {
    units,
    availableCount: units.filter(unit => available.has(unit.id)).length,
    completedCount: completed.length,
    percent: units.length
      ? Math.round((completed.length / units.length) * 100)
      : 0
  };
}

export function trackProgress(track, index, completedLessons) {
  const groups = Array.isArray(track?.groups) ? track.groups : [];
  const units = groups.flatMap(group => group.units || []);
  const available = new Set((index || []).map(entry => entry.id));
  const completed = units.filter(unit => available.has(unit.id) && completedLessons.includes(unit.id));
  return {
    groups,
    unitCount: units.length,
    availableCount: units.filter(unit => available.has(unit.id)).length,
    completedCount: completed.length,
    percent: units.length
      ? Math.round((completed.length / units.length) * 100)
      : 0
  };
}
