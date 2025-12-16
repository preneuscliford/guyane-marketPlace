/**
 * Hook TanStack Query pour la gestion des posts de la communauté
 * Fournit des fonctionnalités CRUD optimisées avec cache intelligent,
 * optimistic updates et synchronisation temps réel
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { getCacheConfig } from './cacheConfig';
import { Database } from '@/types/supabase';

// ============================================================================
// TYPES ET INTERFACES
// ============================================================================

type PostRow = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type LikeRow = Database['public']['Tables']['likes']['Row'];
type CommentRow = Database['public']['Tables']['comments']['Row'];

export interface PostWithDetails extends PostRow {
  profiles?: ProfileRow;
  likes?: LikeRow[];
  like_count: number;
  comment_count: number;
  user_liked: boolean;
  comments?: CommentRow[];
}

export interface CommunityStats {
  total_posts: number;
  total_users: number;
  posts_today: number;
  active_users: number;
}

export interface PostFilters {
  searchQuery?: string;
  sortBy?: 'recent' | 'popular' | 'trending';
  userId?: string;
  isHidden?: boolean;
}

export interface CreatePostData {
  content: string;
  image_url?: string;
}

export interface UpdatePostData {
  content?: string;
  image_url?: string;
}

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: PostFilters) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  stats: () => [...postKeys.all, 'stats'] as const,
  infinite: (filters: PostFilters) => [...postKeys.all, 'infinite', filters] as const,
  userPosts: (userId: string) => [...postKeys.all, 'user', userId] as const,
  trending: () => [...postKeys.all, 'trending'] as const,
  popular: () => [...postKeys.all, 'popular'] as const,
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Récupère une liste de posts avec toutes les données associées
 */
export const fetchPostsAPI = async (filters: PostFilters = {}): Promise<PostWithDetails[]> => {
  const { searchQuery = '', sortBy = 'recent', userId, isHidden = false } = filters;

  try {
    let query = supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id(id, username, avatar_url, full_name, bio),
        likes(user_id)
      `)
      .eq('is_hidden', isHidden);

    // Filtrage par utilisateur
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Filtrage par recherche
    if (searchQuery.trim()) {
      query = query.ilike('content', `%${searchQuery.trim()}%`);
    }

    // Tri des résultats
    switch (sortBy) {
      case 'recent':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popular':
        // Tri par nombre de likes (sera calculé côté client pour maintenir la performance)
        query = query.order('created_at', { ascending: false });
        break;
      case 'trending':
        // Tri par activité récente (commentaires + likes dans les dernières 24h)
        query = query.order('updated_at', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    query = query.limit(50);

    const { data: postsData, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des posts:', error);
      throw new Error(`Erreur lors de la récupération des posts: ${error.message}`);
    }

    if (!postsData) {
      return [];
    }

    // Enrichir les données avec les compteurs
    const enrichedPosts: PostWithDetails[] = await Promise.all(
      postsData.map(async (post: any) => {
        // Compter les commentaires
        const { count: commentCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id)
          .eq('is_hidden', false);

        // Calculer like_count et user_liked
        const likeCount = post.likes?.length || 0;
        
        return {
          ...post,
          like_count: likeCount,
          comment_count: commentCount || 0,
          user_liked: false, // Sera mis à jour par le hook useUserLikedPosts
          profiles: post.profiles || null,
        };
      })
    );

    // Tri côté client pour les posts populaires si nécessaire
    if (sortBy === 'popular') {
      enrichedPosts.sort((a, b) => {
        const scoreA = a.like_count * 2 + a.comment_count;
        const scoreB = b.like_count * 2 + b.comment_count;
        return scoreB - scoreA;
      });
    }

    return enrichedPosts;
  } catch (error) {
    console.error('Erreur dans fetchPostsAPI:', error);
    throw error;
  }
};

/**
 * Récupère un post spécifique avec tous ses détails
 */
export const fetchPostByIdAPI = async (postId: string): Promise<PostWithDetails> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id(id, username, avatar_url, full_name, bio),
        likes(user_id),
        comments(
          id,
          content,
          created_at,
          user_id,
          is_hidden,
          profiles:user_id(id, username, avatar_url, full_name)
        )
      `)
      .eq('id', postId)
      .single();

    if (error) {
      throw new Error(`Post non trouvé: ${error.message}`);
    }

    if (!data) {
      throw new Error('Post non trouvé');
    }

    // Filtrer les commentaires cachés
    const visibleComments = (data as any).comments?.filter((comment: any) => !comment.is_hidden) || [];

    return {
      ...data,
      like_count: (data as any).likes?.length || 0,
      comment_count: visibleComments.length,
      user_liked: false, // Sera mis à jour par le hook useUserLikedPosts
      comments: visibleComments,
      profiles: (data as any).profiles || null,
    };
  } catch (error) {
    console.error('Erreur dans fetchPostByIdAPI:', error);
    throw error;
  }
};

