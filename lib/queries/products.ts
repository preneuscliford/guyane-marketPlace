import { supabase } from "@/lib/supabase";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  images: string[] | null;
  created_at: string;
  view_count?: number | null;
  views?: number | null;
  user_id: string;
  profiles?: {
    username: string;
    avatar_url?: string;
  }[] | null;
}

export interface ProductsFilters {
  searchQuery?: string;
  selectedCategory?: string;
  selectedLocation?: string;
}

/**
 * Fonction pour récupérer les produits avec filtres
 */
export const fetchProducts = async (filters: ProductsFilters): Promise<Product[]> => {
  const client = supabase;

  let query = client
    .from("products")
    .select(`
      id,
      title,
      description,
      price,
      location,
      category,
      images,
      created_at,
      view_count,
      views,
      user_id
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Appliquer les filtres
  if (filters.searchQuery) {
    query = query.or(
      `title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
    );
  }

  if (filters.selectedCategory && filters.selectedCategory !== "all") {
    query = query.eq("category", filters.selectedCategory);
  }

  if (filters.selectedLocation && filters.selectedLocation !== "all") {
    query = query.eq("location", filters.selectedLocation);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erreur détaillée:", error);
    throw new Error(`Erreur lors du chargement des produits: ${error.message}`);
  }

  return data || [];
};

/**
 * Fonction pour récupérer les likes d'un utilisateur
 */
export const fetchUserLikes = async (userId: string): Promise<string[]> => {
  const client = supabase;

  const { data, error } = await client
    .from("product_likes")
    .select("product_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Erreur lors du chargement des likes:", error);
    return [];
  }

  return (data?.map((like: { product_id: string | null }) => like.product_id).filter(Boolean) as string[]) || [];
};
