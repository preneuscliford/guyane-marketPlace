"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReportModal from "@/components/moderation/ReportModal";
import { Flag } from "lucide-react";

interface ReportButtonProps {
  contentType: "post" | "comment" | "service" | "announcement";
  contentId: string;
  reportedUserId?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

/**
 * Bouton de signalement réutilisable pour différents types de contenu
 */
export default function ReportButton({
  contentType,
  contentId,
  reportedUserId,
  className = "",
  variant = "ghost",
  size,
  showText = false,
}: ReportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={
          size && ["default", "sm", "lg", "icon"].includes(size) ? size : "sm"
        }
        onClick={() => setIsModalOpen(true)}
        className={`text-gray-500 hover:text-red-600 ${className}`}
      >
        <Flag className="h-4 w-4" />
        {showText && <span className="ml-2">Signaler</span>}
      </Button>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contentType={contentType}
        contentId={contentId}
        reportedUserId={reportedUserId}
      />
    </>
  );
}
