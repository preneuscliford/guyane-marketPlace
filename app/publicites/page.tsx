'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import AdvertisementDashboard from '@/components/advertisements/AdvertisementDashboard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon, ChartBarIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

/**
 * Page principale du dashboard des publicités
 */
export default function PublicitesPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Section */}
            <div className="mb-12">
              <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MegaphoneIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Boostez votre visibilité en Guyane
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Créez des publicités ciblées pour promouvoir vos produits et services 
                auprès de la communauté guyanaise. Plus vous investissez, plus vous êtes visible !
              </p>
            </div>

            {/* Fonctionnalités */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-2xl shadow-soft">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <PlusIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Création gratuite
                </h3>
                <p className="text-gray-600 text-sm">
                  Créez votre première publicité gratuitement, sans carte bancaire requise
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-soft">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ChartBarIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Suivi en temps réel
                </h3>
                <p className="text-gray-600 text-sm">
                  Suivez les performances de vos publicités avec des statistiques détaillées
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-soft">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MegaphoneIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Visibilité pondérée
                </h3>
                <p className="text-gray-600 text-sm">
                  Plus votre budget est élevé, plus votre publicité apparaît souvent
                </p>
              </div>
            </div>

            {/* Comment ça marche */}
            <div className="bg-white rounded-2xl p-8 shadow-soft mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Comment ça marche ?</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Créez votre compte</h3>
                  <p className="text-gray-600 text-sm">Inscrivez-vous gratuitement sur la plateforme</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Créez votre publicité</h3>
                  <p className="text-gray-600 text-sm">Ajoutez titre, description et image attractive</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Définissez votre budget</h3>
                  <p className="text-gray-600 text-sm">Choisissez le montant que vous souhaitez investir</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    4
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Suivez vos résultats</h3>
                  <p className="text-gray-600 text-sm">Analysez les performances et optimisez</p>
                </div>
              </div>
            </div>

            {/* Tarification */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white mb-12">
              <h2 className="text-2xl font-bold mb-4">Tarification simple et transparente</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Création gratuite</h3>
                  <p className="text-primary-100">Créez autant de publicités que vous voulez</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Budget flexible</h3>
                  <p className="text-primary-100">À partir de 1€, augmentez quand vous voulez</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Paiement au clic</h3>
                  <p className="text-primary-100">Vous ne payez que pour les clics reçus</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <Link href="/auth">
                <Button size="lg" className="text-lg px-8 py-4">
                  Commencer gratuitement
                </Button>
              </Link>
              <p className="text-gray-500 text-sm">
                Aucune carte bancaire requise • Création en 2 minutes
              </p>
            </div>
          </div>
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <AdvertisementDashboard />
        </div>
      </div>
    </>
  );
}
