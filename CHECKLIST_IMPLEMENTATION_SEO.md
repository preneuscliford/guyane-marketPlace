# ⚡ Checklist Implémentation Technique - SEO "Petit Annonce Guyane"

## Phase 1: ✅ DÉJÀ COMPLÉTÉ

### Métadonnées & Contenu

- [x] Optimiser le titre H1 de /annonces
- [x] Améliorer la description meta
- [x] Ajouter contenu d'introduction SEO
- [x] Ajouter mots-clés dans les templates SEO
- [x] Implémenter structured data CollectionPage

### Architecture

- [x] Créer pages dynamiques par ville (/annonces/ville/[city])
- [x] Créer pages dynamiques par catégorie (/annonces/categorie/[category])
- [x] Ajouter métadonnées uniques pour chaque page
- [x] Implémenter linking interne vers catégories

### Structured Data

- [x] Créer composant AnnouncementStructuredData
- [x] Implémenter Schema CollectionPage
- [x] Templates pour Product et LocalBusiness
- [x] Ajouter au rendu des pages

---

## Phase 2: ⏳ À FAIRE (1-2 semaines)

### Contenu Éditorial

- [ ] Créer 3 blog posts (2000+ mots chacun)
  - [ ] "Comment vendre rapidement une annonce en Guyane"
  - [ ] "Guide immobilier: acheter une maison en Guyane"
  - [ ] "Vendre sa voiture: conseils pratiques Guyane"
- [ ] Optimiser les blog posts avec H2, images, liens internes
- [ ] Ajouter structured data Article à chaque blog post

### Optimisation des Annonces Individuelles

```tsx
// Implémenter dans app/annonces/[id]/page.tsx

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const announcement = await fetchAnnouncement(params.id);

  return generateAnnouncementSEO(announcement);
}

export default function AnnouncementDetailPage({ announcement }) {
  return (
    <>
      <AnnouncementStructuredData announcement={announcement} />
      {/* Contenu... */}
    </>
  );
}
```

- [ ] Tester avec Rich Results Test (Google)
- [ ] Vérifier le rendu dans Search Console

### Contenu Enrichi

- [ ] Ajouter FAQ section sur chaque page d'annonces
- [ ] Ajouter "Related announcements" (cross-linking)
- [ ] Créer une page "Comment ça marche?" (/how-it-works)
- [ ] Ajouter testimonials/reviews avec structured data

---

## Phase 3: 📈 COURT TERME (2-4 semaines)

### Performance & Technique

- [ ] Exécuter Lighthouse audit
- [ ] Optimiser les images avec compression WebP
- [ ] Implémenter lazy loading pour images
- [ ] Vérifier Core Web Vitals score
- [ ] Minifier CSS/JS

```bash
# Commandes à exécuter:
npm run build  # Vérifier les erreurs de build
npm run lint   # Vérifier la qualité du code
```

### Google Search Console

- [ ] Soumettre sitemap.xml
- [ ] Demander l'indexation des URLs clés
- [ ] Vérifier la couverture
- [ ] Corriger les erreurs d'indexation
- [ ] Monitorer les impressions pour "petit annonce guyane"

### Validation du Contenu

- [ ] Tester les rich snippets: https://search.google.com/test/rich-results
- [ ] Valider les schémas: https://schema.org/validator
- [ ] Vérifier les mobileability: https://search.google.com/test/mobile-friendly

### Setup Analytics

