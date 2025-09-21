"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Grid, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProductGrid from "../../../../components/marketplace/ProductGrid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchProducts } from "../../../lib/queries/products";
import { getFallbackImage } from "../../../lib/utils";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Eye, Calendar } from "lucide-react";

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

  // Query pour récupérer les produits
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", { selectedCategory: categoryName }],
    queryFn: () => fetchProducts({ selectedCategory: categoryName }),
    staleTime: 5 * 60 * 1000,
  });

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
        {isLoading ? (
          <div
            className={
              viewMode === "list"
                ? "space-y-4"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            }
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Erreur de chargement
            </h2>
            <p className="text-gray-600 mb-6">
              {error.message ||
                "Une erreur est survenue lors du chargement des produits."}
            </p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Aucun produit trouvé
            </h2>
            <p className="text-gray-600 mb-6">
              Aucun produit dans cette catégorie pour le moment.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "list"
                ? "space-y-4"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            }
          >
            {products.map((product, index) => {
              const profile = product.profiles?.[0];
              return (
                <Card
                  key={product.id}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-md hover:shadow-purple-100/50 ${
                    viewMode === "list" ? "flex gap-4 p-4" : "flex flex-col"
                  }`}
                >
                  <div
                    className={`relative bg-gray-100 ${
                      viewMode === "list"
                        ? "w-32 h-24 sm:w-48 sm:h-32 flex-shrink-0 rounded-lg"
                        : "aspect-[4/3] w-full"
                    }`}
                  >
                    {product.images?.[0] &&
                    !product.images[0].includes("example.com") ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Image
                        src={`https://picsum.photos/seed/${encodeURIComponent(
                          product.title.replace(/\s+/g, "-").toLowerCase()
                        )}-guyane/400/300`}
                        alt={`${product.category} - ${product.title}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>

                  <div
                    className={`flex-1 ${
                      viewMode === "list"
                        ? "flex flex-col justify-between"
                        : "p-4"
                    }`}
                  >
                    <Link href={`/marketplace/${product.id}`} className="block">
                      <h3
                        className={`font-bold mb-2 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2 leading-tight ${
                          viewMode === "list" ? "text-lg sm:text-xl" : "text-lg"
                        }`}
                      >
                        {product.title}
                      </h3>
                      <p
                        className={`text-gray-600 mb-4 line-clamp-2 leading-relaxed ${
                          viewMode === "list"
                            ? "text-sm sm:text-base"
                            : "text-sm"
                        }`}
                      >
                        {product.description}
                      </p>

                      <div
                        className={`flex items-center justify-between mb-4 ${
                          viewMode === "list"
                            ? "flex-col sm:flex-row gap-2 sm:gap-0"
                            : ""
                        }`}
                      >
                        <span
                          className={`font-bold text-purple-600 ${
                            viewMode === "list"
                              ? "text-xl sm:text-2xl"
                              : "text-2xl"
                          }`}
                        >
                          {product.price}€
                        </span>
                        <div className="flex items-center text-gray-500 text-sm bg-gray-50 px-2 py-1 rounded-full">
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="font-medium">
                            {product.view_count || product.views || 0}
                          </span>
                        </div>
                      </div>

                      {viewMode !== "list" && (
                        <div
                          className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500 mb-4`}
                        >
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-purple-500" />
                            <span className="truncate">{product.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-purple-500" />
                            <span>
                              {new Date(product.created_at).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                      {viewMode === "list" && (
                        <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-purple-500" />
                            <span>{product.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span>
                              {new Date(product.created_at).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
