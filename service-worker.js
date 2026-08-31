const CACHE_NAME = 'giai-toan-pb-v6';
const ASSETS = [
  './',
  './index.html',
  './app.obf.js',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './license.wasm'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      const fetchPromise = fetch(event.request).then(function (networkResponse) {
        if (event.request.method === 'GET' && networkResponse && networkResponse.ok) {
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, networkResponse.clone()); });
        }
        return networkResponse;
      }).catch(function () { return cached; });
      return cached || fetchPromise;
    })
  );
});
