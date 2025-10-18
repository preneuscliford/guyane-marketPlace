import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mcguyane.com';

  // Pages statiques principales
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Pages légales et informatives (importantes pour SEO et confiance)
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // Pages principales de contenu
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/annonces`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/communaute`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/publicites`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/favoris`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Ajout des catégories marketplace (nouvelles routes corrigées)
  const marketplaceCategories = [
    'artisanat', 'agriculture', 'tourisme', 'produits', 
    'restauration', 'evenements', 'bien-etre'
  ];
  
  marketplaceCategories.forEach(category => {
    staticUrls.push({
      url: `${baseUrl}/marketplace/categories/${category}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });
  });

  // Ajout des pages de catégories pour services
  const serviceCategories = [
    'plomberie', 'électricité', 'jardinage', 'ménage', 'réparation',
    'transport', 'informatique', 'beauté', 'santé', 'éducation',
    'immobilier', 'automobile', 'construction', 'artisanat'
  ];
  
  serviceCategories.forEach(category => {
    staticUrls.push({
      url: `${baseUrl}/services?category=${encodeURIComponent(category)}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
  });

  // Ajout des pages de localisation pour chaque ville de Guyane
  const guyaneLocations = [
    'cayenne', 'kourou', 'saint-laurent-du-maroni', 'maripasoula', 
    'grand-santi', 'apatou', 'saint-georges', 'regina', 'roura',
    'sinnamary', 'iracoubo', 'mana', 'awala-yalimapo'
  ];
  
  // Services par ville pour chaque section
  guyaneLocations.forEach(location => {
    ['services', 'marketplace', 'annonces', 'communaute'].forEach(section => {
      staticUrls.push({
        url: `${baseUrl}/${section}?location=${encodeURIComponent(location)}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.6,
      });
    });
  });

  // Ajout des combinaisons ville + catégorie les plus importantes
  const importantCombinations = [
    { location: 'cayenne', category: 'plomberie' },
    { location: 'cayenne', category: 'électricité' },
    { location: 'cayenne', category: 'ménage' },
    { location: 'kourou', category: 'informatique' },
    { location: 'kourou', category: 'transport' },
    { location: 'saint-laurent-du-maroni', category: 'construction' },
  ];

  importantCombinations.forEach(({ location, category }) => {
    ['services', 'marketplace', 'annonces'].forEach(section => {
      staticUrls.push({
        url: `${baseUrl}/${section}?location=${encodeURIComponent(location)}&category=${encodeURIComponent(category)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    });
  });

  console.log(`✅ Sitemap générée avec ${staticUrls.length} URLs statiques et catégories`);

  return staticUrls;
}