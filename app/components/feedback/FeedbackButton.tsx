"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import { Button } from "@/components/ui/Button";

/**
 * Bouton de feedback flottant affiché sur toutes les pages
 * Permet aux utilisateurs d'envoyer facilement des commentaires
 */
export function FeedbackButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <FeedbackModal>
        <Button
          size="lg"
          className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full p-4"
          aria-label="Envoyer un feedback"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="ml-2 hidden sm:inline">Feedback</span>
        </Button>
      </FeedbackModal>
    </div>
  );
}

export default FeedbackButton;