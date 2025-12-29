Je vais mettre en œuvre les changements recommandés pour dynamiser la communauté.

### 1. Clarification du Rôle (Page Communauté)
Je vais modifier `app/communaute/page.tsx` pour remplacer le message de bienvenue par le texte impactant suggéré :
- **Titre** : "Ici, la communauté aide à :"
- **Points clés** : "Trouver un service fiable", "Éviter les arnaques", "Repérer les bonnes opportunités locales".

### 2. Lien Communauté ↔ Marketplace
Je vais créer des ponts entre les deux espaces pour fluidifier le trafic :
- **Dans `CommunityPost.tsx`** : Ajouter un bouton "Vous proposez ce service ? Créez une annonce" sous chaque post, redirigeant vers la création de service.
- **Dans `marketplace/page.tsx`** : Ajouter un bandeau "Besoin d’avis ? Posez la question à la communauté" pour inciter les visiteurs à échanger avant d'acheter.

### 3. Création de "Vie Artificielle" (Seed Content)
Je vais générer un fichier SQL `supabase/seed_community_posts.sql` contenant **20 à 30 posts réalistes** adaptés à la Guyane (questions sur les opérateurs à Cayenne, quartiers de Kourou, réparateurs, etc.), prêts à être insérés dans la base de données.

### 4. Gamification (Base)
Je vais m'assurer que l'interface est prête pour afficher des badges (ex: "Membre Actif") à côté des noms d'utilisateurs, en utilisant le champ `role` existant ou une logique simple basée sur le nombre de posts si disponible.

Une fois le plan validé, je procéderai aux modifications de code et à la création du script de contenu.