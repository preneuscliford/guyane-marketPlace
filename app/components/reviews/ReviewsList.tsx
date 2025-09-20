"use client";

import { useState } from "react";
import { useReviews } from "@/hooks/useReviews";
import { RatingStars } from "@/components/ui/RatingStars";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, Flag, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

interface ReviewsListProps {
  targetUserId?: string;
  announcementId?: string;
  showAddReview?: boolean;
  showTargetName?: boolean;
  className?: string;
}

export function ReviewsList({
  targetUserId,
  announcementId,
  showAddReview = true,
  showTargetName = false,
  className
}: ReviewsListProps) {
  const { user } = useAuth();
  const { reviews, stats, userReview, loading, deleteReview } = useReviews({
    targetUserId,
    announcementId
  });
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Display a maximum of 3 reviews initially
  const displayedReviews = showAllReviews 
    ? reviews 
    : reviews.slice(0, 3);

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      await deleteReview(reviewId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-1">Avis et évaluations</h3>
            <div className="flex items-center">
              <RatingStars rating={stats.averageRating} size="lg" className="mr-2" />
              <span className="text-lg font-bold">{stats.averageRating}</span>
              <span className="text-gray-500 ml-2">({stats.totalReviews} avis)</span>
            </div>
          </div>
          
          {showAddReview && user && targetUserId && user.id !== targetUserId && (
            <Button 
              variant="outline"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="mt-4 md:mt-0"
            >
              {userReview ? "Modifier votre avis" : "Ajouter un avis"}
            </Button>
          )}
        </div>

        {/* Rating distribution bars */}
        {stats.totalReviews > 0 && (
          <div className="mb-6 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <span className="w-8 text-sm text-gray-600">{rating}</span>
                <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ 
                      width: `${Math.round((stats.ratingDistribution[rating] / stats.totalReviews) * 100)}%` 
                    }}
                  ></div>
                </div>
                <span className="w-8 text-sm text-gray-600 text-right">
                  {stats.ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Review form */}
        {showReviewForm && targetUserId && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <ReviewForm 
              targetUserId={targetUserId} 
              announcementId={announcementId}
              initialRating={userReview?.rating}
              initialComment={userReview?.comment || ""}
              onCancel={() => setShowReviewForm(false)}
              onSuccess={() => setShowReviewForm(false)}
            />
          </div>
        )}

        {/* Reviews list */}
        {stats.totalReviews === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-lg font-medium mb-2">Aucun avis pour le moment</h4>
            <p className="text-gray-500 max-w-md mx-auto">
              Soyez le premier à partager votre expérience et à aider les autres utilisateurs.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedReviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="h-10 w-10 mr-4 relative rounded-full overflow-hidden">
                      <Image 
                        src={review.user?.avatar_url || "/default-avatar.svg"} 
                        alt={review.user?.username || "Utilisateur"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="font-medium mr-2">
                          {review.user?.username || "Utilisateur"}
                        </span>
                        <RatingStars rating={review.rating} size="sm" />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {formatDistanceToNow(new Date(review.created_at), {
                          addSuffix: true,
                          locale: fr
                        })}
                      </p>
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {user && user.id === review.user_id && (
                      <button 
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-gray-400 hover:text-red-500"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      title="Signaler"
                    >
                      <Flag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {reviews.length > 3 && (
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowAllReviews(!showAllReviews)}
                >
                  {showAllReviews ? "Voir moins d'avis" : `Voir tous les avis (${reviews.length})`}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Component for the review form (to be imported by ReviewsList)
interface ReviewFormProps {
  targetUserId: string;
  announcementId?: string | null;
  initialRating?: number;
  initialComment?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ReviewForm({
  targetUserId,
  announcementId,
  initialRating = 0,
  initialComment = "",
  onCancel,
  onSuccess
}: ReviewFormProps) {
  const { addReview } = useReviews({ targetUserId, announcementId: announcementId || undefined });
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Veuillez choisir une note");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await addReview({
        targetUserId,
        announcementId: announcementId || null,
        rating,
        comment: comment.trim() || null
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="text-lg font-medium mb-4">
        {initialRating ? "Modifier votre avis" : "Ajouter un avis"}
      </h4>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Note
        </label>
        <RatingStars 
          rating={rating} 
          interactive 
          size="lg" 
          onChange={setRating} 
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label 
          htmlFor="comment" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Commentaire (optionnel)
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="Partagez votre expérience..."
        ></textarea>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi...
            </>
          ) : initialRating ? "Mettre à jour" : "Publier"}
        </Button>
      </div>
    </form>
  );
}
