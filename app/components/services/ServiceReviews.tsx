"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/AvatarComponent';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RatingStars } from '@/components/ui/RatingStars';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Star, User, MessageSquare, Plus } from 'lucide-react';
import { ServiceReviewForm } from './ServiceReviewForm';

interface ServiceReviewsProps {
  serviceId: string;
  serviceOwnerId: string;
}

/**
 * Composant pour afficher et gérer les avis d'un service
 */
export function ServiceReviews({ serviceId, serviceOwnerId }: ServiceReviewsProps) {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Utiliser le hook useReviews pour récupérer les avis du propriétaire du service
  const {
    reviews,
    stats,
    userReview,
    loading,
    error,
    addReview,
    updateReview,
    deleteReview,
    refreshReviews
  } = useReviews({ targetUserId: serviceOwnerId, serviceId: serviceId });

  /**
   * Gère l'ajout ou la modification d'un avis
   */
  const handleReviewSubmit = async (rating: number, comment: string) => {
    try {
      const result = await addReview({
        targetUserId: serviceOwnerId,
        serviceId: serviceId,
        rating,
        comment: comment.trim() || null
      });
      
      if (result) {
        setShowReviewForm(false);
        await refreshReviews();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'avis:', error);
    }
  };

  /**
   * Gère la suppression d'un avis
   */
  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      try {
        const result = await deleteReview(reviewId);
        if (result.success) {
          await refreshReviews();
        } else {
          console.error('Erreur lors de la suppression de l\'avis:', result.error);
          alert('Erreur lors de la suppression de l\'avis: ' + result.error);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'avis:', error);
        alert('Erreur lors de la suppression de l\'avis');
      }
    }
  };

  // Vérifier si l'utilisateur peut laisser un avis
  const canReview = user && user.id !== serviceOwnerId;
  const hasReviews = reviews && reviews.length > 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Avis clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Chargement des avis...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Avis clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">Erreur lors du chargement des avis: {error}</p>
            <Button 
              onClick={() => refreshReviews()} 
              className="mt-4"
              variant="outline"
            >
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Avis clients
          </CardTitle>
          
          {/* Bouton pour ajouter un avis */}
          {canReview && !userReview && !showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Laisser un avis
            </Button>
          )}
        </div>
        
        {/* Statistiques des avis */}
        {stats && (
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-bold">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                </span>
              </div>
              <span className="text-gray-500">
                ({stats.totalReviews} avis)
              </span>
            </div>
            
            {/* Distribution des notes */}
            {stats.ratingDistribution && (
              <div className="flex gap-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-1 text-xs">
                    <span>{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-500">
                      ({stats.ratingDistribution[rating] || 0})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {/* Formulaire d'ajout d'avis */}
        {showReviewForm && canReview && (
          <div className="mb-6">
            <ServiceReviewForm
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowReviewForm(false)}
              initialRating={userReview?.rating}
              initialComment={userReview?.comment || ''}
              isEditing={!!userReview}
            />
          </div>
        )}

        {/* Avis de l'utilisateur connecté */}
        {userReview && canReview && (
          <div className="mb-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-purple-900">Votre avis</h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowReviewForm(true)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteReview(userReview.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <RatingStars rating={userReview.rating} size="sm" />
                <span className="text-sm text-gray-600">
                  {formatDistanceToNow(new Date(userReview.created_at), {
                    addSuffix: true,
                    locale: fr
                  })}
                </span>
              </div>
              {userReview.comment && (
                <p className="text-gray-700">{userReview.comment}</p>
              )}
            </div>
            <Separator className="my-6" />
          </div>
        )}

        {/* Liste des avis */}
        {hasReviews ? (
          <div className="space-y-6">
            {reviews
              .filter(review => review.id !== userReview?.id) // Exclure l'avis de l'utilisateur connecté
              .map((review) => (
                <div key={review.id} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.profiles?.avatar_url || ''} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">
                          {review.profiles?.username || 'Utilisateur anonyme'}
                        </h4>
                        <RatingStars rating={review.rating} size="sm" />
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(review.created_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </span>
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun avis pour le moment
            </h3>
            <p className="text-gray-500 mb-4">
              Soyez le premier à laisser un avis sur ce prestataire !
            </p>
            {canReview && (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Laisser le premier avis
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
