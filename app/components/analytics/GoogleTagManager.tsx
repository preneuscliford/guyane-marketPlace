"use client";

import Script from "next/script";
import { useEffect } from "react";

interface GoogleTagManagerProps {
  gtmId: string;
}

/**
 * Composant Google Tag Manager optimisé pour Next.js
 * Intègre GTM avec les bonnes pratiques de performance
 */
export default function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  useEffect(() => {
    // Initialiser le dataLayer si pas déjà fait
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
    }
  }, []);

  return (
    <>
      {/* Google Tag Manager Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
    </>
  );
}

/**
 * Composant NoScript pour Google Tag Manager
 * À placer dans le body pour les utilisateurs sans JavaScript
 */
export function GoogleTagManagerNoScript({ gtmId }: GoogleTagManagerProps) {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

// Types pour le dataLayer (optionnel mais recommandé)
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Fonction utilitaire pour envoyer des événements personnalisés à GTM
 * Usage: gtmEvent('page_view', { page_path: '/services' })
 */
export function gtmEvent(
  eventName: string,
  parameters: Record<string, any> = {}
) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters,
    });
  }
}

/**
 * Fonction pour tracker les conversions e-commerce
 * Usage: gtmPurchase('12345', 99.99, [{ item_id: '123', item_name: 'Produit', price: 99.99 }])
 */
export function gtmPurchase(
  transactionId: string,
  value: number,
  items: any[] = []
) {
  gtmEvent("purchase", {
    transaction_id: transactionId,
    value: value,
    currency: "EUR",
    items: items,
  });
}

/**
 * Fonction pour tracker les vues de produits
 */
export function gtmViewItem(
  itemId: string,
  itemName: string,
  category: string,
  value: number
) {
  gtmEvent("view_item", {
    currency: "EUR",
    value: value,
    items: [
      {
        item_id: itemId,
        item_name: itemName,
        category: category,
        price: value,
      },
    ],
  });
}
