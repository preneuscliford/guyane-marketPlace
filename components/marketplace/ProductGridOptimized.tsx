"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "../../app/components/ui/badge";
import { Card, CardContent } from "../../app/components/ui/card";
import ReportButton from "../../app/components/moderation/ReportButton";
import { Heart, MapPin, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";
import { fetchProducts, fetchUserLikes } from "@/lib/queries/products";
import { useAuth } from "@/hooks/useAuth";

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
  selectedLocation?: string;
}

/**
 * Composant grille de produits optimisé avec TanStack Query
 * Affiche les produits avec possibilité de filtrage et navigation vers les détails
 */
export default function ProductGrid({
  searchQuery = "",
  selectedCategory = "",
  selectedLocation = "",
}: ProductGridProps) {
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const client = supabase;

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

  // Chargement
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
            <div className="bg-gray-200 h-6 rounded w-1/4"></div>
          </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => {
        const profile = product.profiles?.[0];
        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                )}

                {/* Badge catégorie */}
                <Badge className="absolute top-2 left-2 bg-white/90 text-gray-800">
                  {product.category}
                </Badge>

                {/* Boutons d'action */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <ReportButton
                    contentType="announcement"
                    contentId={product.id}
                    reportedUserId={product.user_id}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                    onClick={(e) => handleLike(product.id, e)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        likedProducts.has(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <Link href={`/marketplace/${product.id}`} className="block">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-purple-600">
                      {product.price}€
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      {product.view_count || product.views || 0}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {product.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(product.created_at).toLocaleDateString("fr-FR")}
                    </div>
                  </div>

                  {profile && (
                    <div className="flex items-center pt-2 border-t">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                        {profile.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.username}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium text-purple-600">
                            {profile.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {profile.username}
                      </span>
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
