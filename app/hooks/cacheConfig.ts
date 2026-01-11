'use client';

/**
 * Configuration centralisée pour TanStack Query
 * Définit les stratégies de cache optimisées selon les patterns d'usage
 */

// Types pour les différents niveaux de fréquence de mise à jour
type UpdateFrequency = 'high' | 'medium' | 'low' | 'static';

// Configuration de cache par fréquence
interface CacheConfig {
  staleTime: number;  // Durée avant qu'une donnée soit considérée comme périmée
  gcTime: number;     // Durée de rétention en cache après qu'une query soit inactive
  refetchOnMount: boolean;
  refetchOnWindowFocus: boolean;
  refetchOnReconnect: boolean;
  retry: number;
}

/**
 * Stratégies de cache prédéfinies selon la fréquence de mise à jour des données
 */
export const cacheStrategies: Record<UpdateFrequency, CacheConfig> = {
  // Données qui changent très fréquemment (ex: vues, likes en temps réel)
  high: {
    staleTime: 30 * 1000,      // 30 secondes
    gcTime: 2 * 60 * 1000,     // 2 minutes
    refetchOnMount: false,     // ✅ Évite les refetch au montage
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1
  },
  
  // Données qui changent régulièrement (ex: services, annonces, favoris)
  medium: {
    staleTime: 2 * 60 * 1000,  // 2 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
    refetchOnMount: false,     // ✅ Utilise cache au montage
    refetchOnWindowFocus: false, // ✅ Pas de refetch au changement d'onglet
    refetchOnReconnect: true,
    retry: 2
  },
  
  // Données qui changent peu fréquemment (ex: profils, reviews)
  low: {
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 30 * 60 * 1000,    // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3
  },
  
  // Données quasi-statiques (ex: catégories, configurations)
  static: {
    staleTime: 60 * 60 * 1000, // 1 heure
    gcTime: 24 * 60 * 60 * 1000, // 24 heures
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 3
  }
};

/**
 * Configuration spécialisée par type d'opération
 */
export const operationConfigs = {
  // Opérations de lecture
  read: {
    list: cacheStrategies.medium,        // Listes d'entités
    detail: cacheStrategies.low,         // Détail d'une entité
    user: cacheStrategies.medium,        // Données de l'utilisateur connecté
    search: cacheStrategies.medium,      // Résultats de recherche
    stats: cacheStrategies.low,          // Statistiques
    realtime: cacheStrategies.high,      // Données en temps réel
  },
  
  // Opérations de mutation
  mutation: {
    optimisticTimeout: 5000,             // Timeout pour les optimistic updates
    retryDelay: 1000,                    // Délai entre les retentatives
    maxRetries: 3,                       // Nombre maximum de retentatives
  }
};

/**
 * Configuration par entité - mapping des entités vers leurs stratégies optimales
 */
export const entityCacheConfig = {
  // Services - changent moyennement, souvent consultés
  services: {
    list: cacheStrategies.medium,
    detail: {
      ...cacheStrategies.low,
      staleTime: 3 * 60 * 1000,  // 3 minutes pour les détails de services
    },
    user: cacheStrategies.medium,
    stats: cacheStrategies.low,
  },
  
  // Advertisements - changent selon le budget, importance business
  advertisements: {
    list: cacheStrategies.medium,
    detail: cacheStrategies.low,
    user: cacheStrategies.medium,
    active: {
      ...cacheStrategies.medium,
      staleTime: 90 * 1000,      // 1.5 minutes pour les pubs actives
    },
    weighted: {
      ...cacheStrategies.medium,
      staleTime: 5 * 60 * 1000,  // 5 minutes pour les calculs de pondération
    },
    stats: cacheStrategies.low,
    analytics: cacheStrategies.low,
  },
  
  // Service Views - données analytiques qui changent souvent
  serviceViews: {
    stats: cacheStrategies.medium,
    realtime: cacheStrategies.high,
  },
  
  // Favoris - changent fréquemment pour l'utilisateur
  favorites: {
    user: cacheStrategies.medium,
    check: {
      ...cacheStrategies.medium,
      staleTime: 1 * 60 * 1000,  // 1 minute pour la vérification de favori
    },
    details: cacheStrategies.low,
  },
  
  // Reviews - changent moins fréquemment, importantes pour la confiance
  reviews: {
    list: cacheStrategies.low,
    user: cacheStrategies.medium,
    stats: cacheStrategies.low,
  },
  
  // Profiles - changent rarement
  profiles: {
    detail: cacheStrategies.low,
    current: cacheStrategies.medium,
  },
  
  // Announcements - similaire aux services mais plus dynamiques
  announcements: {
    list: cacheStrategies.medium,
    detail: cacheStrategies.low,
    user: cacheStrategies.medium,
  }
};

/**
 * Configuration pour les requêtes en fonction du contexte d'usage
 */
export const contextConfigs = {
  // Page d'accueil - besoin de fraîcheur pour l'engagement
  homepage: {
    services: {
      ...cacheStrategies.medium,
      staleTime: 1 * 60 * 1000,  // 1 minute
    },
    advertisements: {
      ...cacheStrategies.medium,
      staleTime: 90 * 1000,      // 1.5 minutes
    }
  },
  
  // Pages de détail - qualité des données importante
  detail: {
    service: cacheStrategies.low,
    reviews: cacheStrategies.low,
    views: cacheStrategies.medium,
  },
  
  // Dashboard utilisateur - ses propres données changent souvent
  dashboard: {
    userServices: cacheStrategies.medium,
    userFavorites: cacheStrategies.medium,
    userReviews: cacheStrategies.medium,
    stats: cacheStrategies.low,
  },
  
  // Pages de recherche/navigation - performance importante
  search: {
    results: cacheStrategies.medium,
    filters: cacheStrategies.static,
    categories: cacheStrategies.static,
  },
  
  // Modal/overlay - données temporaires
  modal: {
    ...cacheStrategies.medium,
    gcTime: 2 * 60 * 1000,       // Cache plus court pour les modals
  }
};

