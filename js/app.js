import { homeView } from "./views/home.js";
import { modulesView } from "./views/modules.js";
import { lessonView } from "./views/lesson.js";
import { teleprompterView } from "./views/teleprompter.js";
import { shadowingView } from "./views/shadowing.js";
import { notFoundView } from "./views/not-found.js";
import { esc } from "./utils.js";
import { icon } from "./icons.js";

const app = document.querySelector("#app");
const navLinks = [...document.querySelectorAll("[data-nav]")];

document.querySelectorAll("[data-bottom-icon]").forEach(node => {
  const name = node.dataset.bottomIcon === "home" ? "home" : "library";
  node.innerHTML = icon(name, 20);
});
let cleanupCurrent = () => {};
let navigationToken = 0;

if (app && !location.hash) {
  history.replaceState(null, "", "#/");
}

function parseRoute(hash) {
  const clean = String(hash || "#/").replace(/^#\/?/, "").replace(/\/+$/, "");
  if (!clean) return { name: "home", parts: [] };
  return { name: clean.split("/")[0], parts: clean.split("/").filter(Boolean) };
}

function chromeRoute(route) {
  if (route.name === "lesson" && route.parts[2] === "teleprompter") return "teleprompter";
  if (route.name === "lesson" && route.parts[2] === "shadowing") return "shadowing";
  return route.name;
}

function setChrome(routeName) {
  document.body.dataset.route = routeName;
  navLinks.forEach(link => {
    const nav = link.dataset.nav;
    const active = nav === "home"
      ? routeName === "home"
      : routeName === "modules" || routeName === "lesson";
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function showLoading() {
  app.innerHTML = `
    <div class="loading-state" role="status" aria-live="polite">
      <span class="loading-mark" aria-hidden="true">…</span>
      <p>Loading lesson data</p>
    </div>
  `;
}

function showError(error) {
  app.innerHTML = `
    <div class="view">
      <section class="empty-state panel" role="alert">
        <span class="eyebrow">Something went wrong</span>
        <h1>Lesson data could not be loaded.</h1>
        <p>The app could not read its lesson files. If you opened <code>index.html</code> directly from your computer, start a local server instead.</p>
        <pre class="command-line"><code>npm run serve</code></pre>
        <p class="error-detail">${esc(error?.message || "Unknown error")}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/">Back to home</a>
          <button class="btn btn-secondary" type="button" data-reload>Try again</button>
        </div>
      </section>
    </div>
  `;
  app.querySelector("[data-reload]")?.addEventListener("click", () => {
    window.location.reload();
  });
}

async function renderRoute() {
  const token = ++navigationToken;
  cleanupCurrent();
  cleanupCurrent = () => {};

  const route = parseRoute(location.hash);
  setChrome(chromeRoute(route));
  showLoading();

  try {
    let result;

    if (route.parts.length === 0) {
      result = await homeView(app);
    } else if (route.name === "modules" && route.parts.length === 1) {
      result = await modulesView(app);
    } else if (route.name === "lesson" && route.parts.length >= 2) {
      const id = decodeURIComponent(route.parts[1]).toUpperCase();
      if (route.parts.length === 2) {
        result = await lessonView(app, { id });
      } else if (route.parts.length === 3 && route.parts[2] === "teleprompter") {
        result = await teleprompterView(app, { id });
      } else if (route.parts.length === 3 && route.parts[2] === "shadowing") {
        result = await shadowingView(app, { id });
      } else {
        result = notFoundView(app);
      }
    } else {
      result = notFoundView(app);
    }

    if (token !== navigationToken) {
      result?.cleanup?.();
      return;
    }

    cleanupCurrent = typeof result?.cleanup === "function" ? result.cleanup : () => {};
    document.title = result?.title || "Small Steps English";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  } catch (error) {
    if (token !== navigationToken) return;
    console.error("Small Steps English:", error);
    document.title = "Error · Small Steps English";
    showError(error);
  }
}

document.querySelector("[data-skip-link]")?.addEventListener("click", event => {
  event.preventDefault();
  app.focus({ preventScroll: true });
  app.scrollIntoView({ block: "start" });
});

window.addEventListener("hashchange", renderRoute);
renderRoute();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Offline support is optional; the app still works online.
    });
  });
}
