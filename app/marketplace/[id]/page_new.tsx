"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  Eye,
  MessageCircle,
  Edit,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { fetchProductById } from "../../lib/queries/products";
import { useAuth } from "../../hooks/useAuth";
import MessageModal from "../../../components/messaging/MessageModal";

/**
 * Page de détails d'un produit avec TanStack Query
 */
export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const supabase = createClientComponentClient();

  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Query pour récupérer le produit
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Query pour vérifier si l'utilisateur a liké le produit
  const { data: userLikes = [] } = useQuery({
    queryKey: ["userLikes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("product_likes")
        .select("product_id")
        .eq("user_id", user.id);
      return data?.map((like) => like.product_id) || [];
    },
    enabled: !!user,
  });

  // Mutation pour gérer les likes
  const likeMutation = useMutation({
    mutationFn: async ({
      productId,
      action,
    }: {
      productId: string;
      action: "like" | "unlike";
    }) => {
      if (!user) throw new Error("Utilisateur non connecté");

      if (action === "like") {
        await supabase
          .from("product_likes")
          .insert({ product_id: productId, user_id: user.id });
      } else {
        await supabase
          .from("product_likes")
          .delete()
          .eq("product_id", productId)
          .eq("user_id", user.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLikes", user?.id] });
      toast.success("Préférences mises à jour !");
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour des préférences");
      console.error("Erreur like:", error);
    },
  });

  // Fonction pour générer une image de placeholder
  const getPlaceholderImage = (category: string, productId: string) => {
    const seed = productId.slice(-4);
    return `https://picsum.photos/seed/${seed}-${category}/800/600`;
  };

  // Vérifier si une image est valide
  const isValidImage = (imageUrl: string | null | undefined): boolean => {
    return !!(
      imageUrl &&
      !imageUrl.includes("example.com") &&
      imageUrl.trim() !== ""
    );
  };

  // Gérer les likes
  const handleLike = () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    if (!product) return;

    const isCurrentlyLiked = userLikes.includes(product.id);
    likeMutation.mutate({
      productId: product.id,
      action: isCurrentlyLiked ? "unlike" : "like",
    });
  };

  // États de chargement et d'erreur
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skeleton de l'image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Skeleton du contenu */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="h-24 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-3">
                <div className="h-12 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-12 bg-gray-200 rounded w-32 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Produit non trouvé
          </h2>
          <p className="text-gray-600 mb-6">
            Ce produit n'existe pas ou n'est plus disponible.
          </p>
          <Button onClick={() => router.push("/marketplace")}>
            Retour au marketplace
          </Button>
        </motion.div>
      </div>
    );
  }

  const isCurrentlyLiked = userLikes.includes(product.id);
  const profile = product.profiles?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="mb-6">
          <Link
            href="/marketplace"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            ← Retour au marketplace
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square relative overflow-hidden rounded-lg bg-white shadow-lg"
            >
              {isValidImage(product.images?.[currentImage]) ? (
                <Image
                  src={product.images![currentImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <Image
                  src={getPlaceholderImage(product.category, product.id)}
                  alt={`${product.category} - ${product.title}`}
                  fill
                  className="object-cover"
                />
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`aspect-square relative overflow-hidden rounded border-2 transition-colors ${
                      index === currentImage
                        ? "border-purple-500"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={
                        isValidImage(image)
                          ? image
                          : getPlaceholderImage(product.category, product.id)
                      }
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contenu */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Titre et catégorie */}
            <div>
              <Badge className="mb-3 bg-purple-100 text-purple-800">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(product.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{product.view_count || product.views || 0} vues</span>
                </div>
              </div>
            </div>

            {/* Prix */}
            <div className="text-4xl font-bold text-purple-600">
              {product.price}€
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setIsMessageModalOpen(true)}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contacter le vendeur
              </Button>

              <Button
                onClick={handleLike}
                variant="outline"
                size="lg"
                className={`px-6 ${
                  isCurrentlyLiked
                    ? "border-red-500 text-red-500 hover:bg-red-50"
                    : "border-gray-300 hover:border-red-500 hover:text-red-500"
                }`}
              >
                <Heart
                  className={`w-5 h-5 mr-2 ${
                    isCurrentlyLiked ? "fill-red-500" : ""
                  }`}
                />
                {isCurrentlyLiked
                  ? "Retiré des favoris"
                  : "Ajouter aux favoris"}
              </Button>

              <Button variant="outline" size="lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Profil du vendeur */}
            {profile && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Vendeur</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center ring-2 ring-purple-50 relative overflow-hidden">
                        {profile.avatar_url ? (
                          <Image
                            src={profile.avatar_url}
                            alt={profile.username}
                            fill
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-purple-600">
                            {profile.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {profile.username}
                        </h4>
                        <p className="text-sm text-gray-600">Membre vérifié</p>
                      </div>
                    </div>
                    <Button variant="outline">Voir le profil</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal de messagerie */}
      {product && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          receiverId={product.user_id}
          receiverName={profile?.username || "Utilisateur"}
          productId={product.id}
          productTitle={product.title}
        />
      )}
    </div>
  );
}
