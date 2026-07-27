const CACHE_VERSION = '2026-07-27-1';
const CACHE_NAME = `canoramiq-static-${CACHE_VERSION}`;
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/styles/app-buttons.css',
  '/scripts/main.js',
  '/canoramiq_logo.png',
  '/canoramiq_demo_poster.jpg',
  '/google-play.png',
  '/app-store.png'
];

function clearOldCaches() {
  return caches.keys().then((keys) =>
    Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
  );
}

function clearAllSiteCaches() {
  return caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
}

function networkFreshRequest(request) {
  return new Request(request, { cache: 'no-store' });
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        PRECACHE_URLS.map((url) =>
          fetch(url, { cache: 'reload' })
            .then((res) => {
              if (res && res.ok) return cache.put(url, res.clone());
            })
            .catch(() => {})
        )
      )
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    clearOldCaches()
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data && event.data.type === 'CLEAR_SITE_CACHE') {
    event.waitUntil(
      clearAllSiteCaches().then(() => {
        if (event.source) event.source.postMessage({ type: 'SITE_CACHE_CLEARED' });
      })
    );
  }
});

function isHtmlRequest(request) {
  if (request.mode === 'navigate') return true;
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for HTML/navigation so a bad cached page can't get stuck.
  if (isHtmlRequest(request)) {
    event.respondWith(
      fetch(networkFreshRequest(request))
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html') || Response.error()))
    );
    return;
  }

  // Bypass cache for video assets (large + Range/206 responses can't be cached safely)
  if (/\.(mp4|webm|mov)$/i.test(url.pathname)) {
    return; // let the browser handle it directly
  }

  // Network-first for static assets so returning devices get the latest deploy.
  event.respondWith(
    fetch(networkFreshRequest(request))
      .then((response) => {
        if (response && response.ok && response.status === 200 && new URL(request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || Response.error()))
  );
});
