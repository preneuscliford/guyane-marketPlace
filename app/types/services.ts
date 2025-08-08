// Types pour le système de services

export interface Service {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  price: number | null;
  price_type: 'fixed' | 'hourly' | 'daily' | 'negotiable';
  images: string[];
  status: 'active' | 'inactive' | 'pending' | 'completed';
  availability: Record<string, any>;
  contact_info: Record<string, any>;
  tags: string[];
  views: number;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceData {
  title: string;
  description: string;
  category: string;
  location: string;
  price?: number | null;
  price_type?: 'fixed' | 'hourly' | 'daily' | 'negotiable';
  images?: string[];
  availability?: Record<string, any>;
  contact_info?: Record<string, any>;
  tags?: string[];
}

export interface UpdateServiceData {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  price?: number | null;
  price_type?: 'fixed' | 'hourly' | 'daily' | 'negotiable';
  images?: string[];
  status?: 'active' | 'inactive' | 'pending' | 'completed';
  availability?: Record<string, any>;
  contact_info?: Record<string, any>;
  tags?: string[];
}

export interface ServiceSearchParams {
  category?: string;
  location?: string;
  price_min?: number;
  price_max?: number;
  price_type?: string;
  search?: string;
  tags?: string[];
  sort_by?: 'created_at' | 'price' | 'rating' | 'views';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ServiceWithProfile extends Service {
  profiles: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    location: string | null;
  };
}

export interface ServiceStats {
  total_services: number;
  active_services: number;
  total_views: number;
  average_rating: number;
  categories_count: Record<string, number>;
}

// Catégories de services prédéfinies
export const SERVICE_CATEGORIES = [
  'Services à domicile',
  'Cours et formations',
  'Artisanat',
  'Transport',
  'Informatique',
  'Événementiel',
  'Santé et bien-être',
  'Jardinage',
  'Réparation',
  'Nettoyage',
  'Garde d\'enfants',
  'Aide aux personnes âgées',
  'Photographie',
  'Musique',
  'Traduction',
  'Conseil',
  'Autres'
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];

// Types de tarification
export const PRICE_TYPES = [
  { value: 'fixed', label: 'Prix fixe' },
  { value: 'hourly', label: 'Par heure' },
  { value: 'daily', label: 'Par jour' },
  { value: 'negotiable', label: 'À négocier' }
] as const;

// Statuts de service
export const SERVICE_STATUSES = [
  { value: 'active', label: 'Actif', color: 'green' },
  { value: 'inactive', label: 'Inactif', color: 'gray' },
  { value: 'pending', label: 'En attente', color: 'yellow' },
  { value: 'completed', label: 'Terminé', color: 'blue' }
] as const;