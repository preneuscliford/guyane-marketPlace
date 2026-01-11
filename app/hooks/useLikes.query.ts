/**
 * Hook TanStack Query pour la gestion des likes
 * Fournit des optimistic updates instantanés, rollback sur erreur
 * et synchronisation intelligente du cache des likes
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { getCacheConfig } from './cacheConfig';
import { postKeys, PostWithDetails } from './usePosts.query';
import { Database } from '@/types/supabase';

// ============================================================================
// TYPES ET INTERFACES
// ============================================================================

type LikeRow = Database['public']['Tables']['likes']['Row'];
type LikeInsert = Database['public']['Tables']['likes']['Insert'];

export interface PostLikeStatus {
  post_id: string;
  user_liked: boolean;
  like_count: number;
  likes: LikeRow[];
}

export interface LikeToggleData {
  post_id: string;
  user_id: string;
}

export interface UserLikesData {
  [postId: string]: boolean;
}

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const likeKeys = {
  all: ['likes'] as const,
  userLikes: (userId: string) => [...likeKeys.all, 'user', userId] as const,
  postLikes: (postId: string) => [...likeKeys.all, 'post', postId] as const,
  postLikeStatus: (postId: string, userId: string) => [
    ...likeKeys.all, 
    'status', 
    postId, 
    userId
  ] as const,
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Vérifie si un utilisateur a liké un post spécifique
 */
export const checkUserLikeAPI = async (
  postId: string, 
  userId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (error) {
      // Si pas de like trouvé, ce n'est pas une erreur
      if (error.code === 'PGRST116') {
        return false;
      }
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Erreur dans checkUserLikeAPI:', error);
    return false;
  }
};

/**
 * Récupère tous les likes d'un utilisateur
 */
export const fetchUserLikesAPI = async (userId: string): Promise<UserLikesData> => {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', userId);

    if (error) {
      const errorInfo = {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        status: error?.status,
        statusText: (error as any)?.statusText,
        errorString: error?.toString?.() || String(error),
        errorKeys: Object.keys(error || {}),
        fullError: error
      };
      console.error('Erreur lors de la récupération des likes utilisateur:', errorInfo);
      
      const errorMsg = error?.message || 
                      (error as any)?.statusText || 
                      error?.toString?.() || 
                      JSON.stringify(error) || 
                      'Erreur inconnue';
      throw new Error(`Erreur lors de la récupération des likes: ${errorMsg}`);
    }

    // Convertir en objet pour une recherche rapide
    const likesMap: UserLikesData = {};
    data?.forEach(like => {
      likesMap[like.post_id] = true;
    });

    return likesMap;
  } catch (error) {
    console.error('Erreur dans fetchUserLikesAPI:', error);
    throw error;
  }
};

/**
 * Récupère le statut des likes pour un post
 */
export const fetchPostLikeStatusAPI = async (
  postId: string, 
  userId?: string
): Promise<PostLikeStatus> => {
  try {
    // Récupérer tous les likes du post
    const { data: likes, error: likesError } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId);

    if (likesError) {
      const errorInfo = {
        code: likesError?.code,
        message: likesError?.message,
        details: likesError?.details,
        hint: likesError?.hint,
        status: likesError?.status,
        statusText: (likesError as any)?.statusText,
        errorString: likesError?.toString?.() || String(likesError),
        errorKeys: Object.keys(likesError || {}),
        fullError: likesError
      };
      console.error('Erreur lors de la récupération des likes du post:', errorInfo);
      
      const errorMsg = likesError?.message || 
                      (likesError as any)?.statusText || 
                      likesError?.toString?.() || 
                      JSON.stringify(likesError) || 
                      'Erreur inconnue';
      throw new Error(`Erreur lors de la récupération des likes: ${errorMsg}`);
    }

    const likeCount = likes?.length || 0;
    const userLiked = userId ? likes?.some(like => like.user_id === userId) ?? false : false;

    return {
      post_id: postId,
      user_liked: userLiked,
      like_count: likeCount,
      likes: likes || [],
    };
  } catch (error) {
    console.error('Erreur dans fetchPostLikeStatusAPI:', error);
    throw error;
  }
};

/**
 * Ajoute un like à un post
 */
