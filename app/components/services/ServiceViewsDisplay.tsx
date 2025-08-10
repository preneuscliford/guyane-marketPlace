import React from 'react';
import { Eye, Users, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface ServiceViewsDisplayProps {
  uniqueViews?: number;
  totalViews?: number;
  viewsToday?: number;
  viewsThisWeek?: number;
  viewsThisMonth?: number;
  showDetailed?: boolean;
  showTrending?: boolean;
  className?: string;
}

/**
 * Composant pour afficher les statistiques de vues d'un service
 * Supporte l'affichage simple ou détaillé avec tooltips informatifs
 */
export function ServiceViewsDisplay({ 
  uniqueViews = 0,
  totalViews = 0,
  viewsToday = 0,
  viewsThisWeek = 0,
  viewsThisMonth = 0,
  showDetailed = false,
  showTrending = false,
  className = ""
}: ServiceViewsDisplayProps) {
  
  // Détermine si le service est tendance (plus de 5 vues aujourd'hui)
  const isTrending = viewsToday >= 5;
  
  if (showDetailed) {
    return (
      <div className={`flex flex-wrap items-center gap-3 text-sm ${className}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-blue-600">
                <Users className="h-4 w-4" />
                <span className="font-medium">{uniqueViews}</span>
                <span className="text-gray-600">visiteurs uniques</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nombre de personnes différentes ayant vu ce service</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-gray-600">
                <Eye className="h-4 w-4" />
                <span className="font-medium">{totalViews}</span>
                <span>vues totales</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nombre total de visites (incluant les visites répétées)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {viewsToday > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">{viewsToday}</span>
                  <span>aujourd'hui</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p>Vues aujourd'hui: {viewsToday}</p>
                  <p>Cette semaine: {viewsThisWeek}</p>
                  <p>Ce mois: {viewsThisMonth}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {showTrending && isTrending && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <TrendingUp className="h-3 w-3 mr-1" />
            Tendance
          </Badge>
        )}
      </div>
    );
  }

  // Affichage simple
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Eye className="h-4 w-4" />
              <span>{totalViews || uniqueViews} vues</span>
              {showTrending && isTrending && (
                <TrendingUp className="h-3 w-3 text-orange-500 ml-1" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p>Visiteurs uniques: {uniqueViews}</p>
              <p>Vues totales: {totalViews}</p>
              {viewsToday > 0 && <p>Vues aujourd'hui: {viewsToday}</p>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

/**
 * Composant simplifié pour l'affichage dans les cartes
 * Utilise prioritairement total_views, puis views en fallback
 */
export function ServiceViewsSimple({ 
  views,
  totalViews,
  className = "" 
}: { 
  views?: number;
  totalViews?: number; 
  className?: string; 
}) {
  // Prioriser total_views, puis views en fallback
  const displayViews = totalViews ?? views ?? 0;
  
  return (
    <div className={`flex items-center gap-1 text-sm text-gray-600 ${className}`}>
      <Eye className="h-3 w-3" />
      <span>{displayViews} vues</span>
    </div>
  );
}

/**
 * Composant pour afficher les statistiques dans le dashboard du propriétaire
 */
export function ServiceViewsStats({ 
  uniqueViews = 0,
  totalViews = 0,
  viewsToday = 0,
  viewsThisWeek = 0,
  viewsThisMonth = 0,
  className = ""
}: ServiceViewsDisplayProps) {
  const engagementRate = uniqueViews > 0 ? ((totalViews / uniqueViews) * 100).toFixed(1) : '0';
  
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Visiteurs uniques</span>
        </div>
        <div className="text-2xl font-bold text-blue-900">{uniqueViews}</div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-800">Vues totales</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{totalViews}</div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">Aujourd'hui</span>
        </div>
        <div className="text-2xl font-bold text-green-900">{viewsToday}</div>
        <div className="text-xs text-green-700 mt-1">
          Cette semaine: {viewsThisWeek}
        </div>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-800">Engagement</span>
        </div>
        <div className="text-2xl font-bold text-purple-900">{engagementRate}%</div>
        <div className="text-xs text-purple-700 mt-1">
          Vues par visiteur
        </div>
      </div>
    </div>
  );
}