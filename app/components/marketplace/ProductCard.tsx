"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    location: string;
    created_at: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group relative rounded-lg border border-border bg-card overflow-hidden">
      <Link href={`/marketplace/${product.id}`} className="block aspect-square">
        <div className="relative h-full w-full">
          <Image
            src={product.images[0] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center"}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 rounded-full bg-white/80 p-1.5 sm:p-2 backdrop-blur-sm transition-colors hover:bg-white"
      >
        <Heart
          className={`h-4 w-4 sm:h-5 sm:w-5 ${
            isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
          }`}
        />
      </button>

      <div className="p-3 sm:p-4">
        <Link href={`/marketplace/${product.id}`}>
          <h3 className="font-medium text-sm sm:text-base text-foreground line-clamp-2 group-hover:text-primary">
            {product.title}
          </h3>
        </Link>
        
        <div className="mt-2 flex items-center justify-between">
          <p className="text-base sm:text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {product.location}
          </p>
        </div>
      </div>
    </div>
  );
}