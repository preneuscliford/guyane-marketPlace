-- 🚀 MIGRATION FINALE: Données d'exemple réalistes Guyane Marketplace
-- Utilise les utilisateurs existants de auth.users

BEGIN;

-- ========================================================================
-- 1. NETTOYAGE DES DONNÉES DE TEST
-- ========================================================================

-- Nettoyage des dépendances
DELETE FROM service_views WHERE service_id IN (
  SELECT id FROM services 
  WHERE title LIKE '%test%' OR description LIKE '%test%' OR description LIKE '%Type%'
);

DELETE FROM reviews WHERE service_id IN (
  SELECT id FROM services 
  WHERE title LIKE '%test%' OR description LIKE '%test%' OR description LIKE '%Type%'
) OR announcement_id IN (
  SELECT id FROM announcements 
  WHERE title LIKE '%test%' OR description LIKE '%test%' OR description LIKE '%Google Traduction%'
);

-- Suppression des données de test
DELETE FROM services WHERE title LIKE '%test%' OR description LIKE '%test%' OR description LIKE '%Type%';
DELETE FROM announcements WHERE title LIKE '%test%' OR description LIKE '%test%' OR description LIKE '%Google Traduction%';

-- ========================================================================
-- 2. CRÉATION DES PROFILS AVEC IDS UTILISATEURS EXISTANTS
-- ========================================================================

