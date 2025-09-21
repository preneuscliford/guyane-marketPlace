"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import ProductGrid from "../../../../components/marketplace/ProductGrid";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mapping des slugs vers les noms de catégories
const categoryMapping: { [key: string]: string } = {
  "design-graphique": "design-graphique",
  "developpement-web": "Développement Web",
  "marketing-digital": "Marketing",
  "traduction-langues": "Formation",
  "services-guyane": "Services",
  informatique: "Informatique",
};

// Mapping inverse pour l'affichage
const displayNames: { [key: string]: string } = {
  "design-graphique": "Design Graphique",
  "developpement-web": "Développement Web",
  "marketing-digital": "Marketing Digital",
  "traduction-langues": "Traduction & Langues",
  "services-guyane": "Services Guyane",
  informatique: "Informatique",
};

/**
 * Page d'affichage des produits par catégorie
 * Affiche tous les produits d'une catégorie spécifique
 */
export default function CategoryPage() {
  const { category } = useParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");

  const categorySlug = Array.isArray(category) ? category[0] : category;
  const categoryName = categorySlug
    ? categoryMapping[categorySlug] || categorySlug
    : "";
  const displayName = categorySlug
    ? displayNames[categorySlug] || categorySlug
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* En-tête avec navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/marketplace">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {displayName}
                </h1>
              </div>
            </div>

            {/* Contrôles de vue et tri */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Trier par:
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[140px] h-8 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Plus récent</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="title">Nom A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 sm:p-2 ${
                    viewMode === "grid"
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-600"
                  }`}
                >
                  <div className="h-3 w-3 sm:h-4 sm:w-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 sm:p-2 ${
                    viewMode === "list"
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-600"
                  }`}
                >
                  <div className="h-3 w-3 sm:h-4 sm:w-4 flex flex-col gap-0.5">
                    <div className="bg-current h-0.5 w-full rounded"></div>
                    <div className="bg-current h-0.5 w-full rounded"></div>
                    <div className="bg-current h-0.5 w-full rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ProductGrid
            searchQuery=""
            selectedCategory={categoryName}
            selectedLocation=""
          />
        </motion.div>
      </div>
    </div>
  );
}