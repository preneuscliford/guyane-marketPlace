# Guide d'Implémentation SEO - Publications Individuelles

## 🎯 Objectif

Faire apparaître chaque service, annonce, produit et post communautaire individuellement dans Google, comme Reddit, Leboncoin ou Amazon.

## 📋 Composants SEO Disponibles

### 1. Système SEO Avancé (`/lib/seo.ts`)

- `generateServiceSEO()` - Pour les services
- `generateAnnouncementSEO()` - Pour les annonces
- `generateProductSEO()` - Pour les produits marketplace
- `generateCommunityPostSEO()` - Pour les posts communautaires

### 2. Composants de Métadonnées

- `CommunityPostSEO.tsx` - SEO spécialisé communauté
- `PublicationSEO.tsx` - SEO services, annonces, produits

### 3. Données Structurées JSON-LD

- `ServiceJSONLD` - Schema.org pour services
- `AnnouncementJSONLD` - Schema.org pour annonces
- `ProductJSONLD` - Schema.org pour produits
- `CommunityPostJSONLD` - Schema.org pour Q&A et discussions

## 🛠️ Implémentation par Section

### Services (`/services/[id]/page.tsx`)

```tsx
import {
  generateServiceMetadata,
  ServiceJSONLD,
} from "@/components/seo/PublicationSEO";

// Génération des métadonnées côté serveur
export async function generateMetadata({ params }: { params: { id: string } }) {
  // Récupérer les données du service
  const service = await getServiceById(params.id);

  if (!service) {
    return { title: "Service non trouvé" };
  }

  return generateServiceMetadata({
    id: service.id,
    title: service.title,
    description: service.description,
    category: service.category,
    location: service.location,
    price: service.price,
    author: service.profiles?.username,
    rating: service.average_rating,
    reviewCount: service.review_count,
    viewCount: service.view_count,
    createdAt: service.created_at,
    updatedAt: service.updated_at,
    images: service.images,
  });
}

export default function ServiceDetailPage() {
  // ... code existant ...

  return (
    <>
      {/* Injection JSON-LD */}
      <ServiceJSONLD service={serviceData} />

      {/* Contenu de la page */}
      <div>
        <h1>{service.title}</h1>
        {/* ... reste du contenu ... */}
      </div>
    </>
  );
}
```

### Annonces (`/annonces/[id]/page.tsx`)

```tsx
import {
  generateAnnouncementMetadata,
  AnnouncementJSONLD,
} from "@/components/seo/PublicationSEO";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const announcement = await getAnnouncementById(params.id);

  if (!announcement) {
    return { title: "Annonce non trouvée" };
  }

  return generateAnnouncementMetadata({
    id: announcement.id,
    title: announcement.title,
    description: announcement.description,
    category: announcement.category,
    location: announcement.location,
    price: announcement.price,
    author: announcement.profiles?.username,
    viewCount: announcement.view_count,
    createdAt: announcement.created_at,
    updatedAt: announcement.updated_at,
    images: announcement.images,
  });
}

export default function AnnouncementDetailPage() {
  return (
    <>
      <AnnouncementJSONLD announcement={announcementData} />
      {/* Contenu de l'annonce */}
    </>
  );
}
```

### Marketplace (`/marketplace/[id]/page.tsx`)

```tsx
import {
  generateProductMetadata,
  ProductJSONLD,
} from "@/components/seo/PublicationSEO";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    return { title: "Produit non trouvé" };
  }

  return generateProductMetadata({
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.category,
    location: product.location,
    price: product.price,
    author: product.profiles?.username,
    rating: product.average_rating,
    reviewCount: product.review_count,
    viewCount: product.view_count,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    images: product.images,
  });
}

export default function ProductDetailPage() {
  return (
    <>
      <ProductJSONLD product={productData} />
      {/* Contenu du produit */}
    </>
  );
}
```

### Communauté (`/communaute/[id]/page.tsx`)

```tsx
import {
  generateCommunityPostMetadata,
  CommunityPostJSONLD,
} from "@/components/seo/CommunityPostSEO";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getCommunityPostById(params.id);

  if (!post) {
    return { title: "Post non trouvé" };
  }

  return generateCommunityPostMetadata({
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    location: post.location,
    author: post.profiles?.username,
    viewCount: post.view_count,
    replyCount: post.reply_count,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    isQuestion: post.type === "question",
    tags: post.tags,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
  });
}

export default function CommunityPostDetailPage() {
  return (
    <>
      <CommunityPostJSONLD post={postData} />
      {/* Contenu du post */}
    </>
  );
}
```

