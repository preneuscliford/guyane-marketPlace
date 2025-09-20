'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  Advertisement,
  AdvertisementStats,
  CreateAdvertisementData,
  UpdateAdvertisementData,
  AdvertisementAnalytics,
  WeightedAdvertisement,
  AdvertisementSearchParams,
  AdvertisementResponse
} from '../types/advertisements';
import { useAuth } from './useAuth';
import { useCallback } from 'react';

// Query keys factory pour une gestion cohérente du cache
export const advertisementKeys = {
  all: ['advertisements'] as const,
  lists: () => [...advertisementKeys.all, 'list'] as const,
  list: (params: AdvertisementSearchParams = {}) => [...advertisementKeys.lists(), params] as const,
  details: () => [...advertisementKeys.all, 'detail'] as const,
  detail: (id: string) => [...advertisementKeys.details(), id] as const,
  user: (userId: string) => [...advertisementKeys.all, 'user', userId] as const,
  active: () => [...advertisementKeys.all, 'active'] as const,
  weighted: () => [...advertisementKeys.all, 'weighted'] as const,
  stats: (id: string) => [...advertisementKeys.all, 'stats', id] as const,
  analytics: (id: string) => [...advertisementKeys.all, 'analytics', id] as const,
};

/**
 * Fonctions API pour les advertisements
 */

