var dataCacheName = 'bulletpad-v13'; // data, unused var
var cacheName = 'bulletpad-x13'; // app shell
var filesToCache = [
  '/bulletpad_pwa/',
  '/bulletpad_pwa/index.html',
  '/bulletpad_pwa/main.js',
  '/bulletpad_pwa/vue.min.js',
  '/bulletpad_pwa/bulma.css',
  '/bulletpad_pwa/stylesheet.css',
  '/bulletpad_pwa/service-worker.js',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
