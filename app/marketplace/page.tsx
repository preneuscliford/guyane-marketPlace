"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { FilterBar } from "@/components/marketplace/FilterBar";
import { SearchBar } from "@/components/ui/SearchBar";
import { supabase } from "@/lib/supabase";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    category: "",
    location: "",
    sortBy: "recent"
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*')
        .gte('price', filters.priceRange[0])
        .lte('price', filters.priceRange[1]);

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (filters.category && filters.category !== "Tous") {
        query = query.eq('category', filters.category);
      }

      if (filters.location && filters.location !== "Toute la Guyane") {
        query = query.eq('location', filters.location);
      }

      switch (filters.sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Marketplace</h1>
        <SearchBar 
          className="max-w-2xl" 
          onSearch={handleSearch}
          placeholder="Rechercher dans le marketplace..."
        />
      </div>

      <FilterBar onFilterChange={setFilters} />

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
