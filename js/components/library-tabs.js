import { esc } from "../utils.js";

export function libraryTabs(tracks, activeTrackId) {
  return `
    <nav class="library-switch" aria-label="Library tracks">
      ${(Array.isArray(tracks) ? tracks : []).map(track => `
        <a
          href="${esc(track.route || "#/modules")}"
          class="library-switch-link"
          ${track.id === activeTrackId ? 'aria-current="page"' : ""}
        >${esc(track.label || track.id)}</a>
      `).join("")}
    </nav>
  `;
}
