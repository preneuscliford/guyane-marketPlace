/**
 * Hook TanStack Query pour la gestion des commentaires
 * Fournit un système de commentaires imbriqués avec cache hiérarchique,
 * compteurs automatiques et synchronisation temps réel
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { getCacheConfig } from './cacheConfig';
import { postKeys, PostWithDetails } from './usePosts.query';
import { Database } from '@/app/types/supabase';

// ============================================================================
// TYPES ET INTERFACES
// ============================================================================

type CommentRow = Database['public']['Tables']['comments']['Row'];
type CommentInsert = Database['public']['Tables']['comments']['Insert'];
type CommentUpdate = Database['public']['Tables']['comments']['Update'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export interface CommentWithDetails extends CommentRow {
  profiles?: ProfileRow;
  reply_count?: number;
  replies?: CommentWithDetails[];
  depth?: number;
}

export interface CommentStats {
  total_comments: number;
  visible_comments: number;
  comments_today: number;
}

export interface CreateCommentData {
  content: string;
  post_id: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentFilters {
  post_id?: string;
  user_id?: string;
  is_hidden?: boolean;
  limit?: number;
  order?: 'asc' | 'desc';
}

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (filters: CommentFilters) => [...commentKeys.lists(), filters] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
  postComments: (postId: string) => [...commentKeys.all, 'post', postId] as const,
  userComments: (userId: string) => [...commentKeys.all, 'user', userId] as const,
  stats: (postId: string) => [...commentKeys.all, 'stats', postId] as const,
  count: (postId: string) => [...commentKeys.all, 'count', postId] as const,
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Récupère les commentaires d'un post avec les profils utilisateurs
 */
export const fetchPostCommentsAPI = async (postId: string): Promise<CommentWithDetails[]> => {
  try {
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        user_id,
        post_id,
        created_at,
        is_hidden,
        hidden_at,
        hidden_by,
        hidden_reason
      `)
      .eq('post_id', postId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: true });

    if (commentsError) {
      throw new Error(`Erreur lors de la récupération des commentaires: ${commentsError.message}`);
    }

    if (!commentsData || commentsData.length === 0) {
      return [];
    }

    // Récupérer les profils des utilisateurs
    const userIds = [...new Set(commentsData.map(comment => comment.user_id).filter(Boolean))];
    
    if (userIds.length === 0) {
      return commentsData.map(comment => ({
        ...comment,
        profiles: null,
        reply_count: 0,
        replies: [],
        depth: 0,
      }));
    }

    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, full_name, bio')
      .in('id', userIds);

    if (profilesError) {
      console.error('Erreur lors de la récupération des profils:', profilesError);
    }

    // Créer un mapping des profils
    const profilesMap = (profilesData || []).reduce((acc: any, profile: any) => {
      acc[profile.id] = profile;
      return acc;
    }, {});

    // Enrichir les commentaires avec les profils
    const enrichedComments: CommentWithDetails[] = commentsData.map(comment => ({
      ...comment,
      profiles: profilesMap[comment.user_id!] || null,
      reply_count: 0,
      replies: [],
      depth: 0,
    }));

    return enrichedComments;
  } catch (error) {
    console.error('Erreur dans fetchPostCommentsAPI:', error);
    throw error;
  }
};

/**
 * Récupère un commentaire spécifique avec ses détails
 */
export const fetchCommentByIdAPI = async (commentId: string): Promise<CommentWithDetails> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id(id, username, avatar_url, full_name, bio)
      `)
      .eq('id', commentId)
      .single();

    if (error) {
      throw new Error(`Commentaire non trouvé: ${error.message}`);
    }

    return {
      ...data,
      profiles: (data as any).profiles || null,
      reply_count: 0,
      replies: [],
      depth: 0,
    };
  } catch (error) {
    console.error('Erreur dans fetchCommentByIdAPI:', error);
    throw error;
  }
};

/**
 * Compte les commentaires d'un post
 */