/**
 * Crée un nouveau post
 */
export const createPostAPI = async (postData: CreatePostData): Promise<PostWithDetails> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('Utilisateur non authentifié');
    }

    const newPost: PostInsert = {
      content: postData.content,
      image_url: postData.image_url || null,
      user_id: userData.user.id,
    };

    const { data, error } = await supabase
      .from('posts')
      .insert(newPost)
      .select(`
        *,
        profiles:user_id(id, username, avatar_url, full_name, bio)
      `)
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création du post: ${error.message}`);
    }

    return {
      ...data,
      like_count: 0,
      comment_count: 0,
      user_liked: false,
      likes: [],
      comments: [],
      profiles: (data as any).profiles || null,
    };
  } catch (error) {
    console.error('Erreur dans createPostAPI:', error);
    throw error;
  }
};

/**
 * Met à jour un post existant
 */
export const updatePostAPI = async ({ 
  postId, 
  updateData 
}: { 
  postId: string; 
  updateData: UpdatePostData; 
}): Promise<PostWithDetails> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('Utilisateur non authentifié');
    }

    const updatePayload: PostUpdate = {
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('posts')
      .update(updatePayload)
      .eq('id', postId)
      .eq('user_id', userData.user.id) // S'assurer que l'utilisateur peut seulement modifier ses propres posts
      .select(`
        *,
        profiles:user_id(id, username, avatar_url, full_name, bio),
        likes(user_id)
      `)
      .single();

    if (error) {
      throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
    }

    if (!data) {
      throw new Error('Post non trouvé ou permission refusée');
    }

    // Compter les commentaires
    const { count: commentCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('is_hidden', false);

    return {
      ...data,
      like_count: (data as any).likes?.length || 0,
      comment_count: commentCount || 0,
      user_liked: false,
      profiles: (data as any).profiles || null,
    };
  } catch (error) {
    console.error('Erreur dans updatePostAPI:', error);
    throw error;
  }
};

/**
 * Supprime un post
 */
export const deletePostAPI = async (postId: string): Promise<void> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userData.user.id); // S'assurer que l'utilisateur peut seulement supprimer ses propres posts

    if (error) {
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  } catch (error) {
    console.error('Erreur dans deletePostAPI:', error);
    throw error;
  }
};

/**
 * Récupère les statistiques de la communauté
 */
export const fetchCommunityStatsAPI = async (): Promise<CommunityStats> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // Compter les posts totaux
    const { count: totalPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_hidden', false);

    // Compter les utilisateurs totaux
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Compter les posts d'aujourd'hui
    const { count: postsToday } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_hidden', false)
      .gte('created_at', todayISO);

    // Compter les utilisateurs actifs (avec au moins un post ou commentaire aujourd'hui)
    const { data: activeUsersData } = await supabase
      .from('posts')
      .select('user_id')
      .gte('created_at', todayISO)
      .eq('is_hidden', false);

    const { data: activeCommentersData } = await supabase
      .from('comments')
      .select('user_id')
      .gte('created_at', todayISO)
      .eq('is_hidden', false);

    const activeUserIds = new Set([
      ...(activeUsersData?.map(p => p.user_id).filter(Boolean) || []),
      ...(activeCommentersData?.map(c => c.user_id).filter(Boolean) || [])
    ]);

    return {
      total_posts: totalPosts || 0,
      total_users: totalUsers || 0,
      posts_today: postsToday || 0,
      active_users: activeUserIds.size,
    };
  } catch (error) {
    console.error('Erreur dans fetchCommunityStatsAPI:', error);
    throw error;
  }
};

// ============================================================================
// HOOKS TANSTACK QUERY
// ============================================================================

/**
 * Hook pour récupérer une liste de posts avec filtrage et tri
 */
export const usePostsQuery = (filters: PostFilters = {}) => {
  const cacheConfig = getCacheConfig('community_posts');
  
  return useQuery({
    queryKey: postKeys.list(filters),
    queryFn: () => fetchPostsAPI(filters),
    ...cacheConfig,
    retry: 2,
  });
};

/**
 * Hook pour récupérer un post spécifique
 */
export const usePostQuery = (postId: string) => {
  const cacheConfig = getCacheConfig('community_posts');
  
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => fetchPostByIdAPI(postId),
    ...cacheConfig,
    enabled: !!postId,
  });
};

/**
 * Hook pour récupérer les posts d'un utilisateur spécifique
 */
export const useUserPostsQuery = (userId: string) => {
  const cacheConfig = getCacheConfig('community_posts');
  
  return useQuery({
    queryKey: postKeys.userPosts(userId),
    queryFn: () => fetchPostsAPI({ userId }),
    ...cacheConfig,
    enabled: !!userId,
  });
};

/**
 * Hook pour récupérer les statistiques de la communauté
 */
export const useCommunityStatsQuery = () => {
  const cacheConfig = getCacheConfig('community_stats');
  
  return useQuery({
    queryKey: postKeys.stats(),
    queryFn: fetchCommunityStatsAPI,
    ...cacheConfig,
    refetchInterval: 5 * 60 * 1000, // Mise à jour toutes les 5 minutes
  });
};

/**
 * Hook de mutation pour créer un nouveau post
 */
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPostAPI,
    onMutate: async (newPostData) => {
      // Optimistic update: ajouter le nouveau post à la liste
      const optimisticPost: PostWithDetails = {
        id: `temp-${Date.now()}`,
        content: newPostData.content,
        image_url: newPostData.image_url || null,
        user_id: '', // Sera mis à jour avec les vraies données
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_hidden: false,
        hidden_at: null,
        hidden_by: null,
        hidden_reason: null,
        like_count: 0,
        comment_count: 0,
        user_liked: false,
        profiles: null, // Sera mis à jour
        likes: [],
        comments: [],
      };

      // Annuler toutes les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });

      // Sauvegarder l'état précédent
      const previousPosts = queryClient.getQueriesData({ queryKey: postKeys.lists() });

      // Mettre à jour de manière optimiste
      queryClient.setQueriesData<PostWithDetails[]>(
        { queryKey: postKeys.lists() },
        (oldData) => oldData ? [optimisticPost, ...oldData] : [optimisticPost]
      );

      return { previousPosts, optimisticPost };
    },
    onSuccess: (newPost, variables, context) => {
      // Remplacer le post optimiste par le vrai post
      queryClient.setQueriesData<PostWithDetails[]>(
        { queryKey: postKeys.lists() },
        (oldData) => 
          oldData 
            ? oldData.map(post => post.id === context?.optimisticPost.id ? newPost : post)
            : [newPost]
      );

      // Invalider et refetch les données
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.stats() });

      toast.success('Post publié avec succès !');
    },
    onError: (error, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      console.error('Erreur lors de la création du post:', error);
      toast.error(`Erreur lors de la publication: ${error.message}`);
    },
    onSettled: () => {
      // S'assurer que les données sont à jour
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

/**
 * Hook de mutation pour mettre à jour un post
 */
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updatePostAPI,
    onSuccess: (updatedPost) => {
      // Mettre à jour le cache avec les nouvelles données
      queryClient.setQueryData(
        postKeys.detail(updatedPost.id),
        updatedPost
      );

      // Mettre à jour dans toutes les listes de posts
      queryClient.setQueriesData<PostWithDetails[]>(
        { queryKey: postKeys.lists() },
        (oldData) => 
          oldData 
            ? oldData.map(post => post.id === updatedPost.id ? updatedPost : post)
            : [updatedPost]
      );

      toast.success('Post modifié avec succès !');
    },
    onError: (error) => {
      console.error('Erreur lors de la modification du post:', error);
      toast.error(`Erreur lors de la modification: ${error.message}`);
    },
    onSettled: (updatedPost) => {
      if (updatedPost) {
        queryClient.invalidateQueries({ queryKey: postKeys.detail(updatedPost.id) });
      }
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

/**
 * Hook de mutation pour supprimer un post
 */
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletePostAPI,
    onMutate: async (postId) => {
      // Optimistic update: retirer le post de la liste
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });
      
      const previousPosts = queryClient.getQueriesData({ queryKey: postKeys.lists() });
      
      queryClient.setQueriesData<PostWithDetails[]>(
        { queryKey: postKeys.lists() },
        (oldData) => oldData ? oldData.filter(post => post.id !== postId) : []
      );

      return { previousPosts, postId };
    },
    onSuccess: (_, postId) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.stats() });

      toast.success('Post supprimé avec succès !');
    },
    onError: (error, postId, context) => {
      // Rollback en cas d'erreur
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      console.error('Erreur lors de la suppression du post:', error);
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

/**
 * Hook pour récupérer les posts tendance (mise à jour fréquente)
 */
export const useTrendingPostsQuery = () => {
  const cacheConfig = getCacheConfig('trending_data');
  
  return useQuery({
    queryKey: postKeys.trending(),
    queryFn: () => fetchPostsAPI({ sortBy: 'trending' }),
    ...cacheConfig,
    refetchInterval: 2 * 60 * 1000, // Mise à jour toutes les 2 minutes
  });
};

/**
 * Hook pour récupérer les posts populaires
 */
export const usePopularPostsQuery = () => {
  const cacheConfig = getCacheConfig('community_posts');
  
  return useQuery({
    queryKey: postKeys.popular(),
    queryFn: () => fetchPostsAPI({ sortBy: 'popular' }),
    ...cacheConfig,
  });
};