- [ ] Implémenter GTM events
- [ ] Tracker les searches
- [ ] Tracker les clicks d'annonces
- [ ] Setup conversions (dépôt d'annonce)

```tsx
// Code exemple pour Analytics:
import { track } from "@/lib/analytics";

const handleSearch = (term) => {
  track("search", {
    search_term: term,
    category: selectedCategory,
  });
};
```

---

## Phase 4: 🔗 BACKLINKING (3-8 semaines)

### Création de Contenu Linkable

- [ ] Créer une infographie: "État du marché immobilier Guyane 2025"
- [ ] Créer une ressource: "Liste complète des catégories d'annonces"
- [ ] Publier un livre blanc: "Guide SEO pour petites annonces"

### Outreach & Partenariats

- [ ] Identifier 20 sites pertinents (blogs Guyane, annuaires)
- [ ] Créer liste de contacts
- [ ] Envoyer emails d'outreach
- [ ] Proposer guest posts (500-1000 mots avec lien)
- [ ] Demander mentions dans articles existants

### Social Media Strategy

- [ ] Créer calendrier de posts LinkedIn
- [ ] Partager régulièrement sur Facebook
- [ ] Créer du contenu Instagram
- [ ] Poster les annonces highlight (avec lien)

---

## Phase 5: 📊 MONITORING & OPTIMISATION (En continu)

### Outils à Mettre en Place

#### Google Search Console:

```
URL: https://search.google.com/search-console

Configuration:
✓ Propriété vérifiée: www.mcguyane.com
✓ Sitemap soumis: /sitemap.xml
✓ Sitemaps annexes: /sitemap-announcements.xml
✓ Rapport: Performance
✓ Filtre: petit annonce guyane
```

#### Google Analytics 4:

```
Configuration:
✓ Web stream créé
✓ Conversions définies
✓ Events tracké:
  - announcement_search
  - announcement_view
  - announcement_contact
  - post_announcement
```

#### Ranking Tracker:

```
Keywords à tracker (quotidien):
- petit annonce guyane [Position cible: Top 10]
- petit annonce cayenne [Position cible: Top 5]
- annonces guyane [Position cible: Top 10]
- acheter vendre guyane [Position cible: Top 20]
- emploi guyane [Position cible: Top 20]
- immobilier guyane [Position cible: Top 20]

Tools:
□ SEMrush Position Tracking
□ Ahrefs Rank Tracker
□ SE Ranking
□ Serpstat
```

### Reporting Mensuel

```markdown
### JANVIER 2025 - SEO REPORT

#### 📊 Metrics Clés

- Impressions (Search Console): 4,200 → 5,100 (+21%)
- Clics (Search Console): 156 → 189 (+21%)
- CTR: 3.7% → 3.7% (stable)
- Position moyenne: 35.2 → 31.4 ↑

#### 🎯 Keyword Rankings

| Keyword               | Décembre | Janvier | Change |     |
| --------------------- | -------- | ------- | ------ | --- |
| petit annonce guyane  | 35       | 31      | +4     | ↑   |
| petit annonce cayenne | 15       | 12      | +3     | ↑   |
| acheter vendre guyane | 42       | 38      | +4     | ↑   |

#### 📈 Traffic Organique

- Sessions: 1,240 → 1,523 (+23%)
- Bounce Rate: 58% → 54% ↓
- Avg Session Duration: 1m32s → 2m05s ↑

#### 🔗 Backlinks

- Nouveaux: 3
- Total: 18

#### ⚙️ Technique

- Core Web Vitals: All Green ✓
- Mobile Friendly: Yes ✓
- HTTPS: Yes ✓

#### ✅ Completed

- [x] Blog post publié
- [x] Images optimisées
- [x] 2 backlinks obtenus

#### 📋 À Faire

- [ ] Créer 2 nouveaux blog posts
- [ ] Obtenir 5 backlinks
- [ ] Améliorer images SERP
```

---

## Commandes de Vérification Rapide

```bash
# Vérifier la structure du site
curl -s sitemap.xml | grep "annonces" | wc -l

# Vérifier les métadonnées
curl -s "https://www.mcguyane.com/annonces" | grep -o "<title>.*</title>"
curl -s "https://www.mcguyane.com/annonces" | grep -o '<meta name="description".*>'

# Vérifier les structured data (local)
npm run dev  # Ouvrir http://localhost:3000/annonces
# Inspect → Source → Rechercher "application/ld+json"

# Tester avec Google
Google Search Console → URL Inspection
Entrez: https://www.mcguyane.com/annonces
Vérifier: "Appearance in search"
```

---

## URLs Critiques à Monitorer

```
Page Principale:
https://www.mcguyane.com/annonces

Pages Dynamiques:
https://www.mcguyane.com/annonces/ville/cayenne
https://www.mcguyane.com/annonces/ville/kourou
https://www.mcguyane.com/annonces/ville/saint-laurent

https://www.mcguyane.com/annonces/categorie/vehicules
https://www.mcguyane.com/annonces/categorie/immobilier
https://www.mcguyane.com/annonces/categorie/emploi

Pages Individuelles:
https://www.mcguyane.com/annonces/[id]
```

---

## Questions Critiques (Auto-Vérification)

1. **Le titre inclut "petit annonce guyane"?** ✅
2. **La description mentionne les villes clés?** ✅
3. **H1 contient le mot-clé principal?** ✅
4. **Structured data implémenté et valide?** ✅
5. **Linking interne vers catégories?** ✅
6. **Pages par ville/catégorie créées?** ✅
7. **Images optimisées et with alt text?** ⏳
8. **Core Web Vitals vérifiés?** ⏳
9. **Analytics events configurés?** ⏳
10. **Sitemap inclu les nouvelles URLs?** ⏳

---

## Priorités Immédiat

### Cette Semaine:

1. [x] Optimiser métadonnées
2. [x] Ajouter contenu d'intro
3. [x] Implémenter structured data
4. [x] Créer pages par ville/catégorie

### Semaines 2-3:

1. [ ] Optimiser images
2. [ ] Créer 3 blog posts
3. [ ] Implémenter analytics
4. [ ] Corriger Core Web Vitals

### Semaines 4-8:

1. [ ] Obtenir backlinks (20+)
2. [ ] Créer contenu linkable
3. [ ] Monitoring hebdomadaire
4. [ ] Ajustements basés sur data

---

## Ressources & Tools

### Gratuit:

- Google Search Console
- Google Analytics 4
- Google Lighthouse
- Schema.org Validator
- Mobile Friendly Test

### Payant (Recommandé):

- SEMrush ($119/mois)
- Ahrefs ($99+/mois)
- SurferSEO ($99/mois)
- GTmetrix ($0-99/mois)

### Guides:

- [SEO Starter Guide - Google](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Schema.org Documentation](https://schema.org)

---

**Status:** En Implémentation  
**Dernière Mise à Jour:** Décembre 2025  
**Prochaine Revue:** Janvier 2025
