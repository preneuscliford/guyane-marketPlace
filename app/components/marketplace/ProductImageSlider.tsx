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
      <div className="relative aspect-square overflow-hidden rounded-2xl shadow-soft hover:shadow-hover transition-shadow duration-300">
        <Image
          src={images[currentImage]}
          alt={`${title} - Image ${currentImage + 1}`}
          fill
          className="object-cover transform transition-transform duration-500 hover:scale-105"
          priority
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={previousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md hover:bg-white/95 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-gray-800" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md hover:bg-white/95 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-gray-800" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300 transform hover:scale-110",
                    currentImage === index
                      ? "bg-primary shadow-lg"
                      : "bg-white/70 hover:bg-white"
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