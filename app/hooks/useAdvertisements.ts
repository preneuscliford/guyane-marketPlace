'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Advertisement,
  AdvertisementStats,
  CreateAdvertisementData,
  UpdateAdvertisementData,
  AdvertisementAnalytics,
  WeightedAdvertisement,
  AdvertisementSearchParams,
  AdvertisementResponse
} from '../types/advertisements';
import { useAuth } from './useAuth';

/**
 * Hook pour gérer les publicités
 */
export function useAdvertisements() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  /**
   * Récupère toutes les publicités avec filtres optionnels
   */
  const fetchAdvertisements = useCallback(async (params?: AdvertisementSearchParams): Promise<AdvertisementResponse> => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('advertisements')
        .select('*');

      // Appliquer les filtres
      if (params?.filters?.status) {
        query = query.in('status', params.filters.status);
      }
      if (params?.filters?.category) {
        query = query.in('category', params.filters.category);
      }
      if (params?.filters?.location) {
        query = query.in('location', params.filters.location);
      }
      if (params?.filters?.min_budget) {
        query = query.gte('budget', params.filters.min_budget);
      }
      if (params?.filters?.max_budget) {
        query = query.lte('budget', params.filters.max_budget);
      }

      // Appliquer la recherche textuelle
      if (params?.query) {
        query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`);
      }

      // Appliquer le tri
      const sortBy = params?.sort_by || 'created_at';
      const sortOrder = params?.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Appliquer la pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      const response: AdvertisementResponse = {
        data: (data || []) as Advertisement[],
        total: count || 0,
        page,
        limit,
        has_more: (count || 0) > page * limit
      };

      setAdvertisements((data || []) as Advertisement[]);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des publicités';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupère les publicités de l'utilisateur connecté
   */
  const fetchUserAdvertisements = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAdvertisements((data || []) as Advertisement[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement de vos publicités';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Crée une nouvelle publicité
   */
  const createAdvertisement = useCallback(async (data: CreateAdvertisementData): Promise<Advertisement> => {
    console.log('🔍 createAdvertisement appelé avec:', data);
    
    if (!user) {
      console.log('❌ Utilisateur non connecté');
      throw new Error('Utilisateur non connecté');
    }
    console.log('✅ Utilisateur connecté:', user.id);

    setLoading(true);
    setError(null);

    try {
      const insertData = {
        ...data,
        user_id: user.id
      };
      console.log('📤 Données à insérer:', insertData);
      
      const { data: advertisement, error } = await supabase
        .from('advertisements')
        .insert(insertData)
        .select()
        .single();

      console.log('📥 Réponse Supabase:', { advertisement, error });
      
      if (error) {
        console.error('❌ Erreur Supabase détaillée:');
        console.error('Error object:', error);
        console.error('Error message:', error?.message);
        console.error('Error details:', error?.details);
        console.error('Error hint:', error?.hint);
        console.error('Error code:', error?.code);
        console.error('Error keys:', Object.keys(error || {}));
        console.error('Error values:', Object.values(error || {}));
        
        // Essayer de créer un objet d'erreur plus lisible
        const errorInfo = {
          message: error?.message || 'Message non disponible',
          details: error?.details || 'Détails non disponibles',
          hint: error?.hint || 'Hint non disponible',
          code: error?.code || 'Code non disponible',
          allProperties: Object.getOwnPropertyNames(error || {})
        };
        console.error('Error info structured:', errorInfo);
        
        throw new Error(`Erreur Supabase: ${error?.message || 'Erreur inconnue'}`);
      }

      // Mettre à jour la liste locale
      setAdvertisements(prev => [advertisement as Advertisement, ...prev]);
      console.log('✅ Publicité créée avec succès:', advertisement);

      return advertisement as Advertisement;
    } catch (err) {
      console.error('❌ Erreur dans createAdvertisement:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la publicité';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Met à jour une publicité
   */
  const updateAdvertisement = useCallback(async (id: string, data: UpdateAdvertisementData): Promise<Advertisement> => {
    setLoading(true);
    setError(null);

    try {
      const { data: advertisement, error } = await supabase
        .from('advertisements')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour la liste locale
      setAdvertisements(prev => 
        prev.map(ad => ad.id === id ? advertisement as Advertisement : ad)
      );

      return advertisement as Advertisement;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la publicité';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Supprime une publicité
   */
  const deleteAdvertisement = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Mettre à jour la liste locale
      setAdvertisements(prev => prev.filter(ad => ad.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de la publicité';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Récupère une publicité par son ID
   */
  const getAdvertisementById = useCallback(async (id: string): Promise<Advertisement | null> => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as Advertisement;
    } catch (err) {
      console.error('Erreur lors de la récupération de la publicité:', err);
      return null;
    }
  }, []);

  return {
    advertisements,
    loading,
    error,
    fetchAdvertisements,
    fetchUserAdvertisements,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    getAdvertisementById
  };
}

/**
 * Hook pour gérer les statistiques des publicités
 */
export function useAdvertisementStats() {
  const [stats, setStats] = useState<AdvertisementStats[]>([]);
  const [analytics, setAnalytics] = useState<AdvertisementAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère les statistiques d'une publicité
   */
  const fetchAdvertisementStats = useCallback(async (advertisementId: string, dateRange?: { start: string; end: string }) => {
    setLoading(true);
    setError(null);

    try {
      // Récupérer la publicité et ses clics
      const { data: advertisement, error: adError } = await supabase
        .from('advertisements')
        .select('*')
        .eq('id', advertisementId)
        .single();

      if (adError) throw adError;

      let clickQuery = supabase
        .from('advertisement_clicks')
        .select('*')
        .eq('advertisement_id', advertisementId);

      if (dateRange) {
        clickQuery = clickQuery
          .gte('created_at', dateRange.start)
          .lte('created_at', dateRange.end);
      }

      const { data: clicks, error: clickError } = await clickQuery;

      if (clickError) throw clickError;

      // Construire les statistiques basées sur l'annonce et les clics réels
      const stats: AdvertisementStats[] = [{
        id: `${advertisementId}-${Date.now()}`, // ID généré temporairement
        advertisement_id: advertisementId,
        impressions: advertisement?.impressions || 0,
        clicks: clicks?.length || 0,
        cost_per_click: 0, // À calculer selon la logique métier
        date: new Date().toISOString().split('T')[0],
        created_at: advertisement?.created_at || new Date().toISOString()
      }];

      setStats(stats);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Enregistre une impression
   * Temporairement désactivé pour éviter les erreurs RLS
   */
  const recordImpression = useCallback(async (advertisementId: string, userId?: string) => {
    try {
      // TODO: Réactiver une fois les politiques RLS corrigées
      console.log('Impression enregistrée (mode debug):', { advertisementId, userId });
      
      // const { error } = await supabase
      //   .from('advertisement_impressions')
      //   .insert({
      //     advertisement_id: advertisementId,
      //     user_id: userId,
      //     ip_address: null, // À implémenter côté serveur
      //     user_agent: navigator.userAgent
      //   });

      // if (error) throw error;
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'impression:', err);
    }
  }, []);

  /**
   * Enregistre un clic
   * Temporairement désactivé pour éviter les erreurs RLS
   */
  const recordClick = useCallback(async (advertisementId: string, userId?: string) => {
    try {
      // TODO: Réactiver une fois les politiques RLS corrigées
      console.log('Clic enregistré (mode debug):', { advertisementId, userId });
      
      // const { error } = await supabase
      //   .from('advertisement_clicks')
      //   .insert({
      //     advertisement_id: advertisementId,
      //     user_id: userId,
      //     ip_address: null, // À implémenter côté serveur
      //     user_agent: navigator.userAgent
      //   });

      // if (error) throw error;
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du clic:', err);
    }
  }, []);

  /**
   * Calcule les analytics d'une publicité
   */
  const calculateAnalytics = useCallback(async (advertisementId: string): Promise<AdvertisementAnalytics> => {
    setLoading(true);
    setError(null);

    try {
      // Récupérer la publicité
      const { data: advertisement, error: adError } = await supabase
        .from('advertisements')
        .select('*')
        .eq('id', advertisementId)
        .single();

      if (adError) throw adError;

      // Récupérer les clics
      const { data: clicksData, error: clicksError } = await supabase
        .from('advertisement_clicks')
        .select('*')
        .eq('advertisement_id', advertisementId);

      if (clicksError) throw clicksError;

      const clicks = clicksData || [];
      const totalImpressions = advertisement?.impressions || 0;
      const totalClicks = clicks.length;
      const totalCost = advertisement?.total_spent || 0;

      const analytics: AdvertisementAnalytics = {
        advertisement_id: advertisementId,
        total_impressions: totalImpressions,
        total_clicks: totalClicks,
        click_through_rate: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
        total_cost: totalCost,
        average_cost_per_click: totalClicks > 0 ? totalCost / totalClicks : 0,
        daily_stats: [{ // Utilisation de données basiques pour l'instant
          date: new Date().toISOString().split('T')[0],
          impressions: totalImpressions,
          clicks: totalClicks,
          cost: totalCost
        }]
      };

      setAnalytics(analytics);
      return analytics;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du calcul des analytics';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    analytics,
    loading,
    error,
    fetchAdvertisementStats,
    recordImpression,
    recordClick,
    calculateAnalytics
  };
}

/**
 * Hook pour le carrousel pondéré
 */
export function useWeightedCarousel() {
  const [weightedAds, setWeightedAds] = useState<WeightedAdvertisement[]>([]);
  const [currentAd, setCurrentAd] = useState<WeightedAdvertisement | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Calcule le poids d'une publicité basé sur son budget
   */
  const calculateWeight = useCallback((advertisement: Advertisement): number => {
    // Algorithme de pondération basé sur le budget
    // Plus le budget est élevé, plus le poids est important
    const baseBudget = 1; // Budget minimum pour éviter la division par zéro
    const weight = Math.log(advertisement.budget + baseBudget) * 10;
    return Math.max(weight, 1); // Poids minimum de 1
  }, []);

  /**
   * Récupère les publicités actives et calcule leurs poids
   */
  const fetchWeightedAdvertisements = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('status', 'active')
        .gt('budget', 0)
        .order('budget', { ascending: false });

      if (error) throw error;

      const advertisements = data || [];
      const totalWeight = advertisements.reduce((sum, ad) => {
        // Only calculate weight for ads with valid user_id
        if (ad.user_id !== null && typeof ad.user_id === 'string') {
          return sum + calculateWeight(ad as Advertisement);
        }
        return sum;
      }, 0);

      // Filtrer les publicités avec user_id valide et les convertir en WeightedAdvertisement
      const validAds = advertisements.filter((ad) =>
        ad.user_id !== null && typeof ad.user_id === 'string'
      );
      
      const weighted = validAds.map(ad => {
        const weight = calculateWeight(ad as Advertisement);
        return {
          ...ad,
          user_id: ad.user_id, // TypeScript sait maintenant que user_id est string
          weight,
          probability: totalWeight > 0 ? weight / totalWeight : 0
        };
      });

      setWeightedAds(weighted as WeightedAdvertisement[]);
      return weighted;
    } catch (err) {
      console.error('Erreur lors du chargement des publicités pondérées:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [calculateWeight]);

  /**
   * Sélectionne une publicité aléatoirement basée sur les poids
   */
  const selectRandomAdvertisement = useCallback((ads: WeightedAdvertisement[]): WeightedAdvertisement | null => {
    if (ads.length === 0) return null;

    const random = Math.random();
    let cumulativeProbability = 0;

    for (const ad of ads) {
      cumulativeProbability += ad.probability;
      if (random <= cumulativeProbability) {
        return ad;
      }
    }

    // Fallback: retourner la première publicité
    return ads[0];
  }, []);

  /**
   * Démarre le carrousel automatique
   */
  const startCarousel = useCallback((intervalMs: number = 5000) => {
    const interval = setInterval(async () => {
      const ads = await fetchWeightedAdvertisements();
      const validAds = ads.filter((ad) =>
        ad.user_id !== null && typeof ad.user_id === 'string'
      );
      const selectedAd = selectRandomAdvertisement(validAds as WeightedAdvertisement[]);
      setCurrentAd(selectedAd);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [fetchWeightedAdvertisements, selectRandomAdvertisement]);

  return {
    weightedAds,
    currentAd,
    loading,
    fetchWeightedAdvertisements,
    selectRandomAdvertisement,
    startCarousel,
    setCurrentAd
  };
}

/**
 * Hook simple pour récupérer les publicités actives pour le carousel
 */
export function useActiveAdvertisementsForCarousel() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveAdvertisements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching active advertisements...');

      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);

      console.log('📥 Supabase response:', { data, error });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log('✅ Active advertisements found:', data?.length || 0);
      setAdvertisements((data || []).map(ad => ({
        ...ad,
        user_id: ad.user_id || '', // Garantir que user_id ne soit jamais null
        image_url: ad.image_url || undefined // Convertir null en undefined
      } as Advertisement)));
    } catch (err) {
      console.error('❌ Error fetching active advertisements:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveAdvertisements();
  }, [fetchActiveAdvertisements]);

  return {
    advertisements,
    loading,
    error,
    refetch: fetchActiveAdvertisements
  };
}