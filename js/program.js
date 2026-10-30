/*
 * Progres program dihitung dari catatan learnedAt yang sudah tersimpan.
 * Tidak ada kunci penyimpanan baru, sehingga progres lama tetap terbaca.
 */

import {
  PROGRAM_DAYS,
  PROGRAM_DAY_BY_NUMBER,
  PROGRAM_TOTAL_DAYS,
  PROGRAM_TOTAL_PHRASES
} from "./curriculum.js";
import { getPhraseRecord } from "./store.js";

export function isValidProgramDay(value) {
  const day = Number(value);
  return Number.isInteger(day) && Boolean(PROGRAM_DAY_BY_NUMBER[day]);
}

export function getProgramDay(number) {
  return PROGRAM_DAY_BY_NUMBER[Number(number)] || null;
}

export function getDayProgress(dayOrNumber) {
  const day = typeof dayOrNumber === "object"
    ? dayOrNumber
    : PROGRAM_DAY_BY_NUMBER[Number(dayOrNumber)];
  if (!day) {
    return { learned: 0, total: 0, complete: false, percent: 0, learnedIds: [] };
  }

  const learnedIds = day.items
    .map(item => item.id)
    .filter(id => Boolean(getPhraseRecord(id)?.learnedAt));
  const total = day.items.length;

  return {
    learned: learnedIds.length,
    total,
    complete: total > 0 && learnedIds.length === total,
    percent: total ? Math.round((learnedIds.length / total) * 100) : 0,
    learnedIds
  };
}

export function getProgramProgress() {
  const days = PROGRAM_DAYS.map(day => ({
    day: day.day,
    phase: day.phase,
    title: day.title,
    goal: day.goal,
    progress: getDayProgress(day)
  }));

  const learnedPhrases = days.reduce((total, day) => total + day.progress.learned, 0);
  const completeDays = days.filter(day => day.progress.complete).length;
  const current = days.find(day => !day.progress.complete) || days[days.length - 1];
  const currentIndex = days.findIndex(day => day.day === current.day);
  const next = days[currentIndex + 1] || null;

  return {
    days,
    completeDays,
    totalDays: PROGRAM_TOTAL_DAYS,
    learnedPhrases,
    totalPhrases: PROGRAM_TOTAL_PHRASES,
    percentPhrases: PROGRAM_TOTAL_PHRASES
      ? Math.round((learnedPhrases / PROGRAM_TOTAL_PHRASES) * 100)
      : 0,
    percentDays: PROGRAM_TOTAL_DAYS
      ? Math.round((completeDays / PROGRAM_TOTAL_DAYS) * 100)
      : 0,
    allComplete: completeDays === PROGRAM_TOTAL_DAYS,
    currentDay: current.day,
    nextDay: next?.day || null,
    currentProgress: current.progress
  };
}

export function getRecommendedProgramDay() {
  const current = PROGRAM_DAYS.find(day => !getDayProgress(day).complete);
  return (current || PROGRAM_DAYS[PROGRAM_DAYS.length - 1]).day;
}

export function getNextProgramDay(number) {
  const day = Number(number);
  return PROGRAM_DAY_BY_NUMBER[day + 1]?.day || null;
}

export function getPreviousProgramDay(number) {
  const day = Number(number);
  return PROGRAM_DAY_BY_NUMBER[day - 1]?.day || null;
}

export function getNextIncompleteInDay(dayNumber, fromIndex = -1) {
  const day = PROGRAM_DAY_BY_NUMBER[Number(dayNumber)];
  if (!day) return -1;
  return day.items.findIndex((item, index) => (
    index > fromIndex && !getPhraseRecord(item.id)?.learnedAt
  ));
}

export function getFirstIncompleteInDay(dayNumber) {
  return getNextIncompleteInDay(dayNumber, -1);
}
