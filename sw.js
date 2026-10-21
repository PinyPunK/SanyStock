// Nom de la memòria cau (versió del programari)
const CACHE_NAME = 'sanystock-cache-v1';

// Llistat d'arxius essencials per guardar a la memòria cau
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './Logo_App.png'
];

// 1. Esdeveniment d'instal·lació del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Esdeveniment d'activació: neteja de versions antigues
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Estratègia de xarxa amb suport fora de línia (Network first amb fallback a Cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
