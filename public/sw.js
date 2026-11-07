const CACHE_NAME = "skillpath-shell-v4";
const APP_ROOT = self.registration.scope;
const APP_SHELL = ["", "index.html", "styles.css", "lesson.css", "lessons.js", "app.js", "manifest.webmanifest", "assets/icon-192.svg", "assets/icon-512.svg", "assets/icon-192.png", "assets/icon-512.png"].map(path => new URL(path, APP_ROOT).href);
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith("skillpath-shell-") && key !== CACHE_NAME).map(key => caches.delete(key))))
    .then(() => self.clients.claim())
));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith(new URL("api/", APP_ROOT).pathname)) return;
  const cacheResponse = response => {
    if (response.ok) event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone())));
    return response;
  };
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(cacheResponse).catch(() => caches.match(event.request).then(cached => cached || caches.match(new URL("index.html", APP_ROOT).href))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(cacheResponse);
  }));
});