export const addLikeAPI = async ({ post_id, user_id }: LikeToggleData): Promise<LikeRow> => {
  try {
    const newLike: LikeInsert = {
      post_id,
      user_id,
    };

    const { data, error } = await supabase
      .from('likes')
      .insert(newLike)
      .select()
      .single();

    if (error) {
      // Gestion spécifique des erreurs
      if (error.code === '23505') {
        throw new Error('Vous avez déjà aimé ce post');
      } else if (error.code === '23503') {
        throw new Error('Référence invalide, le post ou l\'utilisateur n\'existe pas');
      } else {
        const errorInfo = {
          code: error?.code,
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          status: error?.status,
          statusText: (error as any)?.statusText,
          errorString: error?.toString?.() || String(error),
          errorKeys: Object.keys(error || {}),
          fullError: error
        };
        console.error('Erreur lors de l\'ajout du like:', errorInfo);
        
        const errorMsg = error?.message || 
                        (error as any)?.statusText || 
                        error?.toString?.() || 
                        JSON.stringify(error) || 
                        'Erreur inconnue';
        throw new Error(`Impossible d'ajouter le like: ${errorMsg}`);
      }
    }

    if (!data) {
      throw new Error('Aucune donnée retournée');
    }

    return data;
  } catch (error) {
    console.error('Erreur dans addLikeAPI:', error);
    throw error;
  }
};

/**
 * Retire un like d'un post
 */
export const removeLikeAPI = async ({ post_id, user_id }: LikeToggleData): Promise<void> => {
  try {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', post_id)
      .eq('user_id', user_id);

    if (error) {
      const errorInfo = {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        status: error?.status,
        statusText: (error as any)?.statusText,
        errorString: error?.toString?.() || String(error),
        errorKeys: Object.keys(error || {}),
        fullError: error
      };
      console.error('Erreur lors de la suppression du like:', errorInfo);
      
      const errorMsg = error?.message || 
                      (error as any)?.statusText || 
                      error?.toString?.() || 
                      JSON.stringify(error) || 
                      'Erreur inconnue';
      throw new Error(`Impossible de retirer le like: ${errorMsg}`);
    }
  } catch (error) {
    console.error('Erreur dans removeLikeAPI:', error);
    throw error;
  }
};

/**
 * Toggle un like (ajouter ou retirer selon l'état actuel)
 */
export const toggleLikeAPI = async ({ 
  post_id, 
  user_id, 
  currentlyLiked 
}: LikeToggleData & { currentlyLiked: boolean }): Promise<{ 
  action: 'added' | 'removed'; 
  like?: LikeRow; 
}> => {
  if (currentlyLiked) {
    await removeLikeAPI({ post_id, user_id });
    return { action: 'removed' };
  } else {
    const like = await addLikeAPI({ post_id, user_id });
    return { action: 'added', like };
  }
};

// ============================================================================
// HOOKS TANSTACK QUERY
// ============================================================================

/**
 * Hook pour récupérer tous les likes d'un utilisateur
 */
export const useUserLikesQuery = (userId?: string) => {
  const cacheConfig = getCacheConfig('user_data');
  
  return useQuery({
    queryKey: likeKeys.userLikes(userId || ''),
    queryFn: () => fetchUserLikesAPI(userId!),
    ...cacheConfig,
    enabled: !!userId,
  });
};

/**
 * Hook pour vérifier si un utilisateur a liké un post
 */
export const useUserLikeStatusQuery = (postId: string, userId?: string) => {
  const cacheConfig = getCacheConfig('user_interactions');
  
  return useQuery({
    queryKey: likeKeys.postLikeStatus(postId, userId || ''),
    queryFn: () => checkUserLikeAPI(postId, userId!),
    ...cacheConfig,
    enabled: !!(postId && userId),
  });
};

/**
 * Hook pour récupérer le statut complet des likes d'un post
 */
export const usePostLikeStatusQuery = (postId: string, userId?: string) => {
  const cacheConfig = getCacheConfig('post_interactions');
  
  return useQuery({
    queryKey: likeKeys.postLikes(postId),
    queryFn: () => fetchPostLikeStatusAPI(postId, userId),
    ...cacheConfig,
    enabled: !!postId,
  });
};

