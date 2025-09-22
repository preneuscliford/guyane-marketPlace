"use client";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: "post" | "comment" | "announcement" | "service" | "user";
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
  other: "Autre",
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Flag } from "lucide-react";

export default function ReportModal({
  isOpen,
  onClose,
  contentType,
  contentId,
  reportedUserId,
}: ReportModalProps) {
  const { user } = useAuth();
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const { error } = await supabase.from("reports").insert({
        reporter_id: user.id,
        reported_content_type: contentType,
        reported_content_id: contentId,
        reported_user_id: reportedUserId,
        reason,
        description: description.trim() || null,
      });
      if (error) throw error;
      toast.success(
        "Signalement envoyé avec succès. Notre équipe va l'examiner."
      );
      onClose();
      setReason("");
      setDescription("");
    } catch (error) {
      console.error("Erreur lors du signalement:", error);
      toast.error("Erreur lors de l'envoi du signalement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setReason("");
    setDescription("");
  };

  if (!isOpen) return null;
  return (
    <Dialog>
      <DialogContent
        onClose={handleClose}
        className="w-11/12 max-w-2xl max-h-[98vh] rounded-2xl p-0 overflow-hidden "
      >
        {/* Header */}
        <div className="px-4 sm:px-6 pt-5 pb-4 bg-gradient-to-r from-red-50 to-white border-b rounded-t-2xl">
          <div className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-gray-900">
            <Flag className="h-6 w-6 text-red-500" />
            Signaler ce contenu
          </div>
          <div className="text-sm sm:text-base text-gray-700 pt-2">
            Aidez-nous à maintenir une communauté sûre en signalant les contenus
            inappropriés.
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Body (scrollable) */}
          <div className="flex-1 px-4 sm:px-6 pb-4 overflow-y-auto">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="reason"
                  className="text-base font-semibold text-gray-900"
                >
                  Raison du signalement *
                </Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 rounded-lg hover:border-red-300 focus:border-red-500 transition-colors text-base">
                    <SelectValue placeholder="Sélectionnez une raison" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(REPORT_REASONS).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-base">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-base font-semibold text-gray-900"
                >
                  Description (optionnel)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez le problème en détail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  maxLength={500}
                  className="min-h-[110px] border-2 border-gray-200 rounded-lg hover:border-red-300 focus:border-red-500 transition-colors resize-none text-base"
                />
                <p className="text-xs text-gray-500 text-right">
                  {description.length}/500 caractères
                </p>
              </div>
            </div>
          </div>
          {/* Footer (sticky) */}
          <div className="px-4 sm:px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-base"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !reason}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-base"
            >
              {isSubmitting ? "Envoi..." : "Signaler"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
