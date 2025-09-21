"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Grid, List } from "lucide-react";
import ProductGrid from "../../../../components/marketplace/ProductGrid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  "services-guyane": "Services en Guyane",
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

  if (!categorySlug) {
    return <div>Catégorie non trouvée</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* En-tête */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Button variant="outline" className="w-fit" asChild>
                <Link href="/marketplace" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Retour</span>
                </Link>
              </Button>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
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

              <div className="flex items-center border border-gray-300 rounded-md bg-white">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-r-none h-8 px-2 sm:px-3 ${
                    viewMode === "grid"
                      ? "bg-purple-100 text-purple-600 hover:bg-purple-100"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`rounded-l-none h-8 px-2 sm:px-3 ${
                    viewMode === "list"
                      ? "bg-purple-100 text-purple-600 hover:bg-purple-100"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <ProductGrid
          searchQuery=""
          selectedCategory={categoryName}
          selectedLocation=""
        />
      </div>
    </div>
  );
}
