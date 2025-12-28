import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  location?: 'cayenne' | 'kourou' | 'saint-laurent' | 'maripasoula' | 'grand-santi' | 'apatou';
  category?: 'marketplace' | 'services' | 'annonces' | 'communaute' | 'publicites';
  image?: string;
  price?: number;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  isProduct?: boolean;
  isService?: boolean;
  canonicalUrl?: string;
  // Nouvelles propriétés pour les publications individuelles
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  contentType?: 'article' | 'question' | 'service' | 'product' | 'announcement' | 'discussion';
  tags?: string[];
  viewCount?: number;
  rating?: number;
  reviewCount?: number;
  isPublicationDetail?: boolean;
}

// Mots-clés géolocalisés pour la Guyane
const LOCATION_KEYWORDS = {
  cayenne: 'Cayenne, centre-ville Cayenne, quartier Cayenne, Guyane française, chef-lieu Guyane, capitale Guyane, agglomération cayennaise, Rémire-Montjoly, Matoury',
  kourou: 'Kourou, base spatiale, centre spatial guyanais, Kourou Guyane, CSG, Ariane, lanceur spatial, ville spatiale, technopole Kourou',
  'saint-laurent': 'Saint-Laurent-du-Maroni, Saint-Laurent Maroni, ouest Guyane, Maroni, frontière Suriname, sous-préfecture ouest',
  maripasoula: 'Maripasoula, sud Guyane, fleuve Maroni, parc amazonien, commune isolée, Haut-Maroni, territoire amérindien',
  'grand-santi': 'Grand-Santi, Maroni, communauté Guyane, Haut-Maroni, villages amérindiens, cultures traditionnelles',
  apatou: 'Apatou, ouest Guyane, fleuve Maroni, frontière Suriname, communauté bushinengue, cultures traditionnelles'
};

// Mots-clés spécifiques aux catégories en Guyane
const CATEGORY_KEYWORDS = {
  marketplace: 'marketplace Guyane, place marché guyanaise, vente achat Guyane, commerce local Guyane, boutique en ligne Guyane, e-commerce Guyane française, marché local guyanais, produits Guyane, articles Guyane',
  services: 'services Guyane, prestataires Guyane, artisans Guyane, professionnels Guyane française, dépannage Guyane, réparation Guyane, maintenance Guyane, travaux Guyane, bricolage Guyane, jardinage Guyane, nettoyage Guyane, transport Guyane, livraison Guyane, cours particuliers Guyane, formation Guyane, consulting Guyane',
  annonces: 'petites annonces Guyane, annonces classées Guyane, vendre acheter Guyane, annonces gratuites Guyane française, vente occasion Guyane, achat occasion Guyane, immobilier Guyane, véhicules Guyane, emploi Guyane, location Guyane, recherche Guyane, offres demandes Guyane',
  communaute: 'communauté Guyane, forums Guyane, échanges habitants Guyane, discussion Guyane, questions réponses Guyane, entraide Guyane, réseau social Guyane, forum guyanais, communauté française outre-mer, échanges locaux, conseils Guyane, expériences Guyane, vie en Guyane, culture guyanaise',
  publicites: 'publicité Guyane, promotion entreprise Guyane, marketing local Guyane, communication Guyane, annonceurs Guyane, visibilité Guyane, business Guyane, référencement local Guyane'
};

// Mots-clés pour types de contenu spécifiques
const CONTENT_TYPE_KEYWORDS = {
  article: 'article Guyane, blog Guyane, information locale, guide pratique Guyane, actualités Guyane, conseils Guyane',
  question: 'question Guyane, aide locale, conseil habitants, réponse communauté, forum discussion, entraide guyanaise, questions pratiques Guyane, vie quotidienne Guyane',
  service: 'service professionnel, prestataire qualifié, artisan local, expert Guyane, professionnel compétent, dépannage rapide, intervention Guyane, maintenance locale, réparation Guyane',
  product: 'produit local, vente Guyane, achat marketplace, article occasion, produit neuf, commerce guyanais, boutique locale',
  announcement: 'annonce gratuite, petite annonce locale, offre Guyane, demande locale, annonce classée, vente particulier, achat direct',
  discussion: 'discussion communauté, échange habitants, forum guyanais, conversation locale, débat Guyane, partage expérience, réseau social local, communauté active'
};