export const fetchCommentCountAPI = async (postId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('is_hidden', false);

    if (error) {
      throw new Error(`Erreur lors du comptage: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error('Erreur dans fetchCommentCountAPI:', error);
    return 0;
  }
};

/**
 * Récupère les statistiques des commentaires pour un post
 */
export const fetchCommentStatsAPI = async (postId: string): Promise<CommentStats> => {
  try {
    // Compter tous les commentaires
    const { count: totalComments } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    // Compter les commentaires visibles
    const { count: visibleComments } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('is_hidden', false);

    // Compter les commentaires d'aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const { count: commentsToday } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('is_hidden', false)
      .gte('created_at', todayISO);

    return {
      total_comments: totalComments || 0,
      visible_comments: visibleComments || 0,
      comments_today: commentsToday || 0,
    };
  } catch (error) {
    console.error('Erreur dans fetchCommentStatsAPI:', error);
    return {
      total_comments: 0,
      visible_comments: 0,
      comments_today: 0,
    };
  }
};

/**
 * Crée un nouveau commentaire
 */
export const createCommentAPI = async (commentData: CreateCommentData): Promise<CommentWithDetails> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('Utilisateur non authentifié');
    }

    const newComment: CommentInsert = {
      content: commentData.content,
      post_id: commentData.post_id,
      user_id: userData.user.id,
    };

    const { data, error } = await supabase
      .from('comments')
      .insert(newComment)
      .select(`
        *,
        profiles:user_id(id, username, avatar_url, full_name, bio)
      `)
      .single();

    if (error) {
      throw new Error(`Erreur lors de la création du commentaire: ${error.message}`);
    }

    return {
      ...data,
      profiles: (data as any).profiles || null,
      reply_count: 0,
      replies: [],
      depth: 0,
    };
  } catch (error) {
    console.error('Erreur dans createCommentAPI:', error);
    throw error;
  }
};

/**
 * Met à jour un commentaire existant
 */
export const updateCommentAPI = async ({
  commentId,
  updateData,
}: {
  commentId: string;
  updateData: UpdateCommentData;
}): Promise<CommentWithDetails> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { data, error } = await supabase
      .from('comments')
      .update(updateData)
      .eq('id', commentId)
      .eq('user_id', userData.user.id) // S'assurer que l'utilisateur peut seulement modifier ses propres commentaires
      .select(`
        *,
        profiles:user_id(id, username, avatar_url, full_name, bio)
      `)
      .single();

    if (error) {
      throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
    }

    if (!data) {
      throw new Error('Commentaire non trouvé ou permission refusée');
    }

    return {
      ...data,
      profiles: (data as any).profiles || null,
      reply_count: 0,
      replies: [],
      depth: 0,
    };
  } catch (error) {
    console.error('Erreur dans updateCommentAPI:', error);
    throw error;
  }
};

/**
 * Supprime un commentaire (soft delete en marquant comme caché)
 */
export const deleteCommentAPI = async (commentId: string): Promise<void> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { error } = await supabase
      .from('comments')
      .update({
        is_hidden: true,
        hidden_by: userData.user.id,
        hidden_at: new Date().toISOString(),
        hidden_reason: 'Supprimé par l\'auteur',
      })
      .eq('id', commentId)
      .eq('user_id', userData.user.id);

    if (error) {
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  } catch (error) {
    console.error('Erreur dans deleteCommentAPI:', error);
    throw error;
  }
};

/**
 * Récupère les commentaires d'un utilisateur
 */
export const fetchUserCommentsAPI = async (userId: string): Promise<CommentWithDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id(id, username, avatar_url, full_name, bio)
      `)
      .eq('user_id', userId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(`Erreur lors de la récupération des commentaires: ${error.message}`);
    }

    return (data || []).map(comment => ({
      ...comment,
      profiles: (comment as any).profiles || null,
      reply_count: 0,
      replies: [],
      depth: 0,
    }));
  } catch (error) {
    console.error('Erreur dans fetchUserCommentsAPI:', error);
    throw error;
  }
};

// ============================================================================
// HOOKS TANSTACK QUERY
// ============================================================================

/**
 * Hook pour récupérer les commentaires d'un post
 */
