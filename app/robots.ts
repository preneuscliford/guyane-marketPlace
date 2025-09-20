import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mcguyane.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API routes
          '/admin/',         // Pages d'administration
          '/auth/callback',  // Callback OAuth
          '/messages',       // Messages privés
          '/parametres/',    // Paramètres utilisateur
          '/test-upload',    // Page de test
          '/profile/edit',   // Édition profil
          '/*?preview=*',    // Paramètres de preview
          '/private/',       // Dossiers privés
        ],
      },
      // Optimisations spéciales pour Google
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/services/',
          '/services/*',      // Toutes les pages de services
          '/marketplace/',
          '/marketplace/*',   // Tous les produits
          '/annonces/',
          '/annonces/*',      // Toutes les annonces
          '/communaute/',
          '/communaute/*',    // Tous les posts communautaires
          '/publicites/',
          '/images/',         // Images pour Rich Snippets
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/auth/callback',
          '/private/',
        ],
        // Délai recommandé pour éviter la surcharge serveur
        crawlDelay: 1,
      },
      // Règles spécifiques pour les bots de réseaux sociaux
      {
        userAgent: ['facebookexternalhit', 'twitterbot', 'linkedinbot'],
        allow: '/',
      },
      // Règles pour les bots d'indexation d'images
      {
        userAgent: 'Googlebot-Image',
        allow: ['/images/', '/public/', '/icons/'],
      },
      // Optimisations pour Bingbot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}