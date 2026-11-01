const LESSON_ID = /^M[1-6]-L\d{2}$/;

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
      throw error;
    });
    lessonPromises.set(lessonId, promise);
  }
  return lessonPromises.get(lessonId);
}

export function moduleLessons(module, index) {
  const available = new Map((index || []).map(entry => [entry.id, entry]));
  return Array.from({ length: module.lessonCount }, (_, offset) => {
    const number = offset + 1;
    const id = `${module.id}-L${String(number).padStart(2, "0")}`;
    return {
      id,
      number,
      available: available.has(id),
      title: available.get(id)?.title || `Lesson ${number}`
    };
  });
}

export function moduleProgress(module, index, completedLessons) {
  const lessons = moduleLessons(module, index);
  const available = lessons.filter(lesson => lesson.available);
  const completed = available.filter(lesson => completedLessons.includes(lesson.id));
  return {
    lessons,
    availableCount: available.length,
    completedCount: completed.length,
    percent: module.lessonCount
      ? Math.round((completed.length / module.lessonCount) * 100)
      : 0
  };
}
