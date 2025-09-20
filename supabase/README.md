# 🗄️ Scripts de Gestion des Données - Guyane Marketplace

Ce dossier contient les scripts SQL pour gérer les données de démonstration et le nettoyage de la base de données.

## 📁 Fichiers

### `seed-demo-data.sql`

Script pour ajouter des données d'exemple réalistes à la base de données.

**Contenu :**

- ✅ **10 services** diversifiés (informatique, éducation, beauté, construction, transport, événementiel)
- ✅ **10 annonces** variées (véhicules, immobilier, électronique, maison & jardin, loisirs)
- ✅ **5 avis clients** authentiques pour crédibiliser les services
- ✅ **Données de vues** simulées pour l'activité
- ✅ **Nettoyage** automatique des anciennes données de test

### `clean-database.sql`

Script pour nettoyer complètement la base de données (⚠️ **Attention : supprime toutes les données**)

### `20240120000000_improve_views_system.sql`

Migration existante pour améliorer le système de vues.

## 🚀 Utilisation

### Pour ajouter des données d'exemple

1. Connectez-vous à votre interface Supabase
2. Allez dans "SQL Editor"
3. Copiez le contenu de `seed-demo-data.sql`
4. Exécutez le script
5. Vérifiez que les données ont été ajoutées correctement

### Pour nettoyer complètement la base (⚠️ Développement uniquement)

1. **ATTENTION**: Ce script supprime TOUTES les données utilisateur
2. Utilisez uniquement en environnement de développement
3. Copiez le contenu de `clean-database.sql`
4. Exécutez le script dans l'éditeur SQL Supabase
5. Nettoyez manuellement les buckets de stockage via l'interface

## 📊 Données d'Exemple Détaillées

### Services (10 entrées)

- **Informatique** : Réparation PC/smartphones, développement web
- **Éducation** : Cours de maths, cours de créole guyanais
- **Beauté** : Coiffure afro/européenne, massages bien-être
- **Construction** : Électricité, plomberie
- **Transport** : Déménagement, transport de marchandises
- **Événementiel** : Organisation mariage créole

### Annonces (10 entrées)

- **Véhicules** : Toyota Hilux 4x4, Scooter Yamaha
- **Immobilier** : Villa F4 piscine, Appartement T3 centre
- **Électronique** : iPhone 14 Pro, PC Gamer complet
- **Maison & Jardin** : Mobilier teck, Générateur Honda
- **Loisirs** : Kayak 2 places, VTT électrique Trek

### Caractéristiques Réalistes

- 🏛️ **Villes guyanaises** : Cayenne, Kourou, Matoury, Saint-Laurent-du-Maroni...
- 💰 **Prix du marché** : Tarifs correspondant à l'économie guyanaise
- 📱 **Contacts locaux** : Numéros 0594/0694, emails .gf/.com
- 🌴 **Contexte tropical** : Services adaptés au climat, problématiques locales
- 🎯 **Diversité culturelle** : Reflet de la richesse multiculturelle guyanaise

## 🔍 Vérification Post-Exécution

Après avoir exécuté `seed-demo-data.sql`, vérifiez dans Supabase :

```sql
-- Vérification des services
SELECT count(*) as services_count FROM services WHERE id LIKE 'service-%';

-- Vérification des annonces
SELECT count(*) as announcements_count FROM announcements WHERE id LIKE 'announce-%';

-- Vérification des avis
SELECT count(*) as reviews_count FROM reviews WHERE service_id LIKE 'service-%';

-- Vue d'ensemble
SELECT
  'Services' as type, count(*) as count FROM services
UNION ALL
SELECT 'Annonces' as type, count(*) as count FROM announcements
UNION ALL
SELECT 'Avis' as type, count(*) as count FROM reviews;
```

## 🏗️ Structure des Données

### Services

- **ID** : Format `service-001` à `service-010`
- **Catégories** : informatique, education, beaute, construction, transport, evenementiel
- **Tarification** : hourly (€/heure) ou fixed (prix fixe)
- **Localisation** : Principales communes de Guyane
- **Images** : URLs Unsplash haute qualité
- **Métadonnées** : Disponibilités, contact, tags

### Annonces

- **ID** : Format `announce-001` à `announce-010`
- **Catégories** : Véhicules, Immobilier, Électronique, Maison & Jardin, Loisirs
- **Prix** : Gamme réaliste 680€ - 285,000€
- **Descriptions** : Détaillées avec spécifications techniques
- **Images** : Visuels représentatifs de qualité

## 💡 Conseils d'Utilisation

### Pour le Développement

1. Utilisez `seed-demo-data.sql` pour avoir des données de test cohérentes
2. Les données respectent les contraintes de votre schéma de base
3. Parfait pour tester les hooks TanStack Query

### Pour la Production

1. **Ne jamais** utiliser `clean-database.sql` en production
2. Adaptez les données d'exemple selon vos besoins spécifiques
3. Modifiez les URLs d'images pour pointer vers votre CDN

### Pour les Tests

1. Les données incluent des relations (services ↔ avis ↔ utilisateurs)
2. Statistiques de vues simulées pour tester les analytics
3. Données multilingues (français, quelques termes créoles)

---

## 🚨 Avertissements Importants

- ⚠️ **`clean-database.sql`** supprime TOUTES les données utilisateur
- 🔄 **Toujours faire une sauvegarde** avant d'exécuter des scripts de nettoyage
- 🏭 **Environnement de développement uniquement** pour le nettoyage complet
- 📱 **Buckets de stockage** doivent être nettoyés manuellement via l'interface Supabase

---

_Scripts créés pour Guyane Marketplace v2.0 - Migration TanStack Query_
