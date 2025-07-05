const CACHE_NAME = '5-star-digital-v2';
const OFFLINE_CACHE = '5-star-digital-offline-v1';

// Assets to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/index.css'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/business-scan/,
  /\/api\/generate-recommendations/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(OFFLINE_CACHE).then(cache => cache.add('/offline.html'))
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) return response;
          
          return fetch(request)
            .then(fetchResponse => {
              if (fetchResponse.ok) {
                const responseClone = fetchResponse.clone();
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(request, responseClone));
              }
              return fetchResponse;
            })
            .catch(() => {
              // Return cached version or offline page
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) return response;

        return fetch(request)
          .then(fetchResponse => {
            if (!fetchResponse || fetchResponse.status !== 200) {
              return fetchResponse;
            }

            const responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseClone));

            return fetchResponse;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Background sync for offline forms
self.addEventListener('sync', (event) => {
  if (event.tag === 'offline-form-sync') {
    event.waitUntil(syncOfflineForms());
  }
});

async function syncOfflineForms() {
  // This would sync forms stored in IndexedDB or localStorage
  // Implementation depends on the specific offline storage strategy
  console.log('Syncing offline forms...');
}