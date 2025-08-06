'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  MapPin, 
  Eye, 
  Star,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  images: string[];
  created_at: string;
  view_count?: number;
  user_id: string;
  profiles?: {
    username: string;
    avatar_url?: string;
  };
}

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
  selectedLocation?: string;
}

/**
 * Composant grille de produits pour la marketplace
 * Affiche les produits avec possibilité de filtrage et navigation vers les détails
 */
export default function ProductGrid({ 
  searchQuery = '', 
  selectedCategory = '', 
  selectedLocation = '' 
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const supabase = createClientComponentClient();

  // Récupérer les produits depuis Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      let query = supabase
        .from('products')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      // Appliquer les filtres
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      
      if (selectedLocation && selectedLocation !== 'all') {
        query = query.eq('location', selectedLocation);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors du chargement des produits:', error);
        toast.error('Erreur lors du chargement des produits');
      } else {
        setProducts(data || []);
      }
      
      setLoading(false);
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, selectedLocation, supabase]);

  // Récupérer les likes de l'utilisateur
  useEffect(() => {
    const fetchUserLikes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: likes } = await supabase
        .from('product_likes')
        .select('product_id')
        .eq('user_id', user.id);

      if (likes) {
        setLikedProducts(new Set(likes.map(like => like.product_id)));
      }
    };

    fetchUserLikes();
  }, [supabase]);

  // Fonction pour gérer les likes
  const handleLike = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Empêcher la navigation vers la page de détails
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Vous devez être connecté pour aimer un produit');
      return;
    }

    const isLiked = likedProducts.has(productId);
    
    try {
      if (isLiked) {
        // Retirer le like
        await supabase
          .from('product_likes')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', user.id);
        
        setLikedProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        // Ajouter le like
        await supabase
          .from('product_likes')
          .insert({ product_id: productId, user_id: user.id });
        
        setLikedProducts(prev => new Set([...prev, productId]));
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast.error('Erreur lors de l\'action');
    }
  };

  // Fonction pour formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video bg-gray-200 animate-pulse" />
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Aucun produit trouvé
        </h3>
        <p className="text-gray-600">
          Essayez de modifier vos critères de recherche
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link href={`/marketplace/${product.id}`}>
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white">
              {/* Image du produit */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={product.images?.[0] || '/placeholder-product.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badge catégorie */}
                <Badge 
                  className="absolute top-3 left-3 bg-white/90 text-gray-700 hover:bg-white"
                >
                  {product.category}
                </Badge>
                
                {/* Bouton like */}
                <Button
                  size="sm"
                  variant="ghost"
                  className={`absolute top-3 right-3 h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white ${
                    likedProducts.has(product.id) 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-600 hover:text-red-500'
                  }`}
                  onClick={(e) => handleLike(product.id, e)}
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      likedProducts.has(product.id) ? 'fill-current' : ''
                    }`} 
                  />
                </Button>
              </div>

              <CardContent className="p-4">
                {/* Titre et prix */}
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {product.description}
                </p>

                {/* Localisation et date */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(product.created_at)}</span>
                  </div>
                </div>

                {/* Vendeur et statistiques */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                      {product.profiles?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.profiles?.username || 'Utilisateur'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    {product.view_count && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{product.view_count}</span>
                      </div>
                    )}
                    <MessageCircle className="h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}