/**
 * Hook de mutation pour toggle un like avec optimistic updates
 */
export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ postId, currentlyLiked }: { postId: string; currentlyLiked: boolean }) => {
      if (!user?.id) {
        throw new Error('Utilisateur non authentifié');
      }
      
      return toggleLikeAPI({
        post_id: postId,
        user_id: user.id,
        currentlyLiked,
      });
    },
    onMutate: async ({ postId, currentlyLiked }) => {
      if (!user?.id) return;

      // Annuler les requêtes en cours
      await Promise.all([
        queryClient.cancelQueries({ queryKey: likeKeys.postLikes(postId) }),
        queryClient.cancelQueries({ queryKey: likeKeys.userLikes(user.id) }),
        queryClient.cancelQueries({ queryKey: postKeys.lists() }),
        queryClient.cancelQueries({ queryKey: postKeys.detail(postId) }),
      ]);

      // Sauvegarder l'état précédent
      const previousPostLikeStatus = queryClient.getQueryData(likeKeys.postLikes(postId));
      const previousUserLikes = queryClient.getQueryData(likeKeys.userLikes(user.id));
      const previousPostsLists = queryClient.getQueriesData({ queryKey: postKeys.lists() });
      const previousPostDetail = queryClient.getQueryData(postKeys.detail(postId));

      // Mise à jour optimiste du statut des likes du post
      queryClient.setQueryData<PostLikeStatus>(likeKeys.postLikes(postId), (old) => {
        if (!old) return old;
        
        const newLikeCount = currentlyLiked ? old.like_count - 1 : old.like_count + 1;
        const newLikes = currentlyLiked
          ? old.likes.filter(like => like.user_id !== user.id)
          : [...old.likes, { post_id: postId, user_id: user.id, created_at: new Date().toISOString() }];

        return {
          ...old,
          user_liked: !currentlyLiked,
          like_count: Math.max(0, newLikeCount),
          likes: newLikes,
        };
      });

      // Mise à jour optimiste des likes de l'utilisateur
      queryClient.setQueryData<UserLikesData>(likeKeys.userLikes(user.id), (old) => {
        if (!old) return { [postId]: !currentlyLiked };
        
        const newLikes = { ...old };
        if (currentlyLiked) {
          delete newLikes[postId];
        } else {
          newLikes[postId] = true;
        }
        return newLikes;
      });

      // Mise à jour optimiste du statut de like pour ce post et utilisateur spécifique
      queryClient.setQueryData(
        likeKeys.postLikeStatus(postId, user.id),
        !currentlyLiked
      );

      // Mise à jour optimiste dans toutes les listes de posts
      queryClient.setQueriesData<PostWithDetails[]>(
        { queryKey: postKeys.lists() },
        (oldData) => {
          if (!oldData) return oldData;
          
          return oldData.map(post => {
            if (post.id === postId) {
              const newLikeCount = currentlyLiked ? post.like_count - 1 : post.like_count + 1;
              return {
                ...post,
                user_liked: !currentlyLiked,
                like_count: Math.max(0, newLikeCount),
              };
            }
            return post;
          });
        }
      );

      // Mise à jour optimiste du post détaillé
      queryClient.setQueryData<PostWithDetails>(postKeys.detail(postId), (old) => {
        if (!old) return old;
        
        const newLikeCount = currentlyLiked ? old.like_count - 1 : old.like_count + 1;
        return {
          ...old,
          user_liked: !currentlyLiked,
          like_count: Math.max(0, newLikeCount),
        };
      });

      return {
        previousPostLikeStatus,
        previousUserLikes,
        previousPostsLists,
        previousPostDetail,
        postId,
        currentlyLiked,
      };
    },
    onSuccess: (result, { postId, currentlyLiked }, context) => {
      // Le like a été ajouté/retiré avec succès
      const message = result.action === 'added' ? 'Post aimé !' : 'Like retiré !';
      toast.success(message);

      // Optionnel: rafraîchir les données pour s'assurer de la cohérence
      queryClient.invalidateQueries({ queryKey: likeKeys.postLikes(postId) });
      
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: likeKeys.userLikes(user.id) });
      }
    },
    onError: (error, { postId, currentlyLiked }, context) => {
      // Rollback en cas d'erreur
      if (context) {
        // Restaurer le statut des likes du post
        if (context.previousPostLikeStatus !== undefined) {
          queryClient.setQueryData(likeKeys.postLikes(postId), context.previousPostLikeStatus);
        }

        // Restaurer les likes de l'utilisateur
        if (context.previousUserLikes !== undefined && user?.id) {
          queryClient.setQueryData(likeKeys.userLikes(user.id), context.previousUserLikes);
        }

        // Restaurer le statut de like spécifique
        queryClient.setQueryData(
          likeKeys.postLikeStatus(postId, user?.id || ''),
          currentlyLiked
        );

        // Restaurer les listes de posts
        if (context.previousPostsLists) {
          context.previousPostsLists.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
          });
        }

        // Restaurer le post détaillé
        if (context.previousPostDetail !== undefined) {
          queryClient.setQueryData(postKeys.detail(postId), context.previousPostDetail);
        }
      }

      console.error('Erreur lors du toggle du like:', error);
      
      // Messages d'erreur spécifiques
      if (error.message.includes('déjà aimé')) {
        toast.error('Vous avez déjà aimé ce post');
      } else if (error.message.includes('Référence invalide')) {
        toast.error('Post ou utilisateur introuvable');
      } else if (error.message.includes('non authentifié')) {
        toast.error('Vous devez être connecté pour aimer un post');
      } else {
        toast.error('Erreur lors de la mise à jour du like');
      }
    },
    onSettled: (result, error, { postId }) => {
      // S'assurer que les données sont cohérentes
      queryClient.invalidateQueries({ queryKey: likeKeys.postLikes(postId) });
      
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: likeKeys.userLikes(user.id) });
        queryClient.invalidateQueries({ 
          queryKey: likeKeys.postLikeStatus(postId, user.id) 
        });
      }
      
      // Invalider les listes de posts pour synchroniser les compteurs
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

