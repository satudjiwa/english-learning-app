/* Helper kecil yang dipakai bersama oleh store, jadwal review, dan tampilan. */

export function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Escape teks Inggris lalu tandai placeholder detail seperti [time] dan [name]
 * agar mudah terlihat saat pengguna mengganti isinya.
 */
export function englishHTML(value) {
  return esc(value).replace(/\[(time|name)\]/gi, match => (
    `<mark class="placeholder">${match}</mark>`
  ));
}

/** Normalisasi pencarian: abaikan huruf besar, tanda kutip, dan tanda baca. */
export function normalizeSearch(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’‘`´]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function pad(number) {
  return String(number).padStart(2, "0");
}

export function dateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function startOfDay(value = new Date()) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(value, days) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date;
}

export function parseDateKey(key) {
  const [year, month, day] = String(key).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function formatDateID(value = new Date(), options = {}) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options
  }).format(date);
}

export function formatDateTimeID(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function formatTodayID(value = new Date()) {
  return formatDateID(value, { weekday: "long" });
}

/** Label jadwal review relatif terhadap hari ini. */
export function relativeDueLabel(dueAt, now = new Date()) {
  if (!dueAt) return "Belum dijadwalkan";
  const due = new Date(dueAt);
  if (Number.isNaN(due.getTime())) return "Belum dijadwalkan";
  const diff = Math.round((startOfDay(due) - startOfDay(now)) / 86_400_000);
  if (diff <= 0) return "Jatuh tempo";
  if (diff === 1) return "Besok";
  if (diff === 2) return "Lusa";
  return `${diff} hari lagi`;
}

export function pluralID(count, word, plural = `${word}-${word}`) {
  return `${count} ${count === 1 ? word : plural}`;
}

export function clamp(number, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, number));
}

export function percent(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export function getGreetingID(now = new Date()) {
  const hour = now.getHours();
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 19) return "Selamat sore";
  return "Selamat malam";
}