export const usePostCommentsQuery = (postId: string) => {
  const cacheConfig = getCacheConfig('post_comments');
  
  return useQuery({
    queryKey: commentKeys.postComments(postId),
    queryFn: () => fetchPostCommentsAPI(postId),
    ...cacheConfig,
    enabled: !!postId,
  });
};

/**
 * Hook pour récupérer un commentaire spécifique
 */
export const useCommentQuery = (commentId: string) => {
  const cacheConfig = getCacheConfig('post_comments');
  
  return useQuery({
    queryKey: commentKeys.detail(commentId),
    queryFn: () => fetchCommentByIdAPI(commentId),
    ...cacheConfig,
    enabled: !!commentId,
  });
};

/**
 * Hook pour compter les commentaires d'un post
 */
export const useCommentCountQuery = (postId: string) => {
  const cacheConfig = getCacheConfig('comment_stats');
  
  return useQuery({
    queryKey: commentKeys.count(postId),
    queryFn: () => fetchCommentCountAPI(postId),
    ...cacheConfig,
    enabled: !!postId,
  });
};

/**
 * Hook pour récupérer les statistiques des commentaires
 */
export const useCommentStatsQuery = (postId: string) => {
  const cacheConfig = getCacheConfig('comment_stats');
  
  return useQuery({
    queryKey: commentKeys.stats(postId),
    queryFn: () => fetchCommentStatsAPI(postId),
    ...cacheConfig,
    enabled: !!postId,
  });
};

/**
 * Hook pour récupérer les commentaires d'un utilisateur
 */
export const useUserCommentsQuery = (userId: string) => {
  const cacheConfig = getCacheConfig('user_comments');
  
  return useQuery({
    queryKey: commentKeys.userComments(userId),
    queryFn: () => fetchUserCommentsAPI(userId),
    ...cacheConfig,
    enabled: !!userId,
  });
};

