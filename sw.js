const CACHE_NAME = 'TimeshiftRadioPlayer-v2026-11-14b';

const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// 1. Installation: Neue Version immer frisch vom Server holen (HTTP-Disk-Cache umgehen)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of ASSETS_TO_CACHE) {
        try {
          // cache: 'reload' zwingt den Server nach der echten neuen Datei zu fragen
          const response = await fetch(url, { cache: 'reload' });
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (err) {
          // Fallback falls während der Installation das Netz abreißt
          await cache.add(url).catch(() => {});
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// 2. Aktivierung: Sofort alten Cache löschen und Clients übernehmen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('TimeshiftRadioPlayer-') && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch-Strategie: Reines Cache-First für blitzschnellen Offline-Start
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Live-Streams und externe URLs niemals cachen
  if (
    request.method !== 'GET' || 
    request.destination === 'audio' ||
    url.pathname.includes('stream') ||
    url.pathname.includes('.mp3') ||
    url.pathname.includes('.aac') ||
    !url.href.startsWith(self.location.origin)
  ) {
    return;
  }

  // Für HTML-Navigation: Sofort aus dem Cache liefern (startet offline sofort)
  if (
    request.mode === 'navigate' || 
    request.destination === 'document' || 
    request.headers.get('accept')?.includes('text/html')
  ) {
    event.respondWith(
      caches.match('./index.html', { ignoreSearch: true })
        .then(cached => cached || caches.match('index.html') || caches.match('./'))
        .then(cached => cached || fetch(request))
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Alle anderen statischen Assets (Icons, Manifest)
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(cached => {
      if (cached) return cached;
      return fetch(request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return networkResponse;
      });
    })
  );
});
