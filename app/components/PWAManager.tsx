'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * Composant pour gérer les fonctionnalités PWA
 */
export default function PWAManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    checkIfInstalled();

    // Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      toast.success('Application installée avec succès!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Enregistre le service worker
   */
  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      setSwRegistration(registration);

      // Écouter les mises à jour du service worker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nouvelle version disponible
              showUpdateAvailable();
            }
          });
        }
      });

      console.log('[PWA] Service Worker enregistré avec succès');
    } catch (error) {
      console.error('[PWA] Erreur lors de l\'enregistrement du Service Worker:', error);
    }
  };

  /**
   * Affiche une notification de mise à jour disponible
   */
  const showUpdateAvailable = () => {
    toast.info('Nouvelle version disponible!', {
      description: 'Cliquez pour mettre à jour l\'application',
      action: {
        label: 'Mettre à jour',
        onClick: () => updateServiceWorker()
      },
      duration: 10000
    });
  };

  /**
   * Met à jour le service worker
   */
  const updateServiceWorker = async () => {
    if (swRegistration?.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  /**
   * Déclenche l'installation de l'application
   */
  const installApp = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('[PWA] Installation acceptée');
      } else {
        console.log('[PWA] Installation refusée');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('[PWA] Erreur lors de l\'installation:', error);
    }
  };

  /**
   * Affiche le bouton d'installation si applicable
   */
  const showInstallButton = isInstallable && !isInstalled;

  return (
    <>
      {showInstallButton && (
        <InstallButton onInstall={installApp} />
      )}
      
      {isInstalled && (
        <PWAStatusIndicator />
      )}
    </>
  );
}

/**
 * Bouton d'installation de l'application
 */
function InstallButton({ onInstall }: { onInstall: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Afficher le bouton après un délai pour ne pas être intrusif
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-primary-500 text-white p-4 rounded-2xl shadow-2xl max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            📱
          </div>
          <div>
            <h3 className="font-semibold text-sm">Installer l'application</h3>
            <p className="text-xs text-primary-100">Accès rapide depuis votre écran d'accueil</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onInstall}
            className="flex-1 bg-white text-primary-500 px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-50 transition-colors"
          >
            Installer
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="px-4 py-2 text-primary-100 hover:text-white transition-colors text-sm"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Indicateur de statut PWA
 */
function PWAStatusIndicator() {
  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-green-500 text-white px-3 py-2 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        Application installée
      </div>
    </div>
  );
}

/**
 * Hook pour vérifier le statut de connexion
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const updateNetworkStatus = () => {
      const online = navigator.onLine;
      
      if (!online && isOnline) {
        // Passage hors ligne
        setWasOffline(true);
        toast.warning('Connexion perdue', {
          description: 'Vous êtes maintenant hors ligne. L\'application continue de fonctionner.'
        });
      } else if (online && !isOnline && wasOffline) {
        // Retour en ligne
        toast.success('Connexion rétablie', {
          description: 'Vous êtes de nouveau en ligne. Synchronisation en cours...'
        });
      }
      
      setIsOnline(online);
    };

    // Vérification initiale
    updateNetworkStatus();

    // Écouter les changements de statut réseau
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, [isOnline, wasOffline]);

  return { isOnline, wasOffline };
}

/**
 * Hook pour gérer le cache de l'application
 */
export function useAppCache() {
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    calculateCacheSize();
  }, []);

  /**
   * Calcule la taille du cache
   */
  const calculateCacheSize = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        setCacheSize(estimate.usage || 0);
      } catch (error) {
        console.error('[PWA] Erreur lors du calcul de la taille du cache:', error);
      }
    }
  };

  /**
   * Vide le cache de l'application
   */
  const clearCache = async () => {
    setIsClearing(true);
    
    try {
      // Vider les caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      // Vider le localStorage
      localStorage.clear();
      
      // Vider le sessionStorage
      sessionStorage.clear();
      
      // Recalculer la taille
      await calculateCacheSize();
      
      toast.success('Cache vidé avec succès');
    } catch (error) {
      console.error('[PWA] Erreur lors du vidage du cache:', error);
      toast.error('Erreur lors du vidage du cache');
    } finally {
      setIsClearing(false);
    }
  };

  /**
   * Formate la taille en octets
   */
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    cacheSize: formatBytes(cacheSize),
    clearCache,
    isClearing,
    refreshCacheSize: calculateCacheSize
  };
}