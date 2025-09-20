'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useCallback } from 'react';

// Types
interface FavoriteItem {
  id: string;
  user_id: string;
  announcement_id: string;
  created_at: string;
}

interface FavoriteResult {
  success: boolean;
  error?: string;
}

// Query keys factory pour les favoris
export const favoriteKeys = {
  all: ['favorites'] as const,
  user: (userId: string) => [...favoriteKeys.all, 'user', userId] as const,
  check: (userId: string, announcementId: string) => [...favoriteKeys.all, 'check', userId, announcementId] as const,
};

/**
 * Fonctions API pour les favoris
 */

// Récupérer tous les favoris d'un utilisateur
async function fetchUserFavoritesAPI(userId: string): Promise<string[]> {
  console.log('TanStack Query: fetchUserFavoritesAPI pour utilisateur:', userId);
  
  const { data, error } = await supabase
    .from('favorites')
    .select('announcement_id')
    .eq('user_id', userId);

  if (error) {
    console.error('TanStack Query: Erreur lors de la récupération des favoris:', error);
    throw error;
  }

  const favoriteIds = data ? data.map((item) => item.announcement_id) : [];
  console.log('TanStack Query: Favoris récupérés:', favoriteIds.length);
  return favoriteIds;
}

// Récupérer les détails complets des favoris avec les annonces
async function fetchUserFavoritesWithDetailsAPI(userId: string): Promise<FavoriteItem[]> {
  console.log('TanStack Query: fetchUserFavoritesWithDetailsAPI pour utilisateur:', userId);
  
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      announcements (
        id,
        title,
        description,
        price,
        images,
        created_at,
        status
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('TanStack Query: Erreur lors de la récupération des favoris avec détails:', error);
    throw error;
  }

  console.log('TanStack Query: Favoris avec détails récupérés:', data?.length || 0);
  return (data as FavoriteItem[]) || [];
}

// Vérifier si une annonce est en favori
async function checkIsFavoriteAPI(userId: string, announcementId: string): Promise<boolean> {
  console.log('TanStack Query: checkIsFavoriteAPI pour utilisateur:', userId, 'annonce:', announcementId);
  
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('announcement_id', announcementId)
    .single();

  if (error) {
    // Si l'erreur est "not found", ce n'est pas un favori
    if (error.code === 'PGRST116') {
      return false;
    }
    console.error('TanStack Query: Erreur lors de la vérification du favori:', error);
    throw error;
  }

  const isFav = !!data;
  console.log('TanStack Query: Favori vérifié:', isFav);
  return isFav;
}

// Ajouter aux favoris
async function addFavoriteAPI(userId: string, announcementId: string): Promise<FavoriteResult> {
  console.log('TanStack Query: addFavoriteAPI pour utilisateur:', userId, 'annonce:', announcementId);
  
  const { error } = await supabase
    .from('favorites')
    .insert({
      user_id: userId,
      announcement_id: announcementId,
    });

  if (error) {
    console.error('TanStack Query: Erreur lors de l\'ajout du favori:', error);
    // Si c'est une contrainte unique (déjà en favori), ce n'est pas vraiment une erreur
    if (error.code === '23505') {
      return { success: true };
    }
    return { 
      success: false, 
      error: error.message 
    };
  }

  console.log('TanStack Query: Favori ajouté avec succès');
  return { success: true };
}

// Supprimer des favoris
async function removeFavoriteAPI(userId: string, announcementId: string): Promise<FavoriteResult> {
  console.log('TanStack Query: removeFavoriteAPI pour utilisateur:', userId, 'annonce:', announcementId);
  
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('announcement_id', announcementId);

  if (error) {
    console.error('TanStack Query: Erreur lors de la suppression du favori:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }

  console.log('TanStack Query: Favori supprimé avec succès');
  return { success: true };
}

/**
 * Hooks TanStack Query pour les favoris
 */

// Hook pour récupérer les favoris de l'utilisateur (IDs uniquement)
export function useFavoritesQuery(options?: UseQueryOptions<string[], Error>) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: favoriteKeys.user(user?.id || ''),
    queryFn: () => fetchUserFavoritesAPI(user!.id),
    staleTime: 2 * 60 * 1000, // 2 minutes - les favoris changent moyennement
    gcTime: 10 * 60 * 1000, // 10 minutes en cache
    enabled: !!user, // Ne pas exécuter si pas d'utilisateur
    ...options,
  });
}

