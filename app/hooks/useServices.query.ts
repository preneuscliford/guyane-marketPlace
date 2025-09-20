'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';
import {
  Service,
  CreateServiceData,
  UpdateServiceData,
  ServiceSearchParams,
  ServiceWithProfile,
  ServiceStats
} from '../types/services';
import { useAuth } from './useAuth';
import { useCallback } from 'react';

// Query keys factory pour une gestion cohérente du cache
export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (params: ServiceSearchParams = {}) => [...serviceKeys.lists(), params] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
  user: (userId: string) => [...serviceKeys.all, 'user', userId] as const,
  stats: () => [...serviceKeys.all, 'stats'] as const,
};

/**
 * Fonctions de service API (pour être utilisées dans les queries/mutations)
 */

// Fetch services avec filtres
async function fetchServicesAPI(params: ServiceSearchParams = {}) {
  console.log('TanStack Query: fetchServicesAPI avec params:', params);
  
  let query = supabase
    .from('services')
    .select(`
      *,
      profiles!services_user_id_fkey (
        id,
        username,
        full_name,
        avatar_url
      ),
      reviews (
        rating
      )
    `)
    .eq('status', 'active');

  // Appliquer les filtres
  if (params.category) {
    query = query.eq('category', params.category);
  }
  if (params.location) {
    query = query.ilike('location', `%${params.location}%`);
  }
  if (params.price_min !== undefined) {
    query = query.gte('price', params.price_min);
  }
  if (params.price_max !== undefined) {
    query = query.lte('price', params.price_max);
  }
  if (params.price_type) {
    query = query.eq('price_type', params.price_type);
  }
  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
  }
  if (params.tags && params.tags.length > 0) {
    query = query.overlaps('tags', params.tags);
  }

  // Tri
  const sortBy = params.sort_by || 'created_at';
  const sortOrder = params.sort_order || 'desc';
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Pagination
  if (params.limit) {
    query = query.limit(params.limit);
  }
  if (params.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('TanStack Query: Erreur lors de la récupération des services:', error);
    throw error;
  }

  if (!data) {
    console.warn('TanStack Query: Aucune donnée retournée par Supabase');
    return [];
  }

  // Calculer les statistiques d'avis pour chaque service
  const servicesWithStats = data.map((service: any) => {
    try {
      const reviews = service.reviews || [];
      let rating = 0;
      
      if (reviews && reviews.length > 0) {
        const total = reviews.reduce((sum: number, review: any) => {
          const reviewRating = typeof review.rating === 'string' 
            ? parseFloat(review.rating) || 0 
            : review.rating || 0;
          return sum + reviewRating;
        }, 0);
        rating = total / reviews.length;
      }
      
      const reviews_count = reviews ? reviews.length : 0;
      
      return {
        ...service,
        rating: Math.round(rating * 10) / 10, // Arrondir à 1 décimale
        reviews_count
      };
    } catch (err) {
      console.error('Erreur lors du traitement du service:', err);
      // Retourner le service original en cas d'erreur
      return {
        ...service,
        rating: 0,
        reviews_count: 0
      };
    }
  });

  // Tri intelligent : services récents et bien notés en premier
  const sortedServices = servicesWithStats.sort((a: any, b: any) => {
    // Calculer un score composite basé sur la note et la récence
    const now = new Date().getTime();
    const aDate = new Date(a.created_at).getTime();
    const bDate = new Date(b.created_at).getTime();
    
    // Score de récence (plus récent = score plus élevé)
    const daysDiffA = (now - aDate) / (1000 * 60 * 60 * 24);
    const daysDiffB = (now - bDate) / (1000 * 60 * 60 * 24);
    const recencyScoreA = Math.max(0, 30 - daysDiffA) / 30; // Score de 0 à 1
    const recencyScoreB = Math.max(0, 30 - daysDiffB) / 30;
    
    // Score de qualité (note moyenne)
    const qualityScoreA = a.rating / 5; // Score de 0 à 1
    const qualityScoreB = b.rating / 5;
    
    // Score composite (60% qualité, 40% récence)
    const scoreA = (qualityScoreA * 0.6) + (recencyScoreA * 0.4);
    const scoreB = (qualityScoreB * 0.6) + (recencyScoreB * 0.4);
    
    return scoreB - scoreA; // Tri décroissant
  });

  console.log('TanStack Query: Services récupérés:', sortedServices.length, sortedServices);
  return sortedServices as ServiceWithProfile[];
}

