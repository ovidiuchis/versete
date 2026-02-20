const CACHE_NAME = "memorez-v2";
const STATIC_FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/scripts/app.js",
  "/styles/style.css",
  "/styles/credit.css",
  "/styles/apple-touch-icon.png",
  "/styles/favicon-96x96.png",
  "/styles/favicon.ico",
  "/styles/favicon.svg",
  "/styles/header.jpg",
  "/styles/library.png",
  "/styles/web-app-manifest-192x192.png",
  "/styles/web-app-manifest-512x512.png",
  "/site.webmanifest",
  "/hero-verses.json",
  "/data/collections.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Cache static files first
      await cache.addAll(STATIC_FILES_TO_CACHE);
      // Then read the collections manifest and cache each collection file
      try {
        const response = await fetch("/data/collections.json");
        const collectionFiles = await response.json();
        const collectionUrls = collectionFiles.map(f => `/data/${f}`);
        await cache.addAll(collectionUrls);
      } catch (e) {
        console.warn("Could not cache collection files:", e);
      }
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
