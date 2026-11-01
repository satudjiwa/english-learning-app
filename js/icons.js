const paths = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
  library: '<path d="M4 4h5v16H4z"/><path d="M9 4h5v16H9z"/><path d="m14 5 4.8-1 2.2 15-5 1z"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a2 2 0 0 1 2 2v16a3 3 0 0 0-3-3H4z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v18a3 3 0 0 1 3-3h4z"/>',
  play: '<path d="m8 5 11 7-11 7z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  "rotate-ccw": '<path d="M3 4v6h6"/><path d="M3.5 10a9 9 0 1 1 2.2 9.3"/>',
  restart: '<path d="M3 4v6h6"/><path d="M3.5 10a9 9 0 1 1 2.2 9.3"/>',
  expand: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
  minimize: '<path d="M3 8h5V3M21 8h-5V3M3 16h5v5M21 16h-5v5"/>',
  volume: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>',
  "volume-off": '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/>',
  "chevron-left": '<path d="m15 18-6-6 6-6"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  "arrow-right": '<path d="M4 12h16M14 6l6 6-6 6"/>',
  "arrow-left": '<path d="M20 12H4M10 6l-6 6 6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  "check-circle": '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.7 2.7L16.5 9"/>',
  headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4zM20 14h-2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2z"/>',
  mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  "skip-back": '<path d="M19 20 9 12l10-8z"/><path d="M5 19V5"/>',
  "skip-forward": '<path d="M5 4l10 8-10 8z"/><path d="M19 5v14"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-4v-.09A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15a1.7 1.7 0 0 0-1.55-1H3v-4h.09A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1-1.55V3h4v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9a1.7 1.7 0 0 0 1.55 1H21v4h-.09a1.7 1.7 0 0 0-1.55 1z"/>',
  "text-size": '<path d="M4 7V5h10v2M9 5v14M6 19h6"/><path d="M15 13v-1.5h6V13M18 11.5V19M16 19h4"/>',
  "line-height": '<path d="M5 4v16M2.5 7 5 4.5 7.5 7M2.5 17 5 19.5 7.5 17"/><path d="M11 6h10M11 12h10M11 18h10"/>',
  gauge: '<path d="M4.9 19a9 9 0 1 1 14.2 0"/><path d="m12 12 4-4"/><circle cx="12" cy="12" r="1"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  "eye-off": '<path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A11 11 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3.2M6.6 6.6C3.7 8.3 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4.1-.9"/>',
  alert: '<path d="M12 3 2.5 20h19z"/><path d="M12 9v5M12 17h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.8 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.7 7.5-9.5V6z"/><path d="m8.5 12 2.5 2.5 4.5-4.5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  "maximize-2": '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
  "external-link": '<path d="M14 3h7v7M10 14 21 3M21 14v7H3V3h7"/>',
  "file-text": '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6M9 8h2"/>',
  "message-square": '<path d="M4 4h16v12H8l-4 4z"/>',
  "circle-help": '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.3M12 17h.01"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>'
};

export function icon(name, size = 20, className = "") {
  const body = paths[name] || paths["circle-help"];
  const classes = className ? ` class="${className}"` : "";
  return `<svg${classes} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}
