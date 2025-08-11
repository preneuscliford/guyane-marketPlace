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
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews based on target user or announcement
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("reviews")
        .select(`
          *
        `)
        .order("created_at", { ascending: false });

      if (params.targetUserId) {
        query = query.eq("target_user_id", params.targetUserId);
      }

      if (params.announcementId) {
        query = query.eq("announcement_id", params.announcementId);
      }

      if (params.serviceId) {
        query = query.eq("service_id", params.serviceId);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        // Récupérer les profils utilisateurs pour chaque review
        const userIds = [...new Set(data.map(review => review.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);

        // Associer les profils aux reviews
        const reviewsWithProfiles = data.map(review => ({
          ...review,
          profiles: profilesData?.find(profile => profile.id === review.user_id) || null
        }));

        setReviews(reviewsWithProfiles.map(review => ({
          ...review,
          service_id: (review as any).service_id || null // Type assertion to handle missing property
        })) as unknown as Review[]);

        
        // If user is logged in, find their review
        if (user) {
          const userReview = reviewsWithProfiles.find(review => review.user_id === user.id);
          setUserReview(userReview ? (userReview as unknown as Review) : null);
        }
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
  }, [params.targetUserId, params.announcementId, user]);

  // Calculate statistics from reviews
  const calculateStats = (reviewsData: Review[]) => {
    if (reviewsData.length === 0) {
      setStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
      return;
    }

    const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / reviewsData.length;
    
    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviewsData.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });

    setStats({
      averageRating: parseFloat(average.toFixed(1)),
      totalReviews: reviewsData.length,
      ratingDistribution: distribution
    });
  };

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
  }, [fetchReviews]);

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
