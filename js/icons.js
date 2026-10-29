/*
 * Icon set sederhana bergaya garis 24px. Semua ikon memakai currentColor agar
 * otomatis mengikuti tema, dan aria-hidden karena teks label selalu disediakan
 * di tombol atau elemen induknya.
 */

const PATHS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6.5h5V21"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 4.5v17M8 7h8M8 11h6"/>',
  brain: '<path d="M9.5 4.5a3 3 0 0 0-5.3 2A3.2 3.2 0 0 0 3 12a3.3 3.3 0 0 0 2.4 5.5A3 3 0 0 0 9.5 20V4.5Z"/><path d="M14.5 4.5a3 3 0 0 1 5.3 2A3.2 3.2 0 0 1 21 12a3.3 3.3 0 0 1-2.4 5.5A3 3 0 0 1 14.5 20V4.5Z"/><path d="M9.5 9H7M14.5 9H17M9.5 14H7M14.5 14H17"/>',
  headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/><path d="M19 20a3 3 0 0 1-3 2h-2"/>',
  headset: '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2.5" y="12.5" width="4" height="7" rx="2"/><rect x="17.5" y="12.5" width="4" height="7" rx="2"/><path d="M20 19.5A3.5 3.5 0 0 1 16.5 23H14"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20v-1.5A5.5 5.5 0 0 1 8.5 13h1A5.5 5.5 0 0 1 15 18.5V20"/><path d="M16 5.2A3 3 0 0 1 16 11M17 13.5a5 5 0 0 1 4 4.9V20"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  settings: '<path d="M4 6h7M15 6h5M4 12h3M11 12h9M4 18h9M17 18h3"/><circle cx="13" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="18" r="2"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  play: '<path d="M8 5.5v13l10-6.5-10-6.5Z"/>',
  volume: '<path d="M11 5 6.5 8.5H3v7h3.5L11 19V5Z"/><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a8 8 0 0 1 0 11"/>',
  'volume-off': '<path d="M11 5 6.5 8.5H3v7h3.5L11 19V5Z"/><path d="m16 9 5 6M21 9l-5 6"/>',
  'slow-down': '<path d="M4 17a8 8 0 1 1 16 0"/><path d="m12 14 3-3"/><path d="M8 21h8"/>',
  eye: '<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/>',
  'eye-off': '<path d="m3 3 18 18"/><path d="M10.6 6.2A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a15 15 0 0 1-3.2 3.7M6.2 6.7C3.8 8.4 2.5 12 2.5 12s3.5 6 9.5 6a9.7 9.7 0 0 0 4.2-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  translate: '<path d="M4 5h9M8.5 3v2M6 5c.5 4 3.5 7.5 7 9"/><path d="M4 14c2.5-2 5-5 6-9"/><path d="m13 21 4-10 4 10M14.5 17h5"/>',
  check: '<path d="m4 12.5 5 5L20 6.5"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.7 2.7L16.5 9"/>',
  'check-square': '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7.5 12 3 3 6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4.5 4.5"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  'arrow-right': '<path d="M4 12h16M14 6l6 6-6 6"/>',
  'arrow-left': '<path d="M20 12H4M10 6l-6 6 6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
  'chevron-left': '<path d="m15 5-7 7 7 7"/>',
  'chevron-right': '<path d="m9 5 7 7-7 7"/>',
  flame: '<path d="M12 22c4 0 7-2.8 7-6.5 0-2.6-1.4-4.7-3.4-6.4.1 1.8-.7 3.1-2 3.7.3-3.3-1-6.4-3.6-8.8.2 2.7-1.2 4.2-2.6 5.9A7.4 7.4 0 0 0 5 15.5C5 19.2 8 22 12 22Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  refresh: '<path d="M20 7v5h-5"/><path d="M4.5 17A8 8 0 0 0 19 14M4 12a8 8 0 0 1 13.6-5.7L20 8"/>',
  rotate: '<path d="M20 7v5h-5"/><path d="M19.2 14a8 8 0 1 1-2-8.4L20 8"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  alert: '<path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  message: '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 9.3 9.3 0 0 1-3.5-.7L4 21l1.6-4.3A8.2 8.2 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/>',
  sparkles: '<path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Z"/><path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  wrench: '<path d="M14.5 6.5a4.5 4.5 0 0 0-5.9 5.9L3 18l3 3 5.6-5.6a4.5 4.5 0 0 0 5.9-5.9l-2.8 2.8-3-3 2.8-2.8Z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.1"/>',
  radio: '<circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7"/><path d="M5.6 5.6a9 9 0 0 0 0 12.8M18.4 18.4a9 9 0 0 0 0-12.8"/>',
  zap: '<path d="M13 2 4.5 13H11l-1 9L19.5 10H13l0-8Z"/>',
  monitor: '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  list: '<path d="M9 6h12M9 12h12M9 18h12"/><path d="M4 5.5h1.5v1.5H4zM4 11.5h1.5V13H4zM4 17.5h1.5V19H4z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.4 2.4 0 0 1 4.7.7c0 1.7-2.4 2-2.4 3.8M12 17h.01"/>',
  activity: '<path d="M2.5 12h4l2.5-6 4 12 2.5-6h6"/>',
  'phone-off': '<path d="M8 5 5.2 7.8a3 3 0 0 0-.6 3.3A19 19 0 0 0 12.9 19a3 3 0 0 0 3.3-.6L19 15.6l-4-2.5-2 2a15 15 0 0 1-4.1-4.1l2-2L8.4 5Z"/><path d="m3 3 18 18"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  shield: '<path d="M12 2.5 20 6v6c0 5-3.4 8.2-8 9.5-4.6-1.3-8-4.5-8-9.5V6l8-3.5Z"/><path d="m8.5 12 2.3 2.3 4.7-4.8"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  'trend-up': '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  'rotate-ccw': '<path d="M4 7v5h5"/><path d="M4.8 14a8 8 0 1 0 2-8.4L4 8"/>'
};

export function icon(name, size = 20, className = "") {
  const path = PATHS[name] || PATHS.info;
  return `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
}
