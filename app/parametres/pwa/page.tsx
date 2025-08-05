'use client';

import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';

// Charger dynamiquement le contenu PWA pour éviter les erreurs SSR
const PWASettingsContent = dynamic(() => import('@/components/PWASettingsContent').then(mod => ({ default: mod.PWASettingsContent })), { 
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des paramètres PWA...</p>
        </div>
      </div>
    </div>
  )
});

/**
 * Page de paramètres PWA
 */
export default function PWASettingsPage() {

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

        <PWASettingsContent />
      </div>
      </div>
    </>
  );
}