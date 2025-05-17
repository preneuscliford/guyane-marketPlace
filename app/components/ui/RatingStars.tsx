"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  precision?: "half" | "full";
  onChange?: (rating: number) => void;
  className?: string;
}

export function RatingStars({
  rating = 0,
  size = "md",
  interactive = false,
  precision = "full",
  onChange,
  className
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  // Size mappings
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  // Convert rating to array of stars
  const totalStars = 5;
  const ratingValue = interactive ? (hoverRating > 0 ? hoverRating : selectedRating) : rating;

  // Handle star hover (for interactive mode)
  const handleMouseEnter = (starIndex: number, e?: React.MouseEvent) => {
    if (!interactive) return;
    
    if (precision === "half" && e) {
      // Handle half-star precision
      const isHalfStar = () => {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const mouseAt = e.clientX - rect.left;
        return mouseAt < rect.width / 2;
      };
      
      // Set either half star or full star based on mouse position
      const finalRating = isHalfStar() ? starIndex - 0.5 : starIndex;
      setHoverRating(finalRating);
    } else {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const handleClick = (starIndex: number, e?: React.MouseEvent) => {
    if (!interactive) return;
    
    let finalRating = starIndex;
    
    if (precision === "half" && e) {
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const mouseAt = e.clientX - rect.left;
      const isHalfStar = mouseAt < rect.width / 2;
      
      finalRating = isHalfStar ? starIndex - 0.5 : starIndex;
    }
    
    setSelectedRating(finalRating);
    if (onChange) {
      onChange(finalRating);
    }
  };

  return (
    <div className={cn("flex space-x-1", className)}>
      {[...Array(totalStars)].map((_, index) => {
        const starIndex = index + 1;
        
        return (
          <span
            key={index}
            className={cn(
              "relative cursor-default transition-all duration-100",
              interactive && "cursor-pointer hover:scale-110"
            )}
            onMouseEnter={(e) => handleMouseEnter(starIndex, e)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleClick(starIndex, e)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors duration-100",
                starIndex <= ratingValue
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-gray-300"
              )}
            />
          </span>
        );
      })}
    </div>
  );
}