// Mots-clés sectoriels spécifiques à la Guyane
const SECTOR_KEYWORDS = {
  // Services techniques
  technique: 'électricien Guyane, plombier Guyane, climatisation Guyane, dépannage électrique, réparation électroménager, installation sanitaire, maintenance climatisation, technicien Guyane',
  // Construction et rénovation
  construction: 'maçon Guyane, charpentier Guyane, peintre bâtiment, rénovation maison, travaux construction, artisan bâtiment, menuisier Guyane, carreleur Guyane, étanchéité toiture',
  // Transport et logistique
  transport: 'transport Guyane, déménagement Guyane, livraison locale, fret Guyane, transport marchandises, logistique Guyane, coursier Guyane, transport personnes',
  // Services à la personne
  services_personne: 'aide ménagère, garde enfants, soutien scolaire, cours particuliers, jardinage Guyane, nettoyage maison, assistance personnes âgées, baby-sitting Guyane',
  // Santé et bien-être
  sante: 'kinésithérapeute Guyane, massage Guyane, soins esthétiques, coiffeur Guyane, bien-être Guyane, relaxation, thérapie alternative, soins corporels',
  // Informatique et multimédia
  informatique: 'dépannage ordinateur, réparation smartphone, installation réseau, formation informatique, développement web Guyane, maintenance PC, assistance technique IT',
  // Automobile et mécanique
  automobile: 'garage Guyane, mécanicien auto, réparation véhicule, entretien voiture, pneus Guyane, carrosserie Guyane, dépannage auto, contrôle technique',
  // Immobilier
  immobilier: 'agent immobilier Guyane, location appartement Cayenne, vente maison Guyane, location meublée, colocation Guyane, estimation immobilière, gestion locative',
  // Emploi et formation
  emploi: 'emploi Guyane, recrutement local, offre travail, formation professionnelle, stage Guyane, mission intérim, conseil carrière, orientation professionnelle',
  // Loisirs et culture
  loisirs: 'activités loisirs Guyane, sorties culturelles, sport Guyane, randonnée forêt, pêche Guyane, pirogue, excursions nature, animations événements',
  // Artisanat et art local
  artisanat: 'artisanat guyanais, art local, bijoux créoles, sculpture bois, vannerie, poterie traditionnelle, objets décoratifs, souvenirs Guyane',
  // Gastronomie locale
  gastronomie: 'restaurant créole, cuisine guyanaise, traiteur local, produits terroir, épices Guyane, rhum local, spécialités culinaires, chef cuisinier'
};

// Fonction pour obtenir les mots-clés sectoriels
function getSectorKeywords(tags: string[]): string {
  const sectors: string[] = [];
  
  tags.forEach(tag => {
    const tagLower = tag.toLowerCase();
    if (tagLower.includes('électric') || tagLower.includes('plomb') || tagLower.includes('climat')) sectors.push(SECTOR_KEYWORDS.technique);
    if (tagLower.includes('construction') || tagLower.includes('maçon') || tagLower.includes('rénov')) sectors.push(SECTOR_KEYWORDS.construction);
    if (tagLower.includes('transport') || tagLower.includes('livraison') || tagLower.includes('déménag')) sectors.push(SECTOR_KEYWORDS.transport);
    if (tagLower.includes('ménage') || tagLower.includes('garde') || tagLower.includes('jardin')) sectors.push(SECTOR_KEYWORDS.services_personne);
    if (tagLower.includes('santé') || tagLower.includes('massage') || tagLower.includes('coiff')) sectors.push(SECTOR_KEYWORDS.sante);
    if (tagLower.includes('informatique') || tagLower.includes('ordinateur') || tagLower.includes('web')) sectors.push(SECTOR_KEYWORDS.informatique);
    if (tagLower.includes('auto') || tagLower.includes('voiture') || tagLower.includes('mécanique')) sectors.push(SECTOR_KEYWORDS.automobile);
    if (tagLower.includes('immobilier') || tagLower.includes('location') || tagLower.includes('appartement')) sectors.push(SECTOR_KEYWORDS.immobilier);
    if (tagLower.includes('emploi') || tagLower.includes('travail') || tagLower.includes('formation')) sectors.push(SECTOR_KEYWORDS.emploi);
    if (tagLower.includes('loisir') || tagLower.includes('sport') || tagLower.includes('culture')) sectors.push(SECTOR_KEYWORDS.loisirs);
    if (tagLower.includes('artisan') || tagLower.includes('art') || tagLower.includes('créole')) sectors.push(SECTOR_KEYWORDS.artisanat);
    if (tagLower.includes('restaurant') || tagLower.includes('cuisine') || tagLower.includes('traiteur')) sectors.push(SECTOR_KEYWORDS.gastronomie);
  });
  
  return [...new Set(sectors)].join(', ');
}

