import { useCallback } from 'react';
import { gtmEvent } from '@/components/analytics/GoogleTagManager';

/**
 * Hook personnalisé pour tracker les événements clés
 * Événements à tracker:
 * - Annonces publiées
 * - Messages/posts publiés
 * - Pages visitées
 * - Recherches effectuées
 * - Inscriptions
 */

export function useAnalytics() {
  // Track: Annonce publiée
  const trackAnnouncementCreated = useCallback((data: {
    category: string;
    location?: string;
    price?: number;
  }) => {
    gtmEvent('announcement_created', {
      event_category: 'engagement',
      event_label: `Annonce: ${data.category}`,
      value: data.price || 0,
      location: data.location || 'Non spécifiée',
      ...data,
    });
  }, []);

  // Track: Post/message publié
  const trackPostCreated = useCallback((data: {
    content_length: number;
    has_image: boolean;
    post_type?: string;
  }) => {
    gtmEvent('post_created', {
      event_category: 'community_engagement',
      event_label: 'Post publié',
      content_length: data.content_length,
      has_image: data.has_image,
      post_type: data.post_type || 'text',
    });
  }, []);

  // Track: Recherche effectuée
  const trackSearch = useCallback((data: {
    search_term: string;
    category?: string;
    results_count?: number;
  }) => {
    gtmEvent('search_performed', {
      event_category: 'user_interaction',
      search_term: data.search_term,
      category: data.category || 'all',
      results_count: data.results_count || 0,
    });
  }, []);

  // Track: Page visitée (plus détaillé)
  const trackPageView = useCallback((data: {
    page_title: string;
    page_path: string;
    category?: string;
  }) => {
    gtmEvent('page_view_custom', {
      page_title: data.page_title,
      page_path: data.page_path,
      category: data.category || 'general',
    });
  }, []);

  // Track: CTA cliquée
  const trackCTAClick = useCallback((data: {
    cta_text: string;
    cta_type: string; // 'primary' | 'secondary' | 'navigation'
    page: string;
  }) => {
    gtmEvent('cta_clicked', {
      event_category: 'cta_engagement',
      cta_text: data.cta_text,
      cta_type: data.cta_type,
      page: data.page,
    });
  }, []);

  // Track: Inscription
  const trackSignup = useCallback((data: {
    signup_method: string; // 'google' | 'email'
  }) => {
    gtmEvent('signup_completed', {
      event_category: 'conversion',
      signup_method: data.signup_method,
    });
  }, []);

  // Track: Message/contact envoyé
  const trackMessageSent = useCallback((data: {
    recipient_type: string; // 'seller' | 'service_provider' | 'community'
    message_length: number;
  }) => {
    gtmEvent('message_sent', {
      event_category: 'engagement',
      recipient_type: data.recipient_type,
      message_length: data.message_length,
    });
  }, []);

  // Track: Favoris ajouté
  const trackFavoriteAdded = useCallback((data: {
    item_type: string; // 'announcement' | 'service'
    item_category?: string;
  }) => {
    gtmEvent('favorite_added', {
      event_category: 'engagement',
      item_type: data.item_type,
      item_category: data.item_category || 'unknown',
    });
  }, []);

  return {
    trackAnnouncementCreated,
    trackPostCreated,
    trackSearch,
    trackPageView,
    trackCTAClick,
    trackSignup,
    trackMessageSent,
    trackFavoriteAdded,
  };
}
