# Instructions pour appliquer la migration du système de vues

## Contexte
Ce fichier contient les instructions pour appliquer manuellement la migration SQL qui améliore le système de comptage des vues des services.

## Migration à appliquer
Le fichier de migration se trouve dans : `supabase/migrations/20240120000000_improve_views_system.sql`

## Comment appliquer la migration

### Option 1 : Via l'interface Supabase Dashboard
1. Connectez-vous à votre dashboard Supabase : https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans l'onglet "SQL Editor"
4. Copiez le contenu du fichier `supabase/migrations/20240120000000_improve_views_system.sql`
5. Collez-le dans l'éditeur SQL
6. Cliquez sur "Run" pour exécuter la migration

### Option 2 : Via Supabase CLI (si configuré)
```bash
# D'abord, lier votre projet (si pas déjà fait)
supabase link --project-ref YOUR_PROJECT_REF

# Puis appliquer la migration
supabase db push
```

## Ce que fait cette migration

### 1. Nouvelle table `service_views`
- Stocke chaque vue individuellement
- Permet de distinguer les visiteurs uniques
- Évite les doublons basés sur l'utilisateur, IP et session

### 2. Nouvelles colonnes dans `services`
- `unique_views` : nombre de visiteurs uniques
- `total_views` : nombre total de vues (incluant les répétées)

### 3. Fonction intelligente `increment_service_views`
- N'incrémente pas les vues du propriétaire du service
- Distingue les vues uniques des vues répétées
- Gère automatiquement les doublons

### 4. Fonction de statistiques `get_service_view_stats`
- Retourne des statistiques détaillées :
  - Vues uniques et totales
  - Vues aujourd'hui, cette semaine, ce mois

### 5. Politiques de sécurité RLS
- Contrôle l'accès aux données de vues
- Les propriétaires peuvent voir leurs statistiques
- Les utilisateurs peuvent voir leurs propres vues

## Après la migration

### Utilisation du nouveau système
1. **Dans les composants React** :
   ```typescript
   import { useAutoServiceViews } from '@/hooks/useServiceViews';
   
   // Dans votre composant
   const { viewResult, loading } = useAutoServiceViews(serviceId, true);
   ```

2. **Affichage des vues** :
   ```typescript
   import { ServiceViewsDisplay } from '@/components/services/ServiceViewsDisplay';
   
   // Affichage simple
   <ServiceViewsSimple views={service.views} />
   
   // Affichage détaillé
   <ServiceViewsDisplay 
     uniqueViews={stats.unique_views}
     totalViews={stats.total_views}
     viewsToday={stats.views_today}
     showDetailed={true}
   />
   ```

### Avantages du nouveau système
- ✅ **Précision** : Évite les doublons et les vues artificielles
- ✅ **Analytics** : Statistiques détaillées par période
- ✅ **Performance** : Optimisé avec des index appropriés
- ✅ **Sécurité** : Politiques RLS pour protéger les données
- ✅ **Flexibilité** : Différents types d'affichage selon le contexte

## Vérification post-migration

Après avoir appliqué la migration, vérifiez que :
1. La table `service_views` a été créée
2. Les colonnes `unique_views` et `total_views` ont été ajoutées à `services`
3. Les fonctions `increment_service_views` et `get_service_view_stats` existent
4. Les politiques RLS sont actives

Vous pouvez tester avec cette requête :
```sql
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('services', 'service_views')
ORDER BY table_name, ordinal_position;
```

## Support
Si vous rencontrez des problèmes lors de l'application de cette migration, vérifiez :
1. Que vous avez les permissions d'administration sur la base de données
2. Que toutes les dépendances (extensions PostgreSQL) sont installées
3. Les logs d'erreur dans le dashboard Supabase