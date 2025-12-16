"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  XMarkIcon,
  ChartBarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  BanknotesIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { useAdvertisementAnalyticsQuery } from "@/hooks/useAdvertisements.query";
import {
  Advertisement,
  AdvertisementAnalytics as AnalyticsType,
} from "../../types/advertisements";
import { formatCurrency, formatNumber, formatDate } from "../../lib/utils";
// ... existing code ...
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// ... existing code ...
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface AdvertisementAnalyticsProps {
  advertisement: Advertisement;
  onClose: () => void;
}

/**
 * Composant pour afficher les analytics détaillées d'une publicité
 */
export default function AdvertisementAnalytics({
  advertisement,
  onClose,
}: AdvertisementAnalyticsProps) {
  const analyticsQuery = useAdvertisementAnalyticsQuery(advertisement.id);
  const analytics = (analyticsQuery.data as AnalyticsType) || null;
  const loading = analyticsQuery.isLoading;
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">(
    "30d"
  );
  const [activeTab, setActiveTab] = useState("overview");

  // Optionnel: recharger en fonction du filtre de période (placeholder pour futures API)
  useEffect(() => {
    analyticsQuery.refetch();
  }, [dateRange]);

  /**
   * Calcule le pourcentage de changement
   */
  const calculatePercentageChange = (
    current: number,
    previous: number
  ): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  /**
   * Obtient les données de la période précédente pour comparaison
   */
  const getPreviousPeriodData = () => {
    if (!analytics || analytics.daily_stats.length < 14) return null;

    const midPoint = Math.floor(analytics.daily_stats.length / 2);
    const currentPeriod = analytics.daily_stats.slice(midPoint);
    const previousPeriod = analytics.daily_stats.slice(0, midPoint);

    const currentImpressions = currentPeriod.reduce(
      (sum, day) => sum + day.impressions,
      0
    );
    const previousImpressions = previousPeriod.reduce(
      (sum, day) => sum + day.impressions,
      0
    );
    const currentClicks = currentPeriod.reduce(
      (sum, day) => sum + day.clicks,
      0
    );
    const previousClicks = previousPeriod.reduce(
      (sum, day) => sum + day.clicks,
      0
    );
    const currentCost = currentPeriod.reduce((sum, day) => sum + day.cost, 0);
    const previousCost = previousPeriod.reduce((sum, day) => sum + day.cost, 0);

    return {
      impressions: calculatePercentageChange(
        currentImpressions,
        previousImpressions
      ),
      clicks: calculatePercentageChange(currentClicks, previousClicks),
      cost: calculatePercentageChange(currentCost, previousCost),
      ctr: calculatePercentageChange(
        currentImpressions > 0 ? (currentClicks / currentImpressions) * 100 : 0,
        previousImpressions > 0
          ? (previousClicks / previousImpressions) * 100
          : 0
      ),
    };
  };

  const previousPeriodData = getPreviousPeriodData();

  if (loading || !analytics) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">
            Chargement des analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Analytics - {advertisement.title}
            </h2>
            <p className="text-gray-600 mt-1">
              Performances détaillées de votre publicité
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={
                advertisement.status === "active" ? "default" : "secondary"
              }
            >
              {advertisement.status}
            </Badge>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Métriques principales */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Impressions"
                value={formatNumber(analytics.total_impressions)}
                change={previousPeriodData?.impressions}
                icon={<EyeIcon className="w-6 h-6" />}
                color="blue"
              />
              <MetricCard
                title="Clics"
                value={formatNumber(analytics.total_clicks)}
                change={previousPeriodData?.clicks}
                icon={<CursorArrowRaysIcon className="w-6 h-6" />}
                color="green"
              />
              <MetricCard
                title="Taux de Clic"
                value={`${analytics.click_through_rate.toFixed(2)}%`}
                change={previousPeriodData?.ctr}
                icon={<ChartBarIcon className="w-6 h-6" />}
                color="purple"
              />
              <MetricCard
                title="Coût Total"
                value={formatCurrency(analytics.total_cost)}
                change={previousPeriodData?.cost}
                icon={<BanknotesIcon className="w-6 h-6" />}
                color="orange"
              />
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="optimization">Optimisation</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <OverviewTab
                  analytics={analytics}
                  advertisement={advertisement}
                />
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <PerformanceTab analytics={analytics} />
              </TabsContent>

              <TabsContent value="audience" className="space-y-6">
                <AudienceTab analytics={analytics} />
              </TabsContent>

              <TabsContent value="optimization" className="space-y-6">
                <OptimizationTab
                  analytics={analytics}
                  advertisement={advertisement}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={() => window.print()}>Exporter le rapport</Button>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Composant pour afficher une métrique avec changement
 */