/**
 * Hook personnalisé pour simplifier l'utilisation des likes
 */
export const usePostLike = (postId: string) => {
  const { user } = useAuth();
  const userId = user?.id;

  // Récupérer le statut du like
  const { data: likeStatus, isLoading } = usePostLikeStatusQuery(postId, userId);
  
  // Récupérer la mutation de toggle
  const toggleLikeMutation = useToggleLikeMutation();

  // Fonction helper pour toggle le like
  const toggleLike = () => {
    if (!user) {
      toast.error('Vous devez être connecté pour aimer un post');
      return;
    }

    if (!likeStatus) {
      toast.error('Impossible de déterminer le statut du like');
      return;
    }

    toggleLikeMutation.mutate({
      postId,
      currentlyLiked: likeStatus.user_liked,
    });
  };

  return {
    likeCount: likeStatus?.like_count || 0,
    userLiked: likeStatus?.user_liked || false,
    isLoading: isLoading || toggleLikeMutation.isPending,
    toggleLike,
    error: toggleLikeMutation.error,
  };
};

/**
 * Hook pour récupérer et synchroniser l'état de tous les likes d'un utilisateur
 * Utilisé pour mettre à jour efficacement l'UI avec les bons états de likes
 */
export const useUserLikesSync = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: userLikes } = useUserLikesQuery(user?.id);

  // Fonction pour synchroniser un post avec l'état des likes de l'utilisateur
  const syncPostLikeStatus = (post: PostWithDetails): PostWithDetails => {
    if (!user?.id || !userLikes) return post;

    const userLiked = !!userLikes[post.id];
    
    // Mettre à jour le cache si nécessaire
    if (post.user_liked !== userLiked) {
      queryClient.setQueryData<PostWithDetails>(postKeys.detail(post.id), (old) => {
        if (!old) return old;
        return { ...old, user_liked: userLiked };
      });
    }

    return {
      ...post,
      user_liked: userLiked,
    };
  };

  // Fonction pour synchroniser une liste de posts
  const syncPostsLikeStatus = (posts: PostWithDetails[]): PostWithDetails[] => {
    if (!user?.id || !userLikes) return posts;

    return posts.map(syncPostLikeStatus);
  };

  return {
    userLikes,
    syncPostLikeStatus,
    syncPostsLikeStatus,
    isLoading: !userLikes && !!user?.id,
  };
};