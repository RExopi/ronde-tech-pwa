self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('maintenance-store').then((cache) => cache.addAll([
      '/',
      '/index.html',
      '/style.css',
      '/script.js',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