// Fonction utilitaire pour générer des mots-clés contextuels
export function generateContextualKeywords(context: {
  isHomePage?: boolean;
  isServiceListing?: boolean;
  isAnnouncementListing?: boolean;
  isCommunityPage?: boolean;
  location?: string;
}): string {
  const keywords: string[] = [];
  
  if (context.isHomePage) {
    keywords.push('accueil marketplace Guyane', 'plateforme locale guyanaise', 'commerce en ligne Guyane', 'site petites annonces Guyane', 'forum communauté Guyane');
  }
  
  if (context.isServiceListing) {
    keywords.push('annuaire services Guyane', 'prestataires professionnels', 'artisans qualifiés Guyane', 'services à domicile', 'dépannage rapide Guyane');
  }
  
  if (context.isAnnouncementListing) {
    keywords.push('toutes annonces Guyane', 'vente achat occasion', 'marketplace gratuite', 'annonces particuliers professionnels', 'bons plans Guyane');
  }
  
  if (context.isCommunityPage) {
    keywords.push('forum discussion Guyane', 'questions réponses habitants', 'entraide communautaire', 'conseils vie pratique', 'échanges expériences Guyane');
  }
  
  if (context.location) {
    keywords.push(`services ${context.location}`, `annonces ${context.location}`, `commerce local ${context.location}`, `habitants ${context.location}`);
  }
  
  return keywords.join(', ');
}

// Mots-clés généraux pour la Guyane
const BASE_KEYWORDS = 'Guyane française, DOM-TOM, outre-mer, Amérique Sud, territoire français, Cayenne, Kourou, Saint-Laurent-du-Maroni, commerce local, marketplace guyanaise, petites annonces Guyane, services locaux, forum Guyane, communauté guyanaise, prestations services Guyane, artisans Guyane, professionnels Guyane, vente achat local, économie locale Guyane, réseau guyanais, plateforme échanges Guyane, vie pratique Guyane, habitants Guyane, résidents Guyane, expatriés Guyane, guyanais, culture créole, amazonie, forêt amazonienne, biodiversité Guyane';

/**
 * Génère des métadonnées SEO optimisées pour la Guyane française
 */