INSERT INTO profiles (id, full_name, avatar_url, created_at, updated_at) VALUES
('42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', 'Jean-Pierre Dubois', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', now(), now()),
('7169064c-25d9-4143-95ca-bbca16316ab7', 'Marie-Claire Lafontaine', 'https://images.unsplash.com/photo-1494790108755-2616c27da8d1?w=150&h=150&fit=crop&crop=face', now(), now()),
('de6bf9a0-9c39-4679-8851-d30327526757', 'Alexandre Martin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', now(), now()),
('25253eb9-3236-47a5-920f-3522c2a1d9bb', 'Sophie Bertrand', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', now(), now()),
('d88fbdd7-4194-4d7d-a700-52da6c6dfec1', 'Michel Rousseau', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', now(), now())
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();

-- ========================================================================
-- 3. AJOUT DE SERVICES RÉALISTES GUYANE
-- ========================================================================

INSERT INTO services (id, user_id, title, description, price, price_type, category, location, images, availability, contact_info, tags, status) VALUES
(gen_random_uuid(), '42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', 'Réparation Ordinateurs & Smartphones', 
'Service de réparation professionnel pour ordinateurs, tablettes et smartphones. Diagnostic gratuit, intervention à domicile possible. Spécialisé dans la récupération de données et les problèmes logiciels.', 
45.00, 'hourly', 'informatique', 'Cayenne',
ARRAY['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop'],
'{"disponible": true, "horaires": "Lun-Ven 8h-18h, Sam 9h-15h"}'::jsonb,
'{"phone": "0594 12 34 56", "email": "repair.tech.guyane@gmail.com"}'::jsonb,
ARRAY['réparation', 'informatique', 'smartphone', 'ordinateur', 'diagnostic'], 'active'),

(gen_random_uuid(), '7169064c-25d9-4143-95ca-bbca16316ab7', 'Développement Sites Web', 
'Création de sites web modernes et responsive pour entreprises guyanaises. E-commerce, vitrine, blog. Référencement inclus et formation à la gestion de contenu.', 
800.00, 'fixed', 'informatique', 'Kourou',
ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'],
'{"disponible": true, "delai": "2-4 semaines selon projet"}'::jsonb,
'{"phone": "0594 98 76 54", "email": "webdev.guyane@outlook.com"}'::jsonb,
ARRAY['web', 'développement', 'site internet', 'e-commerce', 'seo'], 'active'),

(gen_random_uuid(), 'de6bf9a0-9c39-4679-8851-d30327526757', 'Cours Particuliers Mathématiques', 
'Professeur certifié propose cours de mathématiques du collège au lycée. Préparation bac, soutien scolaire, remise à niveau. Méthode personnalisée selon le profil de l''élève.', 
25.00, 'hourly', 'education', 'Matoury',
ARRAY['https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop'],
'{"disponible": true, "horaires": "Mer 14h-18h, Sam 9h-17h, vacances sur RDV"}'::jsonb,
'{"phone": "0694 15 28 37", "email": "prof.math.guyane@gmail.com"}'::jsonb,
ARRAY['mathématiques', 'cours particuliers', 'soutien scolaire', 'bac', 'collège', 'lycée'], 'active'),

(gen_random_uuid(), '25253eb9-3236-47a5-920f-3522c2a1d9bb', 'Cours de Créole Guyanais', 
'Apprentissage du créole guyanais pour tous niveaux. Cours individuels ou en groupe, conversation, culture locale. Idéal pour les nouveaux arrivants en Guyane.', 
20.00, 'hourly', 'education', 'Saint-Laurent-du-Maroni',
ARRAY['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop'],
'{"disponible": true, "groupe": "max 6 personnes", "individuel": "sur RDV"}'::jsonb,
'{"phone": "0694 87 42 13", "email": "creole.cours@gmail.com"}'::jsonb,
ARRAY['créole', 'langue', 'culture', 'conversation', 'débutant'], 'active'),

(gen_random_uuid(), 'd88fbdd7-4194-4d7d-a700-52da6c6dfec1', 'Coiffure Afro & Européenne', 
'Salon de coiffure spécialisé dans tous types de cheveux. Coupes, colorations, défrisages, tresses africaines, soins capillaires. Produits professionnels adaptés au climat tropical.', 
35.00, 'fixed', 'beaute', 'Cayenne',
ARRAY['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop'],
'{"disponible": true, "rdv_obligatoire": true, "horaires": "Mar-Sam 9h-18h"}'::jsonb,
'{"phone": "0594 31 27 84", "email": "salon.tropical.hair@gmail.com"}'::jsonb,
ARRAY['coiffure', 'afro', 'tresses', 'défrisage', 'soins capillaires'], 'active'),

(gen_random_uuid(), '42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', 'Électricité Générale', 
'Électricien professionnel pour installation, rénovation, dépannage. Spécialisé dans les installations tropicales, mise aux normes, installation panneaux solaires. Devis gratuit.', 
55.00, 'hourly', 'construction', 'Macouria',
ARRAY['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop'],
'{"disponible": true, "urgence": "24h/24", "devis": "gratuit"}'::jsonb,
'{"phone": "0594 45 67 89", "email": "elec.pro.guyane@gmail.com"}'::jsonb,
ARRAY['électricité', 'installation', 'dépannage', 'solaire', 'normes'], 'active'),

(gen_random_uuid(), '7169064c-25d9-4143-95ca-bbca16316ab7', 'Transport & Déménagement', 
'Service de transport et déménagement en Guyane. Camion avec hayon, équipe professionnelle, emballage, stockage temporaire. Particuliers et entreprises.', 
80.00, 'hourly', 'transport', 'Kourou',
ARRAY['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'],
'{"disponible": true, "devis": "gratuit", "assurance": "incluse"}'::jsonb,
'{"phone": "0694 25 81 47", "email": "transport.demenagement.gf@gmail.com"}'::jsonb,
ARRAY['déménagement', 'transport', 'camion', 'stockage', 'emballage'], 'active');

-- ========================================================================
-- 4. AJOUT D'ANNONCES RÉALISTES GUYANE
-- ========================================================================

INSERT INTO announcements (id, user_id, title, description, price, category, location, images) VALUES
(gen_random_uuid(), 'de6bf9a0-9c39-4679-8851-d30327526757', 'Toyota Hilux 4x4 2019', 
'Toyota Hilux double cabine, 4x4, diesel, 85 000 km. Entretien suivi en concession, climatisation, GPS. Parfait état, idéal pour la brousse guyanaise. Contrôle technique OK.', 
28500.00, 'Véhicules', 'Cayenne',
ARRAY['https://images.unsplash.com/photo-1562911791-c7a97b729ec5?w=400&h=300&fit=crop']),

(gen_random_uuid(), '25253eb9-3236-47a5-920f-3522c2a1d9bb', 'Scooter Yamaha 125cc', 
'Scooter Yamaha XMAX 125cc, 2021, 12 000 km. Révision récente, pneus neufs, top case inclus. Idéal circulation urbaine Cayenne. Papiers en règle, 2 casques offerts.', 
3800.00, 'Véhicules', 'Matoury',
ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop']),

(gen_random_uuid(), 'd88fbdd7-4194-4d7d-a700-52da6c6dfec1', 'Villa F4 avec Piscine', 
'Belle villa F4 (120m²) avec piscine, jardin tropical 800m². 3 chambres, 2 SDB, cuisine équipée, terrasse couverte, parking. Quartier calme, proche écoles et commerces.', 
285000.00, 'Immobilier', 'Rémire-Montjoly',
ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop']),

(gen_random_uuid(), '42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', 'iPhone 14 Pro 256Go', 
'iPhone 14 Pro 256Go, couleur violet, état impeccable. Acheté il y a 8 mois, sous garantie Apple. Coque et film protecteur depuis l''achat. Chargeur et boîte d''origine inclus.', 
850.00, 'Électronique', 'Kourou',
ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop']),

(gen_random_uuid(), '7169064c-25d9-4143-95ca-bbca16316ab7', 'Kayak 2 Places + Équipement', 
'Kayak mer 2 places avec sièges réglables, pagaies carbone, gilets sauvetage, sac étanche. Parfait pour explorer les rivières guyanaises. Très bon état, peu utilisé.', 
680.00, 'Loisirs', 'Iracoubo',
ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop']);

-- ========================================================================
-- 5. MISE À JOUR MÉTADONNÉES ET STATISTIQUES
-- ========================================================================

-- Mise à jour des compteurs de services
UPDATE services SET 
  views = floor(random() * 50 + 10),
  unique_views = floor(random() * 30 + 5),
  total_views = floor(random() * 80 + 15),
  rating = round((random() * 2 + 3)::numeric, 1),
  reviews_count = floor(random() * 5 + 1)
WHERE created_at >= (now() - interval '1 hour');

-- ========================================================================
-- 6. VÉRIFICATION FINALE
-- ========================================================================

SELECT '🎉 MIGRATION TERMINÉE AVEC SUCCÈS !' as status;

SELECT 
  'Profils créés/mis à jour' as type, 
  count(*) as count 
FROM profiles 
UNION ALL
SELECT 
  'Services ajoutés' as type, 
  count(*) as count 
FROM services 
WHERE created_at >= (now() - interval '1 hour')
UNION ALL
SELECT 
  'Annonces ajoutées' as type, 
  count(*) as count 
FROM announcements 
WHERE created_at >= (now() - interval '1 hour');

COMMIT;