// Fetch service by ID
async function fetchServiceByIdAPI(id: string): Promise<ServiceWithProfile> {
  console.log('TanStack Query: fetchServiceByIdAPI pour ID:', id);
  
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      profiles!services_user_id_fkey (
        id,
        username,
        full_name,
        avatar_url,
        location
      ),
      reviews (
        rating
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('TanStack Query: Erreur lors de la récupération du service:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Service non trouvé');
  }

  // Calculer les statistiques d'avis
  const reviews = data.reviews || [];
  const rating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
    : 0;
  const reviews_count = reviews.length;
  
  const serviceWithStats = {
    ...data,
    rating: Math.round(rating * 10) / 10, // Arrondir à 1 décimale
    reviews_count
  };
  
  console.log('TanStack Query: Service récupéré:', serviceWithStats);
  return serviceWithStats as ServiceWithProfile;
}

// Create service
async function createServiceAPI(serviceData: CreateServiceData, userId: string): Promise<Service> {
  console.log('TanStack Query: createServiceAPI avec données:', serviceData);
  
  // Préparer les données avec tous les champs requis
  const insertData = {
    title: serviceData.title,
    description: serviceData.description,
    price: serviceData.price || null,
    category: serviceData.category,
    location: serviceData.location,
    user_id: userId,
    images: serviceData.images || [],
    status: 'active' as const,
    price_type: serviceData.price_type || 'fixed',
    availability: serviceData.availability || {},
    contact_info: serviceData.contact_info || {},
    tags: serviceData.tags || []
  };
  
  console.log('TanStack Query: Données à insérer:', insertData);
  
  const { data, error } = await supabase.from('services').insert(insertData).select().single();
  
  if (error) {
    console.error('TanStack Query: Erreur lors de la création du service:', error);
    throw new Error(`Erreur Supabase: ${error?.message || 'Erreur inconnue'}`);
  }

  console.log('TanStack Query: Service créé avec succès:', data);
  return data as Service;
}

// Update service
async function updateServiceAPI(id: string, serviceData: UpdateServiceData, userId: string): Promise<Service> {
  console.log('TanStack Query: updateServiceAPI pour ID:', id, 'avec données:', serviceData);
  
  const { data, error } = await supabase
    .from('services')
    .update(serviceData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('TanStack Query: Erreur lors de la mise à jour du service:', error);
    throw error;
  }

  console.log('TanStack Query: Service mis à jour avec succès:', data);
  return data as Service;
}

// Delete service
async function deleteServiceAPI(id: string, userId: string): Promise<void> {
  console.log('TanStack Query: deleteServiceAPI pour ID:', id);
  
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('TanStack Query: Erreur lors de la suppression du service:', error);
    throw error;
  }

  console.log('TanStack Query: Service supprimé avec succès');
}

// Fetch user services
async function fetchUserServicesAPI(userId: string): Promise<Service[]> {
  console.log('TanStack Query: fetchUserServicesAPI pour utilisateur:', userId);
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('TanStack Query: Erreur lors de la récupération des services utilisateur:', error);
    throw error;
  }

  console.log('TanStack Query: Services utilisateur récupérés:', data?.length || 0);
  return (data as Service[]) || [];
}

