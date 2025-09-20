'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Service,
  CreateServiceData,
  UpdateServiceData,
  ServiceSearchParams,
  ServiceWithProfile,
  ServiceStats
} from '../types/services';
import { useAuth } from './useAuth';

/**
 * Hook personnalisé pour gérer les services
 * Fournit des fonctions pour créer, lire, mettre à jour et supprimer des services
 */
export function useServices() {
  const [services, setServices] = useState<ServiceWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  /**
   * Récupère la liste des services avec filtres optionnels
   */
  const fetchServices = useCallback(async (params: ServiceSearchParams = {}) => {
    try {
      console.log('useServices: Début de fetchServices avec params:', params);
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('services')
        .select(`
          *,
          profiles!services_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          ),
          reviews (
            rating
          )
        `)
        .eq('status', 'active');
        
      console.log('useServices: Query Supabase créée');

      // Appliquer les filtres
      if (params.category) {
        query = query.eq('category', params.category);
      }
      if (params.location) {
        query = query.ilike('location', `%${params.location}%`);
      }
      if (params.price_min !== undefined) {
        query = query.gte('price', params.price_min);
      }
      if (params.price_max !== undefined) {
        query = query.lte('price', params.price_max);
      }
      if (params.price_type) {
        query = query.eq('price_type', params.price_type);
      }
      if (params.search) {
        query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
      }
      if (params.tags && params.tags.length > 0) {
        query = query.overlaps('tags', params.tags);
      }

      // Tri
      const sortBy = params.sort_by || 'created_at';
      const sortOrder = params.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      if (params.limit) {
        query = query.limit(params.limit);
      }
      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }

      // Exécuter la requête avec timeout
      console.log('useServices: Exécution de la requête Supabase...');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout de la requête Supabase')), 10000);
      });
      
      const { data, error } = await Promise.race([
        query,
        timeoutPromise
      ]) as any;
      
      console.log('useServices: Résultat de la requête:', { data, error });
      
      if (error) {
        console.error('useServices: Erreur lors de la récupération des services:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('useServices: Aucune donnée retournée par Supabase');
        setServices([]);
        return [];
      }

      // Calculer les statistiques d'avis pour chaque service
      const servicesWithStats = data ? data.map((service: any) => {
        try {
          const reviews = service.reviews || [];
          let rating = 0;
          
          if (reviews && reviews.length > 0) {
            const total = reviews.reduce((sum: number, review: any) => {
              const reviewRating = typeof review.rating === 'string' 
                ? parseFloat(review.rating) || 0 
                : review.rating || 0;
              return sum + reviewRating;
            }, 0);
            rating = total / reviews.length;
          }
          
          const reviews_count = reviews ? reviews.length : 0;
          
          // Garder le prix tel quel, la conversion se fera au moment de l'affichage
          // pour éviter des problèmes de sérialisation sur Vercel
          
          return {
            ...service,
            rating: Math.round(rating * 10) / 10, // Arrondir à 1 décimale
            reviews_count
          };
        } catch (err) {
          console.error('Erreur lors du traitement du service:', err);
          // Retourner le service original en cas d'erreur
          return {
            ...service,
            rating: 0,
            reviews_count: 0
          };
        }
      }) : [];
      
      console.log('Services récupérés:', servicesWithStats.length, servicesWithStats);

      // Tri intelligent : services récents et bien notés en premier
      const sortedServices = servicesWithStats.sort((a: any, b: any) => {
        // Calculer un score composite basé sur la note et la récence
        const now = new Date().getTime();
        const aDate = new Date(a.created_at).getTime();
        const bDate = new Date(b.created_at).getTime();
        
        // Score de récence (plus récent = score plus élevé)
        const daysDiffA = (now - aDate) / (1000 * 60 * 60 * 24);
        const daysDiffB = (now - bDate) / (1000 * 60 * 60 * 24);
        const recencyScoreA = Math.max(0, 30 - daysDiffA) / 30; // Score de 0 à 1
        const recencyScoreB = Math.max(0, 30 - daysDiffB) / 30;
        
        // Score de qualité (note moyenne)
        const qualityScoreA = a.rating / 5; // Score de 0 à 1
        const qualityScoreB = b.rating / 5;
        
        // Score composite (60% qualité, 40% récence)
        const scoreA = (qualityScoreA * 0.6) + (recencyScoreA * 0.4);
        const scoreB = (qualityScoreB * 0.6) + (recencyScoreB * 0.4);
        
        return scoreB - scoreA; // Tri décroissant
      });

      setServices(sortedServices as unknown as ServiceWithProfile[]);
      return servicesWithStats || [];
    } catch (err) {
      console.error('Erreur dans fetchServices:', err instanceof Error ? err.message : String(err));
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des services';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupère un service par son ID
   * Note: L'incrémentation des vues est maintenant gérée par le hook useServiceViews
   */
  const getServiceById = useCallback(async (id: string): Promise<ServiceWithProfile | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          profiles!services_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url,
            location
          ),
          reviews (
            rating
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du service:', error);
        throw error;
      }

      // Calculer les statistiques d'avis
      if (data) {
        const reviews = data.reviews || [];
        const rating = reviews.length > 0 
          ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
          : 0;
        const reviews_count = reviews.length;
        
        const serviceWithStats = {
          ...data,
          rating: Math.round(rating * 10) / 10, // Arrondir à 1 décimale
          reviews_count
        };
        
        return serviceWithStats as unknown as ServiceWithProfile;
      }

      return data as unknown as ServiceWithProfile;
    } catch (err) {
      console.error('Erreur dans getServiceById:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération du service';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crée un nouveau service
   */
  const createService = useCallback(async (serviceData: CreateServiceData): Promise<Service> => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      setLoading(true);
      setError(null);

      // Vérification de l'authentification
      console.log('👤 Utilisateur connecté:', user.id);
      
      // Préparer les données avec tous les champs requis
      const insertData = {
        title: serviceData.title,
        description: serviceData.description,
        price: serviceData.price || null,
        category: serviceData.category,
        location: serviceData.location,
        user_id: user.id,
        images: serviceData.images || [],
        status: 'active',
        price_type: serviceData.price_type || 'fixed',
        availability: serviceData.availability || {},
        contact_info: serviceData.contact_info || {},
        tags: serviceData.tags || []
      };
      
      console.log('📤 Données à insérer:', insertData);
      
      // Insertion directe comme dans les annonces
      const { data, error } = await supabase.from('services').insert(insertData).select().single();
      
      console.log('📥 Réponse Supabase:', { data, error });

      if (error) {
        console.error('❌ Erreur Supabase détaillée:');
        console.error('Error object:', error);
        console.error('Error message:', error?.message);
        console.error('Error details:', error?.details);
        console.error('Error hint:', error?.hint);
        console.error('Error code:', error?.code);
        throw new Error(`Erreur Supabase: ${error?.message || 'Erreur inconnue'}`);
      }

      console.log('✅ Service créé avec succès:', data);

      // Rafraîchir la liste des services
      await fetchServices();

      return data as Service;
    } catch (err) {
      console.error('Erreur lors de la création du service:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du service';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, fetchServices]);

  /**
   * Met à jour un service existant
   */
  const updateService = useCallback(async (id: string, data: UpdateServiceData): Promise<Service> => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      setLoading(true);
      setError(null);

      const { data: service, error } = await supabase
        .from('services')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour du service:', error);
        throw error;
      }

      // Mettre à jour la liste locale
      setServices(prev => prev.map(s => s.id === id ? { ...s, ...(service as unknown as ServiceWithProfile) } : s));
      
      return service as Service;
    } catch (err) {
      console.error('Erreur dans updateService:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du service';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Supprime un service
   */
  const deleteService = useCallback(async (id: string): Promise<void> => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur lors de la suppression du service:', error);
        throw error;
      }

      // Mettre à jour la liste locale
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Erreur dans deleteService:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du service';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Récupère les services de l'utilisateur connecté
   */
  const getUserServices = useCallback(async (): Promise<Service[]> => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des services utilisateur:', error);
        throw error;
      }

      return (data as Service[]) || [];
    } catch (err) {
      console.error('Erreur dans getUserServices:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération de vos services';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    services,
    loading,
    error,
    fetchServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getUserServices
  };
}

/**
 * Hook pour les statistiques des services
 */
export function useServiceStats() {
  const [stats, setStats] = useState<ServiceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère les statistiques générales des services
   */
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les statistiques de base
      const { data: services, error } = await supabase
        .from('services')
        .select('status, category, views, rating');

      if (error) {
        throw error;
      }

      const totalServices = services.length;
      const activeServices = services.filter(s => s.status === 'active').length;
      const totalViews = services.reduce((sum, s) => sum + (s.views || 0), 0);
      const averageRating = services.length > 0 
        ? services.reduce((sum, s) => sum + (s.rating || 0), 0) / services.length 
        : 0;

      // Compter par catégorie
      const categoriesCount = services.reduce((acc, service) => {
        acc[service.category] = (acc[service.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statsData: ServiceStats = {
        total_services: totalServices,
        active_services: activeServices,
        total_views: totalViews,
        average_rating: averageRating,
        categories_count: categoriesCount
      };

      setStats(statsData);
      return statsData;
    } catch (err) {
      console.error('Erreur dans fetchStats:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des statistiques';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats
  };
}