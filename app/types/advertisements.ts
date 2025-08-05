// Types pour le système de publicités
export interface Advertisement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url?: string;
  target_url?: string;
  category?: string;
  location?: string;
  budget: number;
  daily_budget: number;
  total_spent: number;
  status: 'active' | 'paused' | 'completed' | 'rejected';
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AdvertisementStats {
  id: string;
  advertisement_id: string;
  impressions: number;
  clicks: number;
  cost_per_click: number;
  date: string;
  created_at: string;
}

export interface AdvertisementImpression {
  id: string;
  advertisement_id: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AdvertisementClick {
  id: string;
  advertisement_id: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Types pour les formulaires
export interface CreateAdvertisementData {
  title: string;
  description: string;
  image_url?: string;
  target_url?: string;
  category?: string;
  location?: string;
  budget: number;
  daily_budget: number;
  start_date?: string;
  end_date?: string;
}

export interface UpdateAdvertisementData extends Partial<CreateAdvertisementData> {
  status?: Advertisement['status'];
}

// Types pour les statistiques agrégées
export interface AdvertisementAnalytics {
  advertisement_id: string;
  total_impressions: number;
  total_clicks: number;
  click_through_rate: number;
  total_cost: number;
  average_cost_per_click: number;
  daily_stats: {
    date: string;
    impressions: number;
    clicks: number;
    cost: number;
  }[];
}

// Types pour le carrousel pondéré
export interface WeightedAdvertisement extends Advertisement {
  weight: number;
  probability: number;
}

export interface CarouselConfig {
  max_ads: number;
  rotation_interval: number; // en millisecondes
  weight_algorithm: 'budget' | 'bid' | 'hybrid';
}

// Types pour le dashboard
export interface DashboardStats {
  total_advertisements: number;
  active_advertisements: number;
  total_budget: number;
  total_spent: number;
  total_impressions: number;
  total_clicks: number;
  average_ctr: number;
  recent_performance: AdvertisementAnalytics[];
}

// Types pour les filtres et recherche
export interface AdvertisementFilters {
  status?: Advertisement['status'][];
  category?: string[];
  location?: string[];
  min_budget?: number;
  max_budget?: number;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface AdvertisementSearchParams {
  query?: string;
  filters?: AdvertisementFilters;
  sort_by?: 'created_at' | 'budget' | 'impressions' | 'clicks';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Types pour les réponses API
export interface AdvertisementResponse {
  data: Advertisement[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface AnalyticsResponse {
  data: AdvertisementAnalytics;
  period: {
    start: string;
    end: string;
  };
}

// Types pour les erreurs
export interface AdvertisementError {
  code: string;
  message: string;
  field?: string;
}

// Types pour les événements
export interface AdvertisementEvent {
  type: 'impression' | 'click' | 'conversion';
  advertisement_id: string;
  user_id?: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

// Types pour la configuration des enchères
export interface BidConfiguration {
  min_bid: number;
  max_bid: number;
  default_bid: number;
  bid_increment: number;
  auto_bid_enabled: boolean;
  target_position?: number;
}

// Types pour les rapports
export interface AdvertisementReport {
  id: string;
  advertisement_id: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'custom';
  period_start: string;
  period_end: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    cost: number;
    revenue: number;
    roi: number;
  };
  generated_at: string;
}

// Types pour les notifications
export interface AdvertisementNotification {
  id: string;
  user_id: string;
  advertisement_id: string;
  type: 'budget_low' | 'campaign_ended' | 'performance_alert' | 'approval_needed';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

// Types pour l'optimisation automatique
export interface AutoOptimization {
  enabled: boolean;
  rules: {
    pause_low_ctr: boolean;
    increase_budget_high_ctr: boolean;
    adjust_bids_by_performance: boolean;
  };
  thresholds: {
    min_ctr: number;
    max_cost_per_click: number;
    min_daily_budget: number;
  };
}