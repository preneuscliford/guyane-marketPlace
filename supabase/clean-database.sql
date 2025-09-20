-- Script de nettoyage complet de la base de données
-- ⚠️ ATTENTION: Ce script supprime TOUTES les données utilisateur
-- À utiliser uniquement en développement ou pour reset complet

-- 1. Suppression des données de l'activité utilisateur (dans l'ordre des dépendances)
DELETE FROM service_views;
DELETE FROM advertisement_impressions;
DELETE FROM advertisement_clicks;
DELETE FROM advertisement_stats;
DELETE FROM conversation_participants;
DELETE FROM messages;
DELETE FROM conversations;
DELETE FROM likes;
DELETE FROM comments;
DELETE FROM posts;
DELETE FROM reports;
DELETE FROM moderation_actions;
DELETE FROM banned_users;
DELETE FROM user_moderation_actions;
DELETE FROM user_warnings;
DELETE FROM feedback;
DELETE FROM notifications;
DELETE FROM contact_messages;
DELETE FROM product_likes;

-- 2. Suppression du contenu principal
DELETE FROM reviews;
DELETE FROM favorites;
DELETE FROM services;
DELETE FROM announcements;
DELETE FROM advertisements;
DELETE FROM products;
DELETE FROM subscriptions;

-- 3. Suppression des données utilisateur (en dernier)
DELETE FROM profiles WHERE id NOT IN (
  SELECT id FROM auth.users 
  WHERE email IN ('admin@guyanemarketplace.com', 'demo@example.com')
);

-- 4. Réinitialisation des séquences et compteurs
-- (Les séquences se réinitialisent automatiquement avec les UUID)

-- 5. Nettoyage du stockage (à exécuter manuellement via l'interface Supabase)
-- - Vider le bucket 'services-images'
-- - Vider le bucket 'announcements-images' 
-- - Vider le bucket 'advertisements-images'

-- 6. Vérification du nettoyage
SELECT 
  'Services' as table_name, count(*) as remaining_rows FROM services
UNION ALL
SELECT 'Announcements' as table_name, count(*) as remaining_rows FROM announcements  
UNION ALL
SELECT 'Advertisements' as table_name, count(*) as remaining_rows FROM advertisements
UNION ALL
SELECT 'Posts' as table_name, count(*) as remaining_rows FROM posts
UNION ALL
SELECT 'Comments' as table_name, count(*) as remaining_rows FROM comments
UNION ALL
SELECT 'Profiles' as table_name, count(*) as remaining_rows FROM profiles
UNION ALL
SELECT 'Reviews' as table_name, count(*) as remaining_rows FROM reviews
UNION ALL
SELECT 'Service Views' as table_name, count(*) as remaining_rows FROM service_views;

-- Message de confirmation
SELECT '✅ Base de données nettoyée avec succès!' as status;
SELECT '⚠️ N''oubliez pas de nettoyer les buckets de stockage via l''interface Supabase' as reminder;