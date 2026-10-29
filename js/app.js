/*
 * Entry point aplikasi.
 * Router berbasis hash agar aman di GitHub Pages tanpa konfigurasi rewrite.
 */

import { icon } from "./icons.js";
import { stopSpeaking } from "./speech.js";
import { consumeLoadNotice, getStats, getStorageStatus } from "./store.js";
import { initDialogBackdrop, toast } from "./ui.js";
import { formatTodayID } from "./utils.js";

import * as dashboard from "./views/dashboard.js";
import * as daily from "./views/daily.js";
import * as phrases from "./views/phrases.js";
import * as recall from "./views/recall.js";
import * as listen from "./views/listen.js";
import * as simulator from "./views/simulator.js";
import * as progress from "./views/progress.js";
import * as settings from "./views/settings.js";
import * as menu from "./views/menu.js";

const VIEWS = {
  home: dashboard,
  daily,
  phrases,
  recall,
  listen,
  simulator,
  progress,
  settings,
  menu
};

const NAV = [
  {
    group: "Belajar",
    items: [
      { route: "home", label: "Beranda", icon: "home" },
      { route: "daily", label: "Latihan Harian", icon: "calendar" },
      { route: "phrases", label: "Bank Frasa", icon: "book" },
      { route: "recall", label: "Latihan Recall", icon: "brain", badge: true },
      { route: "listen", label: "Listen & Speak", icon: "headphones" },
      { route: "simulator", label: "Simulator", icon: "users" }
    ]
  },
  {
    group: "Progres",
    items: [
      { route: "progress", label: "Progres & Review", icon: "chart" },
      { route: "settings", label: "Pengaturan", icon: "settings" }
    ]
  }
];

const MOBILE_NAV = [
  { route: "home", label: "Beranda", icon: "home" },
  { route: "daily", label: "Harian", icon: "calendar" },
  { route: "phrases", label: "Frasa", icon: "book" },
  { route: "recall", label: "Recall", icon: "brain", badge: true },
  { route: "menu", label: "Menu", icon: "menu" }
];

const ctx = {
  ui: {},
  isEntry: true,
  navigate(route) {
    const target = `#/${route}`;
    if (location.hash === target) {
      renderView({ entry: true, focus: true, scrollTop: true });
    } else {
      location.hash = target;
    }
  },
  refresh(options = {}) {
    renderView({
      entry: false,
      focus: Boolean(options.focus),
      scrollTop: Boolean(options.scrollTop)
    });
  }
};

let cleanup = null;
let firstRender = true;

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, "").split("?")[0];
  const parts = raw.split("/").filter(Boolean).map(part => {
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  });
  return {
    name: parts[0] || "home",
    params: { id: parts[1] || "" }
  };
}

function navItemHTML(item) {
  const badge = item.badge
    ? `<span class="nav-badge" data-due-badge hidden>0</span>`
    : "";
  return `
    <a class="nav-link" href="#/${item.route}" data-nav-route="${item.route}">
      <span class="nav-icon">${icon(item.icon, 19)}</span>
      <span class="nav-text">${item.label}</span>
      ${badge}
    </a>
  `;
}

function buildNavigation() {
  const sidebar = document.getElementById("sidebar-nav");
  if (sidebar) {
    sidebar.innerHTML = NAV.map(group => `
      <div class="nav-group">
        <span class="side-label">${group.group}</span>
        ${group.items.map(navItemHTML).join("")}
      </div>
    `).join("");
  }

  const mobile = document.getElementById("mobile-nav");
  if (mobile) {
    mobile.innerHTML = MOBILE_NAV.map(item => {
      const badge = item.badge
        ? `<span class="mobile-badge" data-due-badge hidden>0</span>`
        : "";
      return `
        <a class="mobile-nav-item" href="#/${item.route}" data-nav-route="${item.route}">
          <span class="mobile-nav-icon">${icon(item.icon, 21)}${badge}</span>
          <small>${item.label}</small>
        </a>
      `;
    }).join("");
  }
}

function updateDueBadges() {
  const due = getStats().due;
  document.querySelectorAll("[data-due-badge]").forEach(badge => {
    badge.hidden = due === 0;
    badge.textContent = due > 99 ? "99+" : String(due);
    badge.setAttribute("aria-label", `${due} frasa jatuh tempo`);
  });
}

function updateStorageUI() {
  const storage = getStorageStatus();
  const chip = document.getElementById("storage-chip");
  const warning = document.getElementById("storage-warning");
  if (chip) {
    chip.innerHTML = `${icon(storage.available ? "lock" : "alert", 14)} <span>${storage.available ? "Data lokal" : "Penyimpanan penuh"}</span>`;
    chip.classList.toggle("is-warning", !storage.available);
    chip.title = storage.available
      ? "Progres tersimpan di browser ini"
      : "Browser tidak dapat menyimpan progres";
    chip.setAttribute("aria-label", storage.available
      ? "Data lokal: progres tersimpan di browser ini"
      : "Penyimpanan penuh: progres tidak dapat disimpan");
  }
  if (warning) {
    warning.hidden = storage.available;
  }
}

