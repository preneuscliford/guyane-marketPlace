/**
 * Hook TanStack Query pour la gestion des annonces
 * Fournit des fonctionnalités CRUD optimisées avec cache intelligent,
 * filtrage par catégorie, recherche géographique et gestion des favoris
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { getCacheConfig } from './cacheConfig';
import { Database } from '@/app/types/supabase';

// ============================================================================
// TYPES ET INTERFACES
// ============================================================================

type AnnouncementRow = Database['public']['Tables']['announcements']['Row'];
type AnnouncementInsert = Database['public']['Tables']['announcements']['Insert'];
type AnnouncementUpdate = Database['public']['Tables']['announcements']['Update'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type FavoriteRow = Database['public']['Tables']['favorites']['Row'];

export interface AnnouncementWithDetails extends AnnouncementRow {
  profiles?: ProfileRow;
  is_favorite?: boolean;
  favorites_count?: number;
  favorites?: FavoriteRow[];
}

export interface AnnouncementFilters {
  category?: string;
  location?: string;
  searchQuery?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'recent' | 'price_asc' | 'price_desc' | 'popular' | 'location';
  userId?: string;
  isHidden?: boolean;
}

export interface CreateAnnouncementData {
  title: string;
  description: string;
  category: string;
  location: string;
  price?: number;
  images?: string[];
}

export interface UpdateAnnouncementData {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  price?: number;
  images?: string[];
}

export interface AnnouncementStats {
  total_announcements: number;
  announcements_today: number;
  categories_count: number;
  average_price: number;
  popular_categories: { category: string; count: number }[];
}

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const announcementKeys = {
  all: ['announcements'] as const,
  lists: () => [...announcementKeys.all, 'list'] as const,
  list: (filters: AnnouncementFilters) => [...announcementKeys.lists(), filters] as const,
  infinite: (filters: AnnouncementFilters) => [...announcementKeys.all, 'infinite', filters] as const,
  details: () => [...announcementKeys.all, 'detail'] as const,
  detail: (id: string) => [...announcementKeys.details(), id] as const,
  userAnnouncements: (userId: string) => [...announcementKeys.all, 'user', userId] as const,
  categoryAnnouncements: (category: string) => [...announcementKeys.all, 'category', category] as const,
  locationAnnouncements: (location: string) => [...announcementKeys.all, 'location', location] as const,
  stats: () => [...announcementKeys.all, 'stats'] as const,
  categories: () => [...announcementKeys.all, 'categories'] as const,
  locations: () => [...announcementKeys.all, 'locations'] as const,
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Récupère une liste d'annonces avec filtrage et tri
 */
export const fetchAnnouncementsAPI = async (
  filters: AnnouncementFilters = {}
): Promise<AnnouncementWithDetails[]> => {
  const {
    category,
    location,
    searchQuery = '',
    priceMin,
    priceMax,
    sortBy = 'recent',
    userId,
    isHidden = false,
  } = filters;

  try {
    let query = supabase
      .from('announcements')
      .select(`
        *,
        profiles:user_id(id, username, avatar_url, full_name, business_name, phone),
        favorites(user_id)
      `)
      .eq('is_hidden', isHidden);

    // Filtrage par catégorie
    if (category) {
      query = query.eq('category', category);
    }

    // Filtrage par localisation
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Filtrage par utilisateur
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Filtrage par recherche textuelle
    if (searchQuery.trim()) {
      query = query.or(
        `title.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%`
      );
    }

    // Filtrage par prix
    if (priceMin !== undefined) {
      query = query.gte('price', priceMin);
    }
    if (priceMax !== undefined) {
      query = query.lte('price', priceMax);
    }

    // Tri des résultats
    switch (sortBy) {
      case 'recent':
        query = query.order('created_at', { ascending: false });
        break;
      case 'price_asc':
        query = query.order('price', { ascending: true, nullsFirst: false });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false, nullsFirst: false });
        break;
      case 'popular':
        // Tri par nombre de favoris (calculé côté client)
        query = query.order('created_at', { ascending: false });
        break;
      case 'location':
        query = query.order('location', { ascending: true }).order('created_at', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    query = query.limit(50);

    const { data: announcementsData, error } = await query;

    if (error) {
      throw new Error(`Erreur lors de la récupération des annonces: ${error.message}`);
    }

    if (!announcementsData) {
      return [];
    }

    // Enrichir avec le nombre de favoris
    const enrichedAnnouncements: AnnouncementWithDetails[] = announcementsData.map((announcement: any) => ({
      ...announcement,
      favorites_count: announcement.favorites?.length || 0,
      is_favorite: false, // Sera mis à jour par useUserFavoritesSync
      profiles: announcement.profiles || null,
    }));

    // Tri côté client pour les annonces populaires
    if (sortBy === 'popular') {
      enrichedAnnouncements.sort((a, b) => (b.favorites_count || 0) - (a.favorites_count || 0));
    }

    return enrichedAnnouncements;
  } catch (error) {
    console.error('Erreur dans fetchAnnouncementsAPI:', error);
    throw error;
  }
};

