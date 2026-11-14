const CACHE_NAME = 'TimeshiftRadioPlayer-v2026-11-14c';

const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of ASSETS_TO_CACHE) {
        try {
          const response = await fetch(url, { cache: 'reload' });
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (err) {
          await cache.add(url).catch(() => {});
        }
      }
    }).then(() => self.skipWaiting())
  );
});

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

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);


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
