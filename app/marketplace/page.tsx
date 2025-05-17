"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/marketplace/HeroSection";
import { FeaturedCategories } from "@/components/marketplace/FeaturedCategories";
import { FeaturedServices } from "@/components/marketplace/FeaturedServices";
import { HowItWorks } from "@/components/marketplace/HowItWorks";
import { Testimonials } from "@/components/marketplace/Testimonials";
import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { FilterBar } from "@/components/marketplace/FilterBar";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  location: string;
  created_at: string;
  // Ajoutez d'autres propriétés selon votre modèle de données
}

interface FilterState {
  priceRange: [number, number];
  category: string;
  location: string;
  sortBy: string;
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    category: "",
    location: "",
    sortBy: "recent"
  });

  const fetchProducts = useCallback(async () => {
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
  }, [filters, searchQuery]);

  useEffect(() => {
    if (searchQuery || showAllProducts) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [fetchProducts, searchQuery, showAllProducts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowAllProducts(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setShowAllProducts(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Afficher l'interface de recherche ou l'interface de navigation principale */}
      {showAllProducts || searchQuery ? (
        // Interface de recherche
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Résultats de recherche</h1>
              <button 
                onClick={() => {
                  setShowAllProducts(false);
                  setSearchQuery("");
                }}
                className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Retour à l&apos;accueil
              </button>
            </div>
            
            <div className="mt-6">
              <FilterBar onFilterChange={handleFilterChange} />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Aucun résultat trouvé</h2>
                <p className="text-gray-500">Essayez de modifier vos filtres ou d&apos;utiliser des termes de recherche différents.</p>
              </div>
            )
          )}
        </div>
      ) : (
        // Interface de navigation principale
        <>
          <HeroSection onSearch={handleSearch} />
          <FeaturedCategories />
          <FeaturedServices />
          <HowItWorks />
          <Testimonials />
          
          {/* Call to Action */}
          <section className="py-16 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Prêt à proposer vos services en Guyane ?</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">Rejoignez notre communauté et commencez à partager vos talents avec la Guyane dès aujourd&apos;hui.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-full hover:shadow-lg transition-shadow">
                  Proposer un service
                </button>
                <button className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/30 transition-colors">
                  Découvrir comment ça marche
                </button>
              </div>
            </div>
          </section>
          
          {/* Footer est géré séparément dans le Header component */}
        </>
      )}
    </div>
  );
}