/**
 * Récupère une annonce spécifique avec tous ses détails
 */
export const fetchAnnouncementByIdAPI = async (announcementId: string): Promise<AnnouncementWithDetails> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select(`
        *,
        profiles:user_id(id, username, avatar_url, full_name, business_name, phone, address),
        favorites(user_id)
      `)
      .eq('id', announcementId)
      .single();

    if (error) {
      throw new Error(`Annonce non trouvée: ${error.message}`);
    }

    if (!data) {
      throw new Error('Annonce non trouvée');
    }

    return {
      ...data,
      favorites_count: (data as any).favorites?.length || 0,
      is_favorite: false, // Sera mis à jour par useUserFavoritesSync
      profiles: (data as any).profiles || null,
    };
  } catch (error) {
    console.error('Erreur dans fetchAnnouncementByIdAPI:', error);
    throw error;
  }
};

/**
 * Crée une nouvelle annonce
 */
export const createAnnouncementAPI = async (
  announcementData: CreateAnnouncementData
): Promise<AnnouncementWithDetails> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('Utilisateur non authentifié');
    }

    const newAnnouncement: AnnouncementInsert = {
      title: announcementData.title,
      description: announcementData.description,
      category: announcementData.category,
      location: announcementData.location,
      price: announcementData.price || null,
      images: announcementData.images || null,
      user_id: userData.user.id,
    };

    const { data, error } = await supabase
      .from('announcements')
      .insert(newAnnouncement)
      .select(`
        *,
        profiles:user_id(id, username, avatar_url, full_name, business_name, phone)
      `)
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création de l'annonce: ${error.message}`);
    }

    return {
      ...data,
      favorites_count: 0,
      is_favorite: false,
      favorites: [],
      profiles: (data as any).profiles || null,
    };
  } catch (error) {
    console.error('Erreur dans createAnnouncementAPI:', error);
    throw error;
  }
};

/**
 * Met à jour une annonce existante
 */
export const updateAnnouncementAPI = async ({
  announcementId,
  updateData,
}: {
  announcementId: string;
  updateData: UpdateAnnouncementData;
}): Promise<AnnouncementWithDetails> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('Utilisateur non authentifié');
    }

    const updatePayload: AnnouncementUpdate = {
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('announcements')
      .update(updatePayload)
      .eq('id', announcementId)
      .eq('user_id', userData.user.id) // S'assurer que l'utilisateur peut seulement modifier ses propres annonces
      .select(`
        *,
        profiles:user_id(id, username, avatar_url, full_name, business_name, phone),
        favorites(user_id)
      `)
      .single();

    if (error) {
      throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
    }

    if (!data) {
      throw new Error('Annonce non trouvée ou permission refusée');
    }

    return {
      ...data,
      favorites_count: (data as any).favorites?.length || 0,
      is_favorite: false,
      profiles: (data as any).profiles || null,
    };
  } catch (error) {
    console.error('Erreur dans updateAnnouncementAPI:', error);
    throw error;
  }
};

/**
 * Supprime une annonce
 */
export const deleteAnnouncementAPI = async (announcementId: string): Promise<void> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', announcementId)
      .eq('user_id', userData.user.id); // S'assurer que l'utilisateur peut seulement supprimer ses propres annonces

    if (error) {
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  } catch (error) {
    console.error('Erreur dans deleteAnnouncementAPI:', error);
    throw error;
  }
};

/**
 * Récupère les statistiques des annonces
 */