## 🎯 Optimisations Spéciales Communauté (comme Reddit)

### 1. Structure des Titres

```tsx
// Pour les questions
title: "❓ Comment trouver un bon plombier à Cayenne? - Question Guyane";

// Pour les discussions
title: "💬 Meilleurs restaurants créoles à Kourou - Discussion Guyane";
```

### 2. Descriptions Riches

```tsx
description: "Question posée par Jean123 de la communauté Guyane. Je cherche un plombier fiable à Cayenne pour une urgence... • 5 réponses • 124 vues • Communauté Guyane Marketplace";
```

### 3. Métadonnées d'Engagement

```tsx
'og:engagement': viewCount?.toString(),
'og:replies': replyCount?.toString(),
'content:score': (upvotes - downvotes).toString(),
```

## 📊 Résultats Attendus dans Google

### Services

```
🔧 Réparation climatisation Cayenne - Service Réparation à Cayenne | Guyane...
Réparation de climatisation à domicile à Cayenne, Guyane française. Par TechClim973 • ⭐ 4.8/5 (12 avis) • À partir de 60€ | Guyane Marketplace
www.mcguyane.com/services/abc123 • Cayenne, Guyane française
```

### Annonces

```
💰 iPhone 14 Pro Max 256Go - Téléphone à Cayenne | Petites Annonces Guyane
iPhone 14 Pro Max 256Go en excellent état à Cayenne, Guyane française. Prix: 900€ • 45 vues • Vendu par particulier | Guyane Marketplace
www.mcguyane.com/annonces/def456 • Cayenne, Guyane française
```

### Communauté

```
❓ Où trouver des légumes bio à Kourou? - Question Communauté Guyane
Question posée par Marie973 de la communauté Guyane. Je recherche un endroit pour acheter des légumes bio à Kourou... • 8 réponses • 67 vues
www.mcguyane.com/communaute/ghi789 • Kourou, Guyane française
```

## 🚀 Optimisations Avancées

### 1. URLs Sémantiques

Si possible, ajouter des slugs aux URLs :

- `/services/reparation-climatisation-cayenne-abc123`
- `/annonces/iphone-14-pro-max-cayenne-def456`
- `/communaute/legumes-bio-kourou-ghi789`

### 2. Images Optimisées

```tsx
// Dans les métadonnées
image: service.images?.[0] || "/images/service-default.jpg",
  (
    // Avec alt text SEO
    <Image
      src={image}
      alt={`${service.title} - Service ${service.category} à ${service.location}`}
    />
  );
```

### 3. Breadcrumbs JSON-LD

```tsx
const breadcrumbs = [
  { name: "Accueil", url: "/" },
  { name: "Services", url: "/services" },
  { name: service.category, url: `/services?category=${service.category}` },
  { name: service.location, url: `/services?location=${service.location}` },
  { name: service.title, url: `/services/${service.id}` },
];
```

## ✅ Checklist d'Implémentation

### Services

- [ ] Métadonnées dynamiques avec `generateServiceMetadata()`
- [ ] JSON-LD Service avec `ServiceJSONLD`
- [ ] Titre optimisé avec émoji et localisation
- [ ] Description avec prix, avis, localisation
- [ ] Images avec alt text SEO

### Annonces

- [ ] Métadonnées dynamiques avec `generateAnnouncementMetadata()`
- [ ] JSON-LD Product avec `AnnouncementJSONLD`
- [ ] Rich snippets avec prix et condition
- [ ] Optimisation "près de moi" dans keywords

### Communauté

- [ ] Métadonnées spécialisées Q&A avec `generateCommunityPostMetadata()`
- [ ] Distinction questions/discussions avec émojis
- [ ] JSON-LD QAPage ou DiscussionForumPosting
- [ ] Métriques d'engagement dans description
- [ ] Tags et catégories dans métadonnées

### Global

- [ ] Sitemap.xml inclut toutes les publications
- [ ] Robots.txt optimisé pour crawler les détails
- [ ] OpenGraph images pour partage social
- [ ] Schema.org breadcrumbs sur toutes les pages

Avec cette implémentation, chaque publication apparaîtra individuellement dans Google avec des Rich Snippets optimisés ! 🇬🇫
