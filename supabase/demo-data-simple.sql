-- ========================================================================
-- SCRIPT DE MIGRATION SIMPLE AVEC IDS UTILISATEURS SPÉCIFIQUES
-- ========================================================================

-- Nettoyage des données existantes
DELETE FROM reviews WHERE true;
DELETE FROM service_views WHERE true;
DELETE FROM announcements WHERE true;  
DELETE FROM services WHERE true;

-- Création/mise à jour des profils avec IDs utilisateurs existants
INSERT INTO profiles (id, full_name, avatar_url, created_at, updated_at)
VALUES 
('42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', 'Jean-Pierre Dubois', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', now(), now()),
('7169064c-25d9-4143-95ca-bbca16316ab7', 'Marie-Claire Lafontaine', 'https://images.unsplash.com/photo-1494790108755-2616c27da8d1?w=150&h=150&fit=crop&crop=face', now(), now()),
('de6bf9a0-9c39-4679-8851-d30327526757', 'Alexandre Martin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', now(), now()),
('25253eb9-3236-47a5-920f-3522c2a1d9bb', 'Sophie Bertrand', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', now(), now()),
('d88fbdd7-4194-4d7d-a700-52da6c6dfec1', 'Michel Rousseau', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', now(), now())
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();

-- Services réalistes
INSERT INTO services (id, user_id, title, description, category, price, location, availability, contact_info, images, created_at, updated_at) VALUES

(gen_random_uuid(), '42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', 'Développeur Web Full-Stack', 
'Création de sites web modernes avec React, Next.js et bases de données. Expérience en e-commerce et applications métier.', 
'informatique', 45.00, 'Cayenne', 
'{"lundi": "9h-17h", "mardi": "9h-17h", "mercredi": "9h-17h", "jeudi": "9h-17h", "vendredi": "9h-17h"}'::jsonb, 
'{"telephone": "0694123456", "email": "dev.cayenne@gmail.com"}'::jsonb, 
ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'], now(), now()),

(gen_random_uuid(), '7169064c-25d9-4143-95ca-bbca16316ab7', 'Cours Particuliers Mathématiques', 
'Professeur certifié propose cours de maths du collège au lycée. Préparation bac, aide aux devoirs.', 
'education', 25.00, 'Kourou', 
'{"lundi": "17h-20h", "mardi": "17h-20h", "mercredi": "14h-20h", "samedi": "9h-16h"}'::jsonb, 
'{"telephone": "0694234567", "email": "prof.maths.kourou@gmail.com"}'::jsonb, 
ARRAY['https://images.unsplash.com/photo-1509228627152-72ae4c67f47b?w=400&h=300&fit=crop'], now(), now()),

(gen_random_uuid(), 'de6bf9a0-9c39-4679-8851-d30327526757', 'Salon Coiffure Afro & Européenne', 
'Salon spécialisé cheveux afro et européens. Coupes, défrisages, tresses, colorations. Produits professionnels.', 
'beaute', 35.00, 'Saint-Laurent-du-Maroni', 
'{"mardi": "9h-18h", "mercredi": "9h-18h", "jeudi": "9h-18h", "vendredi": "9h-19h", "samedi": "8h-17h"}'::jsonb, 
'{"telephone": "0694345678", "whatsapp": "594694345678"}'::jsonb, 
ARRAY['https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop'], now(), now()),

(gen_random_uuid(), '25253eb9-3236-47a5-920f-3522c2a1d9bb', 'Maçonnerie & Rénovation', 
'Entreprise maçonnerie générale. Construction, rénovation, carrelage. 15 ans expérience en Guyane.', 
'construction', 50.00, 'Matoury', 
'{"lundi": "7h-16h", "mardi": "7h-16h", "mercredi": "7h-16h", "jeudi": "7h-16h", "vendredi": "7h-16h"}'::jsonb, 
'{"telephone": "0694456789", "email": "maconnerie.matoury@outlook.com"}'::jsonb, 
ARRAY['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop'], now(), now()),

(gen_random_uuid(), 'd88fbdd7-4194-4d7d-a700-52da6c6dfec1', 'Transport & Livraison Express', 
'Transport personnes et livraison colis. Véhicule climatisé, ponctualité garantie. Toute la Guyane.', 
'transport', 30.00, 'Remire-Montjoly', 
'{"lundi": "6h-22h", "mardi": "6h-22h", "mercredi": "6h-22h", "jeudi": "6h-22h", "vendredi": "6h-22h", "samedi": "7h-20h"}'::jsonb, 
'{"telephone": "0694567890", "whatsapp": "594694567890"}'::jsonb, 
ARRAY['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'], now(), now());

-- Annonces réalistes  
INSERT INTO announcements (id, user_id, title, description, price, location, category, images, created_at, updated_at) VALUES

(gen_random_uuid(), 'de6bf9a0-9c39-4679-8851-d30327526757', 'Toyota Hilux 2018 - Excellent état', 
'Pick-up Toyota Hilux Double Cabine 2018, 85 000 km, climatisation, GPS. Entretien suivi en concession.', 
18500.00, 'Cayenne', 'vehicules', 
ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop'], now(), now()),

(gen_random_uuid(), '25253eb9-3236-47a5-920f-3522c2a1d9bb', 'Villa F4 avec jardin tropical', 
'Belle villa F4 (110m²) avec grand jardin tropical. 3 chambres, 2 SDB, cuisine équipée, terrasse.', 
285000.00, 'Matoury', 'immobilier', 
ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop'], now(), now()),

(gen_random_uuid(), 'd88fbdd7-4194-4d7d-a700-52da6c6dfec1', 'iPhone 14 Pro Max 256Go', 
'iPhone 14 Pro Max 256Go violet, état impeccable. Sous garantie Apple jusqu''en mars 2025.', 
950.00, 'Kourou', 'electronique', 
ARRAY['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop'], now(), now()),

(gen_random_uuid(), '42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', 'Kayak de mer + équipement', 
'Kayak mer 2 places avec pagaies, gilets sauvetage. Parfait explorer fleuves guyanais.', 
650.00, 'Sinnamary', 'sport', 
ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'], now(), now()),

(gen_random_uuid(), '7169064c-25d9-4143-95ca-bbca16316ab7', 'Scooter Yamaha Aerox 50cc', 
'Scooter Yamaha Aerox 50cc 2020, 12 000 km. Révision récente, pneus neufs. Papiers en règle.', 
1850.00, 'Remire-Montjoly', 'vehicules', 
ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'], now(), now());

-- Génération de quelques reviews
INSERT INTO reviews (id, user_id, service_id, rating, comment, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    (ARRAY['42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', '7169064c-25d9-4143-95ca-bbca16316ab7', 'de6bf9a0-9c39-4679-8851-d30327526757'])[1 + (random() * 2)::int],
    s.id,
    4 + (random())::int,
    (ARRAY['Excellent service!', 'Très professionnel', 'Travail de qualité', 'Je recommande vivement', 'Service rapide et efficace'])[1 + (random() * 4)::int],
    now() - (random() * interval '30 days'),
    now()
FROM services s
ORDER BY random()
LIMIT 8;

-- Messages de confirmation
SELECT '✅ Données de démonstration insérées avec succès!' as status;
SELECT 'Profils créés:' as type, count(*) as total FROM profiles;
SELECT 'Services créés:' as type, count(*) as total FROM services;
SELECT 'Annonces créées:' as type, count(*) as total FROM announcements; 
SELECT 'Reviews créées:' as type, count(*) as total FROM reviews;