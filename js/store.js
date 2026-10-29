/*
 * Satu sumber kebenaran untuk progres belajar.
 *
 * Semua data disimpan lokal di browser. Skema diberi versi dan setiap data
 * yang dibaca divalidasi ulang; data rusak tidak boleh membuat aplikasi blank.
 */

import { PHRASES, PHRASE_BY_ID } from "./data.js";
import { isDue, isMastered, schedulePhrase } from "./srs.js";
import {
  addDays,
  clamp,
  dateKey,
  parseDateKey,
  startOfDay
} from "./utils.js";

export const STORAGE_KEY = "service-english.progress.v1";
const BACKUP_PREFIX = "service-english.progress.backup.";
export const SCHEMA_VERSION = 1;
const HISTORY_LIMIT = 600;
const DAILY_LIMIT = 120;
const VALID_RATINGS = new Set(["again", "hard", "good"]);
const DEFAULT_SETTINGS = Object.freeze({
  dailyTarget: 5,
  rate: 0.9,
  voiceURI: ""
});

let state;
let storageAvailable = true;
let loadNotice = null;

function canUseStorage() {
  try {
    const probe = "__service_english_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function createEmptyState() {
  return {
    version: SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    settings: { ...DEFAULT_SETTINGS },
    phrases: {},
    daily: {},
    history: []
  };
}

function validIso(value) {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function sanitizeRecord(raw) {
  if (!raw || typeof raw !== "object") return null;
  const record = {};
  const seenAt = validIso(raw.seenAt);
  const learnedAt = validIso(raw.learnedAt);
  const lastReviewedAt = validIso(raw.lastReviewedAt);

  if (seenAt) record.seenAt = seenAt;
  if (learnedAt) {
    record.learnedAt = learnedAt;
    record.seenAt = record.seenAt || learnedAt;
  }
  if (lastReviewedAt) record.lastReviewedAt = lastReviewedAt;

  let dueAt = validIso(raw.dueAt);
  if (record.learnedAt && !dueAt) {
    dueAt = startOfDay(addDays(new Date(record.learnedAt), 1)).toISOString();
  }
  if (dueAt) record.dueAt = dueAt;

  if (Number.isFinite(Number(raw.intervalDays))) {
    record.intervalDays = clamp(Math.round(Number(raw.intervalDays)), 0, 365);
  } else if (record.learnedAt) {
    record.intervalDays = 1;
  }

  if (Number.isFinite(Number(raw.successStreak))) {
    record.successStreak = clamp(Math.round(Number(raw.successStreak)), 0, 99);
  }
  if (Number.isFinite(Number(raw.lapses))) {
    record.lapses = clamp(Math.round(Number(raw.lapses)), 0, 999);
  }
  if (Number.isFinite(Number(raw.reviewCount))) {
    record.reviewCount = clamp(Math.round(Number(raw.reviewCount)), 0, 9999);
  }
  if (VALID_RATINGS.has(raw.lastRating)) record.lastRating = raw.lastRating;

  return Object.keys(record).length ? record : null;
}

function sanitizeDaily(raw) {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.ids)) return null;
  const ids = [...new Set(raw.ids)]
    .filter(id => typeof id === "string" && PHRASE_BY_ID[id])
    .slice(0, 5);
  if (!ids.length) return null;
  return {
    ids,
    createdAt: validIso(raw.createdAt) || new Date().toISOString(),
    completedAt: validIso(raw.completedAt)
  };
}

