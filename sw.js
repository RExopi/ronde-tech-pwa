const CACHE_NAME = 'rondes-app-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Étape 1 : Installer le Service Worker et mettre en cache les assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Ouverture du cache');
        return cache.addAll(ASSETS);
      })
  );
});

// Étape 2 : Intercepter les requêtes réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la réponse en cache si elle existe, sinon faire une requête réseau
        return response || fetch(event.request);
      })
  );
});

// Étape 3 : Activer le Service Worker et nettoyer les anciens caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
