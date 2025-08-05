// Service Worker pour Guyane Marketplace PWA
const CACHE_NAME = 'guyane-marketplace-v1';
const STATIC_CACHE_NAME = 'guyane-marketplace-static-v1';
const DYNAMIC_CACHE_NAME = 'guyane-marketplace-dynamic-v1';

// Ressources à mettre en cache lors de l'installation
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  // Ajoutez ici d'autres ressources statiques importantes
];

// URLs à exclure du cache
const EXCLUDED_URLS = [
  '/api/',
  '/_next/webpack-hmr',
  '/_next/static/chunks/webpack',
  '/socket.io/',
];

/**
 * Installation du Service Worker
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Mise en cache des ressources statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation terminée');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Erreur lors de l\'installation:', error);
      })
  );
});

/**
 * Activation du Service Worker
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Supprimer les anciens caches
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('[SW] Suppression de l\'ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation terminée');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('[SW] Erreur lors de l\'activation:', error);
      })
  );
});

/**
 * Interception des requêtes réseau
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Ignorer les URLs exclues
  if (EXCLUDED_URLS.some(excludedUrl => request.url.includes(excludedUrl))) {
    return;
  }
  
  // Stratégie différente selon le type de requête
  if (request.method === 'GET') {
    if (isStaticAsset(request.url)) {
      // Cache First pour les ressources statiques
      event.respondWith(cacheFirst(request));
    } else if (isAPIRequest(request.url)) {
      // Network First pour les API
      event.respondWith(networkFirst(request));
    } else {
      // Stale While Revalidate pour les pages
      event.respondWith(staleWhileRevalidate(request));
    }
  }
});

/**
 * Vérifie si l'URL est une ressource statique
 */
function isStaticAsset(url) {
  return url.includes('/_next/static/') || 
         url.includes('/images/') || 
         url.includes('/icons/') ||
         url.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/);
}

/**
 * Vérifie si l'URL est une requête API
 */
function isAPIRequest(url) {
  return url.includes('/api/') || url.includes('supabase.co');
}

/**
 * Stratégie Cache First
 * Cherche d'abord dans le cache, puis sur le réseau
 */
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Erreur Cache First:', error);
    return getOfflineResponse(request);
  }
}

/**
 * Stratégie Network First
 * Cherche d'abord sur le réseau, puis dans le cache
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Erreur Network First:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || getOfflineResponse(request);
  }
}

/**
 * Stratégie Stale While Revalidate
 * Retourne le cache immédiatement et met à jour en arrière-plan
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Mise à jour en arrière-plan
  const networkResponsePromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.error('[SW] Erreur réseau:', error);
    });
  
  // Retourner le cache s'il existe, sinon attendre le réseau
  return cachedResponse || networkResponsePromise || getOfflineResponse(request);
}

/**
 * Retourne une réponse hors ligne appropriée
 */
async function getOfflineResponse(request) {
  const url = new URL(request.url);
  
  // Pour les pages HTML, retourner la page offline
  if (request.headers.get('accept')?.includes('text/html')) {
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
  }
  
  // Pour les images, retourner une image placeholder
  if (request.headers.get('accept')?.includes('image/')) {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Image non disponible</text></svg>',
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
  
  // Réponse générique pour les autres types
  return new Response(
    JSON.stringify({ 
      error: 'Contenu non disponible hors ligne',
      message: 'Veuillez vérifier votre connexion internet'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

/**
 * Gestion des messages du client
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.log('[SW] Message non reconnu:', type);
  }
});

/**
 * Nettoie tous les caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

/**
 * Gestion des notifications push (pour une future implémentation)
 */
self.addEventListener('push', (event) => {
  console.log('[SW] Notification push reçue');
  
  const options = {
    body: 'Nouvelle notification de Guyane Marketplace',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Ouvrir',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Fermer'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data.url = data.url || options.data.url;
  }
  
  event.waitUntil(
    self.registration.showNotification('Guyane Marketplace', options)
  );
});

/**
 * Gestion des clics sur les notifications
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Clic sur notification');
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Chercher un onglet existant avec l'URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Ouvrir un nouvel onglet
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

console.log('[SW] Service Worker chargé');