/**
 * Hook de mutation pour créer un nouveau commentaire
 */
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: createCommentAPI,
    onMutate: async (newCommentData) => {
      if (!user) return;

      const { post_id } = newCommentData;

      // Annuler les requêtes en cours
      await Promise.all([
        queryClient.cancelQueries({ queryKey: commentKeys.postComments(post_id) }),
        queryClient.cancelQueries({ queryKey: commentKeys.count(post_id) }),
        queryClient.cancelQueries({ queryKey: postKeys.lists() }),
        queryClient.cancelQueries({ queryKey: postKeys.detail(post_id) }),
      ]);

      // Créer un commentaire optimiste
      const optimisticComment: CommentWithDetails = {
        id: `temp-${Date.now()}`,
        content: newCommentData.content,
        post_id: newCommentData.post_id,
        user_id: user.id,
        created_at: new Date().toISOString(),
        is_hidden: false,
        hidden_at: null,
        hidden_by: null,
        hidden_reason: null,
        profiles: {
          id: user.id,
          username: user.email?.split('@')[0] || 'Utilisateur',
          avatar_url: null,
          full_name: null,
          bio: null,
          created_at: '',
          updated_at: '',
          business_name: null,
          phone: null,
          address: null,
          is_business: false,
        },
        reply_count: 0,
        replies: [],
        depth: 0,
      };

      // Sauvegarder l'état précédent
      const previousComments = queryClient.getQueryData(commentKeys.postComments(post_id));
      const previousCount = queryClient.getQueryData(commentKeys.count(post_id));
      const previousPostsLists = queryClient.getQueriesData({ queryKey: postKeys.lists() });
      const previousPostDetail = queryClient.getQueryData(postKeys.detail(post_id));

      // Mise à jour optimiste des commentaires
      queryClient.setQueryData<CommentWithDetails[]>(
        commentKeys.postComments(post_id),
        (oldData) => oldData ? [...oldData, optimisticComment] : [optimisticComment]
      );

      // Mise à jour optimiste du compteur
      queryClient.setQueryData<number>(
        commentKeys.count(post_id),
        (oldCount) => (oldCount || 0) + 1
      );

      // Mise à jour optimiste dans les listes de posts
      queryClient.setQueriesData<PostWithDetails[]>(
        { queryKey: postKeys.lists() },
        (oldData) => {
          if (!oldData) return oldData;
          
          return oldData.map(post => {
            if (post.id === post_id) {
              return {
                ...post,
                comment_count: post.comment_count + 1,
              };
            }
            return post;
          });
        }
      );

      // Mise à jour optimiste du post détaillé
      queryClient.setQueryData<PostWithDetails>(postKeys.detail(post_id), (old) => {
        if (!old) return old;
        return {
          ...old,
          comment_count: old.comment_count + 1,
        };
      });

      return {
        previousComments,
        previousCount,
        previousPostsLists,
        previousPostDetail,
        optimisticComment,
        post_id,
      };
    },
    onSuccess: (newComment, variables, context) => {
      const { post_id } = variables;

      // Remplacer le commentaire optimiste par le vrai commentaire
      queryClient.setQueryData<CommentWithDetails[]>(
        commentKeys.postComments(post_id),
        (oldData) => 
          oldData 
            ? oldData.map(comment => 
                comment.id === context?.optimisticComment.id ? newComment : comment
              )
            : [newComment]
      );

      // Invalider et refetch les données
      queryClient.invalidateQueries({ queryKey: commentKeys.postComments(post_id) });
      queryClient.invalidateQueries({ queryKey: commentKeys.count(post_id) });
      queryClient.invalidateQueries({ queryKey: commentKeys.stats(post_id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(post_id) });

      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: commentKeys.userComments(user.id) });
      }

      toast.success('Commentaire publié avec succès !');
    },
    onError: (error, variables, context) => {
      const { post_id } = variables;

      // Rollback en cas d'erreur
      if (context) {
        if (context.previousComments !== undefined) {
          queryClient.setQueryData(commentKeys.postComments(post_id), context.previousComments);
        }
        if (context.previousCount !== undefined) {
          queryClient.setQueryData(commentKeys.count(post_id), context.previousCount);
        }
        if (context.previousPostsLists) {
          context.previousPostsLists.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
          });
        }
        if (context.previousPostDetail !== undefined) {
          queryClient.setQueryData(postKeys.detail(post_id), context.previousPostDetail);
        }
      }

      console.error('Erreur lors de la création du commentaire:', error);
      toast.error(`Erreur lors de la publication: ${error.message}`);
    },
    onSettled: (newComment, error, variables) => {
      const { post_id } = variables;
      
      // S'assurer que les données sont à jour
      queryClient.invalidateQueries({ queryKey: commentKeys.postComments(post_id) });
      queryClient.invalidateQueries({ queryKey: commentKeys.count(post_id) });
    },
  });
};

/**
 * Hook de mutation pour mettre à jour un commentaire
 */
export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateCommentAPI,
    onSuccess: (updatedComment) => {
      // Mettre à jour le cache avec les nouvelles données
      queryClient.setQueryData(
        commentKeys.detail(updatedComment.id),
        updatedComment
      );

      // Mettre à jour dans la liste des commentaires du post
      if (updatedComment.post_id) {
        queryClient.setQueryData<CommentWithDetails[]>(
          commentKeys.postComments(updatedComment.post_id),
          (oldData) => 
            oldData 
              ? oldData.map(comment => comment.id === updatedComment.id ? updatedComment : comment)
              : [updatedComment]
        );
      }

      toast.success('Commentaire modifié avec succès !');
    },
    onError: (error) => {
      console.error('Erreur lors de la modification du commentaire:', error);
      toast.error(`Erreur lors de la modification: ${error.message}`);
    },
    onSettled: (updatedComment) => {
      if (updatedComment?.id) {
        queryClient.invalidateQueries({ queryKey: commentKeys.detail(updatedComment.id) });
      }
      if (updatedComment?.post_id) {
        queryClient.invalidateQueries({ queryKey: commentKeys.postComments(updatedComment.post_id) });
      }
    },
  });
};

