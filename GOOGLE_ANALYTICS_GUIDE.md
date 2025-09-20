# Guide d'Utilisation Google Analytics - Guyane Marketplace

## 🎯 Configuration Complète

Google Analytics (G-S651THS9H0) est maintenant intégré à votre marketplace guyanaise avec un tracking avancé !

## 📊 Composants Installés

### 1. **GoogleAnalytics Component** (`/components/analytics/GoogleAnalytics.tsx`)

- ✅ Chargement optimisé avec Next.js Script
- ✅ Configuration automatique avec variables d'environnement
- ✅ Désactivé en développement pour éviter pollution des données

### 2. **Hook useGoogleAnalytics** (`/hooks/useGoogleAnalytics.ts`)

- ✅ Fonctions de tracking prêtes à utiliser
- ✅ E-commerce tracking intégré
- ✅ Événements spécifiques marketplace Guyane

### 3. **Variables d'Environnement** (`.env.local`)

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-S651THS9H0
```

## 🛠️ Utilisation dans les Composants

### **Services - Tracking de Vue et Contact**

```tsx
"use client";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";
import { useEffect } from "react";

export default function ServiceDetailPage() {
  const { trackServiceView, trackServiceContact } = useGoogleAnalytics();

  useEffect(() => {
    // Tracker la vue du service
    trackServiceView(
      service.id,
      service.title,
      service.category,
      service.location
    );
  }, [service]);

  const handleContactClick = () => {
    // Tracker le contact
    trackServiceContact(service.id, "message");
    // ... logique de contact
  };

  return (
    <div>
      <h1>{service.title}</h1>
      <button onClick={handleContactClick}>Contacter le prestataire</button>
    </div>
  );
}
```

### **Annonces - Tracking Vue et Intérêt**

```tsx
"use client";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

export default function AnnouncementPage() {
  const { trackAnnouncementView, trackEvent } = useGoogleAnalytics();

  useEffect(() => {
    trackAnnouncementView(
      announcement.id,
      announcement.title,
      announcement.category,
      announcement.price
    );
  }, [announcement]);

  const handlePhoneClick = () => {
    trackEvent({
      action: "click_phone",
      category: "Annonces",
      label: announcement.id,
      value: announcement.price,
    });
  };

  return (
    <div>
      <h1>{announcement.title}</h1>
      <button onClick={handlePhoneClick}>📞 Voir le numéro</button>
    </div>
  );
}
```

### **Communauté - Tracking Posts et Engagement**

```tsx
"use client";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

export default function CommunityPostPage() {
  const { trackCommunityPost, trackEvent } = useGoogleAnalytics();

  useEffect(() => {
    trackCommunityPost(
      post.id,
      post.type, // 'question' ou 'discussion'
      post.category
    );
  }, [post]);

  const handleReply = () => {
    trackEvent({
      action: "reply_post",
      category: "Communauté",
      label: post.type,
    });
  };

  const handleUpvote = () => {
    trackEvent({
      action: "upvote_post",
      category: "Communauté",
      label: post.id,
    });
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <button onClick={handleUpvote}>👍 Voter</button>
      <button onClick={handleReply}>💬 Répondre</button>
    </div>
  );
}
```

### **Recherche - Tracking des Termes**

```tsx
"use client";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

export default function SearchPage() {
  const { trackSearch } = useGoogleAnalytics();

  const handleSearch = (term: string, category: string, location?: string) => {
    trackSearch(term, category, location);

    // ... logique de recherche
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(searchTerm, selectedCategory, selectedLocation);
      }}
    >
      <input value={searchTerm} placeholder="Rechercher en Guyane..." />
      <button type="submit">Rechercher</button>
    </form>
  );
}
```

### **Authentification - Tracking Inscription/Connexion**

```tsx
"use client";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