// Fetch service stats
async function fetchServiceStatsAPI(): Promise<ServiceStats> {
  console.log('TanStack Query: fetchServiceStatsAPI');
  
  const { data, error } = await supabase
    .from('services')
    .select('status, category, views, rating');

  if (error) {
    console.error('TanStack Query: Erreur lors de la récupération des statistiques:', error);
    throw error;
  }

  const services = data || [];
  const totalServices = services.length;
  const activeServices = services.filter(s => s.status === 'active').length;
  const totalViews = services.reduce((sum, s) => sum + (s.views || 0), 0);
  const averageRating = services.length > 0 
    ? services.reduce((sum, s) => sum + (s.rating || 0), 0) / services.length 
    : 0;

  // Compter par catégorie
  const categoriesCount = services.reduce((acc, service) => {
    acc[service.category] = (acc[service.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statsData: ServiceStats = {
    total_services: totalServices,
    active_services: activeServices,
    total_views: totalViews,
    average_rating: averageRating,
    categories_count: categoriesCount
  };

  console.log('TanStack Query: Statistiques récupérées:', statsData);
  return statsData;
}

/**
 * Hooks TanStack Query pour les services
 */

// Hook pour récupérer la liste des services avec cache intelligent
export function useServicesQuery(params: ServiceSearchParams = {}, options?: UseQueryOptions<ServiceWithProfile[], Error>) {
  return useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: () => fetchServicesAPI(params),
    staleTime: 2 * 60 * 1000, // 2 minutes - les services changent souvent
    gcTime: 10 * 60 * 1000, // 10 minutes en cache
    ...options,
  });
}

// Hook pour récupérer un service par ID avec cache
export function useServiceQuery(id: string, options?: UseQueryOptions<ServiceWithProfile, Error>) {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => fetchServiceByIdAPI(id),
    staleTime: 5 * 60 * 1000, // 5 minutes - les détails changent moins souvent
    gcTime: 15 * 60 * 1000, // 15 minutes en cache
    enabled: !!id, // Ne pas exécuter si pas d'ID
    ...options,
  });
}

// Hook pour récupérer les services de l'utilisateur connecté
export function useUserServicesQuery(options?: UseQueryOptions<Service[], Error>) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: serviceKeys.user(user?.id || ''),
    queryFn: () => fetchUserServicesAPI(user!.id),
    staleTime: 1 * 60 * 1000, // 1 minute - ses propres services changent rapidement
    gcTime: 5 * 60 * 1000, // 5 minutes en cache
    enabled: !!user, // Ne pas exécuter si pas d'utilisateur
    ...options,
  });
}

// Hook pour récupérer les statistiques des services
export function useServiceStatsQuery(options?: UseQueryOptions<ServiceStats, Error>) {
  return useQuery({
    queryKey: serviceKeys.stats(),
    queryFn: fetchServiceStatsAPI,
    staleTime: 10 * 60 * 1000, // 10 minutes - les stats changent lentement
    gcTime: 30 * 60 * 1000, // 30 minutes en cache
    ...options,
  });
}

// Hooks de mutation avec invalidation intelligente du cache
export function useCreateServiceMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (serviceData: CreateServiceData) => {
      if (!user) throw new Error('Utilisateur non connecté');
      return createServiceAPI(serviceData, user.id);
    },
    onSuccess: (newService) => {
      console.log('TanStack Query: Mutation createService réussie, invalidation du cache');
      
      // Invalider et refetch les listes de services
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      
      // Invalider les services de l'utilisateur
      if (user) {
        queryClient.invalidateQueries({ queryKey: serviceKeys.user(user.id) });
      }
      
      // Invalider les statistiques
      queryClient.invalidateQueries({ queryKey: serviceKeys.stats() });
      
      // Optionnellement, ajouter le nouveau service au cache
      queryClient.setQueryData(serviceKeys.detail(newService.id), newService);
    },
    onError: (error) => {
      console.error('TanStack Query: Erreur lors de la création du service:', error);
    }
  });
}

