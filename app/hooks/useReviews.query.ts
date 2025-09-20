'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useCallback } from 'react';

// Types
interface Review {
  id: string;
  user_id: string;
  target_user_id: string;
  announcement_id: string | null;
  service_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

interface UseReviewsParams {
  targetUserId?: string;
  announcementId?: string;
  serviceId?: string;
}

interface CreateReviewData {
  targetUserId: string;
  announcementId?: string | null;
  serviceId?: string | null;
  rating: number;
  comment?: string | null;
}

interface UpdateReviewData {
  id: string;
  rating: number;
  comment: string | null;
}

interface ReviewResult {
  success: boolean;
  error?: string;
}

// Query keys factory pour les reviews
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (params: UseReviewsParams) => [...reviewKeys.lists(), params] as const,
  user: (userId: string) => [...reviewKeys.all, 'user', userId] as const,
  userForTarget: (userId: string, params: UseReviewsParams) => [...reviewKeys.user(userId), 'target', params] as const,
  stats: (params: UseReviewsParams) => [...reviewKeys.all, 'stats', params] as const,
};

/**
 * Fonctions API pour les reviews
 */

// Récupérer les reviews avec profils
async function fetchReviewsAPI(params: UseReviewsParams): Promise<Review[]> {
  console.log('TanStack Query: fetchReviewsAPI avec params:', params);
  
  let query = supabase
    .from('reviews')
    .select(`
      *
    `)
    .order('created_at', { ascending: false });

  if (params.targetUserId) {
    query = query.eq('target_user_id', params.targetUserId);
  }

  if (params.announcementId) {
    query = query.eq('announcement_id', params.announcementId);
  }

  if (params.serviceId) {
    query = query.eq('service_id', params.serviceId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('TanStack Query: Erreur lors de la récupération des reviews:', error);
    throw error;
  }

  if (!data) {
    return [];
  }

  // Récupérer les profils utilisateurs pour chaque review
  const userIds = [...new Set(data.map(review => review.user_id))];
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', userIds);

  // Associer les profils aux reviews
  const reviewsWithProfiles = data.map(review => ({
    ...review,
    service_id: review.service_id || null,
    profiles: profilesData?.find(profile => profile.id === review.user_id) || null
  })) as Review[];

  console.log('TanStack Query: Reviews récupérés:', reviewsWithProfiles.length);
  return reviewsWithProfiles;
}

// Calculer les statistiques des reviews
function calculateReviewStats(reviews: Review[]): ReviewStats {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = totalRating / reviews.length;
  
  // Calculate rating distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++;
  });

  return {
    averageRating: parseFloat(average.toFixed(1)),
    totalReviews: reviews.length,
    ratingDistribution: distribution
  };
}

// Récupérer le review de l'utilisateur actuel
async function fetchUserReviewAPI(userId: string, params: UseReviewsParams): Promise<Review | null> {
  console.log('TanStack Query: fetchUserReviewAPI pour utilisateur:', userId, 'params:', params);
  
  let query = supabase
    .from('reviews')
    .select(`
      *
    `)
    .eq('user_id', userId);

  if (params.targetUserId) {
    query = query.eq('target_user_id', params.targetUserId);
  }

  if (params.announcementId) {
    query = query.eq('announcement_id', params.announcementId);
  }

  if (params.serviceId) {
    query = query.eq('service_id', params.serviceId);
  }

  const { data, error } = await query.single();

  if (error) {
    // Si pas de review trouvé, ce n'est pas une erreur
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('TanStack Query: Erreur lors de la récupération du review utilisateur:', error);
    throw error;
  }

  if (!data) {
    return null;
  }

  // Récupérer le profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .eq('id', data.user_id)
    .single();

  const reviewWithProfile = {
    ...data,
    service_id: data.service_id || null,
    profiles: profile || null
  } as Review;

  console.log('TanStack Query: Review utilisateur récupéré:', reviewWithProfile);
  return reviewWithProfile;
}

