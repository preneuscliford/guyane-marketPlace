// Exemples d'utilisation des améliorations SEO pour Guyane Marketplace

import { generateGuyaneSEO, getPageSEOConfig, generateContextualKeywords } from '@/lib/seo';

// ========================================
// EXEMPLES D'UTILISATION DES MOTS-CLÉS AMÉLIORÉS
// ========================================

// 1. Page d'accueil avec SEO optimisé
export const homePageSEO = generateGuyaneSEO({
  title: "Accueil",
  description: "Bienvenue sur Guyane Marketplace, votre plateforme locale de commerce, services et échanges communautaires",
  category: 'marketplace',
  location: 'cayenne'
});

// 2. Service de plomberie à Kourou avec mots-clés sectoriels
export const plumberServiceSEO = generateGuyaneSEO({
  title: "Plombier Expert - Dépannage Rapide",
  description: "Service de plomberie professionnel : dépannage, installation, réparation sanitaire. Intervention rapide et devis gratuit.",
  category: 'services',
  location: 'kourou',
  contentType: 'service',
  tags: ['plomberie', 'dépannage', 'installation sanitaire', 'réparation'],
  isService: true,
  rating: 4.8,
  reviewCount: 23
});

// 3. Annonce de vente de voiture avec géolocalisation
export const carAnnouncementSEO = generateGuyaneSEO({
  title: "Peugeot 208 - 2018 - Excellent État",
  description: "Vends Peugeot 208 de 2018, 85000 km, excellent état, entretien suivi, toutes options. Visible à Saint-Laurent.",
  category: 'annonces',
  location: 'saint-laurent',
  contentType: 'announcement',
  tags: ['automobile', 'peugeot', 'voiture occasion', 'véhicule'],
  price: 12500,
  availability: 'InStock',
  isProduct: true
});

// 4. Discussion communautaire sur la vie en Guyane
export const communityDiscussionSEO = generateGuyaneSEO({
  title: "Conseils pour nouveaux arrivants en Guyane",
  description: "Discussion ouverte pour partager des conseils pratiques aux personnes qui s'installent en Guyane française",
  category: 'communaute',
  contentType: 'discussion',
  tags: ['conseil', 'installation', 'vie pratique', 'nouveaux arrivants'],
  author: "Marie G.",
  publishedTime: "2025-01-15T10:30:00Z",
  viewCount: 156,
  isPublicationDetail: true
});

// 5. Page listant tous les services à Cayenne
export const serviceListingCayenne = generateGuyaneSEO({
  title: "Tous les Services Professionnels à Cayenne",
  description: "Découvrez tous les services professionnels disponibles à Cayenne : artisans, dépannage, cours particuliers, transport et bien plus.",
  category: 'services',
  location: 'cayenne',
  keywords: generateContextualKeywords({ 
    isServiceListing: true, 
    location: 'cayenne' 
  })
});

// ========================================
// UTILISATION DES CONFIGURATIONS PRÉDÉFINIES
// ========================================

// Configuration rapide pour la page des services
export const servicesPageConfig = getPageSEOConfig('services', 'kourou');

// Configuration pour la page communauté
export const communityPageConfig = getPageSEOConfig('communaute');

// Configuration pour les annonces
export const announcesPageConfig = getPageSEOConfig('annonces', 'saint-laurent');

// ========================================
// EXEMPLES DE MOTS-CLÉS CONTEXTUELS
// ========================================

// Mots-clés pour une page d'accueil localisée
export const homeKeywordsCayenne = generateContextualKeywords({ 
  isHomePage: true, 
  location: 'cayenne' 
});

// Mots-clés pour une page de services spécialisée
export const serviceKeywordsKourou = generateContextualKeywords({ 
  isServiceListing: true, 
  location: 'kourou' 
});

// ========================================
// EXEMPLE D'UTILISATION DANS UNE PAGE NEXT.JS
// ========================================

/*
// Dans app/services/page.tsx
import { generateGuyaneSEO, getPageSEOConfig } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata({ 
  searchParams 
}: { 
  searchParams: { location?: string } 
}): Promise<Metadata> {
  const location = searchParams.location as any;
  const seoConfig = getPageSEOConfig('services', location);
  
  return generateGuyaneSEO({
    ...seoConfig,
    canonicalUrl: location ? `/services?location=${location}` : '/services'
  });
}

export default function ServicesPage() {
  // Composant de la page...
}
*/

// ========================================
// CONSEILS D'OPTIMISATION
// ========================================

/*
MOTS-CLÉS MAINTENANT COUVERTS :

✅ Petites annonces Guyane : "petites annonces Guyane", "annonces gratuites Guyane française", "vente achat local"
✅ Prestations de services : "services Guyane", "prestataires professionnels", "artisans qualifiés Guyane" 
✅ Forum de discussion : "forum discussion Guyane", "communauté guyanaise", "échanges habitants"
✅ Géolocalisation : Cayenne, Kourou, Saint-Laurent, Maripasoula, etc.
✅ Secteurs spécialisés : électricité, plomberie, construction, transport, informatique, etc.
✅ Aspects culturels : "culture créole", "artisanat guyanais", "cuisine guyanaise"

UTILISATION RECOMMANDÉE :
1. Utilisez getPageSEOConfig() pour les pages principales
2. Utilisez generateGuyaneSEO() avec tags spécifiques pour le contenu détaillé  
3. Ajoutez toujours la localisation quand c'est pertinent
4. Incluez des tags descriptifs pour déclencher les mots-clés sectoriels
*/

const seoExamples = {};
export default seoExamples;