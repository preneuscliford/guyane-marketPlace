"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { retryWithExponentialBackoff } from "@/lib/retryWithExponentialBackoff";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { HeroSection } from "@/components/marketplace/HeroSection";
import { FeaturedCategories } from "@/components/marketplace/FeaturedCategories";
import { FeaturedServices } from "@/components/marketplace/FeaturedServices";
import { HowItWorks } from "@/components/marketplace/HowItWorks";
import ProductGrid from "../../components/marketplace/ProductGrid";
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
    sortBy: "recent",
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const products = await retryWithExponentialBackoff(
        async () => {
          let query = supabase
            .from("products")
            .select("*")
            .gte("price", filters.priceRange[0])
            .lte("price", filters.priceRange[1]);

          if (searchQuery) {
            query = query.or(
              `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
            );
          }

          if (filters.category && filters.category !== "Tous") {
            query = query.eq("category", filters.category);
          }

          if (filters.location && filters.location !== "Toute la Guyane") {
            query = query.eq("location", filters.location);
          }

          switch (filters.sortBy) {
            case "price-asc":
              query = query.order("price", { ascending: true });
              break;
            case "price-desc":
              query = query.order("price", { ascending: false });
              break;
            default:
              query = query.order("created_at", { ascending: false });
          }

          const { data, error } = await query;

          if (error) throw error;
          return data || [];
        },
        3,
        500
      );

      setProducts(
        (products || []).map((product: any) => ({
          ...product,
          images: product.images || [],
        }))
      );
    } catch (error) {
      console.error("Failed to load products after retries:", error);
      setProducts([]);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setShowAllProducts(true);
  };

  return (
    <div className="min-h-screen">
      {/* Afficher l'interface de recherche ou l'interface de navigation principale */}
      {showAllProducts || searchQuery ? (
        // Interface de recherche
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Résultats de recherche
              </h1>
              <button
                onClick={() => {
                  setShowAllProducts(false);
                  setSearchQuery("");
                }}
                className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm sm:text-base"
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
            <ProductGrid
              searchQuery={searchQuery}
              selectedCategory={filters.category}
              selectedLocation={filters.location}
            />
          )}
        </div>
      ) : (
        // Interface de navigation principale
        <>
          <HeroSection onSearch={handleSearch} />
          <FeaturedCategories />

          {/* CTA Communauté - Lien fort Marketplace ↔ Communauté */}
          <div className="container mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Conseil</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-teal-900">
                     Besoin d’avis avant d'acheter ?
                  </h3>
                </div>
                <p className="text-teal-700 max-w-2xl">
                   Ne choisissez pas au hasard. La communauté mcGuyane est là pour vous aider : posez vos questions, comparez les offres et trouvez les meilleurs prestataires.
                </p>
              </div>
              <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white whitespace-nowrap shadow-md transition-all hover:shadow-lg">
                <Link href="/communaute">
                   Posez la question à la communauté
                </Link>
              </Button>
            </div>
          </div>

          <FeaturedServices />
          <HowItWorks />

          {/* Call to Action */}
          <section className="py-12 sm:py-16 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                Prêt à proposer vos services en Guyane ?
              </h2>
              <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                Rejoignez notre communauté et commencez à partager vos talents
                avec la Guyane dès aujourd&apos;hui.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="px-6 sm:px-8 bg-white text-purple-600 font-semibold rounded-full hover:shadow-lg transition-shadow text-sm sm:text-base hover:bg-gray-50"
                  asChild
                >
                  <Link href="/services/nouveau">Proposer un service</Link>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-6 sm:px-8 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/30 transition-colors text-sm sm:text-base border-0"
                  onClick={() => {
                    const howItWorksSection =
                      document.getElementById("how-it-works");
                    howItWorksSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Découvrir comment ça marche
                </Button>
              </div>
            </div>
          </section>

          {/* Footer est géré séparément dans le Header component */}
        </>
      )}
    </div>
  );
}
