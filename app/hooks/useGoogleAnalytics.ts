'use client';

import { useCallback } from 'react';

interface GAEventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface GAEcommerceItem {
  item_id: string;
  item_name: string;
  category?: string;
  quantity?: number;
  price?: number;
}

export function useGoogleAnalytics() {
  const gtag = useCallback((...args: any[]) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag(...args);
    }
  }, []);

  // Événement générique
  const trackEvent = useCallback((params: GAEventParams) => {
    gtag('event', params.action, {
      event_category: params.category,
      event_label: params.label,
      value: params.value,
    });
  }, [gtag]);

  // Tracking de page vue
  const trackPageView = useCallback((url: string) => {
    gtag('config', 'G-S651THS9H0', {
      page_location: url,
    });
  }, [gtag]);

  // E-commerce - Vue d'article
  const trackViewItem = useCallback((item: GAEcommerceItem) => {
    gtag('event', 'view_item', {
      currency: 'EUR',
      value: item.price,
      items: [item]
    });
  }, [gtag]);

  // E-commerce - Ajout au panier
  const trackAddToCart = useCallback((item: GAEcommerceItem) => {
    gtag('event', 'add_to_cart', {
      currency: 'EUR',
      value: item.price,
      items: [item]
    });
  }, [gtag]);

  // E-commerce - Achat
  const trackPurchase = useCallback((transactionId: string, value: number, items: GAEcommerceItem[]) => {
    gtag('event', 'purchase', {
      transaction_id: transactionId,
      currency: 'EUR',
      value: value,
      items: items
    });
  }, [gtag]);

  // Événements spécifiques Guyane Marketplace
  const trackServiceView = useCallback((serviceId: string, serviceName: string, category: string, location?: string) => {
    gtag('event', 'view_service', {
      event_category: 'Services',
      service_id: serviceId,
      service_name: serviceName,
      service_category: category,
      location: location,
    });
  }, [gtag]);

  const trackServiceContact = useCallback((serviceId: string, contactType: 'phone' | 'message' | 'email') => {
    gtag('event', 'contact_service', {
      event_category: 'Lead Generation',
      service_id: serviceId,
      contact_type: contactType,
    });
  }, [gtag]);

  const trackAnnouncementView = useCallback((announcementId: string, title: string, category: string, price?: number) => {
    gtag('event', 'view_announcement', {
      event_category: 'Annonces',
      announcement_id: announcementId,
      announcement_title: title,
      category: category,
      price: price,
    });
  }, [gtag]);

  const trackCommunityPost = useCallback ((postId: string, postType: 'question' | 'discussion', category?: string) => {
    gtag('event', 'view_community_post', {
      event_category: 'Communauté',
      post_id: postId,
      post_type: postType,
      category: category,
    });
  }, [gtag]);

  const trackSearch = useCallback((searchTerm: string, category: string, location?: string) => {
    gtag('event', 'search', {
      search_term: searchTerm,
      category: category,
      location: location,
    });
  }, [gtag]);

  const trackUserRegistration = useCallback((method: 'email' | 'google' | 'facebook') => {
    gtag('event', 'sign_up', {
      method: method,
    });
  }, [gtag]);

  const trackUserLogin = useCallback((method: 'email' | 'google' | 'facebook') => {
    gtag('event', 'login', {
      method: method,
    });
  }, [gtag]);

  return {
    trackEvent,
    trackPageView,
    trackViewItem,
    trackAddToCart,
    trackPurchase,
    trackServiceView,
    trackServiceContact,
    trackAnnouncementView,
    trackCommunityPost,
    trackSearch,
    trackUserRegistration,
    trackUserLogin,
  };
}

// Type pour window.gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}