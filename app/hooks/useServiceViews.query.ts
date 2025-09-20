'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useCallback, useEffect, useState } from 'react';

// Types
interface ViewResult {
  success: boolean;
  is_new_unique_view: boolean;
  reason?: string;
  error?: string;
}

interface ViewStats {
  unique_views: number;
  total_views: number;
  views_today: number;
  views_this_week: number;
  views_this_month: number;
}

// Query keys factory pour les vues de services
export const serviceViewKeys = {
  all: ['service-views'] as const,
  stats: (serviceId: string) => [...serviceViewKeys.all, 'stats', serviceId] as const,
};

/**
 * Génère un ID de session unique
 */
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
};

/**
 * Obtient l'ID de session depuis le sessionStorage ou en crée un nouveau
 */
const getSessionId = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  let id = sessionStorage.getItem('service_session_id');
  if (!id) {
    id = generateSessionId();
    sessionStorage.setItem('service_session_id', id);
  }
  return id;
};

/**
 * Fonctions API pour les vues de services
 */

// Obtenir l'IP du client
async function getClientIP(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('TanStack Query: Impossible d\'obtenir l\'IP client:', error);
    return null;
  }
}

// Obtenir le User Agent
function getUserAgent(): string | null {
  if (typeof window === 'undefined') return null;
  return navigator.userAgent;
}