// Fetch advertisements avec filtres
async function fetchAdvertisementsAPI(params?: AdvertisementSearchParams): Promise<AdvertisementResponse> {
  console.log('TanStack Query: fetchAdvertisementsAPI avec params:', params);
  
  let query = supabase
    .from('advertisements')
    .select('*', { count: 'exact' });

  // Appliquer les filtres
  if (params?.filters?.status) {
    query = query.in('status', params.filters.status);
  }
  if (params?.filters?.category) {
    query = query.in('category', params.filters.category);
  }
  if (params?.filters?.location) {
    query = query.in('location', params.filters.location);
  }
  if (params?.filters?.min_budget) {
    query = query.gte('budget', params.filters.min_budget);
  }
  if (params?.filters?.max_budget) {
    query = query.lte('budget', params.filters.max_budget);
  }

  // Appliquer la recherche textuelle
  if (params?.query) {
    query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`);
  }

  // Appliquer le tri
  const sortBy = params?.sort_by || 'created_at';
  const sortOrder = params?.sort_order || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Appliquer la pagination
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('TanStack Query: Erreur lors de la récupération des advertisements:', error);
    throw error;
  }

  const response: AdvertisementResponse = {
    data: (data || []) as Advertisement[],
    total: count || 0,
    page,
    limit,
    has_more: (count || 0) > page * limit
  };

  console.log('TanStack Query: Advertisements récupérés:', response);
  return response;
}

// Fetch advertisement by ID
async function fetchAdvertisementByIdAPI(id: string): Promise<Advertisement> {
  console.log('TanStack Query: fetchAdvertisementByIdAPI pour ID:', id);
  
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('TanStack Query: Erreur lors de la récupération de l\'advertisement:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Advertisement non trouvé');
  }

  console.log('TanStack Query: Advertisement récupéré:', data);
  return data as Advertisement;
}

// Fetch user advertisements
async function fetchUserAdvertisementsAPI(userId: string): Promise<Advertisement[]> {
  console.log('TanStack Query: fetchUserAdvertisementsAPI pour utilisateur:', userId);
  
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('TanStack Query: Erreur lors de la récupération des advertisements utilisateur:', error);
    throw error;
  }

  console.log('TanStack Query: Advertisements utilisateur récupérés:', data?.length || 0);
  return (data as Advertisement[]) || [];
}

// Fetch active advertisements
async function fetchActiveAdvertisementsAPI(): Promise<Advertisement[]> {
  console.log('TanStack Query: fetchActiveAdvertisementsAPI');
  
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('TanStack Query: Erreur lors de la récupération des advertisements actifs:', error);
    throw error;
  }

  const advertisements = (data || []).map(ad => ({
    ...ad,
    user_id: ad.user_id || '', // Garantir que user_id ne soit jamais null
    image_url: ad.image_url || undefined // Convertir null en undefined
  } as Advertisement));

  console.log('TanStack Query: Advertisements actifs récupérés:', advertisements.length);
  return advertisements;
}

// Create advertisement
async function createAdvertisementAPI(advertisementData: CreateAdvertisementData, userId: string): Promise<Advertisement> {
  console.log('TanStack Query: createAdvertisementAPI avec données:', advertisementData);
  
  const insertData = {
    ...advertisementData,
    user_id: userId
  };
  
  const { data, error } = await supabase
    .from('advertisements')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('TanStack Query: Erreur lors de la création de l\'advertisement:', error);
    throw new Error(`Erreur Supabase: ${error?.message || 'Erreur inconnue'}`);
  }

  console.log('TanStack Query: Advertisement créé avec succès:', data);
  return data as Advertisement;
}

// Update advertisement
async function updateAdvertisementAPI(id: string, advertisementData: UpdateAdvertisementData): Promise<Advertisement> {
  console.log('TanStack Query: updateAdvertisementAPI pour ID:', id, 'avec données:', advertisementData);
  
  const { data, error } = await supabase
    .from('advertisements')
    .update({
      ...advertisementData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('TanStack Query: Erreur lors de la mise à jour de l\'advertisement:', error);
    throw error;
  }

  console.log('TanStack Query: Advertisement mis à jour avec succès:', data);
  return data as Advertisement;
}

// Delete advertisement
async function deleteAdvertisementAPI(id: string): Promise<void> {
  console.log('TanStack Query: deleteAdvertisementAPI pour ID:', id);
  
  const { error } = await supabase
    .from('advertisements')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('TanStack Query: Erreur lors de la suppression de l\'advertisement:', error);
    throw error;
  }

  console.log('TanStack Query: Advertisement supprimé avec succès');
}

// Fetch weighted advertisements
async function fetchWeightedAdvertisementsAPI(): Promise<WeightedAdvertisement[]> {
  console.log('TanStack Query: fetchWeightedAdvertisementsAPI');
  
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .eq('status', 'active')
    .gt('budget', 0)
    .order('budget', { ascending: false });

  if (error) {
    console.error('TanStack Query: Erreur lors de la récupération des advertisements pondérés:', error);
    throw error;
  }

  const advertisements = data || [];
  
  // Calculer le poids basé sur le budget
  const calculateWeight = (advertisement: Advertisement): number => {
    const baseBudget = 1;
    const weight = Math.log(advertisement.budget + baseBudget) * 10;
    return Math.max(weight, 1);
  };

  const totalWeight = advertisements.reduce((sum, ad) => {
    if (ad.user_id !== null && typeof ad.user_id === 'string') {
      return sum + calculateWeight(ad as Advertisement);
    }
    return sum;
  }, 0);

  // Filtrer les publicités avec user_id valide et calculer les probabilités
  const validAds = advertisements.filter((ad) =>
    ad.user_id !== null && typeof ad.user_id === 'string'
  );
  
  const weighted = validAds.map(ad => {
    const weight = calculateWeight(ad as Advertisement);
    return {
      ...ad,
      user_id: ad.user_id,
      weight,
      probability: totalWeight > 0 ? weight / totalWeight : 0
    };
  });

  console.log('TanStack Query: Advertisements pondérés calculés:', weighted.length);
  return weighted as WeightedAdvertisement[];
}

// Fetch advertisement stats
async function fetchAdvertisementStatsAPI(advertisementId: string, dateRange?: { start: string; end: string }): Promise<AdvertisementStats[]> {
  console.log('TanStack Query: fetchAdvertisementStatsAPI pour advertisement:', advertisementId);
  
  // Récupérer la publicité et ses clics
  const { data: advertisement, error: adError } = await supabase
    .from('advertisements')
    .select('*')
    .eq('id', advertisementId)
    .single();

  if (adError) {
    console.error('TanStack Query: Erreur lors de la récupération de l\'advertisement:', adError);
    throw adError;
  }

  let clickQuery = supabase
    .from('advertisement_clicks')
    .select('*')
    .eq('advertisement_id', advertisementId);

  if (dateRange) {
    clickQuery = clickQuery
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);
  }

  const { data: clicks, error: clickError } = await clickQuery;

  if (clickError) {
    console.error('TanStack Query: Erreur lors de la récupération des clics:', clickError);
    throw clickError;
  }

  // Construire les statistiques basées sur l'annonce et les clics réels
  const stats: AdvertisementStats[] = [{
    id: `${advertisementId}-${Date.now()}`,
    advertisement_id: advertisementId,
    impressions: advertisement?.impressions || 0,
    clicks: clicks?.length || 0,
    cost_per_click: 0,
    date: new Date().toISOString().split('T')[0],
    created_at: advertisement?.created_at || new Date().toISOString()
  }];

  console.log('TanStack Query: Statistiques calculées:', stats);
  return stats;
}

// Calculate advertisement analytics
async function calculateAdvertisementAnalyticsAPI(advertisementId: string): Promise<AdvertisementAnalytics> {
  console.log('TanStack Query: calculateAdvertisementAnalyticsAPI pour advertisement:', advertisementId);
  
  // Récupérer la publicité
  const { data: advertisement, error: adError } = await supabase
    .from('advertisements')
    .select('*')
    .eq('id', advertisementId)
    .single();

  if (adError) {
    console.error('TanStack Query: Erreur lors de la récupération de l\'advertisement:', adError);
    throw adError;
  }

  // Récupérer les clics
  const { data: clicksData, error: clicksError } = await supabase
    .from('advertisement_clicks')
    .select('*')
    .eq('advertisement_id', advertisementId);

  if (clicksError) {
    console.error('TanStack Query: Erreur lors de la récupération des clics:', clicksError);
    throw clicksError;
  }

  const clicks = clicksData || [];
  const totalImpressions = advertisement?.impressions || 0;
  const totalClicks = clicks.length;
  const totalCost = advertisement?.total_spent || 0;

  const analytics: AdvertisementAnalytics = {
    advertisement_id: advertisementId,
    total_impressions: totalImpressions,
    total_clicks: totalClicks,
    click_through_rate: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
    total_cost: totalCost,
    average_cost_per_click: totalClicks > 0 ? totalCost / totalClicks : 0,
    daily_stats: [{
      date: new Date().toISOString().split('T')[0],
      impressions: totalImpressions,
      clicks: totalClicks,
      cost: totalCost
    }]
  };

  console.log('TanStack Query: Analytics calculés:', analytics);
  return analytics;
}

/**
 * Hooks TanStack Query pour les advertisements
 */

// Hook pour récupérer la liste des advertisements avec cache intelligent
export function useAdvertisementsQuery(params?: AdvertisementSearchParams, options?: UseQueryOptions<AdvertisementResponse, Error>) {
  return useQuery({
    queryKey: advertisementKeys.list(params),
    queryFn: () => fetchAdvertisementsAPI(params),
    staleTime: 3 * 60 * 1000, // 3 minutes - les advertisements changent régulièrement
    gcTime: 10 * 60 * 1000, // 10 minutes en cache
    ...options,
  });
}

// Hook pour récupérer un advertisement par ID avec cache
export function useAdvertisementQuery(id: string, options?: UseQueryOptions<Advertisement, Error>) {
  return useQuery({
    queryKey: advertisementKeys.detail(id),
    queryFn: () => fetchAdvertisementByIdAPI(id),
    staleTime: 5 * 60 * 1000, // 5 minutes - les détails changent moins souvent
    gcTime: 15 * 60 * 1000, // 15 minutes en cache
    enabled: !!id, // Ne pas exécuter si pas d'ID
    ...options,
  });
}

// Hook pour récupérer les advertisements de l'utilisateur connecté
export function useUserAdvertisementsQuery(options?: UseQueryOptions<Advertisement[], Error>) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: advertisementKeys.user(user?.id || ''),
    queryFn: () => fetchUserAdvertisementsAPI(user!.id),
    staleTime: 1 * 60 * 1000, // 1 minute - ses propres advertisements changent rapidement
    gcTime: 5 * 60 * 1000, // 5 minutes en cache
    enabled: !!user, // Ne pas exécuter si pas d'utilisateur
    ...options,
  });
}

// Hook pour récupérer les advertisements actifs pour le carousel
export function useActiveAdvertisementsQuery(options?: UseQueryOptions<Advertisement[], Error>) {
  return useQuery({
    queryKey: advertisementKeys.active(),
    queryFn: fetchActiveAdvertisementsAPI,
    staleTime: 2 * 60 * 1000, // 2 minutes - pour le carousel
    gcTime: 10 * 60 * 1000, // 10 minutes en cache
    refetchOnWindowFocus: false, // Pas besoin de refetch au focus pour le carousel
    ...options,
  });
}

// Hook pour récupérer les advertisements pondérés
export function useWeightedAdvertisementsQuery(options?: UseQueryOptions<WeightedAdvertisement[], Error>) {
  return useQuery({
    queryKey: advertisementKeys.weighted(),
    queryFn: fetchWeightedAdvertisementsAPI,
    staleTime: 5 * 60 * 1000, // 5 minutes - les poids changent avec les budgets
    gcTime: 15 * 60 * 1000, // 15 minutes en cache
    ...options,
  });
}

// Hook pour récupérer les statistiques d'un advertisement
export function useAdvertisementStatsQuery(advertisementId: string, dateRange?: { start: string; end: string }, options?: UseQueryOptions<AdvertisementStats[], Error>) {
  return useQuery({
    queryKey: advertisementKeys.stats(advertisementId),
    queryFn: () => fetchAdvertisementStatsAPI(advertisementId, dateRange),
    staleTime: 2 * 60 * 1000, // 2 minutes - les stats changent régulièrement
    gcTime: 10 * 60 * 1000, // 10 minutes en cache
    enabled: !!advertisementId, // Ne pas exécuter si pas d'ID
    ...options,
  });
}

// Hook pour récupérer les analytics d'un advertisement
export function useAdvertisementAnalyticsQuery(advertisementId: string, options?: UseQueryOptions<AdvertisementAnalytics, Error>) {
  return useQuery({
    queryKey: advertisementKeys.analytics(advertisementId),
    queryFn: () => calculateAdvertisementAnalyticsAPI(advertisementId),
    staleTime: 5 * 60 * 1000, // 5 minutes - les analytics changent moins souvent
    gcTime: 20 * 60 * 1000, // 20 minutes en cache
    enabled: !!advertisementId, // Ne pas exécuter si pas d'ID
    ...options,
  });
}

// Hooks de mutation avec invalidation intelligente du cache
export function useCreateAdvertisementMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (advertisementData: CreateAdvertisementData) => {
      if (!user) throw new Error('Utilisateur non connecté');
      return createAdvertisementAPI(advertisementData, user.id);
    },
    onSuccess: (newAdvertisement) => {
      console.log('TanStack Query: Mutation createAdvertisement réussie, invalidation du cache');
      
      // Invalider et refetch les listes d'advertisements
      queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
      
      // Invalider les advertisements de l'utilisateur
      if (user) {
        queryClient.invalidateQueries({ queryKey: advertisementKeys.user(user.id) });
      }
      
      // Invalider les advertisements actifs pour le carousel
      queryClient.invalidateQueries({ queryKey: advertisementKeys.active() });
      
      // Invalider les advertisements pondérés
      queryClient.invalidateQueries({ queryKey: advertisementKeys.weighted() });
      
      // Ajouter le nouvel advertisement au cache
      queryClient.setQueryData(advertisementKeys.detail(newAdvertisement.id), newAdvertisement);
    },
    onError: (error) => {
      console.error('TanStack Query: Erreur lors de la création de l\'advertisement:', error);
    }
  });
}

export function useUpdateAdvertisementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateAdvertisementData }) => {
      return updateAdvertisementAPI(id, data);
    },
    onSuccess: (updatedAdvertisement, { id }) => {
      console.log('TanStack Query: Mutation updateAdvertisement réussie, mise à jour du cache');
      
      // Mettre à jour l'advertisement spécifique dans le cache
      queryClient.setQueryData(advertisementKeys.detail(id), updatedAdvertisement);
      
      // Invalider les listes pour refléter les changements
      queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
      
      // Invalider les advertisements actifs et pondérés si le statut a changé
      queryClient.invalidateQueries({ queryKey: advertisementKeys.active() });
      queryClient.invalidateQueries({ queryKey: advertisementKeys.weighted() });
      
      // Invalider les stats et analytics
      queryClient.invalidateQueries({ queryKey: advertisementKeys.stats(id) });
      queryClient.invalidateQueries({ queryKey: advertisementKeys.analytics(id) });
    },
    onError: (error) => {
      console.error('TanStack Query: Erreur lors de la mise à jour de l\'advertisement:', error);
    }
  });
}

export function useDeleteAdvertisementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return deleteAdvertisementAPI(id);
    },
    onSuccess: (_, id) => {
      console.log('TanStack Query: Mutation deleteAdvertisement réussie, nettoyage du cache');
      
      // Supprimer l'advertisement du cache
      queryClient.removeQueries({ queryKey: advertisementKeys.detail(id) });
      queryClient.removeQueries({ queryKey: advertisementKeys.stats(id) });
      queryClient.removeQueries({ queryKey: advertisementKeys.analytics(id) });
      
      // Invalider les listes pour refléter la suppression
      queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
      
      // Invalider les advertisements actifs et pondérés
      queryClient.invalidateQueries({ queryKey: advertisementKeys.active() });
      queryClient.invalidateQueries({ queryKey: advertisementKeys.weighted() });
    },
    onError: (error) => {
      console.error('TanStack Query: Erreur lors de la suppression de l\'advertisement:', error);
    }
  });
}

/**
 * Hook utilitaire pour obtenir les mêmes fonctions que l'ancien hook
 * Maintient la compatibilité pendant la migration
 */
export function useAdvertisements() {
  const advertisementsQuery = useAdvertisementsQuery();
  const createMutation = useCreateAdvertisementMutation();
  const updateMutation = useUpdateAdvertisementMutation();
  const deleteMutation = useDeleteAdvertisementMutation();
  
  // Fonction compatible pour récupérer un advertisement par ID
  const getAdvertisementById = useCallback(async (id: string): Promise<Advertisement | null> => {
    try {
      return await fetchAdvertisementByIdAPI(id);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'advertisement:', error);
      return null;
    }
  }, []);

  return {
    // État des données - compatible avec l'ancien hook
    advertisements: advertisementsQuery.data?.data || [],
    loading: advertisementsQuery.isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: advertisementsQuery.error?.message || createMutation.error?.message || updateMutation.error?.message || deleteMutation.error?.message || null,
    
    // Fonctions - compatibles avec l'ancien hook
    fetchAdvertisements: (params?: AdvertisementSearchParams) => {
      // Pour maintenir la compatibilité, on peut forcer un refetch avec de nouveaux params
      return Promise.resolve(advertisementsQuery.data || { data: [], total: 0, page: 1, limit: 10, has_more: false });
    },
    fetchUserAdvertisements: async () => {
      // Cette fonction sera gérée par useUserAdvertisementsQuery séparément
    },
    createAdvertisement: createMutation.mutateAsync,
    updateAdvertisement: (id: string, data: UpdateAdvertisementData) => updateMutation.mutateAsync({ id, data }),
    deleteAdvertisement: deleteMutation.mutateAsync,
    getAdvertisementById,
    
    // Nouvelles propriétés TanStack Query pour un contrôle avancé
    query: advertisementsQuery,
    mutations: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
    }
  };
}

/**
 * Hook pour les statistiques avec TanStack Query
 */
export function useAdvertisementStats() {
  return {
    // Les hooks de stats/analytics sont maintenant séparés et utilisent les queries individuelles
    // useAdvertisementStatsQuery et useAdvertisementAnalyticsQuery
    recordImpression: useCallback(async (advertisementId: string, userId?: string) => {
      // Mode debug pour éviter les erreurs RLS
      console.log('Impression enregistrée (mode debug):', { advertisementId, userId });
    }, []),
    
    recordClick: useCallback(async (advertisementId: string, userId?: string) => {
      // Mode debug pour éviter les erreurs RLS
      console.log('Clic enregistré (mode debug):', { advertisementId, userId });
    }, [])
  };
}

/**
 * Hook pour le carrousel pondéré avec TanStack Query
 */
export function useWeightedCarousel() {
  const weightedAdsQuery = useWeightedAdvertisementsQuery();

  // Fonction pour sélectionner une publicité aléatoirement basée sur les poids
  const selectRandomAdvertisement = useCallback((ads: WeightedAdvertisement[]): WeightedAdvertisement | null => {
    if (ads.length === 0) return null;

    const random = Math.random();
    let cumulativeProbability = 0;

    for (const ad of ads) {
      cumulativeProbability += ad.probability;
      if (random <= cumulativeProbability) {
        return ad;
      }
    }

    // Fallback: retourner la première publicité
    return ads[0];
  }, []);

  return {
    weightedAds: weightedAdsQuery.data || [],
    loading: weightedAdsQuery.isLoading,
    selectRandomAdvertisement,
    query: weightedAdsQuery
  };
}

/**
 * Hook simple pour récupérer les publicités actives pour le carousel avec TanStack Query
 */
export function useActiveAdvertisementsForCarousel() {
  const activeAdsQuery = useActiveAdvertisementsQuery();

  return {
    advertisements: activeAdsQuery.data || [],
    loading: activeAdsQuery.isLoading,
    error: activeAdsQuery.error?.message || null,
    refetch: activeAdsQuery.refetch,
    query: activeAdsQuery
  };
}