/**
 * Hook de mutation pour supprimer un commentaire
 */
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteCommentAPI,
    onMutate: async (commentId) => {
      // Récupérer le commentaire pour avoir le post_id
      const commentData = queryClient.getQueryData<CommentWithDetails>(
        commentKeys.detail(commentId)
      );
      
      if (!commentData?.post_id) return { commentId };

      const postId = commentData.post_id;

      // Optimistic update: retirer le commentaire de la liste
      await Promise.all([
        queryClient.cancelQueries({ queryKey: commentKeys.postComments(postId) }),
        queryClient.cancelQueries({ queryKey: commentKeys.count(postId) }),
        queryClient.cancelQueries({ queryKey: postKeys.lists() }),
      ]);
      
      const previousComments = queryClient.getQueryData(commentKeys.postComments(postId));
      const previousCount = queryClient.getQueryData(commentKeys.count(postId));
      const previousPostsLists = queryClient.getQueriesData({ queryKey: postKeys.lists() });
      
      // Retirer le commentaire de la liste
      queryClient.setQueryData<CommentWithDetails[]>(
        commentKeys.postComments(postId),
        (oldData) => oldData ? oldData.filter(comment => comment.id !== commentId) : []
      );

      // Décrémenter le compteur
      queryClient.setQueryData<number>(
        commentKeys.count(postId),
        (oldCount) => Math.max(0, (oldCount || 0) - 1)
      );

      // Mettre à jour les posts
      queryClient.setQueriesData<PostWithDetails[]>(
        { queryKey: postKeys.lists() },
        (oldData) => {
          if (!oldData) return oldData;
          
          return oldData.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comment_count: Math.max(0, post.comment_count - 1),
              };
            }
            return post;
          });
        }
      );

      return { 
        commentId, 
        postId, 
        previousComments, 
        previousCount, 
        previousPostsLists 
      };
    },
    onSuccess: (_, commentId, context) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: commentKeys.detail(commentId) });
      
      if (context?.postId) {
        queryClient.invalidateQueries({ queryKey: commentKeys.postComments(context.postId) });
        queryClient.invalidateQueries({ queryKey: commentKeys.count(context.postId) });
        queryClient.invalidateQueries({ queryKey: commentKeys.stats(context.postId) });
        queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        queryClient.invalidateQueries({ queryKey: postKeys.detail(context.postId) });
      }

      toast.success('Commentaire supprimé avec succès !');
    },
    onError: (error, commentId, context) => {
      // Rollback en cas d'erreur
      if (context?.postId) {
        if (context.previousComments !== undefined) {
          queryClient.setQueryData(commentKeys.postComments(context.postId), context.previousComments);
        }
        if (context.previousCount !== undefined) {
          queryClient.setQueryData(commentKeys.count(context.postId), context.previousCount);
        }
        if (context.previousPostsLists) {
          context.previousPostsLists.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
          });
        }
      }

      console.error('Erreur lors de la suppression du commentaire:', error);
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    },
    onSettled: (_, __, commentId, context) => {
      if (context?.postId) {
        queryClient.invalidateQueries({ queryKey: commentKeys.postComments(context.postId) });
        queryClient.invalidateQueries({ queryKey: commentKeys.count(context.postId) });
      }
    },
  });
};

/**
 * Hook personnalisé pour simplifier l'utilisation des commentaires
 */
export const usePostComments = (postId: string) => {
  const commentsQuery = usePostCommentsQuery(postId);
  const countQuery = useCommentCountQuery(postId);
  const createMutation = useCreateCommentMutation();

  // Fonction helper pour ajouter un commentaire
  const addComment = (content: string) => {
    if (!content.trim()) {
      toast.error('Le commentaire ne peut pas être vide');
      return;
    }

    createMutation.mutate({
      content: content.trim(),
      post_id: postId,
    });
  };

  return {
    comments: commentsQuery.data || [],
    commentCount: countQuery.data || 0,
    isLoading: commentsQuery.isLoading || countQuery.isLoading,
    isLoadingComments: commentsQuery.isLoading,
    isLoadingCount: countQuery.isLoading,
    addComment,
    isAddingComment: createMutation.isPending,
    error: commentsQuery.error || countQuery.error || createMutation.error,
    refetch: () => {
      commentsQuery.refetch();
      countQuery.refetch();
    },
  };
};