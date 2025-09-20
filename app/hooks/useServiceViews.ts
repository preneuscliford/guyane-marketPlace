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
 * Génère un ID de session unique
 */
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
};

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
   * Incrémente intelligemment les vues d'un service
   * Évite les doublons et ne compte pas les vues du propriétaire
   */
  const incrementViews = useCallback(async (serviceId: string): Promise<ViewResult> => {
    try {
      // Obtenir les informations du client
      const [ip, userAgent] = await Promise.all([
        getClientIP(),
        Promise.resolve(getUserAgent())
      ]);
      
      // Insérer directement dans service_views au lieu d'utiliser une RPC
      const { error } = await supabase
        .from('service_views')
        .insert({
          service_id: serviceId,
          user_id: user?.id || null,
          ip_address: ip as any,
          session_id: sessionId,
          user_agent: userAgent,
          viewed_at: new Date().toISOString()
        });

      if (error) {
        // Si c'est une erreur de contrainte unique (déjà vu), ce n'est pas grave
        if (error.code === '23505') {
          return { 
            success: true, 
            is_new_unique_view: false,
            reason: 'Vue déjà enregistrée'
          };
        }
        console.error('Erreur lors de l\'incrémentation des vues:', error);
        throw error;
      }
      
      return { 
        success: true, 
        is_new_unique_view: true 
      };
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
      return { 
        success: false, 
        is_new_unique_view: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }, [user?.id, sessionId, getClientIP, getUserAgent]);  /**
   * Récupère les statistiques de vues d'un service
   */
  const getViewStats = useCallback(async (serviceId: string): Promise<ViewStats | null> => {
    try {
      // Calculer les statistiques directement depuis la table service_views
      const { data: views, error } = await supabase
        .from('service_views')
        .select('*')
        .eq('service_id', serviceId);

      if (error) {
        console.error('Erreur lors de la récupération des stats:', error);
        return null;
      }
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const totalViews = views.length;
      const uniqueViews = new Set(views.map(v => v.user_id || v.session_id || v.ip_address)).size;
      
      const viewsToday = views.filter(v => 
        new Date(v.viewed_at) >= today
      ).length;
      
      const viewsThisWeek = views.filter(v => 
        new Date(v.viewed_at) >= weekAgo
      ).length;
      
      const viewsThisMonth = views.filter(v => 
        new Date(v.viewed_at) >= monthAgo
      ).length;

      return {
        unique_views: uniqueViews,
        total_views: totalViews,
        views_today: viewsToday,
        views_this_week: viewsThisWeek,
        views_this_month: viewsThisMonth
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      return null;
    }
  }, []);

  return {
    incrementViews,
    getViewStats,
    sessionId
  };
}

/**
 * Hook séparé pour incrémenter automatiquement les vues lors du montage du composant
 * Utilise le hook useServiceViews de manière appropriée
 */
export function useAutoIncrementViews(serviceId: string, enabled: boolean = true) {
  const [viewResult, setViewResult] = useState<ViewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { incrementViews } = useServiceViews();

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
  }, [serviceId, enabled, incrementViews]);

  return { viewResult, loading };
}

/**
 * Hook simplifié pour incrémenter automatiquement les vues
 * (Alias pour useAutoIncrementViews pour la rétrocompatibilité)
 */
export function useAutoServiceViews(serviceId: string, enabled: boolean = true) {
  return useAutoIncrementViews(serviceId, enabled);
}