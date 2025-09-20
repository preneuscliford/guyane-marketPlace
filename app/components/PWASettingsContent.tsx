'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAppCache, useNetworkStatus } from '@/components/PWAManager';
import { 
  Smartphone, 
  Download, 
  Wifi, 
  WifiOff, 
  Settings, 
  Trash2, 
  RefreshCw,
  Bell,
  BellOff,
  Shield,
  Database
} from 'lucide-react';

/**
 * Composant contenant la logique PWA pour éviter les erreurs SSR
 */
export function PWASettingsContent() {
  const { isOnline } = useNetworkStatus();
  const { cacheSize, clearCache, isClearing, refreshCacheSize } = useAppCache();
  const [notifications, setNotifications] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Vérifier si on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNotificationToggle = async (enabled: boolean) => {
    if (!isClient) return;
    
    if (enabled && typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotifications(permission === 'granted');
    } else {
      setNotifications(false);
    }
  };

  const installApp = () => {
    if (!isClient || typeof window === 'undefined') return;
    
    // Cette fonction sera appelée par le PWAManager
    window.dispatchEvent(new CustomEvent('pwa-install-request'));
  };

  const checkForUpdates = async () => {
    if (!isClient || typeof navigator === 'undefined') return;
    
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.update();
      }
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des paramètres PWA...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statut de connexion */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isOnline ? (
              <Wifi className="h-6 w-6 text-green-600" />
            ) : (
              <WifiOff className="h-6 w-6 text-red-600" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </h3>
              <p className="text-sm text-gray-600">
                {isOnline 
                  ? 'Connexion internet active' 
                  : 'Mode hors ligne activé'
                }
              </p>
            </div>
          </div>
          <Badge 
            variant={isOnline ? 'default' : 'destructive'}
            className={isOnline ? 'bg-green-100 text-green-800' : ''}
          >
            {isOnline ? 'Connecté' : 'Déconnecté'}
          </Badge>
        </div>
      </Card>

      {/* Installation de l'application */}
      <Card className="p-6">
        <div className="flex items-start space-x-4">
          <Smartphone className="h-6 w-6 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Installation de l'application
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Installez l'application sur votre appareil pour un accès rapide et une meilleure expérience.
            </p>
            <Button 
              onClick={installApp}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Installer l'application</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {notifications ? (
              <Bell className="h-6 w-6 text-blue-600" />
            ) : (
              <BellOff className="h-6 w-6 text-gray-400" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">
                Notifications push
              </h3>
              <p className="text-sm text-gray-600">
                Recevez des notifications pour les nouvelles offres et mises à jour
              </p>
            </div>
          </div>
          <Switch
            checked={notifications}
            onCheckedChange={handleNotificationToggle}
          />
        </div>
      </Card>

      {/* Mises à jour automatiques */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">
                Mises à jour automatiques
              </h3>
              <p className="text-sm text-gray-600">
                Télécharger automatiquement les nouvelles versions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Switch
              checked={autoUpdate}
              onCheckedChange={setAutoUpdate}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={checkForUpdates}
              className="flex items-center space-x-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Vérifier</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Mode hors ligne */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">
                Mode hors ligne
              </h3>
              <p className="text-sm text-gray-600">
                Utiliser l'application même sans connexion internet
              </p>
            </div>
          </div>
          <Switch
            checked={offlineMode}
            onCheckedChange={setOfflineMode}
          />
        </div>
      </Card>

      {/* Gestion du cache */}
      <Card className="p-6">
        <div className="flex items-start space-x-4">
          <Database className="h-6 w-6 text-orange-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Cache de l'application
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Taille actuelle du cache : <span className="font-medium">{formatBytes(Number(cacheSize))}</span>
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={refreshCacheSize}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Actualiser</span>
              </Button>
              <Button
                variant="destructive"
                onClick={clearCache}
                disabled={isClearing}
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>{isClearing ? 'Suppression...' : 'Vider le cache'}</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Paramètres avancés */}
      <Card className="p-6">
        <div className="flex items-start space-x-4">
          <Settings className="h-6 w-6 text-gray-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Paramètres avancés
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Version de l'application :</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Service Worker :</span>
                <Badge variant="outline" className="text-xs">
                  {typeof navigator !== 'undefined' && 'serviceWorker' in navigator ? 'Supporté' : 'Non supporté'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Mode d'affichage :</span>
                <Badge variant="outline" className="text-xs">
                  {typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches ? 'Application' : 'Navigateur'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
