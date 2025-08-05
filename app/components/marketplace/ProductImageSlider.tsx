"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageSliderProps {
  images: string[];
  title: string;
}

export function ProductImageSlider({ images, title }: ProductImageSliderProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images.length) {
    return (
      <div className="relative aspect-square rounded-lg bg-gray-100">
        <Image
          src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center"
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-background border border-border/50">
        <Image
          src={images[currentImage]}
          alt={`${title} - Image ${currentImage + 1}`}
          fill
          className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          priority
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={previousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 backdrop-blur-md hover:bg-accent transition-all duration-300 shadow-sm hover:shadow-md border border-border"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/80 backdrop-blur-md hover:bg-accent transition-all duration-300 shadow-sm hover:shadow-md border border-border"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 bg-background/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    currentImage === index
                      ? "bg-white shadow-md"
                      : "bg-white/50 hover:bg-white/80"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "relative aspect-square rounded-lg overflow-hidden transition-all duration-200",
                currentImage === index 
                  ? "ring-2 ring-primary ring-offset-2"
                  : "hover:ring-1 hover:ring-primary/30"
              )}
            >
              <Image
                src={image}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}