function sanitizeState(raw) {
  const clean = createEmptyState();
  if (!raw || typeof raw !== "object") return clean;

  const settings = raw.settings && typeof raw.settings === "object" ? raw.settings : {};
  clean.settings.dailyTarget = clamp(
    Math.round(Number(settings.dailyTarget) || DEFAULT_SETTINGS.dailyTarget),
    3,
    5
  );
  const rate = Number(settings.rate);
  clean.settings.rate = Number.isFinite(rate)
    ? clamp(Math.round(rate * 20) / 20, 0.6, 1.3)
    : DEFAULT_SETTINGS.rate;
  clean.settings.voiceURI = typeof settings.voiceURI === "string"
    ? settings.voiceURI.slice(0, 300)
    : "";

  if (raw.phrases && typeof raw.phrases === "object") {
    for (const [id, value] of Object.entries(raw.phrases)) {
      if (!PHRASE_BY_ID[id]) continue;
      const record = sanitizeRecord(value);
      if (record) clean.phrases[id] = record;
    }
  }

  if (raw.daily && typeof raw.daily === "object") {
    const entries = Object.entries(raw.daily)
      .filter(([key]) => /^\d{4}-\d{2}-\d{2}$/.test(key) && parseDateKey(key))
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, DAILY_LIMIT);
    for (const [key, value] of entries) {
      const plan = sanitizeDaily(value);
      if (plan) clean.daily[key] = plan;
    }
  }

  if (Array.isArray(raw.history)) {
    clean.history = raw.history
      .filter(entry => (
        entry &&
        typeof entry === "object" &&
        PHRASE_BY_ID[entry.phraseId] &&
        VALID_RATINGS.has(entry.rating) &&
        validIso(entry.at)
      ))
      .slice(0, HISTORY_LIMIT)
      .map(entry => ({
        phraseId: entry.phraseId,
        rating: entry.rating,
        at: validIso(entry.at),
        dueAt: validIso(entry.dueAt),
        intervalDays: Number.isFinite(Number(entry.intervalDays))
          ? clamp(Math.round(Number(entry.intervalDays)), 0, 365)
          : null
      }));
  }

  clean.createdAt = validIso(raw.createdAt) || clean.createdAt;
  return clean;
}

function backupRaw(raw) {
  if (!raw) return;
  try {
    window.localStorage.setItem(`${BACKUP_PREFIX}${Date.now()}`, raw.slice(0, 200_000));
  } catch {
    // Backup adalah upaya terbaik; kegagalan tidak boleh menghalangi aplikasi.
  }
}

function loadState() {
  storageAvailable = canUseStorage();
  const fallback = createEmptyState();
  if (!storageAvailable) {
    loadNotice = {
      type: "storage",
      message: "Progres tidak dapat disimpan di browser ini. Data hanya bertahan selama halaman terbuka."
    };
    return fallback;
  }

  let raw = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const clean = sanitizeState(parsed);
    if (parsed.version !== SCHEMA_VERSION) {
      // Skema lama tetap diselamatkan sebisa mungkin; versi baru ditulis saat save.
      clean.version = SCHEMA_VERSION;
    }
    return clean;
  } catch (error) {
    console.warn("Data progres tidak dapat dibaca. Data lama dicadangkan.", error);
    backupRaw(raw);
    loadNotice = {
      type: "corrupt",
      message: "Data belajar lama tidak dapat dibaca. Aplikasi dimulai dengan progres baru; data lama sudah dicadangkan di browser ini."
    };
    return fallback;
  }
}

function pruneDaily() {
  const keys = Object.keys(state.daily).sort((a, b) => b.localeCompare(a));
  for (const key of keys.slice(DAILY_LIMIT)) delete state.daily[key];
}

function currentPlanCompletion(plan, now = new Date()) {
  if (!plan || !plan.ids.length) return false;
  return plan.ids.every(id => Boolean(state.phrases[id]?.learnedAt));
}

function syncDailyCompletion(now = new Date()) {
  const key = dateKey(now);
  const plan = state.daily[key];
  if (!plan || plan.completedAt) return false;
  if (!currentPlanCompletion(plan, now)) return false;
  plan.completedAt = now.toISOString();
  return true;
}

function notifyChange() {
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    window.dispatchEvent(new CustomEvent("progress:changed"));
  }
}

function save() {
  state.version = SCHEMA_VERSION;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageAvailable = true;
  } catch (error) {
    console.warn("Progres tidak dapat disimpan.", error);
    storageAvailable = false;
  }
  notifyChange();
}

function ensureRecord(id) {
  if (!PHRASE_BY_ID[id]) return null;
  if (!state.phrases[id]) state.phrases[id] = {};
  return state.phrases[id];
}

function reconcileCompletion() {
  if (syncDailyCompletion()) save();
}

// Inisialisasi modul.
state = loadState();
reconcileCompletion();

/* ── Pembacaan state ───────────────────────────────────────────────────── */

export function getState() {
  return state;
}

export function getSettings() {
  return { ...state.settings };
}

export function getStorageStatus() {
  return {
    available: storageAvailable,
    key: STORAGE_KEY,
    bytes: (() => {
      try {
        return new Blob([JSON.stringify(state)]).size;
      } catch {
        return 0;
      }
    })()
  };
}

