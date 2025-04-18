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
          src="/placeholder.png"
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square">
        <Image
          src={images[currentImage]}
          alt={`${title} - Image ${currentImage + 1}`}
          fill
          className="object-cover rounded-lg"
          priority
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={previousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    currentImage === index
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden",
                currentImage === index && "ring-2 ring-primary"
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