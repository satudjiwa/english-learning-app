const MODULE_ID = /^[A-Z]{2,5}$/;
const LESSON_ID = /^[A-Z]{2,5}-P\d{2}$/;

let modulesPromise = null;
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

export function isLessonId(value) {
  return LESSON_ID.test(String(value || ""));
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

export function loadLessonIndex() {
  if (!lessonIndexPromise) {
    lessonIndexPromise = fetchJSON("lessons/index.json").catch(error => {
      lessonIndexPromise = null;
      throw error;
    });
  }
  return lessonIndexPromise;
}

export function loadLesson(id) {
  const lessonId = String(id || "");
  if (!LESSON_ID.test(lessonId)) {
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
