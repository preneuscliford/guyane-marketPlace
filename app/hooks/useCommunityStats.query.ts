/**
 * Hook TanStack Query pour les statistiques de la communauté
 * Centralise toutes les métriques et analytics avec cache intelligent
 * et mise à jour périodique automatique
 */

import { useQuery, useQueries } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getCacheConfig } from './cacheConfig';
import { postKeys } from './usePosts.query';
import { commentKeys } from './useComments.query';
import { announcementKeys } from './useAnnouncements.query';
import { messageKeys } from './useMessages.query';

// ============================================================================
// TYPES ET INTERFACES
// ============================================================================

export interface CommunityStats {
  total_posts: number;
  total_users: number;
  posts_today: number;
  active_users: number;
}

export interface DetailedCommunityStats extends CommunityStats {
  total_comments: number;
  comments_today: number;
  total_likes: number;
  likes_today: number;
  total_announcements: number;
  announcements_today: number;
  total_conversations: number;
  active_conversations: number;
  messages_today: number;
}

export interface UserEngagementStats {
  avg_posts_per_user: number;
  avg_comments_per_post: number;
  avg_likes_per_post: number;
  most_active_users: Array<{
    user_id: string;
    username: string;
    activity_score: number;
  }>;
}

export interface ContentStats {
  popular_categories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  trending_posts: Array<{
    id: string;
    title: string;
    likes: number;
    comments: number;
    score: number;
  }>;
  growth_metrics: {
    posts_growth_7d: number;
    users_growth_7d: number;
    engagement_growth_7d: number;
  };
}

export interface DashboardStats {
  community: DetailedCommunityStats;
  engagement: UserEngagementStats;
  content: ContentStats;
  real_time: {
    users_online: number;
    active_conversations: number;
    last_updated: string;
  };
}

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const statsKeys = {
  all: ['stats'] as const,
  community: () => [...statsKeys.all, 'community'] as const,
  detailed: () => [...statsKeys.all, 'detailed'] as const,
  engagement: () => [...statsKeys.all, 'engagement'] as const,
  content: () => [...statsKeys.all, 'content'] as const,
  dashboard: () => [...statsKeys.all, 'dashboard'] as const,
  realtime: () => [...statsKeys.all, 'realtime'] as const,
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Récupère les statistiques basiques de la communauté
 */
export const fetchCommunityStatsAPI = async (): Promise<CommunityStats> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // Exécuter toutes les requêtes en parallèle pour de meilleures performances
    const [
      totalPostsResult,
      totalUsersResult,
      postsTodayResult,
      activeUsersPostsResult,
      activeUsersCommentsResult
    ] = await Promise.all([
      // Compter les posts totaux
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false),
      
      // Compter les utilisateurs totaux
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true }),
      
      // Compter les posts d'aujourd'hui
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false)
        .gte('created_at', todayISO),
      
      // Utilisateurs actifs avec des posts aujourd'hui
      supabase
        .from('posts')
        .select('user_id')
        .gte('created_at', todayISO)
        .eq('is_hidden', false),
      
      // Utilisateurs actifs avec des commentaires aujourd'hui
      supabase
        .from('comments')
        .select('user_id')
        .gte('created_at', todayISO)
        .eq('is_hidden', false)
    ]);

    // Calculer les utilisateurs actifs uniques
    const activeUserIds = new Set([
      ...(activeUsersPostsResult.data?.map(p => p.user_id).filter(Boolean) || []),
      ...(activeUsersCommentsResult.data?.map(c => c.user_id).filter(Boolean) || [])
    ]);

    return {
      total_posts: totalPostsResult.count || 0,
      total_users: totalUsersResult.count || 0,
      posts_today: postsTodayResult.count || 0,
      active_users: activeUserIds.size,
    };
  } catch (error) {
    console.error('Erreur dans fetchCommunityStatsAPI:', error);
    throw error;
  }
};

/**
 * Récupère les statistiques détaillées de la communauté
 */