export function generateGuyaneSEO({
  title,
  description,
  keywords = '',
  location,
  category,
  image = '/images/guyane-marketplace-og.jpg',
  price,
  availability = 'InStock',
  isProduct = false,
  canonicalUrl,
  // Nouvelles propriétés
  author,
  publishedTime,
  modifiedTime,
  contentType,
  tags = [],
  viewCount,
  rating,
  reviewCount,
  isPublicationDetail = false
}: SEOConfig): Metadata {
  
  // Construction des mots-clés optimisés
  const locationKeywords = location ? LOCATION_KEYWORDS[location] : '';
  const categoryKeywords = category ? CATEGORY_KEYWORDS[category] : '';
  const contentTypeKeywords = contentType ? CONTENT_TYPE_KEYWORDS[contentType] : '';
  const tagsKeywords = tags.join(', ');
  const sectorKeywords = getSectorKeywords(tags);
  
  const combinedKeywords = [BASE_KEYWORDS, locationKeywords, categoryKeywords, contentTypeKeywords, sectorKeywords, tagsKeywords, keywords]
    .filter(Boolean)
    .join(', ');

  // URL de base (sera remplacée par la variable d'env en prod)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mcguyane.com';
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;

  // Titre optimisé avec localisation et type de contenu
  let seoTitle = title;
  if (isPublicationDetail) {
    const locationSuffix = location ? ` - ${location.charAt(0).toUpperCase() + location.slice(1)}` : '';
    const contentSuffix = contentType === 'question' ? ' | Questions & Réponses Guyane' :
                         contentType === 'discussion' ? ' | Discussions Communauté Guyane' :
                         contentType === 'service' ? ' | Services Professionnels Guyane' :
                         contentType === 'announcement' ? ' | Petites Annonces Guyane' :
                         contentType === 'product' ? ' | Marketplace Guyane' : ' | Guyane Marketplace';
    seoTitle = `${title}${locationSuffix}${contentSuffix}`;
  } else {
    seoTitle = location 
      ? `${title} - ${location.charAt(0).toUpperCase() + location.slice(1)} | Guyane Marketplace`
      : `${title} | Guyane Marketplace - Commerce Local Guyane Française`;
  }

  // Description enrichie pour la Guyane avec informations de publication
  let seoDescription = description;
  if (isPublicationDetail) {
    const locationInfo = location ? ` à ${location.charAt(0).toUpperCase() + location.slice(1)}, Guyane française` : ' en Guyane française';
    const engagementInfo = viewCount ? ` • ${viewCount} vues` : '';
    const ratingInfo = rating && reviewCount ? ` • ${rating}★ (${reviewCount} avis)` : '';
    const authorInfo = author ? ` Par ${author}` : '';
    
    seoDescription = `${description}${locationInfo}.${authorInfo}${engagementInfo}${ratingInfo} | Guyane Marketplace - La plateforme locale de Guyane`;
  } else {
    seoDescription = location
      ? `${description} Disponible à ${location.charAt(0).toUpperCase() + location.slice(1)}, Guyane française. Découvrez notre marketplace locale pour acheter et vendre facilement.`
      : `${description} Sur Guyane Marketplace, la première plateforme de commerce local en Guyane française. Cayenne, Kourou, Saint-Laurent et toute la Guyane.`;
  }

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: combinedKeywords,
    
    // Métadonnées géographiques
    other: {
      'geo.region': 'GF',
      'geo.placename': location ? location.charAt(0).toUpperCase() + location.slice(1) : 'Guyane française',
      'geo.position': location === 'cayenne' ? '4.9228;-52.3260' : 
                     location === 'kourou' ? '5.1592;-52.6503' :
                     location === 'saint-laurent' ? '5.5006;-54.0250' : '4.9228;-52.3260',
      'ICBM': location === 'cayenne' ? '4.9228, -52.3260' : 
              location === 'kourou' ? '5.1592, -52.6503' :
              location === 'saint-laurent' ? '5.5006, -54.0250' : '4.9228, -52.3260',
    },

    // Open Graph optimisé
    openGraph: {
      type: 'website',
      locale: 'fr_GF', // Locale spécifique à la Guyane française
      url: fullCanonicalUrl,
      title: seoTitle,
      description: seoDescription,
      siteName: 'Guyane Marketplace',
      images: [
        {
          url: `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
      ...(location && {
        locale: 'fr_GF',
        countryName: 'Guyane française',
      }),
      // Métadonnées pour publications individuelles
      ...(isPublicationDetail && {
        type: 'article',
        ...(author && { authors: [author] }),
        ...(publishedTime && { publishedTime }),
        ...(modifiedTime && { modifiedTime }),
        ...(tags.length > 0 && { tags }),
      }),
    },

    // Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [`${baseUrl}${image}`],
      creator: '@GuyaneMktplace',
    },

    // Canonical URL
    alternates: {
      canonical: fullCanonicalUrl,
    },

    // Métadonnées pour les produits/services
    ...(isProduct && price && {
      other: {
        ...(({}as any).other || {}),
        'product:price:amount': price.toString(),
        'product:price:currency': 'EUR',
        'product:availability': availability,
        'product:condition': 'new',
      }
    }),

    // Robots et indexation
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Templates SEO prédéfinis pour les pages principales
 */
export const SEO_TEMPLATES = {
  home: {
    title: 'Guyane Marketplace - Commerce Local en Guyane Française',
    description: 'La première marketplace de Guyane française. Achetez et vendez localement à Cayenne, Kourou, Saint-Laurent. Services, annonces, publicités locales.',
    category: 'marketplace' as const,
    keywords: 'achat vente Guyane, e-commerce Guyane, plateforme commerce Guyane',
  },

  services: {
    title: 'Services en Guyane - Trouvez des Professionnels Locaux',
    description: 'Découvrez les meilleurs services en Guyane française. Artisans, professionnels, prestataires locaux à Cayenne, Kourou, Saint-Laurent.',
    category: 'services' as const,
    keywords: 'prestataires services Guyane, artisans Guyane, professionnels locaux',
  },

  marketplace: {
    title: 'Marketplace Guyane - Achat Vente Local en Guyane Française',
    description: 'Marketplace locale de Guyane. Achetez et vendez facilement des produits locaux. Livraison possible sur Cayenne, Kourou, Saint-Laurent.',
    category: 'marketplace' as const,
    keywords: 'vente achat produits Guyane, marketplace locale, commerce Guyane',
  },

  annonces: {
    title: 'Petites Annonces Guyane - Annonces Classées Locales | Acheter & Vendre',
    description: 'Petites annonces gratuites en Guyane française. Immobilier, véhicules, emploi, services. Cayenne, Kourou, Saint-Laurent et toute la Guyane. Achetez et vendez localement!',
    category: 'annonces' as const,
    keywords: 'petit annonce guyane, petites annonces guyane française, annonces classées guyane, vendre acheter guyane, petit annonce cayenne, petit annonce kourou, immobilier guyane, emploi guyane, véhicules guyane',
  },

  communaute: {
    title: 'Communauté Guyane - Forums et Échanges Locaux',
    description: 'Rejoignez la communauté guyanaise en ligne. Forums, discussions, échanges entre habitants de Guyane française.',
    category: 'communaute' as const,
    keywords: 'communauté guyanaise, forums Guyane, discussions habitants Guyane',
  },
} as const;

/**
 * Génère le SEO pour une publication de service individuelle
 */
export function generateServiceSEO(service: {
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
}) {
  return generateGuyaneSEO({
    title: `${service.title} - ${service.category}`,
    description: service.description.length > 155 
      ? `${service.description.substring(0, 152)}...` 
      : service.description,
    location: service.location as any,
    category: 'services',
    contentType: 'service',
    author: service.author,
    price: service.price,
    rating: service.rating,
    reviewCount: service.reviewCount,
    viewCount: service.viewCount,
    publishedTime: service.createdAt,
    modifiedTime: service.updatedAt,
    image: service.images?.[0] || '/images/service-default.jpg',
    canonicalUrl: `/services/${service.id}`,
    isProduct: false,
    isService: true,
    isPublicationDetail: true,
    keywords: `${service.category}, service ${service.location}, prestataire ${service.category.toLowerCase()} Guyane`,
    tags: [service.category, service.location || 'Guyane'].filter(Boolean)
  });
}

/**
 * Génère le SEO pour une annonce individuelle
 */
export function generateAnnouncementSEO(announcement: {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  price?: number;
  author?: string;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  images?: string[];
}) {
  return generateGuyaneSEO({
    title: announcement.title,
    description: announcement.description.length > 155 
      ? `${announcement.description.substring(0, 152)}...` 
      : announcement.description,
    location: announcement.location as any,
    category: 'annonces',
    contentType: 'announcement',
    author: announcement.author,
    price: announcement.price,
    viewCount: announcement.viewCount,
    publishedTime: announcement.createdAt,
    modifiedTime: announcement.updatedAt,
    image: announcement.images?.[0] || '/images/annonce-default.jpg',
    canonicalUrl: `/annonces/${announcement.id}`,
    isProduct: true,
    isService: false,
    isPublicationDetail: true,
    keywords: `${announcement.category}, ${announcement.title}, petite annonce ${announcement.location}, vendre acheter ${announcement.category.toLowerCase()}`,
    tags: [announcement.category, announcement.location || 'Guyane'].filter(Boolean)
  });
}

/**
 * Génère le SEO pour un produit marketplace individuel
 */
export function generateProductSEO(product: {
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
}) {
  return generateGuyaneSEO({
    title: product.title,
    description: product.description.length > 155 
      ? `${product.description.substring(0, 152)}...` 
      : product.description,
    location: product.location as any,
    category: 'marketplace',
    contentType: 'product',
    author: product.author,
    price: product.price,
    rating: product.rating,
    reviewCount: product.reviewCount,
    viewCount: product.viewCount,
    publishedTime: product.createdAt,
    modifiedTime: product.updatedAt,
    image: product.images?.[0] || '/images/product-default.jpg',
    canonicalUrl: `/marketplace/${product.id}`,
    isProduct: true,
    isService: false,
    isPublicationDetail: true,
    keywords: `${product.title}, ${product.category}, acheter ${product.category.toLowerCase()} ${product.location}, marketplace Guyane`,
    tags: [product.category, product.location || 'Guyane'].filter(Boolean)
  });
}

/**
 * Génère le SEO pour un post communautaire individuel
 */
export function generateCommunityPostSEO(post: {
  id: string;
  title: string;
  content: string;
  category?: string;
  location?: string;
  author?: string;
  viewCount?: number;
  replyCount?: number;
  createdAt?: string;
  updatedAt?: string;
  isQuestion?: boolean;
}) {
  const contentType = post.isQuestion ? 'question' : 'discussion';
  const categoryTitle = post.isQuestion ? 'Question' : 'Discussion';
  
  return generateGuyaneSEO({
    title: `${post.title} - ${categoryTitle} Communauté Guyane`,
    description: post.content.length > 155 
      ? `${post.content.substring(0, 152)}...` 
      : post.content,
    location: post.location as any,
    category: 'communaute',
    contentType,
    author: post.author,
    reviewCount: post.replyCount,
    viewCount: post.viewCount,
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt,
    image: '/images/community-default.jpg',
    canonicalUrl: `/communaute/${post.id}`,
    isProduct: false,
    isService: false,
    isPublicationDetail: true,
    keywords: `${post.title}, ${post.isQuestion ? 'question réponse' : 'discussion'} ${post.location}, communauté Guyane, forum ${post.category}`,
    tags: [post.category, post.location, post.isQuestion ? 'Question' : 'Discussion'].filter(Boolean) as string[]
  });
}

/**
 * Génère un JSON-LD pour le référencement structuré
 */
export function generateJSONLD(config: SEOConfig & {
  type: 'Organization' | 'Product' | 'Service' | 'WebPage' | 'BreadcrumbList' | 'Article' | 'QAPage' | 'DiscussionForumPosting';
  breadcrumbs?: { name: string; url: string }[];
  faqItems?: { question: string; answer: string }[];
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mcguyane.com';

  const baseOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Guyane Marketplace",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+594-XX-XX-XX-XX",
      "contactType": "customer service",
      "areaServed": "GF",
      "availableLanguage": "French"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GF",
      "addressRegion": "Guyane française",
      "addressLocality": "Cayenne"
    }
  };

  switch (config.type) {
    case 'Article':
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": config.title,
        "description": config.description,
        "image": config.image ? `${baseUrl}${config.image}` : undefined,
        "author": {
          "@type": "Person",
          "name": config.author || "Guyane Marketplace"
        },
        "publisher": baseOrganization,
        "datePublished": config.publishedTime,
        "dateModified": config.modifiedTime,
        "locationCreated": {
          "@type": "Place",
          "name": config.location ? config.location.charAt(0).toUpperCase() + config.location.slice(1) : "Guyane française",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "GF",
            "addressRegion": "Guyane française"
          }
        },
        "keywords": config.keywords,
        "interactionStatistic": config.viewCount ? {
          "@type": "InteractionCounter", 
          "interactionType": "https://schema.org/ViewAction",
          "userInteractionCount": config.viewCount
        } : undefined
      };

    case 'QAPage':
      return {
        "@context": "https://schema.org",
        "@type": "QAPage",
        "mainEntity": {
          "@type": "Question",
          "name": config.title,
          "text": config.description,
          "answerCount": config.reviewCount || 0,
          "author": {
            "@type": "Person",
            "name": config.author || "Utilisateur Guyane Marketplace"
          },
          "dateCreated": config.publishedTime,
          "location": config.location ? {
            "@type": "Place",
            "name": config.location.charAt(0).toUpperCase() + config.location.slice(1),
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "GF",
              "addressRegion": "Guyane française"
            }
          } : undefined
        }
      };

    case 'DiscussionForumPosting':
      return {
        "@context": "https://schema.org",
        "@type": "DiscussionForumPosting",
        "headline": config.title,
        "text": config.description,
        "author": {
          "@type": "Person",
          "name": config.author || "Membre Communauté Guyane"
        },
        "datePublished": config.publishedTime,
        "dateModified": config.modifiedTime,
        "isPartOf": {
          "@type": "WebSite",
          "name": "Guyane Marketplace - Communauté",
          "url": `${baseUrl}/communaute`
        },
        "location": config.location ? {
          "@type": "Place", 
          "name": config.location.charAt(0).toUpperCase() + config.location.slice(1),
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "GF",
            "addressRegion": "Guyane française"
          }
        } : undefined,
        "interactionStatistic": config.viewCount ? {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/ViewAction", 
          "userInteractionCount": config.viewCount
        } : undefined
      };

    case 'Service':
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": config.title,
        "description": config.description,
        "image": config.image ? `${baseUrl}${config.image}` : undefined,
        "provider": {
          "@type": "Person",
          "name": config.author || "Prestataire Guyane Marketplace"
        },
        "areaServed": {
          "@type": "Place",
          "name": config.location ? config.location.charAt(0).toUpperCase() + config.location.slice(1) : "Guyane française",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "GF",
            "addressRegion": "Guyane française"
          }
        },
        "offers": config.price ? {
          "@type": "Offer",
          "price": config.price,
          "priceCurrency": "EUR",
          "availability": `https://schema.org/${config.availability}`
        } : undefined,
        "aggregateRating": config.rating && config.reviewCount ? {
          "@type": "AggregateRating",
          "ratingValue": config.rating,
          "reviewCount": config.reviewCount,
          "bestRating": 5,
          "worstRating": 1
        } : undefined
      };

    case 'Product':
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": config.title,
        "description": config.description,
        "image": `${baseUrl}${config.image}`,
        "offers": {
          "@type": "Offer",
          "price": config.price,
          "priceCurrency": "EUR",
          "availability": `https://schema.org/${config.availability}`,
          "areaServed": {
            "@type": "Country",
            "name": "Guyane française"
          }
        },
        "aggregateRating": config.rating && config.reviewCount ? {
          "@type": "AggregateRating", 
          "ratingValue": config.rating,
          "reviewCount": config.reviewCount,
          "bestRating": 5,
          "worstRating": 1
        } : undefined
      };

    case 'BreadcrumbList':
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": config.breadcrumbs?.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": `${baseUrl}${crumb.url}`
        }))
      };

    default:
      return baseOrganization;
  }
}

