/*
 * Penjadwalan review sederhana.
 *
 * Belum ingat : ulangi di sesi yang sama (queue) dan tetap jatuh tempo.
 * Agak ingat  : besok.
 * Sudah ingat : 3 hari, lalu 7, 15, 34, 60 hari (maksimal 60 hari).
 *
 * "Dikuasai" bukan sekadar pernah tampil: butuh 4 recall sukses berturut-turut
 * dan interval minimal 14 hari.
 */

import { addDays, startOfDay } from "./utils.js";

export const RATING_META = {
  again: {
    label: "Belum Ingat",
    short: "Belum ingat",
    description: "Ulangi lagi di sesi ini.",
    tone: "danger"
  },
  hard: {
    label: "Agak Ingat",
    short: "Agak ingat",
    description: "Dijadwalkan ulang besok.",
    tone: "warning"
  },
  good: {
    label: "Sudah Ingat",
    short: "Sudah ingat",
    description: "Jarak review akan bertambah.",
    tone: "success"
  }
};

export const MASTERY_STREAK = 4;
export const MASTERY_MIN_INTERVAL = 14;
export const MAX_INTERVAL_DAYS = 60;

export function isDue(record, now = new Date()) {
  if (!record || !record.learnedAt || !record.dueAt) return false;
  const due = new Date(record.dueAt);
  return !Number.isNaN(due.getTime()) && due.getTime() <= now.getTime();
}

export function isMastered(record) {
  return Boolean(
    record &&
    record.learnedAt &&
    Number(record.successStreak) >= MASTERY_STREAK &&
    Number(record.intervalDays) >= MASTERY_MIN_INTERVAL
  );
}

/**
 * Mengembalikan field jadwal baru tanpa mengubah record asli.
 * @param {object} record record lama (boleh kosong)
 * @param {"again"|"hard"|"good"} rating
 * @param {Date} now
 */
export function schedulePhrase(record = {}, rating, now = new Date()) {
  const previousStreak = Number(record.successStreak) || 0;
  const previousLapses = Number(record.lapses) || 0;
  let intervalDays;
  let successStreak;
  let lapses = previousLapses;
  let dueAt;

  if (rating === "again") {
    intervalDays = 0;
    successStreak = 0;
    lapses += 1;
    // Tetap "jatuh tempo" agar konsisten setelah halaman dimuat ulang.
    dueAt = now.toISOString();
  } else if (rating === "hard") {
    intervalDays = 1;
    successStreak = 0;
    dueAt = startOfDay(addDays(now, 1)).toISOString();
  } else if (rating === "good") {
    successStreak = previousStreak + 1;
    if (successStreak === 1) {
      intervalDays = 3;
    } else {
      const base = Math.max(Number(record.intervalDays) || 3, 3);
      intervalDays = Math.min(MAX_INTERVAL_DAYS, Math.round(base * 2.2));
    }
    dueAt = startOfDay(addDays(now, intervalDays)).toISOString();
  } else {
    throw new Error(`Rating tidak dikenal: ${rating}`);
  }

  return {
    intervalDays,
    successStreak,
    lapses,
    dueAt,
    lastReviewedAt: now.toISOString(),
    lastRating: rating
  };
}