export const fetchDetailedCommunityStatsAPI = async (): Promise<DetailedCommunityStats> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // Exécuter toutes les requêtes en parallèle
    const [
      basicStats,
      totalCommentsResult,
      commentsTodayResult,
      totalLikesResult,
      likesTodayResult,
      totalAnnouncementsResult,
      announcementsTodayResult,
      totalConversationsResult,
      activeConversationsResult,
      messagesTodayResult
    ] = await Promise.all([
      // Statistiques de base
      fetchCommunityStatsAPI(),
      
      // Commentaires totaux
      supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false),
      
      // Commentaires d'aujourd'hui
      supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false)
        .gte('created_at', todayISO),
      
      // Likes totaux
      supabase
        .from('likes')
        .select('*', { count: 'exact', head: true }),
      
      // Likes d'aujourd'hui
      supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO),
      
      // Annonces totales
      supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false),
      
      // Annonces d'aujourd'hui
      supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false)
        .gte('created_at', todayISO),
      
      // Conversations totales
      supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true }),
      
      // Conversations actives (avec messages dans les 24h)
      supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', todayISO),
      
      // Messages d'aujourd'hui
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO)
    ]);

    return {
      ...basicStats,
      total_comments: totalCommentsResult.count || 0,
      comments_today: commentsTodayResult.count || 0,
      total_likes: totalLikesResult.count || 0,
      likes_today: likesTodayResult.count || 0,
      total_announcements: totalAnnouncementsResult.count || 0,
      announcements_today: announcementsTodayResult.count || 0,
      total_conversations: totalConversationsResult.count || 0,
      active_conversations: activeConversationsResult.count || 0,
      messages_today: messagesTodayResult.count || 0,
    };
  } catch (error) {
    console.error('Erreur dans fetchDetailedCommunityStatsAPI:', error);
    throw error;
  }
};

/**
 * Récupère les statistiques d'engagement utilisateur
 */
export const fetchUserEngagementStatsAPI = async (): Promise<UserEngagementStats> => {
  try {
    const [
      totalPosts,
      totalUsers,
      totalComments,
      totalLikes,
      userActivityData
    ] = await Promise.all([
      // Total des posts
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false),
      
      // Total des utilisateurs
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true }),
      
      // Total des commentaires
      supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false),
      
      // Total des likes
      supabase
        .from('likes')
        .select('*', { count: 'exact', head: true }),
      
      // Activité des utilisateurs (posts, commentaires, likes par utilisateur)
      supabase
        .from('profiles')
        .select(`
          id,
          username,
          posts!posts_user_id_fkey(id),
          comments!comments_user_id_fkey(id),
          likes!likes_user_id_fkey(id)
        `)
        .limit(1000) // Limiter pour de meilleures performances
    ]);

    // Calculer les moyennes
    const avgPostsPerUser = (totalPosts.count || 0) / Math.max(totalUsers.count || 1, 1);
    const avgCommentsPerPost = (totalComments.count || 0) / Math.max(totalPosts.count || 1, 1);
    const avgLikesPerPost = (totalLikes.count || 0) / Math.max(totalPosts.count || 1, 1);

    // Calculer les utilisateurs les plus actifs
    const mostActiveUsers = (userActivityData.data || [])
      .map((user: any) => {
        const postsCount = user.posts?.length || 0;
        const commentsCount = user.comments?.length || 0;
        const likesCount = user.likes?.length || 0;
        
        // Score d'activité (posts = 3 points, commentaires = 2 points, likes = 1 point)
        const activityScore = postsCount * 3 + commentsCount * 2 + likesCount * 1;
        
        return {
          user_id: user.id,
          username: user.username,
          activity_score: activityScore,
        };
      })
      .filter(user => user.activity_score > 0)
      .sort((a, b) => b.activity_score - a.activity_score)
      .slice(0, 10); // Top 10

    return {
      avg_posts_per_user: Math.round(avgPostsPerUser * 100) / 100,
      avg_comments_per_post: Math.round(avgCommentsPerPost * 100) / 100,
      avg_likes_per_post: Math.round(avgLikesPerPost * 100) / 100,
      most_active_users: mostActiveUsers,
    };
  } catch (error) {
    console.error('Erreur dans fetchUserEngagementStatsAPI:', error);
    throw error;
  }
};

/**
 * Récupère les statistiques de contenu et tendances
 */