// Configurations SEO prédéfinies pour les pages principales
export const PAGE_SEO_CONFIGS = {
  home: {
    title: "Guyane Marketplace - Commerce Local, Petites Annonces & Forum",
    description: "La première plateforme de commerce local en Guyane française. Petites annonces gratuites, services professionnels, forum communautaire. Cayenne, Kourou, Saint-Laurent et toute la Guyane.",
    keywords: generateContextualKeywords({ isHomePage: true }),
    category: 'marketplace' as const
  },
  
  services: {
    title: "Services Professionnels en Guyane - Artisans & Prestataires",
    description: "Trouvez tous les services professionnels en Guyane française : artisans, dépannage, maintenance, cours, transport. Prestataires qualifiés à Cayenne, Kourou et dans toute la Guyane.",
    keywords: generateContextualKeywords({ isServiceListing: true }),
    category: 'services' as const
  },
  
  annonces: {
    title: "Petites Annonces Gratuites Guyane - Vente & Achat Local",
    description: "Petites annonces gratuites en Guyane française : vente, achat, location, emploi. Annonces de particuliers et professionnels à Cayenne, Kourou, Saint-Laurent et toute la Guyane.",
    keywords: generateContextualKeywords({ isAnnouncementListing: true }),
    category: 'annonces' as const
  },
  
  communaute: {
    title: "Forum Communauté Guyane - Questions, Conseils & Échanges",
    description: "Forum de discussion et d'entraide pour les habitants de Guyane française. Questions-réponses, conseils pratiques, échanges d'expériences entre guyanais. Communauté active et bienveillante.",
    keywords: generateContextualKeywords({ isCommunityPage: true }),
    category: 'communaute' as const
  },
  
  marketplace: {
    title: "Marketplace Guyane - Boutique en Ligne Locale",
    description: "Marketplace locale de Guyane française : achetez et vendez facilement en ligne. Produits locaux, articles neufs et d'occasion, commerce équitable et responsable. Livraison en Guyane.",
    keywords: generateContextualKeywords({ isHomePage: true }),
    category: 'marketplace' as const
  }
};

// Fonction pour obtenir la configuration SEO d'une page
export function getPageSEOConfig(pageName: keyof typeof PAGE_SEO_CONFIGS, location?: string) {
  const baseConfig = PAGE_SEO_CONFIGS[pageName];
  const locationKeywords = location ? generateContextualKeywords({ location }) : '';
  
  return {
    ...baseConfig,
    keywords: [baseConfig.keywords, locationKeywords].filter(Boolean).join(', '),
    location: location as any
  };
}