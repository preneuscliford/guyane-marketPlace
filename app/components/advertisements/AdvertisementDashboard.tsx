'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  ChartBarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  BanknotesIcon,
  PlayIcon,
  PauseIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useAdvertisements, useAdvertisementStats } from '../../hooks/useAdvertisements';
import { Advertisement, AdvertisementAnalytics as AdvertisementAnalyticsType } from '../../types/advertisements';
import { formatCurrency, formatNumber, formatDate } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import AdvertisementForm from './AdvertisementForm';
import AdvertisementAnalytics from './AdvertisementAnalytics';

/**
 * Dashboard principal pour gérer les publicités
 */
export default function AdvertisementDashboard() {
  const {
    advertisements,
    loading,
    error,
    fetchUserAdvertisements,
    updateAdvertisement,
    deleteAdvertisement
  } = useAdvertisements();
  
  const { calculateAnalytics } = useAdvertisementStats();
  
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState<Record<string, AdvertisementAnalyticsType>>({});
  const [activeTab, setActiveTab] = useState('overview');

  // Charger les publicités de l'utilisateur
  useEffect(() => {
    fetchUserAdvertisements();
  }, [fetchUserAdvertisements]);

  // Charger les analytics pour chaque publicité
  useEffect(() => {
    const loadAnalytics = async () => {
      const analyticsData: Record<string, AdvertisementAnalyticsType> = {};
      
      for (const ad of advertisements) {
        try {
          const data = await calculateAnalytics(ad.id);
          analyticsData[ad.id] = data;
        } catch (err) {
          console.error(`Erreur lors du chargement des analytics pour ${ad.id}:`, err);
        }
      }
      
      setAnalytics(analyticsData);
    };

    if (advertisements.length > 0) {
      loadAnalytics();
    }
  }, [advertisements, calculateAnalytics]);

  /**
   * Calcule les statistiques globales
   */
  const globalStats = React.useMemo(() => {
    const totalBudget = advertisements.reduce((sum, ad) => sum + ad.budget, 0);
    const totalSpent = advertisements.reduce((sum, ad) => sum + ad.total_spent, 0);
    const activeAds = advertisements.filter(ad => ad.status === 'active').length;
    
    const totalImpressions = Object.values(analytics).reduce((sum, data) => sum + data.total_impressions, 0);
    const totalClicks = Object.values(analytics).reduce((sum, data) => sum + data.total_clicks, 0);
    const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      activeAds,
      totalAds: advertisements.length,
      totalImpressions,
      totalClicks,
      averageCTR
    };
  }, [advertisements, analytics]);

  /**
   * Gère le changement de statut d'une publicité
   */
  const handleStatusChange = async (ad: Advertisement, newStatus: Advertisement['status']) => {
    try {
      await updateAdvertisement(ad.id, { status: newStatus });
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
    }
  };

  /**
   * Gère la suppression d'une publicité
   */
  const handleDelete = async (ad: Advertisement) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) {
      try {
        await deleteAdvertisement(ad.id);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  /**
   * Ouvre le formulaire d'édition
   */
  const handleEdit = (ad: Advertisement) => {
    setSelectedAd(ad);
    setShowForm(true);
  };

  /**
   * Ouvre les analytics détaillées
   */
  const handleViewAnalytics = (ad: Advertisement) => {
    setSelectedAd(ad);
    setShowAnalytics(true);
  };

  /**
   * Ferme les modales
   */
  const closeModals = () => {
    setShowForm(false);
    setShowAnalytics(false);
    setSelectedAd(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchUserAdvertisements}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Publicités</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos campagnes publicitaires et suivez leurs performances
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Nouvelle Publicité
        </Button>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(globalStats.totalBudget)}
                </p>
              </div>
              <BanknotesIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dépensé</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(globalStats.totalSpent)}
                </p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impressions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(globalStats.totalImpressions)}
                </p>
              </div>
              <EyeIcon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de Clic</p>
                <p className="text-2xl font-bold text-gray-900">
                  {globalStats.averageCTR.toFixed(2)}%
                </p>
              </div>
              <CursorArrowRaysIcon className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="active">Actives ({globalStats.activeAds})</TabsTrigger>
          <TabsTrigger value="all">Toutes ({globalStats.totalAds})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab advertisements={advertisements} analytics={analytics} />
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <AdvertisementList
            advertisements={advertisements.filter(ad => ad.status === 'active')}
            analytics={analytics}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onViewAnalytics={handleViewAnalytics}
          />
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <AdvertisementList
            advertisements={advertisements}
            analytics={analytics}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onViewAnalytics={handleViewAnalytics}
          />
        </TabsContent>
      </Tabs>

      {/* Modales */}
      {showForm && (
        <AdvertisementForm
          advertisement={selectedAd}
          onClose={closeModals}
          onSuccess={() => {
            closeModals();
            fetchUserAdvertisements();
          }}
        />
      )}

      {showAnalytics && selectedAd && (
        <AdvertisementAnalytics
          advertisement={selectedAd}
          onClose={closeModals}
        />
      )}
    </div>
  );
}

