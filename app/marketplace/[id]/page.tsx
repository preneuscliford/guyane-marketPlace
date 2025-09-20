"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Share2, MapPin, Calendar, Eye, MessageCircle, Edit, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import MessageModal from "../../../components/messaging/MessageModal";

/**
 * Page de détails d'un produit
 * Affiche toutes les informations d'un produit avec possibilité d'interaction
 */
export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  useEffect(() => {
    fetchProduct();
    incrementViewCount();
  }, [id]);

  /**
   * Récupère les détails du produit depuis Supabase
   */
  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            created_at
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
      setViewCount(data.view_count || 0);
      
      // Vérifier si l'utilisateur a liké ce produit
      if (user) {
        const { data: likeData } = await supabase
          .from('product_likes')
          .select('*')
          .eq('product_id', id)
          .eq('user_id', user.id)
          .single();
        
        setIsLiked(!!likeData);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Incrémente le compteur de vues du produit
   */
  const incrementViewCount = async () => {
    try {
      await supabase.rpc('increment_product_views', {
        product_id: id
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  /**
   * Gère l'ajout/suppression des likes
   */
  const handleLike = async () => {
    if (!user) {
      router.push('/auth');
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('product_likes')
          .delete()
          .eq('product_id', id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('product_likes')
          .insert({ product_id: id, user_id: user.id });
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  /**
   * Gère le partage du produit
   */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copier l'URL dans le presse-papiers
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers!');
    }
  };

  /**
   * Supprime le produit (seulement pour le propriétaire)
   */
  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      router.push('/marketplace');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-6">Ce produit n'existe pas ou a été supprimé.</p>
          <Button asChild>
            <Link href="/marketplace">Retour à la marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === product.user_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/marketplace" className="hover:text-purple-600 transition-colors">
              Marketplace
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Galerie d'images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="aspect-square relative overflow-hidden rounded-2xl shadow-2xl bg-white">
              <Image
                src={product.images?.[currentImage] || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center"}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              
              {/* Badge de statut */}
              <div className="absolute top-4 left-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Disponible
                </span>
              </div>
              
              {/* Compteur de vues */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {viewCount}
              </div>
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`flex-shrink-0 w-20 h-20 relative rounded-xl overflow-hidden transition-all duration-200 ${
                      currentImage === index 
                        ? 'ring-4 ring-purple-500 scale-105' 
                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Détails du produit */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* En-tête */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {formatPrice(product.price)}
                  </p>
                </div>
                
                {/* Actions du propriétaire */}
                {isOwner && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/marketplace/${id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-purple-500" />
                  {product.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-purple-500" />
                  {formatDate(product.created_at)}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{product.description}</p>
            </div>

            {/* Boutons d'action */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3"
                  onClick={() => setIsMessageModalOpen(true)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contacter
                </Button>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Acheter
                </Button>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleLike}
                  className={`flex-1 transition-all duration-200 ${
                    isLiked 
                      ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100' 
                      : 'hover:border-red-200 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Aimé' : 'J\'aime'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1 hover:border-blue-200 hover:text-blue-500 transition-all duration-200"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>

            {/* Informations vendeur */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Vendeur</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-400 flex-shrink-0">
                  {product.profiles?.avatar_url ? (
                    <Image
                      src={product.profiles.avatar_url}
                      alt={product.profiles.username}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                      {product.profiles?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg text-gray-900">{product.profiles?.username}</p>
                  <p className="text-sm text-gray-600">Membre depuis {formatDate(product.profiles?.created_at)}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">(4.8/5)</span>
                  </div>
                </div>
                <Button variant="outline" className="hover:border-purple-200 hover:text-purple-600">
                  Voir le profil
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal de messagerie */}
      {product && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          receiverId={product.user_id}
          receiverName={product.profiles?.username || 'Utilisateur'}
          productId={product.id}
          productTitle={product.title}
        />
      )}
    </div>
  );
}