// Hook pour récupérer les favoris avec les détails des annonces
export function useFavoritesWithDetailsQuery(options?: UseQueryOptions<FavoriteItem[], Error>) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: [...favoriteKeys.user(user?.id || ''), 'details'],
    queryFn: () => fetchUserFavoritesWithDetailsAPI(user!.id),
    staleTime: 3 * 60 * 1000, // 3 minutes - plus de données à charger
    gcTime: 15 * 60 * 1000, // 15 minutes en cache
    enabled: !!user, // Ne pas exécuter si pas d'utilisateur
    ...options,
  });
}

// Hook pour vérifier si une annonce spécifique est en favori
export function useIsFavoriteQuery(announcementId: string, options?: UseQueryOptions<boolean, Error>) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: favoriteKeys.check(user?.id || '', announcementId),
    queryFn: () => checkIsFavoriteAPI(user!.id, announcementId),
    staleTime: 1 * 60 * 1000, // 1 minute - information critique pour l'UI
    gcTime: 5 * 60 * 1000, // 5 minutes en cache
    enabled: !!user && !!announcementId, // Ne pas exécuter si pas d'utilisateur ou d'ID
    ...options,
  });
}

// Mutations pour les favoris avec optimistic updates
export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (announcementId: string) => {
      if (!user) throw new Error('Utilisateur non connecté');
      return addFavoriteAPI(user.id, announcementId);
    },
    // Optimistic update - mettre à jour l'UI immédiatement
    onMutate: async (announcementId) => {
      if (!user) return;

      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: favoriteKeys.user(user.id) });
      await queryClient.cancelQueries({ queryKey: favoriteKeys.check(user.id, announcementId) });

      // Sauvegarder l'état précédent
      const previousFavorites = queryClient.getQueryData<string[]>(favoriteKeys.user(user.id));
      const previousIsFavorite = queryClient.getQueryData<boolean>(favoriteKeys.check(user.id, announcementId));

      // Mise à jour optimiste
      if (previousFavorites && !previousFavorites.includes(announcementId)) {
        queryClient.setQueryData<string[]>(favoriteKeys.user(user.id), [...previousFavorites, announcementId]);
      }
      queryClient.setQueryData<boolean>(favoriteKeys.check(user.id, announcementId), true);

      // Retourner le contexte pour le rollback si nécessaire
      return { previousFavorites, previousIsFavorite, announcementId };
    },
    onError: (error, announcementId, context) => {
      console.error('TanStack Query: Erreur lors de l\'ajout du favori:', error);
      
      // Rollback en cas d'erreur
      if (context && user) {
        if (context.previousFavorites) {
          queryClient.setQueryData<string[]>(favoriteKeys.user(user.id), context.previousFavorites);
        }
        if (context.previousIsFavorite !== undefined) {
          queryClient.setQueryData<boolean>(favoriteKeys.check(user.id, announcementId), context.previousIsFavorite);
        }
      }
    },
    onSettled: (data, error, announcementId) => {
      if (!user) return;
      
      // Refetch pour s'assurer que les données sont à jour
      queryClient.invalidateQueries({ queryKey: favoriteKeys.user(user.id) });
      queryClient.invalidateQueries({ queryKey: favoriteKeys.check(user.id, announcementId) });
    }
  });
}

