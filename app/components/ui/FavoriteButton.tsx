"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/utils";

interface FavoriteButtonProps {
  announcementId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
}

export function FavoriteButton({ 
  announcementId, 
  className, 
  size = "md", 
  showCount = false,
  count = 0
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Determine if this announcement is in favorites
  const isFavorited = isFavorite(announcementId);

  // Size mappings
  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-10 h-10"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  // Handle click on the favorite button
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If user is not logged in, redirect to login
    if (!user) {
      router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    try {
      setIsLoading(true);
      await toggleFavorite(announcementId);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={cn(
        "rounded-full flex items-center justify-center transition-all duration-200",
        "bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md",
        "border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2",
        sizeClasses[size],
        className
      )}
      aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          "transition-colors duration-200",
          isFavorited 
            ? "fill-red-500 text-red-500" 
            : "fill-transparent text-gray-500 hover:text-red-500",
          isLoading && "opacity-50"
        )} 
      />
      
      {showCount && count > 0 && (
        <span className="ml-1 text-xs font-medium text-gray-600">{count}</span>
      )}
    </button>
  );
}