function MetricCard({
  title,
  value,
  change,
  icon,
  color,
}: {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colorClasses = {
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
    orange: "text-orange-500",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change !== undefined && (
              <div className="flex items-center mt-2">
                {change >= 0 ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div className={`${colorClasses[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Onglet Vue d'ensemble
 */
function OverviewTab({
  analytics,
  advertisement,
}: {
  analytics: AnalyticsType;
  advertisement: Advertisement;
}) {
  const efficiency =
    analytics.total_impressions > 0
      ? (analytics.total_clicks / analytics.total_impressions) * 100
      : 0;

  const remainingBudget = advertisement.budget - advertisement.total_spent;
  const budgetUtilization =
    (advertisement.total_spent / advertisement.budget) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Résumé de la campagne */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé de la campagne</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Statut</span>
            <Badge
              variant={
                advertisement.status === "active" ? "default" : "secondary"
              }
            >
              {advertisement.status}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Budget total</span>
            <span className="font-semibold">
              {formatCurrency(advertisement.budget)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Dépensé</span>
            <span className="font-semibold">
              {formatCurrency(advertisement.total_spent)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Restant</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(remainingBudget)}
            </span>
          </div>
          <div className="pt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Utilisation du budget</span>
              <span>{budgetUtilization.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métriques clés */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques clés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Efficacité (CTR)</span>
            <span className="font-semibold">{efficiency.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Coût par clic moyen</span>
            <span className="font-semibold">
              {formatCurrency(analytics.average_cost_per_click)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Impressions par jour</span>
            <span className="font-semibold">
              {analytics.daily_stats.length > 0
                ? Math.round(
                    analytics.total_impressions / analytics.daily_stats.length
                  )
                : 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Clics par jour</span>
            <span className="font-semibold">
              {analytics.daily_stats.length > 0
                ? Math.round(
                    analytics.total_clicks / analytics.daily_stats.length
                  )
                : 0}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Onglet Performance
 */
function PerformanceTab({ analytics }: { analytics: AnalyticsType }) {
  const bestDay = analytics.daily_stats.reduce(
    (best, day) => (day.clicks > best.clicks ? day : best),
    analytics.daily_stats[0] || { date: "", clicks: 0, impressions: 0, cost: 0 }
  );

  const worstDay = analytics.daily_stats.reduce(
    (worst, day) => (day.clicks < worst.clicks ? day : worst),
    analytics.daily_stats[0] || { date: "", clicks: 0, impressions: 0, cost: 0 }
  );

  return (
    <div className="space-y-8">
      {/* Graphique de performance (simulé) */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des performances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2 p-4 bg-gray-50 rounded-lg">
            {analytics.daily_stats.slice(-14).map((day, index) => {
              const maxClicks = Math.max(
                ...analytics.daily_stats.map((d) => d.clicks)
              );
              const height = maxClicks > 0 ? (day.clicks / maxClicks) * 200 : 0;

              return (
                <div key={day.date} className="flex flex-col items-center">
                  <div
                    className="bg-primary-500 rounded-t min-h-[4px] w-6 transition-all duration-300 hover:bg-primary-600"
                    style={{ height: `${height}px` }}
                    title={`${day.clicks} clics le ${formatDate(day.date)}`}
                  />
                  <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-left">
                    {new Date(day.date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Meilleurs et pires jours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Meilleur jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                {formatDate(bestDay.date)}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Clics</p>
                  <p className="font-semibold">{bestDay.clicks}</p>
                </div>
                <div>
                  <p className="text-gray-600">Impressions</p>
                  <p className="font-semibold">{bestDay.impressions}</p>
                </div>
                <div>
                  <p className="text-gray-600">CTR</p>
                  <p className="font-semibold">
                    {bestDay.impressions > 0
                      ? ((bestDay.clicks / bestDay.impressions) * 100).toFixed(
                          2
                        )
                      : 0}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Coût</p>
                  <p className="font-semibold">
                    {formatCurrency(bestDay.cost)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">
              Jour le moins performant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                {formatDate(worstDay.date)}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Clics</p>
                  <p className="font-semibold">{worstDay.clicks}</p>
                </div>
                <div>
                  <p className="text-gray-600">Impressions</p>
                  <p className="font-semibold">{worstDay.impressions}</p>
                </div>
                <div>
                  <p className="text-gray-600">CTR</p>
                  <p className="font-semibold">
                    {worstDay.impressions > 0
                      ? (
                          (worstDay.clicks / worstDay.impressions) *
                          100
                        ).toFixed(2)
                      : 0}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Coût</p>
                  <p className="font-semibold">
                    {formatCurrency(worstDay.cost)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Onglet Audience
 */
function AudienceTab({ analytics }: { analytics: AnalyticsType }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Données d'audience</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Les données d'audience détaillées seront disponibles prochainement.
            Cette section inclura des informations sur la démographie, les
            appareils utilisés, et les heures de pointe.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Onglet Optimisation
 */
function OptimizationTab({
  analytics,
  advertisement,
}: {
  analytics: AnalyticsType;
  advertisement: Advertisement;
}) {
  const recommendations = [];

  // Générer des recommandations basées sur les performances
  if (analytics.click_through_rate < 1) {
    recommendations.push({
      type: "warning",
      title: "Taux de clic faible",
      description:
        "Votre CTR est inférieur à 1%. Considérez améliorer votre titre ou votre image.",
      action: "Modifier la publicité",
    });
  }

  if (analytics.average_cost_per_click > 1) {
    recommendations.push({
      type: "info",
      title: "Coût par clic élevé",
      description:
        "Votre CPC est élevé. Vous pourriez optimiser votre ciblage.",
      action: "Ajuster le budget",
    });
  }

  if (
    advertisement.budget - advertisement.total_spent <
    advertisement.daily_budget * 3
  ) {
    recommendations.push({
      type: "warning",
      title: "Budget bientôt épuisé",
      description:
        "Il vous reste moins de 3 jours de budget. Considérez augmenter votre budget.",
      action: "Augmenter le budget",
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recommandations d'optimisation</CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {rec.description}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      {rec.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowTrendingUpIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Excellentes performances !
              </h3>
              <p className="text-gray-600">
                Votre publicité performe bien. Continuez sur cette lancée !
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