// Créer un nouveau review
async function createReviewAPI(reviewData: CreateReviewData, userId: string): Promise<ReviewResult> {
  console.log('TanStack Query: createReviewAPI avec données:', reviewData);
  
  const { error } = await supabase
    .from('reviews')
    .insert({
      user_id: userId,
      target_user_id: reviewData.targetUserId,
      announcement_id: reviewData.announcementId || null,
      service_id: reviewData.serviceId || null,
      rating: reviewData.rating,
      comment: reviewData.comment || null
    });

  if (error) {
    console.error('TanStack Query: Erreur lors de la création du review:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }

  console.log('TanStack Query: Review créé avec succès');
  return { success: true };
}

// Mettre à jour un review
async function updateReviewAPI(reviewData: UpdateReviewData, userId: string): Promise<ReviewResult> {
  console.log('TanStack Query: updateReviewAPI avec données:', reviewData);
  
  const { error } = await supabase
    .from('reviews')
    .update({
      rating: reviewData.rating,
      comment: reviewData.comment
    })
    .eq('id', reviewData.id)
    .eq('user_id', userId);

  if (error) {
    console.error('TanStack Query: Erreur lors de la mise à jour du review:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }

  console.log('TanStack Query: Review mis à jour avec succès');
  return { success: true };
}

// Supprimer un review
async function deleteReviewAPI(reviewId: string, userId: string): Promise<ReviewResult> {
  console.log('TanStack Query: deleteReviewAPI pour review:', reviewId, 'utilisateur:', userId);
  
  const { data, error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', userId)
    .select();

  if (error) {
    console.error('TanStack Query: Erreur lors de la suppression du review:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }

  if (!data || data.length === 0) {
    console.warn('TanStack Query: Aucun review supprimé - non trouvé ou non autorisé');
    return { 
      success: false, 
      error: 'Avis non trouvé ou vous n\'êtes pas autorisé à le supprimer' 
    };
  }

  console.log('TanStack Query: Review supprimé avec succès');
  return { success: true };
}

/**
 * Hooks TanStack Query pour les reviews
 */

// Hook pour récupérer les reviews avec cache intelligent
export function useReviewsQuery(params: UseReviewsParams, options?: UseQueryOptions<Review[], Error>) {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: () => fetchReviewsAPI(params),
    staleTime: 2 * 60 * 1000, // 2 minutes - les reviews changent moyennement
    gcTime: 10 * 60 * 1000, // 10 minutes en cache
    enabled: !!(params.targetUserId || params.announcementId || params.serviceId), // Au moins un paramètre requis
    ...options,
  });
}

// Hook pour récupérer les statistiques des reviews (dérivé de la query principale)
export function useReviewStatsQuery(params: UseReviewsParams, options?: UseQueryOptions<ReviewStats, Error>) {
  const reviewsQuery = useReviewsQuery(params, { enabled: false }); // Disable automatic fetch
  
  return useQuery({
    queryKey: reviewKeys.stats(params),
    queryFn: async () => {
      const reviews = await fetchReviewsAPI(params);
      return calculateReviewStats(reviews);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - les stats changent avec les reviews
    gcTime: 10 * 60 * 1000, // 10 minutes en cache
    enabled: !!(params.targetUserId || params.announcementId || params.serviceId),
    ...options,
  });
}

// Hook pour récupérer le review de l'utilisateur connecté
export function useUserReviewQuery(params: UseReviewsParams, options?: UseQueryOptions<Review | null, Error>) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: reviewKeys.userForTarget(user?.id || '', params),
    queryFn: () => fetchUserReviewAPI(user!.id, params),
    staleTime: 1 * 60 * 1000, // 1 minute - le review de l'utilisateur peut changer rapidement
    gcTime: 5 * 60 * 1000, // 5 minutes en cache
    enabled: !!user && !!(params.targetUserId || params.announcementId || params.serviceId),
    ...options,
  });
}

// Mutations pour les reviews avec invalidation intelligente du cache
export function useCreateReviewMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (reviewData: CreateReviewData) => {
      if (!user) throw new Error('Utilisateur non connecté');
      return createReviewAPI(reviewData, user.id);
    },
    onSuccess: (result, reviewData) => {
      if (!user) return;
      
      console.log('TanStack Query: Mutation createReview réussie, invalidation du cache');
      
      const params = {
        targetUserId: reviewData.targetUserId,
        announcementId: reviewData.announcementId || undefined,
        serviceId: reviewData.serviceId || undefined
      };
      
      // Invalider les reviews pour cette cible
      queryClient.invalidateQueries({ queryKey: reviewKeys.list(params) });
      
      // Invalider les stats
      queryClient.invalidateQueries({ queryKey: reviewKeys.stats(params) });
      
      // Invalider le review utilisateur
      queryClient.invalidateQueries({ queryKey: reviewKeys.userForTarget(user.id, params) });
      
      // Si c'est pour un service, invalider aussi les données du service
      if (reviewData.serviceId) {
        queryClient.invalidateQueries({ queryKey: ['services'] });
      }
    },
    onError: (error) => {
      console.error('TanStack Query: Erreur lors de la création du review:', error);
    }
  });
}