export const fetchContentStatsAPI = async (): Promise<ContentStats> => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoISO = weekAgo.toISOString();

    const [
      announcementsData,
      postsWithEngagement,
      postsThisWeek,
      postsLastWeek,
      usersThisWeek,
      usersLastWeek
    ] = await Promise.all([
      // Catégories d'annonces
      supabase
        .from('announcements')
        .select('category')
        .eq('is_hidden', false),
      
      // Posts avec engagement pour le trending
      supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          likes(user_id),
          comments!comments_post_id_fkey(id)
        `)
        .eq('is_hidden', false)
        .gte('created_at', weekAgoISO)
        .limit(100),
      
      // Posts de cette semaine
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false)
        .gte('created_at', weekAgoISO),
      
      // Posts de la semaine précédente
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_hidden', false)
        .gte('created_at', new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .lt('created_at', weekAgoISO),
      
      // Utilisateurs créés cette semaine
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgoISO),
      
      // Utilisateurs créés la semaine précédente
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .lt('created_at', weekAgoISO)
    ]);

    // Calculer les catégories populaires
    const categoryCountMap = (announcementsData.data || []).reduce((acc: any, announcement) => {
      acc[announcement.category] = (acc[announcement.category] || 0) + 1;
      return acc;
    }, {});

    const totalCategories = announcementsData.data?.length || 0;
    const popularCategories = Object.entries(categoryCountMap)
      .map(([category, count]) => ({
        category,
        count: count as number,
        percentage: Math.round(((count as number) / totalCategories) * 100 * 100) / 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculer les posts tendance
    const trendingPosts = (postsWithEngagement.data || [])
      .map((post: any) => {
        const likesCount = post.likes?.length || 0;
        const commentsCount = post.comments?.length || 0;
        
        // Score basé sur l'engagement récent
        const daysSinceCreation = Math.max(1, Math.floor(
          (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60 * 24)
        ));
        
        // Score ajusté par le temps (plus récent = meilleur score)
        const timeAdjustment = Math.max(0.1, 1 / daysSinceCreation);
        const score = (likesCount * 2 + commentsCount * 3) * timeAdjustment;
        
        return {
          id: post.id,
          title: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
          likes: likesCount,
          comments: commentsCount,
          score: Math.round(score * 100) / 100,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Calculer les métriques de croissance
    const postsThisWeekCount = postsThisWeek.count || 0;
    const postsLastWeekCount = postsLastWeek.count || 0;
    const usersThisWeekCount = usersThisWeek.count || 0;
    const usersLastWeekCount = usersLastWeek.count || 0;

    const postsGrowth = postsLastWeekCount > 0 
      ? ((postsThisWeekCount - postsLastWeekCount) / postsLastWeekCount) * 100 
      : 0;
    
    const usersGrowth = usersLastWeekCount > 0 
      ? ((usersThisWeekCount - usersLastWeekCount) / usersLastWeekCount) * 100 
      : 0;

    // Engagement growth (simplifié: croissance du nombre total d'interactions)
    const totalEngagementThisWeek = postsThisWeekCount * 1.5; // Approximation
    const totalEngagementLastWeek = postsLastWeekCount * 1.5;
    const engagementGrowth = totalEngagementLastWeek > 0 
      ? ((totalEngagementThisWeek - totalEngagementLastWeek) / totalEngagementLastWeek) * 100 
      : 0;

    return {
      popular_categories: popularCategories,
      trending_posts: trendingPosts,
      growth_metrics: {
        posts_growth_7d: Math.round(postsGrowth * 100) / 100,
        users_growth_7d: Math.round(usersGrowth * 100) / 100,
        engagement_growth_7d: Math.round(engagementGrowth * 100) / 100,
      },
    };
  } catch (error) {
    console.error('Erreur dans fetchContentStatsAPI:', error);
    throw error;
  }
};

/**
 * Récupère les statistiques temps réel
 */
export const fetchRealTimeStatsAPI = async (): Promise<DashboardStats['real_time']> => {
  try {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    const fiveMinutesAgoISO = fiveMinutesAgo.toISOString();

    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
    const thirtyMinutesAgoISO = thirtyMinutesAgo.toISOString();

    const [
      recentActivity,
      recentConversations
    ] = await Promise.all([
      // Activité récente (posts, commentaires dans les 30 dernières minutes)
      Promise.all([
        supabase
          .from('posts')
          .select('user_id')
          .gte('created_at', thirtyMinutesAgoISO)
          .eq('is_hidden', false),
        
        supabase
          .from('comments')
          .select('user_id')
          .gte('created_at', thirtyMinutesAgoISO)
          .eq('is_hidden', false)
      ]),
      
      // Conversations actives (mises à jour dans les 5 dernières minutes)
      supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', fiveMinutesAgoISO)
    ]);

    // Estimer les utilisateurs en ligne basé sur l'activité récente
    const activeUserIds = new Set([
      ...(recentActivity[0].data?.map(p => p.user_id).filter(Boolean) || []),
      ...(recentActivity[1].data?.map(c => c.user_id).filter(Boolean) || [])
    ]);

    return {
      users_online: activeUserIds.size,
      active_conversations: recentConversations.count || 0,
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Erreur dans fetchRealTimeStatsAPI:', error);
    return {
      users_online: 0,
      active_conversations: 0,
      last_updated: new Date().toISOString(),
    };
  }
};

/**
 * Récupère toutes les statistiques du dashboard
 */
export const fetchDashboardStatsAPI = async (): Promise<DashboardStats> => {
  try {
    const [
      communityStats,
      engagementStats,
      contentStats,
      realTimeStats
    ] = await Promise.all([
      fetchDetailedCommunityStatsAPI(),
      fetchUserEngagementStatsAPI(),
      fetchContentStatsAPI(),
      fetchRealTimeStatsAPI()
    ]);

    return {
      community: communityStats,
      engagement: engagementStats,
      content: contentStats,
      real_time: realTimeStats,
    };
  } catch (error) {
    console.error('Erreur dans fetchDashboardStatsAPI:', error);
    throw error;
  }
};

// ============================================================================
// HOOKS TANSTACK QUERY
// ============================================================================

/**
 * Hook pour récupérer les statistiques basiques de la communauté
 */
export const useCommunityStatsQuery = () => {
  const cacheConfig = getCacheConfig('community_stats');
  
  return useQuery({
    queryKey: statsKeys.community(),
    queryFn: fetchCommunityStatsAPI,
    ...cacheConfig,
    refetchInterval: 5 * 60 * 1000, // Mise à jour toutes les 5 minutes
  });
};

/**
 * Hook pour récupérer les statistiques détaillées de la communauté
 */
export const useDetailedCommunityStatsQuery = () => {
  const cacheConfig = getCacheConfig('analytics_data');
  
  return useQuery({
    queryKey: statsKeys.detailed(),
    queryFn: fetchDetailedCommunityStatsAPI,
    ...cacheConfig,
    refetchInterval: 10 * 60 * 1000, // Mise à jour toutes les 10 minutes
  });
};

/**
 * Hook pour récupérer les statistiques d'engagement
 */
export const useUserEngagementStatsQuery = () => {
  const cacheConfig = getCacheConfig('analytics_data');
  
  return useQuery({
    queryKey: statsKeys.engagement(),
    queryFn: fetchUserEngagementStatsAPI,
    ...cacheConfig,
    refetchInterval: 15 * 60 * 1000, // Mise à jour toutes les 15 minutes
  });
};

/**
 * Hook pour récupérer les statistiques de contenu
 */
export const useContentStatsQuery = () => {
  const cacheConfig = getCacheConfig('trending_data');
  
  return useQuery({
    queryKey: statsKeys.content(),
    queryFn: fetchContentStatsAPI,
    ...cacheConfig,
    refetchInterval: 10 * 60 * 1000, // Mise à jour toutes les 10 minutes
  });
};

/**
 * Hook pour récupérer les statistiques temps réel
 */
export const useRealTimeStatsQuery = () => {
  const cacheConfig = getCacheConfig('realtime_data');
  
  return useQuery({
    queryKey: statsKeys.realtime(),
    queryFn: fetchRealTimeStatsAPI,
    ...cacheConfig,
    refetchInterval: 30 * 1000, // Mise à jour toutes les 30 secondes
  });
};

/**
 * Hook pour récupérer toutes les statistiques du dashboard
 */
export const useDashboardStatsQuery = () => {
  const cacheConfig = getCacheConfig('dashboard_data');
  
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: fetchDashboardStatsAPI,
    ...cacheConfig,
    refetchInterval: 5 * 60 * 1000, // Mise à jour toutes les 5 minutes
  });
};

/**
 * Hook pour récupérer plusieurs statistiques en parallèle
 */
export const useMultipleStatsQueries = () => {
  return useQueries({
    queries: [
      {
        queryKey: statsKeys.community(),
        queryFn: fetchCommunityStatsAPI,
        ...getCacheConfig('community_stats'),
        refetchInterval: 5 * 60 * 1000,
      },
      {
        queryKey: statsKeys.engagement(),
        queryFn: fetchUserEngagementStatsAPI,
        ...getCacheConfig('analytics_data'),
        refetchInterval: 15 * 60 * 1000,
      },
      {
        queryKey: statsKeys.content(),
        queryFn: fetchContentStatsAPI,
        ...getCacheConfig('trending_data'),
        refetchInterval: 10 * 60 * 1000,
      },
      {
        queryKey: statsKeys.realtime(),
        queryFn: fetchRealTimeStatsAPI,
        ...getCacheConfig('realtime_data'),
        refetchInterval: 30 * 1000,
      },
    ],
  });
};

/**
 * Hook personnalisé pour un aperçu complet des statistiques
 */
export const useCommunityOverview = () => {
  const communityQuery = useCommunityStatsQuery();
  const realTimeQuery = useRealTimeStatsQuery();
  
  return {
    // Données principales
    stats: communityQuery.data,
    realTime: realTimeQuery.data,
    
    // États de chargement
    isLoading: communityQuery.isLoading || realTimeQuery.isLoading,
    isLoadingStats: communityQuery.isLoading,
    isLoadingRealTime: realTimeQuery.isLoading,
    
    // Erreurs
    error: communityQuery.error || realTimeQuery.error,
    
    // Actions
    refetch: () => {
      communityQuery.refetch();
      realTimeQuery.refetch();
    },
    
    // Métriques calculées
    metrics: communityQuery.data ? {
      engagement_rate: communityQuery.data.total_posts > 0 
        ? ((communityQuery.data.active_users / communityQuery.data.total_users) * 100).toFixed(1)
        : '0',
      activity_today: (
        communityQuery.data.posts_today + 
        (realTimeQuery.data?.active_conversations || 0)
      ),
      growth_indicator: communityQuery.data.posts_today > 0 ? 'positive' : 'neutral'
    } : null,
  };
};