/*
 * Service worker sederhana untuk aplikasi statis.
 * Halaman memakai strategi network-first agar pembaruan langsung terlihat;
 * aset modul memakai cache-first dengan pembaruan di belakang layar.
 */

const CACHE = "service-english-shell-v3";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.webmanifest",
  "./icon.svg",
  "./js/app.js",
  "./js/curriculum.js",
  "./js/data.js",
  "./js/expansion.js",
  "./js/icons.js",
  "./js/program.js",
  "./js/srs.js",
  "./js/speech.js",
  "./js/store.js",
  "./js/ui.js",
  "./js/utils.js",
  "./js/views/dashboard.js",
  "./js/views/daily.js",
  "./js/views/phrases.js",
  "./js/views/recall.js",
  "./js/views/patterns.js",
  "./js/views/listen.js",
  "./js/views/simulator.js",
  "./js/views/progress.js",
  "./js/views/settings.js",
  "./js/views/menu.js"
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
          .filter(key => (
            key !== CACHE &&
            (key.startsWith("service-english-shell-") || key.startsWith("small-steps-shell-"))
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

  // Navigasi: ambil versi terbaru, lalu gunakan index.html saat offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match("./index.html", { ignoreSearch: true }))
    );
    return;
  }

  // Aset: cache-first. ignoreSearch membuat versi berversi (?v=...) tetap
  // cocok dengan entri cache yang disimpan tanpa query.
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(cached => {
      const network = fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
