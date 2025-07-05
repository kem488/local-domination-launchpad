import { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OfflineData {
  forms: Record<string, any>;
  preferences: Record<string, any>;
  cache: Record<string, any>;
}

export const OfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [pendingSyncs, setPendingSyncs] = useState<string[]>([]);

  // Initialize offline storage
  const initOfflineStorage = () => {
    if (!localStorage.getItem('offline_data')) {
      const initialData: OfflineData = {
        forms: {},
        preferences: {},
        cache: {}
      };
      localStorage.setItem('offline_data', JSON.stringify(initialData));
    }
  };

  // Save data for offline use
  const saveOfflineData = (key: string, data: any) => {
    try {
      const offlineData: OfflineData = JSON.parse(localStorage.getItem('offline_data') || '{}');
      offlineData.cache[key] = {
        data,
        timestamp: Date.now(),
        synced: false
      };
      localStorage.setItem('offline_data', JSON.stringify(offlineData));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  };

  // Get offline data
  const getOfflineData = (key: string) => {
    try {
      const offlineData: OfflineData = JSON.parse(localStorage.getItem('offline_data') || '{}');
      return offlineData.cache[key]?.data || null;
    } catch (error) {
      console.error('Failed to retrieve offline data:', error);
      return null;
    }
  };

  // Save form data when offline
  const saveFormOffline = (formId: string, formData: any) => {
    try {
      const offlineData: OfflineData = JSON.parse(localStorage.getItem('offline_data') || '{}');
      offlineData.forms[formId] = {
        data: formData,
        timestamp: Date.now(),
        synced: false
      };
      localStorage.setItem('offline_data', JSON.stringify(offlineData));
      setPendingSyncs(prev => [...prev.filter(id => id !== formId), formId]);
    } catch (error) {
      console.error('Failed to save form offline:', error);
    }
  };

  // Sync offline data when back online
  const syncOfflineData = async () => {
    if (!isOnline) return;

    try {
      const offlineData: OfflineData = JSON.parse(localStorage.getItem('offline_data') || '{}');
      const unsynced = Object.entries(offlineData.forms).filter(([_, form]: [string, any]) => !form.synced);

      for (const [formId, formData] of unsynced) {
        try {
          // Attempt to sync each form
          const response = await fetch('/api/sync-offline-form', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formId, data: formData.data })
          });

          if (response.ok) {
            // Mark as synced
            offlineData.forms[formId].synced = true;
            setPendingSyncs(prev => prev.filter(id => id !== formId));
          }
        } catch (syncError) {
          console.error(`Failed to sync form ${formId}:`, syncError);
        }
      }

      localStorage.setItem('offline_data', JSON.stringify(offlineData));
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  };

  // Enhanced service worker for offline caching
  const registerEnhancedServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/enhanced-sw.js');
        
        // Listen for service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'CACHE_UPDATED') {
            console.log('Cache updated:', event.data.payload);
          }
        });

        console.log('Enhanced service worker registered');
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    }
  };

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
      syncOfflineData();
      console.log('Back online - syncing data');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
      console.log('Gone offline - enabling offline mode');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize offline support
  useEffect(() => {
    initOfflineStorage();
    registerEnhancedServiceWorker();
    
    // Check for pending syncs on load
    const offlineData: OfflineData = JSON.parse(localStorage.getItem('offline_data') || '{}');
    const pendingForms = Object.keys(offlineData.forms).filter(
      formId => !offlineData.forms[formId].synced
    );
    setPendingSyncs(pendingForms);

    // Sync if online
    if (isOnline && pendingForms.length > 0) {
      syncOfflineData();
    }
  }, [isOnline]);

  // Expose offline utilities to global scope for use by other components
  useEffect(() => {
    (window as any).offlineUtils = {
      saveFormOffline,
      saveOfflineData,
      getOfflineData,
      isOnline
    };
  }, [isOnline]);

  return (
    <>
      {showOfflineAlert && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <Alert className="border-warning bg-warning/10">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              You're offline. Your data will be saved locally and synced when connection is restored.
              {pendingSyncs.length > 0 && (
                <span className="block mt-1 text-sm">
                  {pendingSyncs.length} item(s) pending sync
                </span>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {isOnline && pendingSyncs.length > 0 && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className="border-success bg-success/10">
            <Wifi className="h-4 w-4" />
            <AlertDescription>
              Syncing {pendingSyncs.length} offline item(s)...
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

// Enhanced service worker content
export const enhancedServiceWorkerContent = `
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
  /\\/api\\/business-scan/,
  /\\/api\\/generate-recommendations/
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
`;