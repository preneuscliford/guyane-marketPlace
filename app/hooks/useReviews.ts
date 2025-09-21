import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

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
  ratingDistribution: Record<number, number>; // { 1: count, 2: count, ... }
}

interface UseReviewsParams {
  targetUserId?: string;
  announcementId?: string;
  serviceId?: string;
}

export function useReviews(params: UseReviewsParams = {}) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Créer des valeurs stables pour les paramètres
  const { targetUserId, announcementId, serviceId } = params;
  const userId = user?.id; // Référence stable pour user.id

  // Fetch reviews based on target user or announcement
  const fetchReviews = useCallback(async () => {
    try {
      console.log('useReviews - fetchReviews appelé avec:', { targetUserId, announcementId, serviceId });
      setLoading(true);
      setError(null);

      let query = supabase
        .from("reviews")
        .select(`
          *
        `)
        .order("created_at", { ascending: false });

      if (targetUserId) {
        query = query.eq("target_user_id", targetUserId);
      }

      if (announcementId) {
        query = query.eq("announcement_id", announcementId);
      }

      if (serviceId) {
        query = query.eq("service_id", serviceId);
      }

      console.log('useReviews - Exécution de la requête...');
      const { data, error } = await query;

      console.log('useReviews - Résultat requête:', { data: data?.length || 0, error });

      if (error) {
        console.error('useReviews - Erreur Supabase:', error);
        throw error;
      }

      if (data) {
        // Si pas d'avis, définir un tableau vide
        if (data.length === 0) {
          setReviews([]);
          setUserReview(null);
        } else {
          // Récupérer les profils utilisateurs pour chaque review
          const userIds = [...new Set(data.map(review => review.user_id))];
          
          let profilesData: Array<{id: string; username: string | null; avatar_url: string | null}> = [];
          if (userIds.length > 0) {
            const { data: profiles } = await supabase
              .from('profiles')
              .select('id, username, avatar_url')
              .in('id', userIds);
            profilesData = profiles || [];
          }

          // Associer les profils aux reviews
          const reviewsWithProfiles = data.map(review => ({
            ...review,
            profiles: profilesData.find(profile => profile.id === review.user_id) || null
          }));

          setReviews(reviewsWithProfiles.map(review => ({
            ...review,
            service_id: (review as any).service_id || null
          })) as unknown as Review[]);

          // If user is logged in, find their review
          const currentUser = user; // Capturer user dans une variable stable
          if (currentUser) {
            const userReview = reviewsWithProfiles.find(review => review.user_id === currentUser.id);
            setUserReview(userReview ? (userReview as unknown as Review) : null);
          } else {
            setUserReview(null);
          }
        }
      } else {
        // Si data est null/undefined, définir un tableau vide
        setReviews([]);
        setUserReview(null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch reviews";
      console.error("Detailed error:", {
        error,
        params,
        errorMessage
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [targetUserId, announcementId, serviceId, userId]); // Utiliser userId au lieu de user?.id

  // Add a new review
  const addReview = async (reviewData: {
    targetUserId: string;
    announcementId?: string | null;
    serviceId?: string | null;
    rating: number;
    comment?: string | null;
  }) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      // Check if user already left a review
      if (userReview) {
        return updateReview({
          id: userReview.id,
          rating: reviewData.rating,
          comment: reviewData.comment || null
        });
      }

      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        target_user_id: reviewData.targetUserId,
        announcement_id: reviewData.announcementId || null,
        service_id: reviewData.serviceId || null,
        rating: reviewData.rating,
        comment: reviewData.comment || null
      });

      if (error) throw error;

      // Refresh reviews after adding with updated params
      const refreshParams = {
        ...params,
        targetUserId: reviewData.targetUserId,
        serviceId: reviewData.serviceId,
        announcementId: reviewData.announcementId
      };
      
      // Update the current params and refresh
      Object.assign(params, refreshParams);
      await fetchReviews();
      return { success: true };
    } catch (error: Error | unknown) {
      console.error("Error adding review:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to add review" 
      };
    }
  };

  // Update an existing review
  const updateReview = async (reviewData: {
    id: string;
    rating: number;
    comment: string | null;
  }) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          rating: reviewData.rating,
          comment: reviewData.comment
        })
        .eq("id", reviewData.id)
        .eq("user_id", user.id);

      if (error) throw error;

      // Refresh reviews after updating
      await fetchReviews();
      return { success: true };
    } catch (error: Error | unknown) {
      console.error("Error updating review:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update review" 
      };
    }
  };

  // Delete a review
  const deleteReview = async (reviewId: string) => {
    if (!user) {
      console.error("Delete review failed: User not authenticated");
      return { success: false, error: "User not authenticated" };
    }

    console.log("Attempting to delete review:", { reviewId, userId: user.id });

    try {
      const { data, error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", user.id)
        .select();

      if (error) {
        console.error("Supabase delete error:", error);
        throw error;
      }

      console.log("Delete result:", data);
      
      if (!data || data.length === 0) {
        console.warn("No review was deleted - review not found or user not authorized");
        return { 
          success: false, 
          error: "Avis non trouvé ou vous n'êtes pas autorisé à le supprimer" 
        };
      }

      // Refresh reviews after deleting
      await fetchReviews();
      console.log("Review deleted successfully");
      return { success: true };
    } catch (error: Error | unknown) {
      console.error("Error deleting review:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to delete review" 
      };
    }
  };

    // Fetch reviews when parameters change
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, targetUserId, announcementId, serviceId]);

  // Log de debug (à supprimer en production)
  useEffect(() => {
    if (loading === false) {
      console.log('useReviews - Chargement terminé:', { reviewsCount: reviews.length, error });
    }
  }, [loading, error, reviews]);

  return {
    reviews,
    stats,
    userReview,
    loading,
    error,
    addReview,
    updateReview,
    deleteReview,
    refreshReviews: fetchReviews
  };
}