export const fetchAnnouncementStatsAPI = async (): Promise<AnnouncementStats> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // Compter les annonces totales
    const { count: totalAnnouncements } = await supabase
      .from('announcements')
      .select('*', { count: 'exact', head: true })
      .eq('is_hidden', false);

    // Compter les annonces d'aujourd'hui
    const { count: announcementsToday } = await supabase
      .from('announcements')
      .select('*', { count: 'exact', head: true })
      .eq('is_hidden', false)
      .gte('created_at', todayISO);

    // Récupérer les catégories et leur popularité
    const { data: categoriesData } = await supabase
      .from('announcements')
      .select('category')
      .eq('is_hidden', false);

    const categoriesCount = new Set(categoriesData?.map(a => a.category) || []).size;

    // Calculer les catégories populaires
    const categoryCountMap = (categoriesData || []).reduce((acc: any, announcement) => {
      acc[announcement.category] = (acc[announcement.category] || 0) + 1;
      return acc;
    }, {});

    const popularCategories = Object.entries(categoryCountMap)
      .map(([category, count]) => ({ category, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculer le prix moyen
    const { data: pricesData } = await supabase
      .from('announcements')
      .select('price')
      .eq('is_hidden', false)
      .not('price', 'is', null);

    const prices = (pricesData || []).map(a => a.price).filter(Boolean) as number[];
    const averagePrice = prices.length > 0 
      ? prices.reduce((sum, price) => sum + price, 0) / prices.length 
      : 0;

    return {
      total_announcements: totalAnnouncements || 0,
      announcements_today: announcementsToday || 0,
      categories_count: categoriesCount,
      average_price: Math.round(averagePrice * 100) / 100,
      popular_categories: popularCategories,
    };
  } catch (error) {
    console.error('Erreur dans fetchAnnouncementStatsAPI:', error);
    throw error;
  }
};

/**
 * Récupère la liste des catégories disponibles
 */
export const fetchCategoriesAPI = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('category')
      .eq('is_hidden', false);

    if (error) {
      throw new Error(`Erreur lors de la récupération des catégories: ${error.message}`);
    }

    const categories = [...new Set((data || []).map(a => a.category))].sort();
    return categories;
  } catch (error) {
    console.error('Erreur dans fetchCategoriesAPI:', error);
    return [];
  }
};

/**
 * Récupère la liste des localisations disponibles
 */
export const fetchLocationsAPI = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('location')
      .eq('is_hidden', false);

    if (error) {
      throw new Error(`Erreur lors de la récupération des localisations: ${error.message}`);
    }

    const locations = [...new Set((data || []).map(a => a.location))].sort();
    return locations;
  } catch (error) {
    console.error('Erreur dans fetchLocationsAPI:', error);
    return [];
  }
};

// ============================================================================
// HOOKS TANSTACK QUERY
// ============================================================================

/**
 * Hook pour récupérer une liste d'annonces avec filtrage
 */
export const useAnnouncementsQuery = (filters: AnnouncementFilters = {}) => {
  const cacheConfig = getCacheConfig('marketplace_data');
  
  return useQuery({
    queryKey: announcementKeys.list(filters),
    queryFn: () => fetchAnnouncementsAPI(filters),
    ...cacheConfig,
    retry: 2,
  });
};

/**
 * Hook pour récupérer une annonce spécifique
 */
export const useAnnouncementQuery = (announcementId: string) => {
  const cacheConfig = getCacheConfig('marketplace_data');
  
  return useQuery({
    queryKey: announcementKeys.detail(announcementId),
    queryFn: () => fetchAnnouncementByIdAPI(announcementId),
    ...cacheConfig,
    enabled: !!announcementId,
  });
};

/**
 * Hook pour récupérer les annonces d'un utilisateur
 */
export const useUserAnnouncementsQuery = (userId: string) => {
  const cacheConfig = getCacheConfig('user_content');
  
  return useQuery({
    queryKey: announcementKeys.userAnnouncements(userId),
    queryFn: () => fetchAnnouncementsAPI({ userId }),
    ...cacheConfig,
    enabled: !!userId,
  });
};

/**
 * Hook pour récupérer les annonces par catégorie
 */
export const useCategoryAnnouncementsQuery = (category: string) => {
  const cacheConfig = getCacheConfig('marketplace_data');
  
  return useQuery({
    queryKey: announcementKeys.categoryAnnouncements(category),
    queryFn: () => fetchAnnouncementsAPI({ category }),
    ...cacheConfig,
    enabled: !!category,
  });
};

/**
 * Hook pour récupérer les statistiques des annonces
 */
export const useAnnouncementStatsQuery = () => {
  const cacheConfig = getCacheConfig('analytics_data');
  
  return useQuery({
    queryKey: announcementKeys.stats(),
    queryFn: fetchAnnouncementStatsAPI,
    ...cacheConfig,
    refetchInterval: 10 * 60 * 1000, // Mise à jour toutes les 10 minutes
  });
};

/**
 * Hook pour récupérer la liste des catégories
 */
export const useCategoriesQuery = () => {
  const cacheConfig = getCacheConfig('static_data');
  
  return useQuery({
    queryKey: announcementKeys.categories(),
    queryFn: fetchCategoriesAPI,
    ...cacheConfig,
  });
};

/**
 * Hook pour récupérer la liste des localisations
 */
export const useLocationsQuery = () => {
  const cacheConfig = getCacheConfig('static_data');
  
  return useQuery({
    queryKey: announcementKeys.locations(),
    queryFn: fetchLocationsAPI,
    ...cacheConfig,
  });
};

