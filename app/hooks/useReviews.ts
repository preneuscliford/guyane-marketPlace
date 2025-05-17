import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

interface Review {
  id: string;
  user_id: string;
  target_user_id: string;
  announcement_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: {
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

  // Fetch reviews based on target user or announcement
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("reviews")
        .select(`
          *,
          user:user_id (
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (params.targetUserId) {
        query = query.eq("target_user_id", params.targetUserId);
      }

      if (params.announcementId) {
        query = query.eq("announcement_id", params.announcementId);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setReviews(data as Review[]);
        calculateStats(data as Review[]);
        
        // If user is logged in, find their review
        if (user) {
          const userReview = data.find(review => review.user_id === user.id);
          setUserReview(userReview as Review || null);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
        rating: reviewData.rating,
        comment: reviewData.comment || null
      });

      if (error) throw error;

      // Refresh reviews after adding
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
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", user.id);

      if (error) throw error;

      // Refresh reviews after deleting
      await fetchReviews();
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
    addReview,
    updateReview,
    deleteReview,
    refreshReviews: fetchReviews
  };
}
