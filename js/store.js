const STORAGE_KEY = "small-steps-english.v3";
const LEGACY_STORAGE_KEYS = ["small-steps-english.v2"];
const LESSON_ID = /^[A-Z]{2,5}-P\d{2}$/;
const SHADOWING_SPEEDS = [0.75, 0.85, 1];

const DEFAULT_PREFERENCES = {
  teleprompter: {
    speed: 4,
    fontSize: 24,
    lineSpacing: 1.5,
    showIndonesian: true
  },
  shadowing: {
    speed: 1,
    showIndonesian: true
  }
};

function clamp(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function defaultState() {
  return {
    version: 3,
    lastLessonId: null,
    completedLessons: [],
    preferences: {
      teleprompter: { ...DEFAULT_PREFERENCES.teleprompter },
      shadowing: { ...DEFAULT_PREFERENCES.shadowing }
    }
  };
}

function canUseStorage() {
  if (typeof window === "undefined") return false;
  try {
    const storage = window.localStorage;
    const probe = "__small_steps_probe__";
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

const storageAvailable = canUseStorage();

function sanitize(raw) {
  const clean = defaultState();
  if (!raw || typeof raw !== "object") return clean;

  // Lessons saved by an older curriculum (for example M1-L01) no longer
  // exist. They are dropped here instead of crashing a view that cannot
  // resolve them.
  if (typeof raw.lastLessonId === "string" && LESSON_ID.test(raw.lastLessonId)) {
    clean.lastLessonId = raw.lastLessonId;
  }

  if (Array.isArray(raw.completedLessons)) {
    clean.completedLessons = [...new Set(raw.completedLessons)]
      .filter(id => typeof id === "string" && LESSON_ID.test(id));
  }

  const teleprompter = raw.preferences?.teleprompter;
  if (teleprompter && typeof teleprompter === "object") {
    clean.preferences.teleprompter = {
      speed: clamp(teleprompter.speed, 1, 10, DEFAULT_PREFERENCES.teleprompter.speed),
      fontSize: clamp(teleprompter.fontSize, 18, 36, DEFAULT_PREFERENCES.teleprompter.fontSize),
      lineSpacing: clamp(teleprompter.lineSpacing, 1.2, 2.2, DEFAULT_PREFERENCES.teleprompter.lineSpacing),
      showIndonesian: teleprompter.showIndonesian !== false
    };
  }

  const shadowing = raw.preferences?.shadowing;
  if (shadowing && typeof shadowing === "object") {
    const requestedSpeed = Number(shadowing.speed);
    clean.preferences.shadowing = {
      speed: SHADOWING_SPEEDS.includes(requestedSpeed)
        ? requestedSpeed
        : DEFAULT_PREFERENCES.shadowing.speed,
      showIndonesian: shadowing.showIndonesian !== false
    };
  }

  return clean;
}

function readState() {
  if (!storageAvailable) return defaultState();
  try {
    // v3 is the verb curriculum. A v2 payload belongs to the retired
    // service-engineer curriculum, so only its preferences are carried over.
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return sanitize(JSON.parse(raw));

    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const legacy = window.localStorage.getItem(legacyKey);
      if (!legacy) continue;
      const carried = sanitize(JSON.parse(legacy));
      const clean = defaultState();
      clean.preferences = carried.preferences;
      return clean;
    }

    return defaultState();
  } catch (error) {
    console.warn("Small Steps English: progress could not be read.", error);
    return defaultState();
  }
}

let state = readState();

function save() {
  if (!storageAvailable) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.warn("Small Steps English: progress could not be saved.", error);
    return false;
  }
}

export function retainKnownLessons(knownIds) {
  if (!Array.isArray(knownIds)) return false;

  const known = new Set(
    knownIds.filter(id => typeof id === "string" && LESSON_ID.test(id))
  );
  let changed = false;

  if (state.lastLessonId && !known.has(state.lastLessonId)) {
    state.lastLessonId = null;
    changed = true;
  }

  const completed = state.completedLessons.filter(id => known.has(id));
  if (completed.length !== state.completedLessons.length) {
    state.completedLessons = completed;
    changed = true;
  }

  if (changed) save();
  return changed;
}

export function isStorageAvailable() {
  return storageAvailable;
}

export function getLastLessonId() {
  return state.lastLessonId;
}

export function setLastLesson(id) {
  if (!LESSON_ID.test(String(id || ""))) return false;
  if (state.lastLessonId === id) return true;
  state.lastLessonId = id;
  save();
  return true;
}

export function getCompletedLessons() {
  return [...state.completedLessons];
}

export function isLessonComplete(id) {
  return state.completedLessons.includes(id);
}

export function toggleLessonComplete(id) {
  if (!LESSON_ID.test(String(id || ""))) return false;
  const index = state.completedLessons.indexOf(id);
  if (index >= 0) {
    state.completedLessons.splice(index, 1);
    save();
    return false;
  }
  state.completedLessons.push(id);
  save();
  return true;
}

export function markPracticeStarted(id) {
  if (!LESSON_ID.test(String(id || ""))) return false;
  try {
    window.sessionStorage.setItem(`small-steps-practice:${id}`, "1");
    return true;
  } catch {
    return false;
  }
}

export function hasPracticeStarted(id) {
  if (!LESSON_ID.test(String(id || ""))) return false;
  try {
    return window.sessionStorage.getItem(`small-steps-practice:${id}`) === "1";
  } catch {
    return false;
  }
}

export function getPreferences(mode) {
  if (mode === "teleprompter" || mode === "shadowing") {
    return { ...state.preferences[mode] };
  }
  return {
    teleprompter: { ...state.preferences.teleprompter },
    shadowing: { ...state.preferences.shadowing }
  };
}

export function updatePreferences(mode, patch) {
  if (mode !== "teleprompter" && mode !== "shadowing") return getPreferences();
  if (!patch || typeof patch !== "object") return getPreferences(mode);

  if (mode === "teleprompter") {
    const current = state.preferences.teleprompter;
    if ("speed" in patch) current.speed = clamp(patch.speed, 1, 10, current.speed);
    if ("fontSize" in patch) current.fontSize = clamp(patch.fontSize, 18, 36, current.fontSize);
    if ("lineSpacing" in patch) current.lineSpacing = clamp(patch.lineSpacing, 1.2, 2.2, current.lineSpacing);
    if ("showIndonesian" in patch) current.showIndonesian = Boolean(patch.showIndonesian);
  } else {
    const current = state.preferences.shadowing;
    if ("speed" in patch) {
      const next = Number(patch.speed);
      if (SHADOWING_SPEEDS.includes(next)) current.speed = next;
    }
    if ("showIndonesian" in patch) current.showIndonesian = Boolean(patch.showIndonesian);
  }

  save();
  return getPreferences(mode);
}