export function useUpdateServiceMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateServiceData }) => {
      if (!user) throw new Error('Utilisateur non connecté');
      return updateServiceAPI(id, data, user.id);
    },
    onSuccess: (updatedService, { id }) => {
      console.log('TanStack Query: Mutation updateService réussie, mise à jour du cache');
      
      // Mettre à jour le service spécifique dans le cache
      queryClient.setQueryData(serviceKeys.detail(id), updatedService);
      
      // Invalider les listes pour refléter les changements
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      
      // Invalider les services de l'utilisateur
      if (user) {
        queryClient.invalidateQueries({ queryKey: serviceKeys.user(user.id) });
      }
      
      // Invalider les statistiques si nécessaire
      queryClient.invalidateQueries({ queryKey: serviceKeys.stats() });
    },
    onError: (error) => {
      console.error('TanStack Query: Erreur lors de la mise à jour du service:', error);
    }
  });
}

export function useDeleteServiceMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (id: string) => {
      if (!user) throw new Error('Utilisateur non connecté');
      return deleteServiceAPI(id, user.id);
    },
    onSuccess: (_, id) => {
      console.log('TanStack Query: Mutation deleteService réussie, nettoyage du cache');
      
      // Supprimer le service du cache
      queryClient.removeQueries({ queryKey: serviceKeys.detail(id) });
      
      // Invalider les listes pour refléter la suppression
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      
      // Invalider les services de l'utilisateur
      if (user) {
        queryClient.invalidateQueries({ queryKey: serviceKeys.user(user.id) });
      }
      
      // Invalider les statistiques
      queryClient.invalidateQueries({ queryKey: serviceKeys.stats() });
    },
    onError: (error) => {
      console.error('TanStack Query: Erreur lors de la suppression du service:', error);
    }
  });
}

/**
 * Hook utilitaire pour obtenir les mêmes fonctions que l'ancien hook
 * Maintient la compatibilité pendant la migration
 */
export function useServices(params: ServiceSearchParams = {}) {
  const servicesQuery = useServicesQuery(params);
  const createMutation = useCreateServiceMutation();
  const updateMutation = useUpdateServiceMutation();
  const deleteMutation = useDeleteServiceMutation();
  
  // Fonction compatible pour récupérer un service par ID
  const getServiceById = useCallback(async (id: string): Promise<ServiceWithProfile | null> => {
    try {
      return await fetchServiceByIdAPI(id);
    } catch (error) {
      console.error('Erreur lors de la récupération du service:', error);
      throw error;
    }
  }, []);

  return {
    // État des données - compatible avec l'ancien hook
    services: servicesQuery.data || [],
    loading: servicesQuery.isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: servicesQuery.error?.message || createMutation.error?.message || updateMutation.error?.message || deleteMutation.error?.message || null,
    
    // Fonctions - compatibles avec l'ancien hook
    fetchServices: servicesQuery.refetch,
    getServiceById,
    createService: createMutation.mutateAsync,
    updateService: (id: string, data: UpdateServiceData) => updateMutation.mutateAsync({ id, data }),
    deleteService: deleteMutation.mutateAsync,
    getUserServices: () => {
      // Pour cette fonction, on retourne une Promise qui utilise la query
      return new Promise((resolve, reject) => {
        const { user } = useAuth();
        if (!user) {
          reject(new Error('Utilisateur non connecté'));
          return;
        }
        fetchUserServicesAPI(user.id).then(resolve).catch(reject);
      });
    },
    
    // Nouvelles propriétés TanStack Query pour un contrôle avancé
    query: servicesQuery,
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
export function useServiceStats() {
  const statsQuery = useServiceStatsQuery();

  return {
    stats: statsQuery.data || null,
    loading: statsQuery.isLoading,
    error: statsQuery.error?.message || null,
    fetchStats: statsQuery.refetch,
    query: statsQuery
  };
}