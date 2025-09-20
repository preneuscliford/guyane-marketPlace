# Guide Google Tag Manager - Guyane Marketplace

## 🎯 Configuration GTM

Google Tag Manager est configuré avec l'ID : `GTM-TTB35W84`

## 🛠️ Utilisation dans les Composants

### 1. Hook useGTM

```tsx
import { useGTM } from "@/hooks/useGTM";

function ProductPage({ product }) {
  const gtm = useGTM();

  useEffect(() => {
    // Tracker la vue du produit
    gtm.trackViewItem(
      product.id,
      product.title,
      product.category,
      product.price
    );
  }, [product]);

  const handleAddToCart = () => {
    gtm.trackAddToCart(
      product.id,
      product.title,
      product.category,
      product.price
    );
  };

  return <button onClick={handleAddToCart}>Ajouter au panier</button>;
}
```

### 2. Événements E-commerce

```tsx
// Vue d'un produit/service
gtm.trackViewItem("123", "iPhone 14", "Électronique", 800);

// Ajout au panier
gtm.trackAddToCart("123", "iPhone 14", "Électronique", 800, 1);

// Achat
gtm.trackPurchase("ORDER_123", 800, [
  {
    item_id: "123",
    item_name: "iPhone 14",
    category: "Électronique",
    price: 800,
    quantity: 1,
  },
]);
```

### 3. Événements d'Engagement

```tsx
// Recherche
gtm.trackSearch("plombier", "Services", "Cayenne");

// Inscription
gtm.trackSignUp("google");

// Connexion
gtm.trackLogin("email");

// Contact/Lead
gtm.trackContactForm("contact_seller");

// Clic sur publicité
gtm.trackAdClick("ad_123", "Promotion Restaurant", 1);
```

### 4. Événements Spécifiques Marketplace

```tsx
// Réservation de service
gtm.trackServiceBooking("service_456", "Plomberie", 80, "Cayenne");

// Message envoyé
gtm.trackMessageSent("seller");

// Avis laissé
gtm.trackReviewSubmitted("product_123", 5);

// Ajout aux favoris
gtm.trackFavoriteAdded("item_789", "product");

// Partage
gtm.trackShare("product_123", "product", "whatsapp");
```

## 📊 Événements Trackés Automatiquement

### Navigation

- `page_view` - Vue de page automatique
- Changements d'URL pour SPA

### E-commerce Standard

- `view_item` - Vue d'un produit/service
- `add_to_cart` - Ajout panier
- `remove_from_cart` - Suppression panier
- `begin_checkout` - Début commande
- `purchase` - Achat confirmé

### Engagement

- `search` - Recherches utilisateur
- `sign_up` - Inscriptions
- `login` - Connexions
- `generate_lead` - Formulaires de contact
- `share` - Partages sur réseaux sociaux

## 🎯 Configuration Recommandée GTM

### Tags à Créer dans GTM

1. **Google Analytics 4**

   - Configuration Tag
   - Event Tag pour tous les événements

2. **Facebook Pixel**

   - Base Code
   - Purchase Event
   - ViewContent Event

3. **Google Ads Conversion**
   - Purchase Conversion
   - Lead Conversion

### Variables Utiles

```javascript
// Variables de page
{{Page Path}}
{{Page Title}}
{{Page Location}}

// Variables e-commerce
{{Ecommerce - Transaction ID}}
{{Ecommerce - Purchase Value}}
{{Ecommerce - Items}}

// Variables personnalisées Guyane
{{Location - Guyane}} (Cayenne, Kourou, etc.)
{{Category - Marketplace}} (Services, Produits, etc.)
```

### Triggers Importants

- `Page View` - Toutes les pages
- `purchase` - Événement d'achat
- `generate_lead` - Génération de leads
- `sign_up` - Inscriptions utilisateur

## 🔧 Variables d'Environnement

```bash
# Production
NEXT_PUBLIC_GTM_ID=GTM-TTB35W84

# Développement (optionnel - différent container)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## 📈 Métriques Clés à Surveiller

### E-commerce

- Revenus par canal d'acquisition
- Taux de conversion par ville (Cayenne, Kourou, etc.)
- Panier moyen
- Produits/services les plus vus

### Engagement

- Pages vues par session
- Temps sur site
- Taux de rebond par page
- Recherches populaires

### Géolocalisation (Guyane)

- Sessions par ville
- Conversions par région
- Saisonnalité du trafic

## 🚀 Test et Debug

### Mode Preview GTM

1. Aller sur tagmanager.google.com
2. Sélectionner le container GTM-TTB35W84
3. Cliquer "Preview"
4. Naviguer sur mcguyane.com
5. Vérifier que les événements se déclenchent

### Console Browser

```javascript
// Vérifier dataLayer
console.log(window.dataLayer);

// Envoyer un événement de test
window.dataLayer.push({
  event: "test_event",
  category: "test",
  action: "manual_test",
});
```

## 🎯 Optimisations Guyane

### Segments d'Audience

- Visiteurs de Cayenne
- Acheteurs de services
- Utilisateurs récurrents
- Abandons de panier

### Objectifs de Conversion

- Inscription utilisateur
- Première commande
- Contact vendeur
- Avis client déposé

Cette configuration GTM est optimisée pour tracker efficacement les performances de votre marketplace guyanaise ! 🇬🇫