/**
 * Hook de mutation pour créer une nouvelle annonce
 */
export const useCreateAnnouncementMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAnnouncementAPI,
    onMutate: async (newAnnouncementData) => {
      // Optimistic update: ajouter la nouvelle annonce à la liste
      const optimisticAnnouncement: AnnouncementWithDetails = {
        id: `temp-${Date.now()}`,
        title: newAnnouncementData.title,
        description: newAnnouncementData.description,
        category: newAnnouncementData.category,
        location: newAnnouncementData.location,
        price: newAnnouncementData.price || null,
        images: newAnnouncementData.images || null,
        user_id: '', // Sera mis à jour avec les vraies données
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_hidden: false,
        hidden_at: null,
        hidden_by: null,
        hidden_reason: null,
        read: false,
        favorites_count: 0,
        is_favorite: false,
        profiles: null,
        favorites: [],
      };

      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: announcementKeys.lists() });

      // Sauvegarder l'état précédent
      const previousAnnouncements = queryClient.getQueriesData({ queryKey: announcementKeys.lists() });

      // Mettre à jour de manière optimiste
      queryClient.setQueriesData<AnnouncementWithDetails[]>(
        { queryKey: announcementKeys.lists() },
        (oldData) => oldData ? [optimisticAnnouncement, ...oldData] : [optimisticAnnouncement]
      );

      return { previousAnnouncements, optimisticAnnouncement };
    },
    onSuccess: (newAnnouncement, variables, context) => {
      // Remplacer l'annonce optimiste par la vraie annonce
      queryClient.setQueriesData<AnnouncementWithDetails[]>(
        { queryKey: announcementKeys.lists() },
        (oldData) => 
          oldData 
            ? oldData.map(announcement => 
                announcement.id === context?.optimisticAnnouncement.id ? newAnnouncement : announcement
              )
            : [newAnnouncement]
      );

      // Invalider et refetch les données
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: announcementKeys.stats() });
      queryClient.invalidateQueries({ queryKey: announcementKeys.categories() });
      queryClient.invalidateQueries({ queryKey: announcementKeys.locations() });

      toast.success('Annonce publiée avec succès !');
    },
    onError: (error, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousAnnouncements) {
        context.previousAnnouncements.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      console.error('Erreur lors de la création de l\'annonce:', error);
      toast.error(`Erreur lors de la publication: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
  });
};

/**
 * Hook de mutation pour mettre à jour une annonce
 */
export const useUpdateAnnouncementMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateAnnouncementAPI,
    onSuccess: (updatedAnnouncement) => {
      // Mettre à jour le cache
      queryClient.setQueryData(
        announcementKeys.detail(updatedAnnouncement.id),
        updatedAnnouncement
      );

      // Mettre à jour dans toutes les listes
      queryClient.setQueriesData<AnnouncementWithDetails[]>(
        { queryKey: announcementKeys.lists() },
        (oldData) => 
          oldData 
            ? oldData.map(announcement => 
                announcement.id === updatedAnnouncement.id ? updatedAnnouncement : announcement
              )
            : [updatedAnnouncement]
      );

      toast.success('Annonce modifiée avec succès !');
    },
    onError: (error) => {
      console.error('Erreur lors de la modification de l\'annonce:', error);
      toast.error(`Erreur lors de la modification: ${error.message}`);
    },
    onSettled: (updatedAnnouncement) => {
      if (updatedAnnouncement) {
        queryClient.invalidateQueries({ queryKey: announcementKeys.detail(updatedAnnouncement.id) });
      }
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
  });
};

/**
 * Hook de mutation pour supprimer une annonce
 */
export const useDeleteAnnouncementMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAnnouncementAPI,
    onMutate: async (announcementId) => {
      // Optimistic update: retirer l'annonce de la liste
      await queryClient.cancelQueries({ queryKey: announcementKeys.lists() });
      
      const previousAnnouncements = queryClient.getQueriesData({ queryKey: announcementKeys.lists() });
      
      queryClient.setQueriesData<AnnouncementWithDetails[]>(
        { queryKey: announcementKeys.lists() },
        (oldData) => oldData ? oldData.filter(announcement => announcement.id !== announcementId) : []
      );

      return { previousAnnouncements, announcementId };
    },
    onSuccess: (_, announcementId) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: announcementKeys.detail(announcementId) });
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: announcementKeys.stats() });

      toast.success('Annonce supprimée avec succès !');
    },
    onError: (error, announcementId, context) => {
      // Rollback en cas d'erreur
      if (context?.previousAnnouncements) {
        context.previousAnnouncements.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      console.error('Erreur lors de la suppression de l\'annonce:', error);
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
  });
};