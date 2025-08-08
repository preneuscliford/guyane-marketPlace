"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import { ArrowLeft, Filter, Grid, List } from "lucide-react";
import { motion } from "framer-motion";
import ProductGrid from "../../../../components/marketplace/ProductGrid";
import { Button } from "../../../components/ui/Button";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  featured: boolean;
  status: string;
}

// Mapping des slugs vers les noms de catégories
const categoryMapping: { [key: string]: string } = {
  "design-graphique": "design-graphique",
  "developpement-web": "Développement Web",
  "marketing-digital": "Marketing",
  "traduction-langues": "Formation",
  "services-guyane": "Services",
  "informatique": "Informatique"
};

// Mapping inverse pour l'affichage
const displayNames: { [key: string]: string } = {
  "design-graphique": "Design Graphique",
  "developpement-web": "Développement Web",
  "marketing-digital": "Marketing Digital",
  "traduction-langues": "Traduction & Langues",
  "services-guyane": "Services en Guyane",
  "informatique": "Informatique"
};

/**
 * Page d'affichage des produits par catégorie
 * Affiche tous les produits d'une catégorie spécifique
 */
export default function CategoryPage() {
  const { category } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');

  const categorySlug = Array.isArray(category) ? category[0] : category;
  const categoryName = categorySlug ? (categoryMapping[categorySlug] || categorySlug) : '';
  const displayName = categorySlug ? displayNames[categorySlug] || categorySlug : '';

  /**
   * Récupère les produits de la catégorie depuis Supabase
   */
  const fetchProducts = async () => {
    try {
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
        .eq('category', categoryName)
        .eq('status', 'active');

      // Appliquer le tri
      switch (sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'title':
          query = query.order('title', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categorySlug) {
      fetchProducts();
    }
  }, [categorySlug, sortBy]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* En-tête */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/marketplace">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
                <p className="text-gray-600 mt-1">
                  {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Contrôles de vue et tri */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Trier par:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="recent">Plus récent</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="title">Nom A-Z</option>
                </select>
              </div>

              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
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
              Il n'y a pas encore de produits dans la catégorie "{displayName}".
            </p>
            <Button asChild>
              <Link href="/marketplace">Retour à la marketplace</Link>
            </Button>
          </motion.div>
        ) : (
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
        )}
      </div>
    </div>
  );
}