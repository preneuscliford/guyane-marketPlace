# Guide SEO - Guyane Marketplace

## 🎯 Optimisation SEO pour la Guyane Française

Ce système SEO a été spécialement conçu pour cibler le marché guyanais avec des mots-clés locaux et des métadonnées optimisées.

## 📋 Fonctionnalités SEO Implémentées

### ✅ Métadonnées Dynamiques

- Titres optimisés avec géolocalisation
- Descriptions enrichies pour la Guyane
- Mots-clés spécifiques par ville (Cayenne, Kourou, Saint-Laurent)
- Open Graph et Twitter Cards

### ✅ Données Structurées (JSON-LD)

- Organisation (Guyane Marketplace)
- Produits et services avec prix en EUR
- Breadcrumbs pour la navigation
- Informations géographiques (Guyane française)

### ✅ SEO Technique

- Sitemap.xml automatique
- Robots.txt optimisé
- URLs canoniques
- Métadonnées géographiques

## 🛠️ Utilisation

### 1. Pages avec SEO automatique

Les pages suivantes ont déjà leur SEO configuré :

- `/` - Page d'accueil
- `/services` - Services en Guyane
- `/marketplace` - Marketplace locale
- `/annonces` - Petites annonces
- `/communaute` - Communauté guyanaise

### 2. SEO pour une page produit/service

```tsx
import { Metadata } from "next";
import { generateGuyaneSEO } from "@/lib/seo";

export const metadata: Metadata = generateGuyaneSEO({
  title: "Service de plomberie à Cayenne",
  description: "Plombier professionnel à Cayenne, intervention rapide 24h/24",
  location: "cayenne",
  category: "services",
  price: 50,
  isService: true,
  canonicalUrl: "/services/plomberie-cayenne",
});
```

### 3. Ajouter des breadcrumbs

```tsx
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export default function ServicePage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Services", url: "/services" },
          { name: "Cayenne", url: "/services?location=cayenne" },
          { name: "Plomberie", url: "/services/plomberie-cayenne" },
        ]}
      />
      {/* Contenu de la page */}
    </>
  );
}
```

### 4. Données structurées pour produits

```tsx
import StructuredData from "@/components/seo/StructuredData";

<StructuredData
  type="Product"
  title="iPhone 14 - Cayenne"
  description="iPhone 14 en excellent état, vendu à Cayenne"
  price={800}
  availability="InStock"
  location="cayenne"
/>;
```

## 🌍 Localisations Supportées

- `cayenne` - Cayenne (capitale)
- `kourou` - Kourou (base spatiale)
- `saint-laurent` - Saint-Laurent-du-Maroni
- `maripasoula` - Maripasoula
- `grand-santi` - Grand-Santi
- `apatou` - Apatou

## 🏷️ Catégories SEO

- `marketplace` - Commerce général
- `services` - Services et artisans
- `annonces` - Petites annonces
- `communaute` - Forums et communauté
- `publicites` - Publicités locales

## 📊 Mots-clés Ciblés

### Généraux

- Guyane française, DOM-TOM, outre-mer
- Commerce local, marketplace guyanaise
- Cayenne, Kourou, Saint-Laurent-du-Maroni

### Par Catégorie

- **Services** : artisans Guyane, prestataires locaux, professionnels Cayenne
- **Marketplace** : achat vente Guyane, e-commerce local, produits guyanais
- **Annonces** : petites annonces gratuites, annonces classées Guyane

## 🚀 Performance SEO

### Techniques Implémentées

- Compression d'images automatique
- Lazy loading
- URLs conviviales
- Temps de chargement optimisé
- Mobile-first design

### Balises Meta Spéciales

- Géolocalisation (coordonnées GPS)
- Devise (EUR)
- Langue (fr_GF pour Guyane française)
- Fuseau horaire (America/Cayenne)

## 📈 Suivi et Analytics

### À configurer

1. Google Search Console
2. Google Analytics 4
3. Google My Business (si applicable)
4. Monitoring des positions

### KPIs à surveiller

- Positionnement sur "marketplace Guyane"
- Trafic organique local
- Conversions par ville
- Taux de clics depuis les recherches

## 🔧 Maintenance

### Mise à jour régulière

- Sitemap automatiquement regénéré
- Nouvelles pages ajoutées au SEO
- Optimisation continue des mots-clés
- Tests de vitesse mensuels

### Optimisations futures

- [ ] Schema.org plus avancé
- [ ] AMP pages (si nécessaire)
- [ ] PWA optimisations
- [ ] Images WebP/AVIF