export function consumeLoadNotice() {
  const notice = loadNotice;
  loadNotice = null;
  return notice;
}

export function getPhraseRecord(id) {
  return state.phrases[id] || null;
}

export function getPhraseStatus(id) {
  const record = state.phrases[id];
  if (!record) return { key: "new", label: "Baru", tone: "neutral" };
  if (isDue(record)) return { key: "due", label: "Jatuh tempo", tone: "warning" };
  if (isMastered(record)) return { key: "mastered", label: "Dikuasai", tone: "success" };
  if (record.learnedAt) return { key: "learned", label: "Dipelajari", tone: "info" };
  if (record.seenAt) return { key: "seen", label: "Sudah dilihat", tone: "neutral" };
  return { key: "new", label: "Baru", tone: "neutral" };
}

export function getStats(now = new Date()) {
  const records = Object.entries(state.phrases);
  const seen = records.filter(([, record]) => record.seenAt || record.learnedAt).length;
  const learned = records.filter(([, record]) => record.learnedAt).length;
  const due = records.filter(([, record]) => isDue(record, now)).length;
  const mastered = records.filter(([, record]) => isMastered(record)).length;
  const today = state.daily[dateKey(now)];
  const planTotal = today?.ids.length || 0;
  const planLearned = today
    ? today.ids.filter(id => Boolean(state.phrases[id]?.learnedAt)).length
    : 0;

  return {
    total: PHRASES.length,
    seen,
    learned,
    due,
    mastered,
    planTotal,
    planLearned,
    planComplete: Boolean(today?.completedAt),
    streak: getStreak(now),
    reviewCount: state.history.length,
    masteredPercent: Math.round((mastered / PHRASES.length) * 100)
  };
}

