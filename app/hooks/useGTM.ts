"use client";

import { useEffect } from "react";
import { gtmEvent, gtmViewItem, gtmPurchase } from "@/components/analytics/GoogleTagManager";

/**
 * Hook personnalisé pour utiliser Google Tag Manager facilement
 * Fournit des fonctions pré-configurées pour tracker les événements
 */
export function useGTM() {

  // Tracker automatiquement les changements de page
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtmEvent('page_view', {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      });
    };

    // Observer les changements d'URL pour les SPA
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChange(args[2] as string);
    };

    return () => {
      history.pushState = originalPushState;
    };
  }, []);

  return {
    // Événements e-commerce
    trackPurchase: (transactionId: string, value: number, items: any[] = []) => {
      gtmPurchase(transactionId, value, items);
    },

    trackViewItem: (itemId: string, itemName: string, category: string, value: number) => {
      gtmViewItem(itemId, itemName, category, value);
    },

    trackAddToCart: (itemId: string, itemName: string, category: string, value: number, quantity: number = 1) => {
      gtmEvent('add_to_cart', {
        currency: 'EUR',
        value: value,
        items: [{
          item_id: itemId,
          item_name: itemName,
          category: category,
          price: value,
          quantity: quantity,
        }],
      });
    },

    trackRemoveFromCart: (itemId: string, itemName: string, value: number, quantity: number = 1) => {
      gtmEvent('remove_from_cart', {
        currency: 'EUR',
        value: value,
        items: [{
          item_id: itemId,
          item_name: itemName,
          price: value,
          quantity: quantity,
        }],
      });
    },

    // Événements d'engagement
    trackSearch: (searchTerm: string, category?: string, location?: string) => {
      gtmEvent('search', {
        search_term: searchTerm,
        category: category,
        location: location,
      });
    },

    trackSignUp: (method: string = 'email') => {
      gtmEvent('sign_up', {
        method: method,
      });
    },

    trackLogin: (method: string = 'email') => {
      gtmEvent('login', {
        method: method,
      });
    },

    trackContactForm: (formType: string) => {
      gtmEvent('generate_lead', {
        form_type: formType,
        currency: 'EUR',
        value: 0, // Valeur estimée d'un lead
      });
    },

    trackAdClick: (adId: string, adTitle: string, position: number) => {
      gtmEvent('select_promotion', {
        creative_name: adTitle,
        creative_slot: position.toString(),
        promotion_id: adId,
        promotion_name: adTitle,
      });
    },

    trackServiceBooking: (serviceId: string, serviceName: string, price: number, location: string) => {
      gtmEvent('begin_checkout', {
        currency: 'EUR',
        value: price,
        items: [{
          item_id: serviceId,
          item_name: serviceName,
          category: 'Service',
          price: price,
          location: location,
        }],
      });
    },

    trackMessageSent: (recipientType: 'seller' | 'buyer' | 'admin') => {
      gtmEvent('message_sent', {
        recipient_type: recipientType,
      });
    },

    trackReviewSubmitted: (itemId: string, rating: number) => {
      gtmEvent('review_submitted', {
        item_id: itemId,
        rating: rating,
      });
    },

    trackFavoriteAdded: (itemId: string, itemType: 'product' | 'service') => {
      gtmEvent('add_to_wishlist', {
        currency: 'EUR',
        value: 0,
        items: [{
          item_id: itemId,
          item_category: itemType,
        }],
      });
    },

    trackShare: (contentId: string, contentType: string, method: string) => {
      gtmEvent('share', {
        content_type: contentType,
        content_id: contentId,
        method: method,
      });
    },

    // Événement personnalisé générique
    trackCustomEvent: (eventName: string, parameters: Record<string, any> = {}) => {
      gtmEvent(eventName, parameters);
    },
  };
}

// Types TypeScript pour les événements e-commerce
export interface GTMItem {
  item_id: string;
  item_name: string;
  category: string;
  price: number;
  quantity?: number;
  location?: string;
}

export interface GTMPurchaseData {
  transaction_id: string;
  value: number;
  currency: string;
  items: GTMItem[];
  shipping?: number;
  tax?: number;
}