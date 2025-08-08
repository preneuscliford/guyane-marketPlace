'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  /**
   * Récupère la liste des services avec filtres optionnels
   */
  const fetchServices = useCallback(async (params: ServiceSearchParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('services')
        .select(`
          *,
          profiles (
            id,
            username,
            full_name,
            avatar_url,
            location
          )
        `)
        .eq('status', 'active');

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

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors de la récupération des services:', error);
        throw error;
      }

      setServices(data || []);
      return data || [];
    } catch (err) {
      console.error('Erreur dans fetchServices:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des services';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  /**
   * Récupère un service par son ID
   */
  const getServiceById = useCallback(async (id: string): Promise<ServiceWithProfile | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          profiles (
            id,
            username,
            full_name,
            avatar_url,
            location
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du service:', error);
        throw error;
      }

      // Incrémenter le compteur de vues
      await supabase
        .from('services')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);

      return data;
    } catch (err) {
      console.error('Erreur dans getServiceById:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération du service';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  /**
   * Crée un nouveau service
   */
  const createService = useCallback(async (data: CreateServiceData): Promise<Service> => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      setLoading(true);
      setError(null);

      console.log('👤 Utilisateur connecté:', user.id);
      
      const insertData = {
        ...data,
        user_id: user.id
      };
      console.log('📤 Données à insérer:', insertData);
      
      const { data: service, error } = await supabase
        .from('services')
        .insert(insertData)
        .select()
        .single();

      console.log('📥 Réponse Supabase:', { service, error });
      
      if (error) {
        console.error('❌ Erreur Supabase détaillée:');
        console.error('Error object:', error);
        console.error('Error message:', error?.message);
        console.error('Error details:', error?.details);
        console.error('Error hint:', error?.hint);
        console.error('Error code:', error?.code);
        
        throw new Error(`Erreur Supabase: ${error?.message || 'Erreur inconnue'}`);
      }

      // Mettre à jour la liste locale
      await fetchServices();
      console.log('✅ Service créé avec succès:', service);

      return service;
    } catch (err) {
      console.error('❌ Erreur dans createService:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du service';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supabase, user, fetchServices]);

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
      setServices(prev => prev.map(s => s.id === id ? { ...s, ...service } : s));
      
      return service;
    } catch (err) {
      console.error('Erreur dans updateService:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du service';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

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
  }, [supabase, user]);

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

      return data || [];
    } catch (err) {
      console.error('Erreur dans getUserServices:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération de vos services';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

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
  const supabase = createClientComponentClient();

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
  }, [supabase]);

  return {
    stats,
    loading,
    error,
    fetchStats
  };
}