export function getStreak(now = new Date()) {
  const activeDays = new Set();
  for (const entry of state.history) {
    const key = dateKey(entry.at);
    if (key) activeDays.add(key);
  }
  for (const record of Object.values(state.phrases)) {
    if (record.learnedAt) activeDays.add(dateKey(record.learnedAt));
  }
  for (const [key, plan] of Object.entries(state.daily)) {
    if (plan.completedAt) activeDays.add(key);
  }

  let cursor = startOfDay(now);
  if (!activeDays.has(dateKey(cursor))) {
    cursor = addDays(cursor, -1);
    if (!activeDays.has(dateKey(cursor))) return 0;
  }

  let streak = 0;
  while (activeDays.has(dateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function getDuePhrases(now = new Date()) {
  return Object.entries(state.phrases)
    .filter(([, record]) => isDue(record, now))
    .map(([id, record]) => ({ phrase: PHRASE_BY_ID[id], record }))
    .filter(item => item.phrase)
    .sort((a, b) => new Date(a.record.dueAt) - new Date(b.record.dueAt));
}

export function getReviewHistory(limit = 12) {
  return state.history.slice(0, limit).map(entry => ({
    ...entry,
    phrase: PHRASE_BY_ID[entry.phraseId] || null
  }));
}

/** Aktivitas unik per hari selama N hari terakhir, untuk grafik progres. */
export function getActivity(days = 14, now = new Date()) {
  const end = startOfDay(now);
  const buckets = [];
  const index = new Map();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = addDays(end, -offset);
    const key = dateKey(date);
    const bucket = {
      key,
      date,
      label: new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(date),
      count: 0,
      phraseIds: new Set()
    };
    buckets.push(bucket);
    index.set(key, bucket);
  }

  for (const entry of state.history) {
    const bucket = index.get(dateKey(entry.at));
    if (bucket) bucket.phraseIds.add(entry.phraseId);
  }
  for (const [id, record] of Object.entries(state.phrases)) {
    if (!record.learnedAt) continue;
    const bucket = index.get(dateKey(record.learnedAt));
    if (bucket) bucket.phraseIds.add(id);
  }

  return buckets.map(bucket => ({
    key: bucket.key,
    label: bucket.label,
    count: bucket.phraseIds.size,
    date: bucket.date
  }));
}

/* ── Sesi harian ───────────────────────────────────────────────────────── */

/**
 * Ambil rencana hari ini. Jika belum ada, pilih frasa yang belum dipelajari:
 * frasa yang pernah dilihat tetapi belum ditandai didahulukan, lalu frasa baru.
 * Maksimal 5 (mengikuti target 3–5 di pengaturan).
 */
export function getDailyPlan(now = new Date()) {
  const key = dateKey(now);
  let plan = state.daily[key];
  if (plan) return plan;

  const target = clamp(state.settings.dailyTarget, 3, 5);
  const seen = [];
  const fresh = [];
  for (const phrase of PHRASES) {
    const record = state.phrases[phrase.id];
    if (record?.learnedAt) continue;
    if (record?.seenAt) seen.push({ id: phrase.id, seenAt: record.seenAt });
    else fresh.push(phrase.id);
  }
  seen.sort((a, b) => new Date(a.seenAt) - new Date(b.seenAt));
  const ids = [...seen.map(item => item.id), ...fresh].slice(0, target);
  if (!ids.length) return null;

  plan = {
    ids,
    createdAt: now.toISOString(),
    completedAt: null
  };
  state.daily[key] = plan;
  pruneDaily();
  save();
  return plan;
}

export function getPlanPhrases(plan) {
  if (!plan) return [];
  return plan.ids.map(id => PHRASE_BY_ID[id]).filter(Boolean);
}

export function getPlanProgress(plan) {
  if (!plan) return { learned: 0, total: 0, complete: false, percent: 0 };
  const learned = plan.ids.filter(id => Boolean(state.phrases[id]?.learnedAt)).length;
  const total = plan.ids.length;
  return {
    learned,
    total,
    complete: Boolean(plan.completedAt) || (total > 0 && learned === total),
    percent: total ? Math.round((learned / total) * 100) : 0
  };
}

/* ── Mutasi progres ────────────────────────────────────────────────────── */

export function markSeen(id) {
  const record = ensureRecord(id);
  if (!record || record.seenAt) return false;
  // Frasa yang hanya dilihat tidak dijadwalkan untuk review, tetapi tetap
  // dicatat agar statistik "ditemui" dihitung dari data yang sebenarnya.
  record.seenAt = new Date().toISOString();
  save();
  return true;
}

export function learnPhrase(id, now = new Date()) {
  const record = ensureRecord(id);
  if (!record) return false;
  if (record.learnedAt) {
    syncDailyCompletion(now) && save();
    return false;
  }
  const seenAt = now.toISOString();
  record.seenAt = record.seenAt || seenAt;
  record.learnedAt = seenAt;
  record.lastReviewedAt = seenAt;
  record.intervalDays = 1;
  record.successStreak = 0;
  record.reviewCount = record.reviewCount || 0;
  record.dueAt = startOfDay(addDays(now, 1)).toISOString();
  syncDailyCompletion(now);
  save();
  return true;
}

export function ratePhrase(id, rating, now = new Date()) {
  if (!PHRASE_BY_ID[id] || !VALID_RATINGS.has(rating)) {
    throw new Error("Rating frasa tidak valid.");
  }
  const record = ensureRecord(id);
  const scheduled = schedulePhrase(record, rating, now);
  const at = now.toISOString();

  record.seenAt = record.seenAt || at;
  record.learnedAt = record.learnedAt || at;
  Object.assign(record, scheduled);
  record.reviewCount = (Number(record.reviewCount) || 0) + 1;

  state.history.unshift({
    phraseId: id,
    rating,
    at,
    dueAt: scheduled.dueAt,
    intervalDays: scheduled.intervalDays
  });
  state.history = state.history.slice(0, HISTORY_LIMIT);
  syncDailyCompletion(now);
  save();

  return { record: { ...record }, scheduled };
}

export function updateSettings(partial) {
  if (!partial || typeof partial !== "object") return getSettings();
  if (partial.dailyTarget !== undefined) {
    state.settings.dailyTarget = clamp(Math.round(Number(partial.dailyTarget) || 5), 3, 5);
  }
  if (partial.rate !== undefined) {
    state.settings.rate = clamp(Math.round(Number(partial.rate) * 20) / 20, 0.6, 1.3);
  }
  if (partial.voiceURI !== undefined) {
    state.settings.voiceURI = String(partial.voiceURI || "").slice(0, 300);
  }
  save();
  return getSettings();
}

export function resetProgress({ keepSettings = true, now = new Date() } = {}) {
  const settings = keepSettings ? { ...state.settings } : { ...DEFAULT_SETTINGS };
  const fresh = createEmptyState();
  fresh.settings = settings;
  fresh.createdAt = now.toISOString();
  state = fresh;
  save();
  return getStats(now);
}
