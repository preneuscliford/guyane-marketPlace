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

  try {
    // Récupérer d'abord les produits
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

    const { data: products, error } = await query;

    if (error) {
      console.error("Erreur détaillée:", error);
      throw new Error(`Erreur lors du chargement des produits: ${error.message}`);
    }

    if (!products || products.length === 0) {
      return [];
    }

    // Récupérer les profils des utilisateurs
    const userIds = [...new Set(products.map(p => p.user_id))];
    const { data: profiles, error: profilesError } = await client
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", userIds);

    if (profilesError) {
      console.error("Erreur lors du chargement des profils:", profilesError);
      // Continuer sans les profils plutôt que d'échouer
    }

    // Joindre les données
    const productsWithProfiles = products.map(product => ({
      ...product,
      profiles: profiles?.filter(profile => profile.id === product.user_id) || []
    }));

    return productsWithProfiles as Product[];
  } catch (error) {
    console.error("Erreur dans fetchProducts:", error);
    throw new Error("Erreur lors du chargement des produits");
  }
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

/**
 * Fonction pour récupérer un produit spécifique par ID
 */
export const fetchProductById = async (id: string): Promise<Product | null> => {
  const client = supabase;

  try {
    // Récupérer le produit
    const { data: product, error } = await client
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
        user_id,
        status
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erreur lors du chargement du produit:", error);
      throw new Error(`Erreur lors du chargement du produit: ${error.message}`);
    }

    if (!product) {
      console.warn(`Aucun produit trouvé pour l'id: ${id}`);
      return null;
    }

    if (product.status !== undefined && product.status !== "active") {
      console.warn(`Produit trouvé mais status != 'active' (status: ${product.status}) pour l'id: ${id}`);
      return null;
    }

    // Récupérer le profil du vendeur
    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("id, username, avatar_url")
      .eq("id", product.user_id)
      .single();

    if (profileError) {
      console.error("Erreur lors du chargement du profil:", profileError);
      // Continuer sans le profil
    }

    // Joindre les données
    return {
      ...product,
      profiles: profile ? [profile] : []
    } as Product;

  } catch (error) {
    console.error("Erreur dans fetchProductById:", error);
    throw new Error("Erreur lors du chargement du produit");
  }
};
