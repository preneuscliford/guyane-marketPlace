import { Metadata } from "next";
import {
  generateServiceSEO,
  generateAnnouncementSEO,
  generateProductSEO,
  generateJSONLD,
} from "@/lib/seo";

interface Publication {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  price?: number;
  author?: string;
  rating?: number;
  reviewCount?: number;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  images?: string[];
}

/**
 * Génère les métadonnées SEO pour un service
 * Optimisé pour apparaître dans Google pour les recherches de services locaux
 */
export function generateServiceMetadata(service: Publication): Metadata {
  const metadata = generateServiceSEO(service);

  return {
    ...metadata,

    // Métadonnées spécifiques aux services locaux
    other: {
      ...metadata.other,

      // Signaler à Google que c'est un service local
      "business:type": "Local Service",
      "business:category": service.category,
      "business:location": service.location,
      "business:price_range": service.price ? `€${service.price}` : "Sur devis",
      "business:availability": "Available",

      // Signaux pour les recherches locales "service près de moi"
      "local:type": "service",
      "local:category": service.category.toLowerCase(),
      "local:area": service.location,

      // Métadonnées de qualité
      "service:rating": service.rating?.toString(),
      "service:reviews": service.reviewCount?.toString(),
      "service:views": service.viewCount?.toString(),
    },

    // OpenGraph optimisé pour les services
    openGraph: {
      ...metadata.openGraph,
      title: `🔧 ${service.title} - Service ${service.category} à ${
        service.location || "Guyane"
      }`,
      description: `${service.description.substring(0, 120)}... • ${
        service.rating ? `⭐ ${service.rating}/5` : "Nouveau service"
      } • ${service.reviewCount || 0} avis • À partir de ${
        service.price ? `${service.price}€` : "Sur devis"
      }`,
    },

    // Schema.org local business
    alternates: {
      ...metadata.alternates,
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/services/${service.id}`,
    },
  };
}

/**
 * Génère les métadonnées SEO pour une annonce
 * Optimisé pour apparaître dans Google comme Leboncoin/Facebook Marketplace
 */
export function generateAnnouncementMetadata(
  announcement: Publication
): Metadata {
  const metadata = generateAnnouncementSEO(announcement);

  return {
    ...metadata,

    // Métadonnées spécifiques aux annonces/marketplace
    other: {
      ...metadata.other,

      // Signaler à Google que c'est une annonce classée
      "classified:type": "advertisement",
      "classified:category": announcement.category,
      "classified:location": announcement.location,
      "classified:price": announcement.price?.toString(),
      "classified:condition": "varies",

      // Optimisation pour "vendre acheter près de moi"
      "marketplace:type": "listing",
      "marketplace:category": announcement.category.toLowerCase(),
      "marketplace:location": announcement.location,
      "marketplace:seller": announcement.author,

      // Métadonnées de performance
      "listing:views": announcement.viewCount?.toString(),
      "listing:created": announcement.createdAt,
    },

    // OpenGraph optimisé pour les annonces
    openGraph: {
      ...metadata.openGraph,
      title: `💰 ${announcement.title} - ${announcement.category} à ${
        announcement.location || "Guyane"
      }`,
      description: `${announcement.description.substring(0, 120)}... • ${
        announcement.price ? `Prix: ${announcement.price}€` : "Prix à négocier"
      } • ${announcement.viewCount || 0} vues • Vendu par ${
        announcement.author || "Particulier"
      }`,
    },
  };
}

/**
 * Génère les métadonnées SEO pour un produit marketplace
 * Optimisé pour l'e-commerce et les recherches d'achat
 */
export function generateProductMetadata(product: Publication): Metadata {
  const metadata = generateProductSEO(product);

  return {
    ...metadata,

    // Métadonnées spécifiques aux produits e-commerce
    other: {
      ...metadata.other,

      // Rich Snippets pour produits
      "product:price:amount": product.price?.toString(),
      "product:price:currency": "EUR",
      "product:availability": "in stock",
      "product:condition": "new",
      "product:category": product.category,
      "product:brand": "Guyane Marketplace",

      // Optimisation pour les recherches shopping
      "ecommerce:type": "product",
      "ecommerce:category": product.category.toLowerCase(),
      "ecommerce:location": product.location,
      "ecommerce:seller": product.author,

      // Signaux de confiance
      "product:rating": product.rating?.toString(),
      "product:reviews": product.reviewCount?.toString(),
    },

    // OpenGraph optimisé pour les produits
    openGraph: {
      ...metadata.openGraph,
      title: `🛒 ${product.title} - Acheter à ${product.location || "Guyane"}`,
      description: `${product.description.substring(0, 120)}... • ${
        product.price ? `Prix: ${product.price}€` : "Prix sur demande"
      } • ${product.rating ? `⭐ ${product.rating}/5` : ""} ${
        product.reviewCount ? `(${product.reviewCount} avis)` : ""
      }`,
    },
  };
}

/**
 * Génère le JSON-LD pour un service
 */
export function generateServiceJSONLD(service: Publication) {
  return generateJSONLD({
    type: "Service",
    title: service.title,
    description: service.description,
    author: service.author,
    price: service.price,
    location: service.location as any,
    rating: service.rating,
    reviewCount: service.reviewCount,
    availability: "InStock",
  });
}

/**
 * Génère le JSON-LD pour une annonce
 */
export function generateAnnouncementJSONLD(announcement: Publication) {
  return generateJSONLD({
    type: "Product",
    title: announcement.title,
    description: announcement.description,
    price: announcement.price,
    availability: "InStock",
    image: announcement.images?.[0],
  });
}

/**
 * Génère le JSON-LD pour un produit
 */
export function generateProductJSONLD(product: Publication) {
  return generateJSONLD({
    type: "Product",
    title: product.title,
    description: product.description,
    price: product.price,
    availability: "InStock",
    rating: product.rating,
    reviewCount: product.reviewCount,
    image: product.images?.[0],
  });
}

/**
 * Composants pour injecter JSON-LD dans le head
 */
export function ServiceJSONLD({ service }: { service: Publication }) {
  const jsonLD = generateServiceJSONLD(service);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
    />
  );
}

export function AnnouncementJSONLD({
  announcement,
}: {
  announcement: Publication;
}) {
  const jsonLD = generateAnnouncementJSONLD(announcement);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
    />
  );
}

export function ProductJSONLD({ product }: { product: Publication }) {
  const jsonLD = generateProductJSONLD(product);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
    />
  );
}
