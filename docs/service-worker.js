self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('canoramiq-static-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/main.css',
        '/styles/app-buttons.css',
        '/scripts/main.js',
        '/canoramiq_logo.png',
        '/google-play.png',
        '/app-store.png'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== 'canoramiq-static-v1' && caches.delete(k))))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
