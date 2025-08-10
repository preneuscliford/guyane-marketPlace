import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

interface ViewResult {
  success: boolean;
  is_new_unique_view: boolean;
  reason?: string;
  error?: string;
}

interface ViewStats {
  unique_views: number;
  total_views: number;
  views_today: number;
  views_this_week: number;
  views_this_month: number;
}

/**
 * Hook pour gérer les vues des services de manière intelligente
 * Évite les comptages multiples et fournit des statistiques détaillées
 */
export function useServiceViews() {
  const { user } = useAuth();
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return null;
    
    let id = sessionStorage.getItem('service_session_id');
    if (!id) {
      id = generateSessionId();
      sessionStorage.setItem('service_session_id', id);
    }
    return id;
  });

  /**
   * Génère un ID de session unique
   */
  const generateSessionId = useCallback((): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) +
           Date.now().toString(36);
  }, []);

  /**
   * Obtient l'adresse IP du client (optionnel)
   */
  const getClientIP = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn('Impossible d\'obtenir l\'IP client:', error);
      return null;
    }
  }, []);

  /**
   * Obtient le User Agent du navigateur
   */
  const getUserAgent = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return navigator.userAgent;
  }, []);

  /**
   * Incrémente les vues d'un service de manière intelligente
   * Évite les doublons et ne compte pas les vues du propriétaire
   */
  const incrementViews = useCallback(async (serviceId: string): Promise<ViewResult> => {
    try {
      // Obtenir les informations du client
      const [ip, userAgent] = await Promise.all([
        getClientIP(),
        Promise.resolve(getUserAgent())
      ]);
      
      const { data, error } = await supabase.rpc('increment_service_views', {
        p_service_id: serviceId,
        p_user_id: user?.id || null,
        p_ip_address: ip,
        p_session_id: sessionId,
        p_user_agent: userAgent
      });

      if (error) {
        console.error('Erreur lors de l\'incrémentation des vues:', error);
        throw error;
      }
      
      return data as ViewResult;
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
      return { 
        success: false, 
        is_new_unique_view: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }, [user?.id, sessionId, getClientIP, getUserAgent]);

  /**
   * Récupère les statistiques de vues d'un service
   */
  const getViewStats = useCallback(async (serviceId: string): Promise<ViewStats | null> => {
    try {
      const { data, error } = await supabase.rpc('get_service_view_stats', {
        p_service_id: serviceId
      });

      if (error) {
        console.error('Erreur lors de la récupération des stats:', error);
        return null;
      }
      
      return data as ViewStats;
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      return null;
    }
  }, []);

  /**
   * Hook pour incrémenter automatiquement les vues lors du montage du composant
   */
  const useAutoIncrementViews = useCallback((serviceId: string, enabled: boolean = true) => {
    const [viewResult, setViewResult] = useState<ViewResult | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!enabled || !serviceId) return;

      let timeoutId: NodeJS.Timeout;
      
      const incrementWithDelay = async () => {
        // Attendre un peu pour éviter les incréments accidentels lors de la navigation rapide
        timeoutId = setTimeout(async () => {
          setLoading(true);
          try {
            const result = await incrementViews(serviceId);
            setViewResult(result);
          } finally {
            setLoading(false);
          }
        }, 1000); // Délai de 1 seconde
      };

      incrementWithDelay();

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, [serviceId, enabled]);

    return { viewResult, loading };
  }, [incrementViews]);

  return {
    incrementViews,
    getViewStats,
    useAutoIncrementViews,
    sessionId
  };
}

/**
 * Hook simplifié pour incrémenter automatiquement les vues
 */
export function useAutoServiceViews(serviceId: string, enabled: boolean = true) {
  const { useAutoIncrementViews } = useServiceViews();
  return useAutoIncrementViews(serviceId, enabled);
}