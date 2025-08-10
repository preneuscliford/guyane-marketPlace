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
  availability?: string;
  contact_info?: {
    phone?: string;
    email?: string;
  };
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
  { value: 'services-domicile', label: 'Services à domicile' },
  { value: 'cours-formations', label: 'Cours et formations' },
  { value: 'artisanat', label: 'Artisanat' },
  { value: 'transport', label: 'Transport' },
  { value: 'informatique', label: 'Informatique' },
  { value: 'evenementiel', label: 'Événementiel' },
  { value: 'sante-bien-etre', label: 'Santé et bien-être' },
  { value: 'jardinage', label: 'Jardinage' },
  { value: 'reparation', label: 'Réparation' },
  { value: 'nettoyage', label: 'Nettoyage' },
  { value: 'garde-enfants', label: 'Garde d\'enfants' },
  { value: 'aide-personnes-agees', label: 'Aide aux personnes âgées' },
  { value: 'photographie', label: 'Photographie' },
  { value: 'musique', label: 'Musique' },
  { value: 'traduction', label: 'Traduction' },
  { value: 'conseil', label: 'Conseil' },
  { value: 'autres', label: 'Autres' }
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number]['value'];

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