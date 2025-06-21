const CACHE_NAME = "memorez-v1";
const FILES_TO_CACHE = [
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
  "/comunitate2025.json",
  "/hero-verses.json",
  "/nationala2025.json",
  "/scriptura.json",
  "/sioniada2025.json"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
