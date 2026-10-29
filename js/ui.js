/* Komponen UI kecil yang dipakai lintas halaman. */

import { icon } from "./icons.js";
import { esc } from "./utils.js";

let toastTimer = null;

export function toast(message, tone = "default", duration = 3200) {
  const element = document.getElementById("toast");
  if (!element) return;
  element.textContent = message;
  element.className = `toast is-visible tone-${tone}`;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    element.className = "toast";
  }, duration);
}

/**
 * Dialog konfirmasi berbasis <dialog> dengan fallback window.confirm.
 * @returns {Promise<boolean>}
 */
export function confirmDialog({
  title = "Konfirmasi",
  message = "",
  confirmLabel = "Lanjutkan",
  cancelLabel = "Batal",
  tone = "danger",
  iconName = "alert"
} = {}) {
  const dialog = document.getElementById("app-dialog");
  if (!dialog) {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }

  if (typeof dialog.showModal !== "function") {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }

  if (dialog.open) dialog.close("cancel");

  const titleEl = document.getElementById("dialog-title");
  const messageEl = document.getElementById("dialog-message");
  const confirmEl = document.getElementById("dialog-confirm");
  const cancelEl = document.getElementById("dialog-cancel");
  const iconEl = document.getElementById("dialog-icon");

  if (titleEl) titleEl.textContent = title;
  if (messageEl) messageEl.textContent = message;
  if (confirmEl) {
    confirmEl.textContent = confirmLabel;
    confirmEl.className = `btn ${tone === "danger" ? "btn-danger" : "btn-primary"}`;
    confirmEl.value = "confirm";
  }
  if (cancelEl) cancelEl.textContent = cancelLabel;
  if (iconEl) iconEl.innerHTML = icon(iconName, 24);

  dialog.returnValue = "";
  return new Promise(resolve => {
    const handleClose = () => {
      dialog.removeEventListener("close", handleClose);
      resolve(dialog.returnValue === "confirm");
    };
    dialog.addEventListener("close", handleClose);
    dialog.showModal();
    if (cancelEl) cancelEl.focus();
  });
}

export function initDialogBackdrop() {
  const dialog = document.getElementById("app-dialog");
  if (!dialog) return;
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close("cancel");
  });
}

export function progressBarHTML(percent, label, extraClass = "") {
  const safe = Math.max(0, Math.min(100, Math.round(percent)));
  return `
    <div class="progress ${extraClass}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${safe}" aria-label="${esc(label)}">
      <span class="progress-fill" style="width:${safe}%"></span>
    </div>
  `;
}

export function statCardHTML({ iconName, label, value, hint, tone = "navy", small = false }) {
  return `
    <article class="stat-card ${small ? "stat-card--small" : ""}">
      <span class="stat-icon stat-icon--${tone}">${icon(iconName, 20)}</span>
      <div class="stat-copy">
        <span class="stat-value">${value}</span>
        <span class="stat-label">${label}</span>
        ${hint ? `<span class="stat-hint">${hint}</span>` : ""}
      </div>
    </article>
  `;
}

export function emptyStateHTML({ iconName = "info", title, message, action = "" }) {
  return `
    <div class="empty-state">
      <span class="empty-icon">${icon(iconName, 28)}</span>
      <h3>${esc(title)}</h3>
      <p>${esc(message)}</p>
      ${action}
    </div>
  `;
}