/**
 * Helper pour obtenir la configuration de cache optimale
 * Accepte soit (entity, operation, context) soit juste un type générique (string)
 */
export function getCacheConfig(
  entityOrType: string | (keyof typeof entityCacheConfig),
  operation?: string,
  context?: keyof typeof contextConfigs
): CacheConfig {
  // Si appelé avec juste un string générique (ex: 'analytics_data')
  if (!operation) {
    return cacheStrategies.medium; // Default à medium pour les opérations générique
  }

  const entity = entityOrType as keyof typeof entityCacheConfig;
  
  // Priorité 1: Configuration contextuelle spécifique
  if (context && contextConfigs[context]) {
    const contextConfig = contextConfigs[context] as any;
    if (contextConfig[entity] || contextConfig[operation]) {
      return contextConfig[entity] || contextConfig[operation];
    }
  }
  
  // Priorité 2: Configuration d'entité spécifique
  if (entityCacheConfig[entity]) {
    const entityConfig = entityCacheConfig[entity] as any;
    if (entityConfig[operation]) {
      return entityConfig[operation];
    }
  }
  
  // Priorité 3: Configuration d'opération générale
  if (operationConfigs.read[operation as keyof typeof operationConfigs.read]) {
    return operationConfigs.read[operation as keyof typeof operationConfigs.read];
  }
  
  // Fallback: Configuration medium par défaut
  return cacheStrategies.medium;
}

/**
 * Configuration spécialisée pour les mutations avec optimistic updates
 */
export const optimisticUpdateConfig = {
  // Favoris - update instantané pour l'UX
  favorites: {
    enabled: true,
    rollbackOnError: true,
    invalidateRelated: ['services', 'announcements'], // Invalider les listes qui pourraient afficher l'état de favori
  },
  
  // Reviews - mise à jour visuelle immédiate
  reviews: {
    enabled: true,
    rollbackOnError: true,
    invalidateRelated: ['services', 'profiles'], // Mise à jour des notes moyennes
  },
  
  // Service views - update immédiat du compteur
  serviceViews: {
    enabled: true,
    rollbackOnError: false, // Pas critique si échec
    invalidateRelated: ['services'],
  },
  
  // Services et Advertisements - pas d'optimistic update (trop complexe)
  services: {
    enabled: false,
    invalidateRelated: ['services', 'favorites', 'reviews'],
  },
  
  advertisements: {
    enabled: false,
    invalidateRelated: ['advertisements'],
  }
};

/**
 * Configuration pour les requêtes en arrière-plan
 */
export const backgroundRefreshConfig = {
  // Services populaires - refresh en arrière-plan
  popularServices: {
    interval: 5 * 60 * 1000,     // 5 minutes
    enabled: true,
  },
  
  // Publicités actives - refresh fréquent pour le carousel
  activeAdvertisements: {
    interval: 2 * 60 * 1000,     // 2 minutes
    enabled: true,
  },
  
  // Statistiques générales - refresh modéré
  globalStats: {
    interval: 15 * 60 * 1000,    // 15 minutes
    enabled: true,
  }
};

/**
 * Helper pour créer les options de query avec la configuration optimale
 */
export function createQueryOptions(
  entity: keyof typeof entityCacheConfig,
  operation: string,
  context?: keyof typeof contextConfigs,
  overrides: Partial<CacheConfig> = {}
) {
  const baseConfig = getCacheConfig(entity, operation, context);
  
  return {
    ...baseConfig,
    ...overrides,
  };
}

/**
 * Présets pour les cas d'usage courants
 */
export const queryPresets = {
  // Liste principale de la page d'accueil
  homepageList: (entity: keyof typeof entityCacheConfig) => 
    createQueryOptions(entity, 'list', 'homepage'),
  
  // Détail d'une entité avec qualité des données
  entityDetail: (entity: keyof typeof entityCacheConfig) => 
    createQueryOptions(entity, 'detail', 'detail'),
  
  // Données utilisateur dans le dashboard
  userDashboard: (entity: keyof typeof entityCacheConfig) => 
    createQueryOptions(entity, 'user', 'dashboard'),
  
  // Résultats de recherche
  searchResults: (entity: keyof typeof entityCacheConfig) => 
    createQueryOptions(entity, 'list', 'search'),
  
  // Données en temps réel
  realtime: (entity: keyof typeof entityCacheConfig) => 
    createQueryOptions(entity, 'realtime'),
  
  // Données statiques (catégories, etc.)
  static: () => cacheStrategies.static,
};

/**
 * Export des configurations les plus utilisées pour un accès rapide
 */
export const quickConfigs = {
  // Services
  servicesList: queryPresets.homepageList('services'),
  serviceDetail: queryPresets.entityDetail('services'),
  userServices: queryPresets.userDashboard('services'),
  
  // Advertisements
  advertisementsList: queryPresets.homepageList('advertisements'),
  activeAdvertisements: createQueryOptions('advertisements', 'active'),
  
  // Favorites
  userFavorites: queryPresets.userDashboard('favorites'),
  favoriteCheck: createQueryOptions('favorites', 'check'),
  
  // Reviews
  serviceReviews: queryPresets.entityDetail('reviews'),
  userReviews: queryPresets.userDashboard('reviews'),
  
  // Service Views
  viewStats: createQueryOptions('serviceViews', 'stats'),
  realtimeViews: createQueryOptions('serviceViews', 'realtime'),
};