function updateActiveNav(routeName) {
  const mobileRoutes = new Set(["home", "daily", "phrases", "recall"]);
  const mobileActive = mobileRoutes.has(routeName) ? routeName : "menu";
  document.querySelectorAll("[data-nav-route]").forEach(link => {
    const activeName = link.closest(".mobile-nav") ? mobileActive : routeName;
    const active = link.dataset.navRoute === activeName;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function errorHTML() {
  return `
    <div class="page">
      <div class="empty-state empty-state--large">
        <span class="empty-icon">${icon("alert", 30)}</span>
        <h1>Halaman tidak dapat dimuat</h1>
        <p>Terjadi kesalahan saat menampilkan bagian ini. Coba muat ulang halaman, atau kembali ke beranda.</p>
        <div class="empty-actions">
          <button class="btn btn-primary" type="button" data-reload-app>Muat ulang</button>
          <a class="btn btn-secondary" href="#/home">Kembali ke beranda</a>
        </div>
      </div>
    </div>
  `;
}

function notFoundHTML() {
  return `
    <div class="page">
      <div class="empty-state empty-state--large">
        <span class="empty-icon">${icon("search", 30)}</span>
        <h1>Halaman tidak ditemukan</h1>
        <p>Tautan ini tidak tersedia di aplikasi. Gunakan navigasi untuk membuka modul belajar.</p>
        <div class="empty-actions">
          <a class="btn btn-primary" href="#/home">Kembali ke beranda</a>
          <a class="btn btn-secondary" href="#/phrases">Buka bank frasa</a>
        </div>
      </div>
    </div>
  `;
}

function renderView({ entry = false, focus = false, scrollTop = false } = {}) {
  if (typeof cleanup === "function") {
    try {
      cleanup();
    } catch (error) {
      console.warn("Pembersihan tampilan gagal:", error);
    }
    cleanup = null;
  }
  stopSpeaking();

  const route = parseRoute();
  const view = VIEWS[route.name];
  const isEntry = entry || firstRender;
  const content = document.getElementById("app-content");
  const breadcrumb = document.getElementById("breadcrumb");
  const announcer = document.getElementById("route-announcer");
  if (!content) return;

  ctx.isEntry = isEntry;

  if (view) {
    const pageLabel = route.name === "simulator" && route.params.id
      ? "Simulator"
      : view.navLabel;
    if (breadcrumb) {
      breadcrumb.innerHTML = `Belajar <span>/</span> ${pageLabel}`;
    }
    document.title = route.name === "home"
      ? "English for Service Engineer"
      : `${view.title} · English for Service Engineer`;
    updateActiveNav(route.name);

    try {
      content.innerHTML = view.render(ctx, route.params);
      updateStorageUI();
      const maybeCleanup = view.mount?.(content, ctx, route.params);
      cleanup = typeof maybeCleanup === "function" ? maybeCleanup : null;
    } catch (error) {
      console.error("Gagal merender halaman:", error);
      content.innerHTML = errorHTML();
      cleanup = null;
    }
  } else {
    if (breadcrumb) breadcrumb.innerHTML = "Belajar <span>/</span> Halaman tidak ditemukan";
    document.title = "Halaman tidak ditemukan · English for Service Engineer";
    updateActiveNav("");
    content.innerHTML = notFoundHTML();
    cleanup = null;
  }

  if (announcer) {
    announcer.textContent = view ? `${view.navLabel} dibuka` : "Halaman tidak ditemukan";
  }

  updateDueBadges();
  if (scrollTop && !firstRender) {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
  if (focus && !firstRender) {
    content.focus({ preventScroll: true });
  }
  firstRender = false;
}

function init() {
  buildNavigation();
  initDialogBackdrop();

  const dateLabel = document.getElementById("today-label");
  if (dateLabel) dateLabel.textContent = formatTodayID();

  document.querySelector(".skip-link")?.addEventListener("click", event => {
    event.preventDefault();
    const content = document.getElementById("app-content");
    if (!content) return;
    content.focus({ preventScroll: true });
    content.scrollIntoView({ block: "start" });
  });

  document.addEventListener("click", event => {
    if (event.target.closest("[data-reload-app]")) {
      location.reload();
      return;
    }
    const link = event.target.closest('a[data-nav-route]');
    if (!link) return;
    if (link.getAttribute("href") === location.hash && location.hash) {
      event.preventDefault();
      renderView({ entry: true, focus: true, scrollTop: true });
    }
  });

  window.addEventListener("hashchange", () => {
    renderView({ entry: true, focus: true, scrollTop: true });
  });
  window.addEventListener("progress:changed", updateDueBadges);

  const pendingNotice = consumeLoadNotice();
  updateStorageUI();
  renderView({ entry: true, focus: false, scrollTop: false });

  if (pendingNotice) {
    window.setTimeout(() => {
      toast(pendingNotice.message, pendingNotice.type === "corrupt" ? "error" : "warning", 7000);
    }, 350);
  }

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(error => {
        console.warn("Service worker tidak terdaftar:", error);
      });
    });
  }
}

init();
