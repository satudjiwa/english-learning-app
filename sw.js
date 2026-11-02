/*
 * Small Steps English — static app shell.
 * Navigation uses network-first so a new deployment appears immediately.
 * Cached assets keep the app usable offline after the first visit.
 */

const CACHE = "small-steps-v3-shell-2";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.webmanifest",
  "./icon.svg",
  "./js/app.js",
  "./js/data.js",
  "./js/icons.js",
  "./js/store.js",
  "./js/utils.js",
  "./js/lib/audio.js",
  "./js/components/teleprompter.js",
  "./js/components/shadowing.js",
  "./js/views/home.js",
  "./js/views/modules.js",
  "./js/views/lesson.js",
  "./js/views/teleprompter.js",
  "./js/views/shadowing.js",
  "./js/views/not-found.js",
  "./data/modules.json",
  "./data/lessons/index.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE && (
            key.startsWith("service-english-shell-") ||
            key.startsWith("small-steps-") ||
            key.startsWith("small-steps-english-")
          ))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match("./index.html", { ignoreSearch: true }))
    );
    return;
  }

  const cached = caches.match(request, { ignoreSearch: true });

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() => cached.then(hit => hit || Response.error()))
  );
});