export function useUpdateReviewMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ reviewData, params }: { reviewData: UpdateReviewData, params: UseReviewsParams }) => {
      if (!user) throw new Error('Utilisateur non connecté');
      return updateReviewAPI(reviewData, user.id);
    },
    onSuccess: (result, { params }) => {
      if (!user) return;
      
      console.log('TanStack Query: Mutation updateReview réussie, invalidation du cache');
      
      // Invalider les reviews pour cette cible
      queryClient.invalidateQueries({ queryKey: reviewKeys.list(params) });
      
      // Invalider les stats
      queryClient.invalidateQueries({ queryKey: reviewKeys.stats(params) });
      
      // Invalider le review utilisateur
      queryClient.invalidateQueries({ queryKey: reviewKeys.userForTarget(user.id, params) });
      
      // Si c'est pour un service, invalider aussi les données du service
      if (params.serviceId) {
        queryClient.invalidateQueries({ queryKey: ['services'] });
      }
    },
    onError: (error) => {
      console.error('TanStack Query: Erreur lors de la mise à jour du review:', error);
    }
  });
}

export function useDeleteReviewMutation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ reviewId, params }: { reviewId: string, params: UseReviewsParams }) => {
      if (!user) throw new Error('Utilisateur non connecté');
      return deleteReviewAPI(reviewId, user.id);
    },
    onSuccess: (result, { params }) => {
      if (!user) return;
      
      console.log('TanStack Query: Mutation deleteReview réussie, invalidation du cache');
      
      // Invalider les reviews pour cette cible
      queryClient.invalidateQueries({ queryKey: reviewKeys.list(params) });
      
      // Invalider les stats
      queryClient.invalidateQueries({ queryKey: reviewKeys.stats(params) });
      
      // Invalider le review utilisateur
      queryClient.invalidateQueries({ queryKey: reviewKeys.userForTarget(user.id, params) });
      
      // Si c'est pour un service, invalider aussi les données du service
      if (params.serviceId) {
        queryClient.invalidateQueries({ queryKey: ['services'] });
      }
    },
    onError: (error) => {
      console.error('TanStack Query: Erreur lors de la suppression du review:', error);
    }
  });
}

/**
 * Hook principal pour gérer les reviews avec TanStack Query
 * Compatible avec l'ancien hook useReviews
 */
export function useReviews(params: UseReviewsParams = {}) {
  const reviewsQuery = useReviewsQuery(params);
  const statsQuery = useReviewStatsQuery(params);
  const userReviewQuery = useUserReviewQuery(params);
  
  const createMutation = useCreateReviewMutation();
  const updateMutation = useUpdateReviewMutation();
  const deleteMutation = useDeleteReviewMutation();
  
  // Fonctions compatibles avec l'ancien hook
  const addReview = useCallback(async (reviewData: CreateReviewData): Promise<ReviewResult> => {
    try {
      // Vérifier si l'utilisateur a déjà un review et le mettre à jour à la place
      if (userReviewQuery.data) {
        return await updateMutation.mutateAsync({
          reviewData: {
            id: userReviewQuery.data.id,
            rating: reviewData.rating,
            comment: reviewData.comment || null
          },
          params
        });
      }
      
      return await createMutation.mutateAsync(reviewData);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add review'
      };
    }
  }, [createMutation, updateMutation, userReviewQuery.data, params]);

  const updateReview = useCallback(async (reviewData: UpdateReviewData): Promise<ReviewResult> => {
    try {
      return await updateMutation.mutateAsync({ reviewData, params });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update review'
      };
    }
  }, [updateMutation, params]);

  const deleteReview = useCallback(async (reviewId: string): Promise<ReviewResult> => {
    try {
      return await deleteMutation.mutateAsync({ reviewId, params });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete review'
      };
    }
  }, [deleteMutation, params]);

  return {
    // État des données - compatible avec l'ancien hook
    reviews: reviewsQuery.data || [],
    stats: statsQuery.data || {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    },
    userReview: userReviewQuery.data || null,
    loading: reviewsQuery.isLoading || statsQuery.isLoading || userReviewQuery.isLoading || 
             createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: reviewsQuery.error?.message || statsQuery.error?.message || userReviewQuery.error?.message || 
           createMutation.error?.message || updateMutation.error?.message || deleteMutation.error?.message || null,
    
    // Fonctions - compatibles avec l'ancien hook
    addReview,
    updateReview,
    deleteReview,
    refreshReviews: reviewsQuery.refetch,
    
    // Nouvelles propriétés TanStack Query pour un contrôle avancé
    queries: {
      reviews: reviewsQuery,
      stats: statsQuery,
      userReview: userReviewQuery,
    },
    mutations: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
    }
  };
}