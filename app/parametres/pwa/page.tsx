'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAppCache, useNetworkStatus } from '@/components/PWAManager';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Download, 
  Trash2, 
  RefreshCw, 
  Bell, 
  Settings,
  Info,
  Shield,
  Zap
} from 'lucide-react';

/**
 * Page de paramètres PWA
 */
export default function PWASettingsPage() {
  const { isOnline } = useNetworkStatus();
  const { cacheSize, clearCache, isClearing, refreshCacheSize } = useAppCache();
  const [notifications, setNotifications] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotifications(permission === 'granted');
    } else {
      setNotifications(false);
    }
  };

  const installApp = () => {
    // Cette fonction sera appelée par le PWAManager
    window.dispatchEvent(new CustomEvent('pwa-install-request'));
  };

  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.update();
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Paramètres de l'Application
          </h1>
          <p className="text-gray-600">
            Gérez les fonctionnalités et les paramètres de votre application PWA
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Connexion</h3>
                <p className="text-sm text-gray-600">
                  {isOnline ? 'En ligne' : 'Hors ligne'}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                isOnline ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {isOnline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Cache</h3>
                <p className="text-sm text-gray-600">{cacheSize}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Type d'app</h3>
                <p className="text-sm text-gray-600">
                  {window.matchMedia('(display-mode: standalone)').matches ? 'Installée' : 'Navigateur'}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <Smartphone className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Installation */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-semibold text-gray-900">Installation</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Installer l'application</h3>
                  <p className="text-sm text-gray-600">
                    Ajoutez Guyane Marketplace à votre écran d'accueil pour un accès rapide
                  </p>
                </div>
                <Button onClick={installApp} variant="outline">
                  Installer
                </Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Avantages de l'installation :</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Accès rapide depuis l'écran d'accueil</li>
                  <li>• Fonctionnement hors ligne</li>
                  <li>• Notifications push</li>
                  <li>• Interface optimisée</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Notifications push</h3>
                  <p className="text-sm text-gray-600">
                    Recevez des notifications pour les nouvelles annonces et messages
                  </p>
                </div>
                <Switch 
                  checked={notifications}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
              
              {notifications && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Notifications activées
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Vous recevrez des notifications pour les événements importants
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Updates */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-semibold text-gray-900">Mises à jour</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Mises à jour automatiques</h3>
                  <p className="text-sm text-gray-600">
                    Télécharger automatiquement les nouvelles versions
                  </p>
                </div>
                <Switch 
                  checked={autoUpdate}
                  onCheckedChange={setAutoUpdate}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Vérifier les mises à jour</h3>
                  <p className="text-sm text-gray-600">
                    Rechercher manuellement les nouvelles versions
                  </p>
                </div>
                <Button onClick={checkForUpdates} variant="outline">
                  Vérifier
                </Button>
              </div>
            </div>
          </Card>

          {/* Storage */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-semibold text-gray-900">Stockage</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Mode hors ligne</h3>
                  <p className="text-sm text-gray-600">
                    Permettre l'utilisation de l'app sans connexion internet
                  </p>
                </div>
                <Switch 
                  checked={offlineMode}
                  onCheckedChange={setOfflineMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Taille du cache</h3>
                  <p className="text-sm text-gray-600">
                    Espace utilisé pour le stockage hors ligne: {cacheSize}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={refreshCacheSize} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={clearCache} 
                    variant="outline" 
                    size="sm"
                    disabled={isClearing}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">À propos du cache</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Le cache permet à l'application de fonctionner hors ligne en stockant 
                      les données localement. Vider le cache supprimera toutes les données 
                      stockées localement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* App Info */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-semibold text-gray-900">Informations</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Fonctionnalités PWA</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Offline</Badge>
                    <span className="text-sm text-gray-600">Fonctionne hors ligne</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Responsive</Badge>
                    <span className="text-sm text-gray-600">Adaptatif mobile/desktop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Fast</Badge>
                    <span className="text-sm text-gray-600">Chargement rapide</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Compatibilité</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={navigator.serviceWorker ? 'default' : 'destructive'}>
                      Service Worker
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={'Notification' in window ? 'default' : 'destructive'}>
                      Notifications
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={'caches' in window ? 'default' : 'destructive'}>
                      Cache API
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
}