// ❤U Festival service worker
//
// Strategieën:
//   • App-shell + statische assets    → cache-first met netwerk-update
//   • Google Fonts (css + woff2)       → cache-first (offline iconen!)
//   • /api/*                           → network-first met cache-fallback
//   • Andere GET (zelfde origin)       → stale-while-revalidate
//
// Plus:
//   • push  → toon notification
//   • notificationclick → focus / open de juiste URL

const VERSION    = 'v3';
const SHELL      = `ufest-shell-${VERSION}`;
const API_CACHE  = `ufest-api-${VERSION}`;
const FONT_CACHE = `ufest-fonts-${VERSION}`;
const RUNTIME    = `ufest-runtime-${VERSION}`;

const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon.svg',
  '/icons/icon-maskable.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL).then((c) => c.addAll(PRECACHE)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![SHELL, API_CACHE, FONT_CACHE, RUNTIME].includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isApi = url.pathname.startsWith('/api/');
  const isFont = url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com';
  const isSameOrigin = url.origin === self.location.origin;

  // Google Fonts — cache-first (CSS + woff2). woff2 levert opaque responses
  // (no-cors) wat prima is om alleen terug te spelen in de browser.
  if (isFont) {
    event.respondWith(cacheFirst(req, FONT_CACHE));
    return;
  }

  // /api/* (zelfde óf andere origin) → netwerk eerst.
  if (isApi) {
    event.respondWith(networkFirst(req, API_CACHE));
    return;
  }

  // HTML-navigaties → netwerk, fallback naar gecachte index.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put(req, copy)).catch(() => undefined);
          return res;
        })
        .catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
    );
    return;
  }

  // Statische assets zelfde origin → stale-while-revalidate.
  if (isSameOrigin) {
    event.respondWith(staleWhileRevalidate(req, RUNTIME));
  }
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    // .ok is false voor opaque responses (status 0). Toch cachen.
    if (res && (res.ok || res.type === 'opaque')) {
      cache.put(req, res.clone()).catch(() => undefined);
    }
    return res;
  } catch {
    return cached || Response.error();
  }
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone()).catch(() => undefined);
    return res;
  } catch {
    const cached = await cache.match(req);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const network = fetch(req)
    .then((res) => {
      if (res && res.ok) cache.put(req, res.clone()).catch(() => undefined);
      return res;
    })
    .catch(() => cached);
  return cached || network;
}

// -------------------------------------------------------------------------
// Push
// -------------------------------------------------------------------------
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data?.text?.() || '' }; }

  const title = data.title || '❤U Festival';
  const options = {
    body: data.body || '',
    icon: '/icons/icon.svg',
    badge: '/icons/icon.svg',
    data: { url: data.url || '/' },
    vibrate: [120, 60, 120],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const c of all) {
        if ('focus' in c) {
          c.navigate(url).catch(() => undefined);
          return c.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })()
  );
});

// -------------------------------------------------------------------------
// Background-sync — flush offline favorites-queue (best-effort).
// De client roept ook handmatig aan via fetch — dit is een extra vangnet.
// -------------------------------------------------------------------------
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SYNC_FAVORITES') {
    // Geef de client door dat-ie zelf de queue moet flushen — wij hebben
    // geen toegang tot localStorage hier.
    event.waitUntil(
      self.clients.matchAll().then((clients) =>
        clients.forEach((c) => c.postMessage({ type: 'FLUSH_FAV_QUEUE' }))
      )
    );
  }
});