/**
 * Composant pour l'onglet vue d'ensemble
 */
function OverviewTab({
  advertisements,
  analytics
}: {
  advertisements: Advertisement[];
  analytics: Record<string, AdvertisementAnalyticsType>;
}) {
  const topPerformers = advertisements
    .map(ad => ({
      ...ad,
      analytics: analytics[ad.id]
    }))
    .filter(ad => ad.analytics)
    .sort((a, b) => b.analytics.click_through_rate - a.analytics.click_through_rate)
    .slice(0, 5);

  const recentAds = advertisements
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Top performers */}
      <Card>
        <CardHeader>
          <CardTitle>Meilleures Performances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((ad, index) => (
              <div key={ad.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ad.title}</p>
                    <p className="text-sm text-gray-600">
                      CTR: {ad.analytics.click_through_rate.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                  {ad.status}
                </Badge>
              </div>
            ))}
            {topPerformers.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Aucune donnée de performance disponible
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Publicités récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Publicités Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAds.map(ad => (
              <div key={ad.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{ad.title}</p>
                  <p className="text-sm text-gray-600">
                    Créée le {formatDate(ad.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                    {ad.status}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatCurrency(ad.budget)}
                  </p>
                </div>
              </div>
            ))}
            {recentAds.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Aucune publicité créée
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Composant pour la liste des publicités
 */
function AdvertisementList({
  advertisements,
  analytics,
  onEdit,
  onDelete,
  onStatusChange,
  onViewAnalytics
}: {
  advertisements: Advertisement[];
  analytics: Record<string, AdvertisementAnalyticsType>;
  onEdit: (ad: Advertisement) => void;
  onDelete: (ad: Advertisement) => void;
  onStatusChange: (ad: Advertisement, status: Advertisement['status']) => void;
  onViewAnalytics: (ad: Advertisement) => void;
}) {
  if (advertisements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Aucune publicité trouvée</p>
        <p className="text-sm text-gray-400">
          Créez votre première publicité pour commencer à promouvoir vos produits
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {advertisements.map(ad => {
        const adAnalytics = analytics[ad.id];
        
        return (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Informations principales */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{ad.title}</h3>
                    <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                      {ad.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{ad.description}</p>
                  
                  {/* Métadonnées */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span>Budget: {formatCurrency(ad.budget)}</span>
                    <span>Dépensé: {formatCurrency(ad.total_spent)}</span>
                    {ad.category && <span>Catégorie: {ad.category}</span>}
                    {ad.location && <span>Lieu: {ad.location}</span>}
                  </div>
                </div>

                {/* Statistiques */}
                {adAnalytics && (
                  <div className="grid grid-cols-3 gap-4 text-center lg:text-left">
                    <div>
                      <p className="text-sm text-gray-600">Impressions</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatNumber(adAnalytics.total_impressions)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Clics</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatNumber(adAnalytics.total_clicks)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CTR</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {adAnalytics.click_through_rate.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewAnalytics(ad)}
                  >
                    <ChartBarIcon className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(ad)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => 
                      onStatusChange(ad, ad.status === 'active' ? 'paused' : 'active')
                    }
                  >
                    {ad.status === 'active' ? (
                      <PauseIcon className="w-4 h-4" />
                    ) : (
                      <PlayIcon className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(ad)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}