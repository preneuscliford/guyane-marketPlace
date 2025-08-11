"use client";

import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Array<{
    id: string;
    title: string;
    price: number;
    images: string[];
    location: string;
    created_at: string;
  }>;
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}