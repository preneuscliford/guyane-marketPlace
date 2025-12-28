/**
 * Composant pour générer le structured data (JSON-LD) pour les annonces
 * Améliore le SEO en fournissant des données structurées à Google
 */

interface AnnouncementStructuredDataProps {
  announcement: {
    id: string;
    title: string;
    description: string;
    price?: number;
    category: string;
    location?: string;
    createdAt?: string;
    images?: string[];
    author?: string;
  };
}

export function AnnouncementStructuredData({
  announcement,
}: AnnouncementStructuredDataProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mcguyane.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: announcement.title,
    description: announcement.description,
    image: announcement.images?.[0]
      ? `${baseUrl}${announcement.images[0]}`
      : `${baseUrl}/images/annonce-default.jpg`,
    category: announcement.category,
    url: `${baseUrl}/annonces/${announcement.id}`,
    ...(announcement.price && {
      offers: {
        "@type": "Offer",
        price: announcement.price.toString(),
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: `${baseUrl}/annonces/${announcement.id}`,
      },
    }),
    ...(announcement.location && {
      areaServed: {
        "@type": "Place",
        name:
          announcement.location.charAt(0).toUpperCase() +
          announcement.location.slice(1),
        address: {
          "@type": "PostalAddress",
          addressCountry: "GF",
          addressRegion: "Guyane française",
        },
      },
    }),
    ...(announcement.createdAt && {
      datePublished: announcement.createdAt,
      dateModified: announcement.createdAt,
    }),
    ...(announcement.author && {
      seller: {
        "@type": "Person",
        name: announcement.author,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Composant pour générer un collectCollectionPage structure pour les listes d'annonces
 */
interface AnnouncementCollectionStructuredDataProps {
  title: string;
  description: string;
  announcementCount: number;
  url: string;
}

export function AnnouncementCollectionStructuredData({
  title,
  description,
  announcementCount,
  url,
}: AnnouncementCollectionStructuredDataProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mcguyane.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: description,
    url: `${baseUrl}${url}`,
    publisher: {
      "@type": "Organization",
      name: "Guyane Marketplace",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
    },
    mainEntity: {
      "@type": "ItemList",
      name: title,
      description: description,
      numberOfItems: announcementCount,
      url: `${baseUrl}${url}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Composant pour générer un LocalBusiness structure pour la Guyane
 */
export function GuyaneLocalBusinessStructuredData() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mcguyane.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Guyane Marketplace",
    description:
      "Plateforme de petites annonces en Guyane française - Achetez et vendez localement",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/images/guyane-marketplace-og.jpg`,
    areaServed: [
      {
        "@type": "City",
        name: "Cayenne",
      },
      {
        "@type": "City",
        name: "Kourou",
      },
      {
        "@type": "City",
        name: "Saint-Laurent-du-Maroni",
      },
      {
        "@type": "Region",
        name: "Guyane française",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "GF",
      addressRegion: "Guyane française",
      addressLocality: "Cayenne",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "French",
    },
    sameAs: [
      "https://www.facebook.com/mcguyane",
      "https://www.instagram.com/mcguyane",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
