"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Share2, MapPin, Calendar } from "lucide-react";
import Image from "next/image";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
      
      // Check if user has liked this product
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

  const handleLike = async () => {
    if (!user) return;

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Produit non trouvé</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={product.images[currentImage] || "/placeholder.png"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 
                    ${currentImage === index ? 'border-primary' : 'border-transparent'}`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-2xl font-semibold mt-2">{formatPrice(product.price)}</p>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {product.location}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(product.created_at)}
            </div>
          </div>

          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button size="lg" className="flex-1">
              Contacter le vendeur
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleLike}
              className={isLiked ? 'text-red-500' : ''}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="border-t pt-6 mt-6">
            <div className="flex items-center space-x-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src={product.profiles.avatar_url || "/default-avatar.png"}
                  alt={product.profiles.username}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{product.profiles.username}</p>
                <p className="text-sm text-muted-foreground">Membre depuis {formatDate(product.profiles.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}