"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Flag, X } from "lucide-react";
import { motion } from "framer-motion";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'post' | 'comment' | 'announcement' | 'service' | 'user';
  contentId: string;
  reportedUserId?: string;
}

const REPORT_REASONS = {
  spam: "Spam ou contenu indésirable",
  harassment: "Harcèlement ou intimidation",
  hate_speech: "Discours de haine",
  violence: "Violence ou menaces",
  inappropriate: "Contenu inapproprié",
  misinformation: "Désinformation",
  copyright: "Violation de droits d'auteur",
  fraud: "Fraude ou escroquerie",
  other: "Autre"
};

/**
 * Modal pour signaler du contenu inapproprié
 */
export default function ReportModal({
  isOpen,
  onClose,
  contentType,
  contentId,
  reportedUserId
}: ReportModalProps) {
  const { user } = useAuth();
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Soumet le signalement
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Vous devez être connecté pour signaler du contenu");
      return;
    }

    if (!reason) {
      toast.error("Veuillez sélectionner une raison");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: user.id,
          reported_content_type: contentType,
          reported_content_id: contentId,
          reported_user_id: reportedUserId,
          reason,
          description: description.trim() || null
        });

      if (error) throw error;

      toast.success("Signalement envoyé avec succès. Notre équipe va l'examiner.");
      onClose();
      setReason("");
      setDescription("");
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
      toast.error("Erreur lors de l'envoi du signalement");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Ferme le modal et remet à zéro les champs
   */
  const handleClose = () => {
    onClose();
    setReason("");
    setDescription("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={handleClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Flag className="h-5 w-5 text-red-500" />
              Signaler ce contenu
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Aidez-nous à maintenir une communauté sûre en signalant les contenus inappropriés.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="reason">Raison du signalement *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une raison" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(REPORT_REASONS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le problème en détail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {description.length}/500 caractères
            </p>
          </div>

          <div className="p-6 pt-4 border-t bg-gray-50 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !reason}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Envoi..." : "Signaler"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}