// Incrémenter les vues d'un service
async function incrementServiceViewAPI(serviceId: string, userId?: string): Promise<ViewResult> {
  console.log('TanStack Query: incrementServiceViewAPI pour service:', serviceId);
  
  const sessionId = getSessionId();
  
  try {
    // Obtenir les informations du client
    const [ip, userAgent] = await Promise.all([
      getClientIP(),
      Promise.resolve(getUserAgent())
    ]);
    
    // Insérer directement dans service_views
    const { error } = await supabase
      .from('service_views')
      .insert({
        service_id: serviceId,
        user_id: userId || null,
        ip_address: ip as any,
        session_id: sessionId,
        user_agent: userAgent,
        viewed_at: new Date().toISOString()
      });

    if (error) {
      // Si c'est une erreur de contrainte unique (déjà vu), ce n'est pas grave
      if (error.code === '23505') {
        console.log('TanStack Query: Vue déjà enregistrée pour ce service');
        return { 
          success: true, 
          is_new_unique_view: false,
          reason: 'Vue déjà enregistrée'
        };
      }
      console.error('TanStack Query: Erreur lors de l\'incrémentation des vues:', error);
      throw error;
    }
    
    console.log('TanStack Query: Vue incrémentée avec succès');
    return { 
      success: true, 
      is_new_unique_view: true 
    };
  } catch (error) {
    console.error('TanStack Query: Erreur lors de l\'incrémentation des vues:', error);
    return { 
      success: false, 
      is_new_unique_view: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

// Récupérer les statistiques de vues d'un service
async function fetchServiceViewStatsAPI(serviceId: string): Promise<ViewStats> {
  console.log('TanStack Query: fetchServiceViewStatsAPI pour service:', serviceId);
  
  const { data: views, error } = await supabase
    .from('service_views')
    .select('*')
    .eq('service_id', serviceId);

  if (error) {
    console.error('TanStack Query: Erreur lors de la récupération des stats:', error);
    throw error;
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const totalViews = views.length;
  const uniqueViews = new Set(views.map(v => v.user_id || v.session_id || v.ip_address)).size;
  
  const viewsToday = views.filter(v => 
    new Date(v.viewed_at) >= today
  ).length;
  
  const viewsThisWeek = views.filter(v => 
    new Date(v.viewed_at) >= weekAgo
  ).length;
  
  const viewsThisMonth = views.filter(v => 
    new Date(v.viewed_at) >= monthAgo
  ).length;

  const stats: ViewStats = {
    unique_views: uniqueViews,
    total_views: totalViews,
    views_today: viewsToday,
    views_this_week: viewsThisWeek,
    views_this_month: viewsThisMonth
  };

  console.log('TanStack Query: Statistiques de vues calculées:', stats);
  return stats;
}

/**
 * Hooks TanStack Query pour les vues de services
 */

// Hook pour récupérer les statistiques de vues avec cache intelligent
export function useServiceViewStatsQuery(serviceId: string, options?: UseQueryOptions<ViewStats, Error>) {
  return useQuery({
    queryKey: serviceViewKeys.stats(serviceId),
    queryFn: () => fetchServiceViewStatsAPI(serviceId),
    staleTime: 1 * 60 * 1000, // 1 minute - les vues changent fréquemment
    gcTime: 5 * 60 * 1000, // 5 minutes en cache
    enabled: !!serviceId, // Ne pas exécuter si pas d'ID de service
    refetchOnWindowFocus: false, // Pas besoin de refetch au focus pour les stats
    ...options,
  });
}

// Mutation pour incrémenter les vues avec cache intelligent
export function useIncrementServiceViewMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (serviceId: string) => {
      return incrementServiceViewAPI(serviceId, user?.id);
    },
    onSuccess: (result, serviceId) => {
      console.log('TanStack Query: Mutation incrementServiceView réussie, invalidation du cache');
      
      // Si c'est une nouvelle vue unique, invalider les statistiques
      if (result.is_new_unique_view) {
        queryClient.invalidateQueries({ queryKey: serviceViewKeys.stats(serviceId) });
        
        // Optionnellement, invalider aussi les données du service principal
        // pour mettre à jour les compteurs de vues dans les listes
        queryClient.invalidateQueries({ queryKey: ['services'] });
      }
    },
    onError: (error) => {
      console.error('TanStack Query: Erreur lors de l\'incrémentation des vues:', error);
    },
    // Configuration pour éviter les mutations trop fréquentes
    retry: 1, // Réessayer une seule fois en cas d'erreur
  });
}

/**
 * Hook principal pour gérer les vues des services avec TanStack Query
 * Compatible avec l'ancien hook useServiceViews
 */
export function useServiceViews() {
  const incrementMutation = useIncrementServiceViewMutation();
  const { user } = useAuth();
  
  const [sessionId] = useState(() => getSessionId());

  // Fonction compatible pour incrémenter les vues
  const incrementViews = useCallback(async (serviceId: string): Promise<ViewResult> => {
    try {
      return await incrementMutation.mutateAsync(serviceId);
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
      return {
        success: false,
        is_new_unique_view: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }, [incrementMutation]);

  // Fonction compatible pour récupérer les statistiques
  const getViewStats = useCallback(async (serviceId: string): Promise<ViewStats | null> => {
    try {
      return await fetchServiceViewStatsAPI(serviceId);
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      return null;
    }
  }, []);

  return {
    incrementViews,
    getViewStats,
    sessionId,
    // Nouvelles propriétés TanStack Query pour un contrôle avancé
    mutation: incrementMutation
  };
}

/**
 * Hook pour incrémenter automatiquement les vues lors du montage du composant
 * Optimisé avec TanStack Query pour éviter les appels répétitifs
 */
export function useAutoIncrementViews(serviceId: string, enabled: boolean = true) {
  const [viewResult, setViewResult] = useState<ViewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const incrementMutation = useIncrementServiceViewMutation();

  useEffect(() => {
    if (!enabled || !serviceId) return;

    let timeoutId: NodeJS.Timeout;
    
    const incrementWithDelay = async () => {
      // Attendre un peu pour éviter les incréments accidentels lors de la navigation rapide
      timeoutId = setTimeout(async () => {
        setLoading(true);
        try {
          const result = await incrementMutation.mutateAsync(serviceId);
          setViewResult(result);
        } catch (error) {
          setViewResult({
            success: false,
            is_new_unique_view: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
          });
        } finally {
          setLoading(false);
        }
      }, 1000); // Délai de 1 seconde
    };

    incrementWithDelay();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [serviceId, enabled, incrementMutation]);

  return { 
    viewResult, 
    loading: loading || incrementMutation.isPending,
    // Nouvelle propriété pour accéder à la mutation
    mutation: incrementMutation
  };
}

/**
 * Hook simplifié pour incrémenter automatiquement les vues
 * (Alias pour useAutoIncrementViews pour la rétrocompatibilité)
 */
export function useAutoServiceViews(serviceId: string, enabled: boolean = true) {
  return useAutoIncrementViews(serviceId, enabled);
}

/**
 * Hook utilitaire pour récupérer les statistiques de vues en temps réel
 * avec rafraîchissement automatique
 */
export function useServiceViewStatsRealtime(serviceId: string, refreshInterval: number = 30000) {
  return useServiceViewStatsQuery(serviceId, {
    refetchInterval: refreshInterval, // Rafraîchir toutes les 30 secondes par défaut
    refetchIntervalInBackground: false, // Pas de rafraîchissement en arrière-plan
  });
}

/**
 * Hook pour optimiser les vues avec debouncing et cache intelligent
 * Utile pour les pages avec navigation rapide
 */
export function useOptimizedServiceViews(serviceId: string, debounceMs: number = 2000) {
  const [debouncedServiceId, setDebouncedServiceId] = useState<string>('');
  const incrementMutation = useIncrementServiceViewMutation();

  // Debounce pour éviter les incréments trop fréquents
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedServiceId(serviceId);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [serviceId, debounceMs]);

  // Auto-incrément avec le serviceId debounced
  useEffect(() => {
    if (!debouncedServiceId) return;
    
    incrementMutation.mutate(debouncedServiceId);
  }, [debouncedServiceId, incrementMutation]);

  return {
    isIncrementing: incrementMutation.isPending,
    lastResult: incrementMutation.data,
    error: incrementMutation.error,
    mutation: incrementMutation
  };
}