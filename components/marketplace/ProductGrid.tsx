"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "../../app/components/ui/button";
import { Badge } from "../../app/components/ui/badge";
import { Card, CardContent } from "../../app/components/ui/card";
import ReportButton from "../../app/components/moderation/ReportButton";
import { Heart, MapPin, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";
import { fetchProducts, fetchUserLikes } from "../../app/lib/queries/products";
import { useAuth } from "../../app/hooks/useAuth";

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
  selectedLocation?: string;
  viewMode?: "grid" | "list";
}

/**
 * Composant grille de produits optimisé avec TanStack Query
 * Affiche les produits avec possibilité de filtrage et navigation vers les détails
 */
export default function ProductGrid({
  searchQuery = "",
  selectedCategory = "",
  selectedLocation = "",
  viewMode = "grid",
}: ProductGridProps) {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const client = supabase;

  // Fonction pour générer une image de placeholder basée sur la catégorie
  const getPlaceholderImage = (category: string, productId: string) => {
    const seed = productId.slice(-4); // Utilise les 4 derniers chars de l'ID pour la cohérence
    const categoryImages = {
      "developpement-web": `https://picsum.photos/seed/${seed}-web/400/300`,
      "design-graphique": `https://picsum.photos/seed/${seed}-design/400/300`,
      "marketing-digital": `https://picsum.photos/seed/${seed}-marketing/400/300`,
      redaction: `https://picsum.photos/seed/${seed}-writing/400/300`,
      traduction: `https://picsum.photos/seed/${seed}-translate/400/300`,
      autre: `https://picsum.photos/seed/${seed}-other/400/300`,
    };
    return (
      categoryImages[category as keyof typeof categoryImages] ||
      `https://picsum.photos/seed/${seed}/400/300`
    );
  };

  // Fonction pour gérer les erreurs d'image
  const handleImageError = (imageUrl: string) => {
    setFailedImages((prev) => new Set(prev).add(imageUrl));
  };

  // Vérifier si une image doit utiliser le fallback immédiatement
  const shouldUseFallback = (imageUrl: string | null | undefined): boolean => {
    if (!imageUrl || imageUrl.trim() === "") return true;

    const invalidDomains = ["example.com", "placeholder.com", "dummyimage.com"];
    return (
      invalidDomains.some((domain) => imageUrl.includes(domain)) ||
      failedImages.has(imageUrl)
    );
  };

  // Query pour récupérer les produits
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", { searchQuery, selectedCategory, selectedLocation }],
    queryFn: () =>
      fetchProducts({ searchQuery, selectedCategory, selectedLocation }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Retry jusqu'à 3 fois, sauf si c'est une erreur d'autorisation
      if (failureCount >= 3) return false;
      if (error.message?.includes("unauthorized")) return false;
      return true;
    },
    meta: {
      errorMessage: "Erreur lors du chargement des produits",
    },
  });

  // Query pour les likes de l'utilisateur
  const { data: userLikes = [] } = useQuery({
    queryKey: ["userLikes", user?.id],
    queryFn: () => fetchUserLikes(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Mettre à jour les likes locaux quand les données arrivent
  useState(() => {
    setLikedProducts(new Set(userLikes));
  });

  // Fonction pour gérer les likes
  const handleLike = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vous devez être connecté pour aimer un produit");
      return;
    }

    const isLiked = likedProducts.has(productId);
    const newLikedProducts = new Set(likedProducts);

    try {
      if (isLiked) {
        // Retirer le like
        await client
          .from("product_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        newLikedProducts.delete(productId);
        toast.success("Produit retiré de vos favoris");
      } else {
        // Ajouter le like
        await client
          .from("product_likes")
          .insert([{ user_id: user.id, product_id: productId }]);

        newLikedProducts.add(productId);
        toast.success("Produit ajouté à vos favoris");
      }

      setLikedProducts(newLikedProducts);
      // Invalider les queries pour refresh les données
      queryClient.invalidateQueries({ queryKey: ["userLikes", user.id] });
    } catch (error) {
      console.error("Erreur lors de la gestion du like:", error);
      toast.error("Une erreur est survenue");
    }
  };

  // Gestion des erreurs
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Erreur de chargement
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message ||
            "Une erreur est survenue lors du chargement des produits."}
        </p>
        <Button onClick={() => refetch()}>Réessayer</Button>
      </div>
    );
  }

  // Chargement avec des skeleton cards shadcn
  if (isLoading) {
    return (
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
    );
  }

  // Aucun produit trouvé
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Aucun produit trouvé
        </h2>
        <p className="text-gray-600 mb-6">
          Essayez de modifier vos critères de recherche ou de filtrage.
        </p>
        <Button onClick={() => refetch()}>Actualiser</Button>
      </motion.div>
    );
  }

  return (
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
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-md hover:shadow-purple-100/50">
              <div className="relative overflow-hidden">
                {(() => {
                  const imageUrl = product.images?.[0];
                  const useFallback = shouldUseFallback(imageUrl);
                  console.log(
                    `Produit ${product.id}: imageUrl=${imageUrl}, useFallback=${useFallback}`
                  );
                  return useFallback ? (
                    <div className="relative w-full h-48 sm:h-52">
                      <Image
                        src={getPlaceholderImage(product.category, product.id)}
                        alt={`${product.category} - ${product.title}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute bottom-2 left-2">
                        <span className="text-xs text-white font-medium px-2 py-1 bg-black/50 rounded-full backdrop-blur-sm">
                          Image de démonstration
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-48 sm:h-52">
                      <Image
                        src={imageUrl!}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => handleImageError(imageUrl!)}
                      />
                    </div>
                  );
                })()}

                {/* Badge catégorie amélioré */}
                <Badge className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 border-0 shadow-sm font-medium px-3 py-1">
                  {product.category}
                </Badge>

                {/* Boutons d'action améliorés */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ReportButton
                    contentType="announcement"
                    contentId={product.id}
                    reportedUserId={product.user_id}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white border-0 shadow-sm"
                    onClick={(e) => handleLike(product.id, e)}
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        likedProducts.has(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600 hover:text-red-500"
                      }`}
                    />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4 sm:p-5">
                <Link href={`/marketplace/${product.id}`} className="block">
                  <h3 className="font-bold text-lg sm:text-xl mb-2 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2 leading-tight">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl sm:text-3xl font-bold text-purple-600">
                      {product.price}€
                    </span>
                    <div className="flex items-center text-gray-500 text-sm bg-gray-50 px-2 py-1 rounded-full">
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="font-medium">
                        {product.view_count || product.views || 0}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
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

                  {profile && (
                    <div className="flex items-center pt-3 border-t border-gray-100">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mr-3 ring-2 ring-purple-50 relative overflow-hidden">
                        {profile.avatar_url ? (
                          <Image
                            src={profile.avatar_url}
                            alt={profile.username}
                            fill
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-purple-600">
                            {profile.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">
                          {profile.username}
                        </span>
                        <span className="text-xs text-gray-500">Vendeur</span>
                      </div>
                    </div>
                  )}
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