export default function AuthPage() {
  const { trackUserRegistration, trackUserLogin } = useGoogleAnalytics();

  const handleGoogleSignUp = async () => {
    // ... logique inscription
    trackUserRegistration("google");
  };

  const handleEmailLogin = async () => {
    // ... logique connexion
    trackUserLogin("email");
  };

  return (
    <div>
      <button onClick={handleGoogleSignUp}>S'inscrire avec Google</button>
      <button onClick={handleEmailLogin}>Se connecter par email</button>
    </div>
  );
}
```

## 📈 E-commerce Tracking

### **Marketplace - Tracking Produits**

```tsx
"use client";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

export default function ProductPage() {
  const { trackViewItem, trackAddToCart, trackPurchase } = useGoogleAnalytics();

  useEffect(() => {
    // Vue produit
    trackViewItem({
      item_id: product.id,
      item_name: product.title,
      category: product.category,
      price: product.price,
      quantity: 1,
    });
  }, [product]);

  const handleAddToCart = () => {
    trackAddToCart({
      item_id: product.id,
      item_name: product.title,
      category: product.category,
      price: product.price,
      quantity: 1,
    });
  };

  const handlePurchase = (transactionId: string) => {
    trackPurchase(transactionId, product.price, [
      {
        item_id: product.id,
        item_name: product.title,
        category: product.category,
        price: product.price,
        quantity: 1,
      },
    ]);
  };

  return (
    <div>
      <h1>{product.title}</h1>
      <button onClick={handleAddToCart}>🛒 Ajouter au panier</button>
    </div>
  );
}
```

## 📊 Événements Automatiquement Trackés

### **Pages Vues**

- ✅ Toutes les pages automatiquement
- ✅ URL et titre de page
- ✅ Géolocalisation Guyane

### **Événements Personnalisés Disponibles**

- `view_service` - Vue d'un service
- `contact_service` - Contact prestataire
- `view_announcement` - Vue d'une annonce
- `view_community_post` - Vue post communautaire
- `search` - Recherche effectuée
- `sign_up` - Inscription utilisateur
- `login` - Connexion utilisateur

## 📍 Tracking Spécifique Guyane

### **Géolocalisation**

Chaque événement peut inclure la localisation :

- Cayenne, Kourou, Saint-Laurent-du-Maroni
- Maripasoula, Grand-Santi, Apatou
- Autres communes

### **Catégories Locales**

- Services : Plomberie, Électricité, Ménage, etc.
- Annonces : Immobilier, Véhicules, Emploi, etc.
- Communauté : Questions, Discussions par thème

## 🎯 Métriques Google Analytics

### **Audiences**

- Visiteurs par ville de Guyane
- Utilisateurs récurrents vs nouveaux
- Comportement mobile vs desktop

### **Acquisition**

- Sources de trafic (Google, Facebook, direct)
- Recherches organiques
- Campagnes publicitaires

### **Comportement**

- Pages les plus vues
- Temps passé par section
- Taux de rebond par ville

### **Conversions**

- Inscriptions utilisateurs
- Contacts prestataires
- Vues annonces
- Engagement communauté

## ⚙️ Configuration Google Analytics

### **Objectifs Recommandés**

1. **Inscription** - Événement `sign_up`
2. **Contact Service** - Événement `contact_service`
3. **Engagement Communauté** - Événements `view_community_post`, `reply_post`
4. **E-commerce** - Événements `purchase`, `add_to_cart`

### **Audiences Personnalisées**

1. **Utilisateurs Cayenne** - Location = Cayenne
2. **Chercheurs Services** - Événement `view_service`
3. **Communauté Active** - Événement `view_community_post`
4. **Acheteurs Potentiels** - Événement `view_item`

## 🚀 Prêt pour l'Analyse !

Votre marketplace dispose maintenant d'un tracking Google Analytics complet pour :

- 📊 **Mesurer l'engagement** par ville de Guyane
- 📈 **Optimiser les conversions** services/annonces
- 🎯 **Comprendre le comportement** utilisateurs
- 💰 **Tracker le ROI** des campagnes marketing

Le système est automatiquement désactivé en développement et s'active uniquement en production ! 🇬🇫