export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (announcementId: string) => {
      if (!user) throw new Error('Utilisateur non connecté');
      return removeFavoriteAPI(user.id, announcementId);
    },
    // Optimistic update - mettre à jour l'UI immédiatement
    onMutate: async (announcementId) => {
      if (!user) return;

      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: favoriteKeys.user(user.id) });
      await queryClient.cancelQueries({ queryKey: favoriteKeys.check(user.id, announcementId) });

      // Sauvegarder l'état précédent
      const previousFavorites = queryClient.getQueryData<string[]>(favoriteKeys.user(user.id));
      const previousIsFavorite = queryClient.getQueryData<boolean>(favoriteKeys.check(user.id, announcementId));

      // Mise à jour optimiste
      if (previousFavorites) {
        queryClient.setQueryData<string[]>(favoriteKeys.user(user.id), 
          previousFavorites.filter(id => id !== announcementId)
        );
      }
      queryClient.setQueryData<boolean>(favoriteKeys.check(user.id, announcementId), false);

      // Retourner le contexte pour le rollback si nécessaire
      return { previousFavorites, previousIsFavorite, announcementId };
    },
    onError: (error, announcementId, context) => {
      console.error('TanStack Query: Erreur lors de la suppression du favori:', error);
      
      // Rollback en cas d'erreur
      if (context && user) {
        if (context.previousFavorites) {
          queryClient.setQueryData<string[]>(favoriteKeys.user(user.id), context.previousFavorites);
        }
        if (context.previousIsFavorite !== undefined) {
          queryClient.setQueryData<boolean>(favoriteKeys.check(user.id, announcementId), context.previousIsFavorite);
        }
      }
    },
    onSettled: (data, error, announcementId) => {
      if (!user) return;
      
      // Refetch pour s'assurer que les données sont à jour
      queryClient.invalidateQueries({ queryKey: favoriteKeys.user(user.id) });
      queryClient.invalidateQueries({ queryKey: favoriteKeys.check(user.id, announcementId) });
    }
  });
}

// Mutation pour toggle (ajouter/supprimer) un favori
export function useToggleFavoriteMutation() {
  const addMutation = useAddFavoriteMutation();
  const removeMutation = useRemoveFavoriteMutation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (announcementId: string) => {
      if (!user) throw new Error('Utilisateur non connecté');
      
      // Vérifier l'état actuel
      const currentIsFavorite = queryClient.getQueryData<boolean>(
        favoriteKeys.check(user.id, announcementId)
      ) ?? false;
      
      if (currentIsFavorite) {
        return await removeFavoriteAPI(user.id, announcementId);
      } else {
        return await addFavoriteAPI(user.id, announcementId);
      }
    },
    onSuccess: (result, announcementId) => {
      if (!user) return;
      
      console.log('TanStack Query: Toggle favori réussi');
      
      // Invalider les caches pour refléter le changement
      queryClient.invalidateQueries({ queryKey: favoriteKeys.user(user.id) });
      queryClient.invalidateQueries({ queryKey: favoriteKeys.check(user.id, announcementId) });
    },
    onError: (error) => {
      console.error('TanStack Query: Erreur lors du toggle favori:', error);
    }
  });
}

/**
 * Hook principal pour gérer les favoris avec TanStack Query
 * Compatible avec l'ancien hook useFavorites
 */
export function useFavorites() {
  const favoritesQuery = useFavoritesQuery();
  const addMutation = useAddFavoriteMutation();
  const removeMutation = useRemoveFavoriteMutation();
  const toggleMutation = useToggleFavoriteMutation();
  
  // Fonction compatible pour vérifier si un item est favori
  const isFavorite = useCallback((announcementId: string): boolean => {
    const favorites = favoritesQuery.data || [];
    return favorites.includes(announcementId);
  }, [favoritesQuery.data]);

  // Fonctions compatibles avec l'ancien hook
  const addFavorite = useCallback(async (announcementId: string): Promise<FavoriteResult> => {
    try {
      return await addMutation.mutateAsync(announcementId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add favorite'
      };
    }
  }, [addMutation]);

  const removeFavorite = useCallback(async (announcementId: string): Promise<FavoriteResult> => {
    try {
      return await removeMutation.mutateAsync(announcementId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove favorite'
      };
    }
  }, [removeMutation]);

  const toggleFavorite = useCallback(async (announcementId: string): Promise<FavoriteResult> => {
    try {
      return await toggleMutation.mutateAsync(announcementId);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to toggle favorite'
      };
    }
  }, [toggleMutation]);

  return {
    // État des données - compatible avec l'ancien hook
    favorites: favoritesQuery.data || [],
    loading: favoritesQuery.isLoading || addMutation.isPending || removeMutation.isPending || toggleMutation.isPending,
    
    // Fonctions - compatibles avec l'ancien hook
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refreshFavorites: favoritesQuery.refetch,
    
    // Nouvelles propriétés TanStack Query pour un contrôle avancé
    query: favoritesQuery,
    mutations: {
      add: addMutation,
      remove: removeMutation,
      toggle: toggleMutation,
    }
  };
}