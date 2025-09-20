"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RatingStars } from '@/components/ui/RatingStars';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Send, X } from 'lucide-react';

interface ServiceReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel: () => void;
  initialRating?: number;
  initialComment?: string;
  isEditing?: boolean;
}

/**
 * Formulaire pour ajouter ou modifier un avis sur un service
 */
export function ServiceReviewForm({
  onSubmit,
  onCancel,
  initialRating = 0,
  initialComment = '',
  isEditing = false
}: ServiceReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Veuillez sélectionner une note');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(rating, comment);
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'avis:', error);
      alert('Une erreur est survenue lors de l\'envoi de votre avis');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Gère l'annulation du formulaire
   */
  const handleCancel = () => {
    setRating(initialRating);
    setComment(initialComment);
    onCancel();
  };

  return (
    <Card className="border-purple-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-purple-600" />
          {isEditing ? 'Modifier votre avis' : 'Laisser un avis'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection de la note */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Note <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <RatingStars
                rating={rating}
                interactive
                size="lg"
                onChange={setRating}
                className="cursor-pointer"
              />
              {rating > 0 && (
                <span className="text-sm text-gray-600">
                  {rating === 1 && 'Très insatisfait'}
                  {rating === 2 && 'Insatisfait'}
                  {rating === 3 && 'Correct'}
                  {rating === 4 && 'Satisfait'}
                  {rating === 5 && 'Très satisfait'}
                </span>
              )}
            </div>
          </div>

          {/* Commentaire */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium">
              Commentaire (optionnel)
            </Label>
            <Textarea
              id="comment"
              placeholder="Partagez votre expérience avec ce prestataire..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">
              {comment.length}/500 caractères
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
              {isSubmitting
                ? 'Envoi en cours...'
                : isEditing
                ? 'Modifier l\'avis'
                : 'Publier l\'avis'
              }
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
