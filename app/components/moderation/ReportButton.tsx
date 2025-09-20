"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import ReportModal from "./ReportModal";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ReportButtonProps {
  contentType: 'post' | 'comment' | 'announcement' | 'service' | 'user';
  contentId: string;
  reportedUserId?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

/**
 * Bouton pour signaler du contenu inapproprié
 */
export default function ReportButton({
  contentType,
  contentId,
  reportedUserId,
  variant = 'ghost',
  size = 'sm',
  className = '',
  showText = false
}: ReportButtonProps) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Ouvre le modal de signalement
   */
  const handleReport = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour signaler du contenu");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleReport}
        className={`text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors ${className}`}
        title="Signaler ce contenu"
      >
        <Flag className="h-4 w-4" />
        {showText && <span className="ml-1">Signaler</span>}
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