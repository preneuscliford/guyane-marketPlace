-- Script de données d'exemple pour Guyane Marketplace
-- Exécutez ce script dans votre interface Supabase pour ajouter des données réalistes

-- 1. Nettoyage des données existantes de test
DELETE FROM service_views WHERE service_id IN (SELECT id FROM services WHERE title LIKE '%test%' OR description LIKE '%test%' OR description LIKE '%Type%');
DELETE FROM reviews WHERE service_id IN (SELECT id FROM services WHERE title LIKE '%test%' OR description LIKE '%test%' OR description LIKE '%Type%');
DELETE FROM reviews WHERE announcement_id IN (SELECT id FROM announcements WHERE title LIKE '%test%' OR description LIKE '%test%' OR description LIKE '%Google Traduction%');
DELETE FROM services WHERE title LIKE '%test%' OR description LIKE '%test%' OR description LIKE '%Type%';
DELETE FROM announcements WHERE title LIKE '%test%' OR description LIKE '%test%' OR description LIKE '%Google Traduction%';

-- 2. Ajout de services réalistes pour la Guyane
INSERT INTO services (id, user_id, title, description, price, price_type, category, location, images, availability, contact_info, tags, status) VALUES

-- Services Informatique
('service-001', '7169064c-25d9-4143-95ca-bbca16316ab7', 'Réparation Ordinateurs & Smartphones', 
'Service de réparation professionnel pour ordinateurs, tablettes et smartphones. Diagnostic gratuit, intervention à domicile possible. Spécialisé dans la récupération de données et les problèmes logiciels.', 
45.00, 'hourly', 'informatique', 'Cayenne',
ARRAY['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop'],
'{"disponible": true, "horaires": "Lun-Ven 8h-18h, Sam 9h-15h"}',
'{"phone": "0594 12 34 56", "email": "repair.tech.guyane@gmail.com"}',
ARRAY['réparation', 'informatique', 'smartphone', 'ordinateur', 'diagnostic'], 'active'),

('service-002', '25253eb9-3236-47a5-920f-3522c2a1d9bb', 'Développement Sites Web', 
'Création de sites web modernes et responsive pour entreprises guyanaises. E-commerce, vitrine, blog. Référencement inclus et formation à la gestion de contenu.', 
800.00, 'fixed', 'informatique', 'Kourou',
ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'],
'{"disponible": true, "delai": "2-4 semaines selon projet"}',
'{"phone": "0594 98 76 54", "email": "webdev.guyane@outlook.com"}',
ARRAY['web', 'développement', 'site internet', 'e-commerce', 'seo'], 'active'),

-- Services Éducation
('service-003', '42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', 'Cours Particuliers Mathématiques', 
'Professeur certifié propose cours de mathématiques du collège au lycée. Préparation bac, soutien scolaire, remise à niveau. Méthode personnalisée selon le profil de l''élève.', 
25.00, 'hourly', 'education', 'Matoury',
ARRAY['https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop'],
'{"disponible": true, "horaires": "Mer 14h-18h, Sam 9h-17h, vacances sur RDV"}',
'{"phone": "0694 15 28 37", "email": "prof.math.guyane@gmail.com"}',
ARRAY['mathématiques', 'cours particuliers', 'soutien scolaire', 'bac', 'collège', 'lycée'], 'active'),

('service-004', 'a5b6dab7-d0a9-41c6-871b-70901a036ca7', 'Cours de Créole Guyanais', 
'Apprentissage du créole guyanais pour tous niveaux. Cours individuels ou en groupe, conversation, culture locale. Idéal pour les nouveaux arrivants en Guyane.', 
20.00, 'hourly', 'education', 'Saint-Laurent-du-Maroni',
ARRAY['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop'],
'{"disponible": true, "groupe": "max 6 personnes", "individuel": "sur RDV"}',
'{"phone": "0694 87 42 13", "email": "creole.cours@gmail.com"}',
ARRAY['créole', 'langue', 'culture', 'conversation', 'débutant'], 'active'),

-- Services Beauté & Bien-être
('service-005', '7169064c-25d9-4143-95ca-bbca16316ab7', 'Coiffure Afro & Européenne', 
'Salon de coiffure spécialisé dans tous types de cheveux. Coupes, colorations, défrisages, tresses africaines, soins capillaires. Produits professionnels adaptés au climat tropical.', 
35.00, 'fixed', 'beaute', 'Cayenne',
ARRAY['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop'],
'{"disponible": true, "rdv_obligatoire": true, "horaires": "Mar-Sam 9h-18h"}',
'{"phone": "0594 31 27 84", "email": "salon.tropical.hair@gmail.com"}',
ARRAY['coiffure', 'afro', 'tresses', 'défrisage', 'soins capillaires'], 'active'),

('service-006', '25253eb9-3236-47a5-920f-3522c2a1d9bb', 'Massage Bien-être', 
'Massages relaxants et thérapeutiques. Techniques traditionnelles et modernes, huiles essentielles locales. Déplacement à domicile possible. Certifié en massage ayurvédique.', 
60.00, 'hourly', 'beaute', 'Rémire-Montjoly',
ARRAY['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop'],
'{"disponible": true, "domicile": true, "horaires": "Lun-Sam 10h-20h"}',
'{"phone": "0694 53 76 29", "email": "massage.wellness.gf@gmail.com"}',
ARRAY['massage', 'relaxation', 'bien-être', 'ayurvédique', 'domicile'], 'active'),

-- Services Construction & Rénovation
('service-007', '42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', 'Électricité Générale', 
'Électricien professionnel pour installation, rénovation, dépannage. Spécialisé dans les installations tropicales, mise aux normes, installation panneaux solaires. Devis gratuit.', 
55.00, 'hourly', 'construction', 'Macouria',
ARRAY['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop'],
'{"disponible": true, "urgence": "24h/24", "devis": "gratuit"}',
'{"phone": "0594 45 67 89", "email": "elec.pro.guyane@gmail.com"}',
ARRAY['électricité', 'installation', 'dépannage', 'solaire', 'normes'], 'active'),

('service-008', 'a5b6dab7-d0a9-41c6-871b-70901a036ca7', 'Plomberie & Sanitaire', 
'Plombier expérimenté pour tous travaux de plomberie et sanitaire. Installation, réparation, débouchage. Intervention rapide, matériel de qualité résistant à l''humidité tropicale.', 
50.00, 'hourly', 'construction', 'Cayenne',
ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
'{"disponible": true, "urgence": "7j/7", "garantie": "1 an sur travaux"}',
'{"phone": "0594 78 92 35", "email": "plombier.guyane@outlook.com"}',
ARRAY['plomberie', 'sanitaire', 'débouchage', 'installation', 'réparation'], 'active'),

-- Services Transport
('service-009', '7169064c-25d9-4143-95ca-bbca16316ab7', 'Transport & Déménagement', 
'Service de transport et déménagement en Guyane. Camion avec hayon, équipe professionnelle, emballage, stockage temporaire. Particuliers et entreprises.', 
80.00, 'hourly', 'transport', 'Kourou',
ARRAY['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'],
'{"disponible": true, "devis": "gratuit", "assurance": "incluse"}',
'{"phone": "0694 25 81 47", "email": "transport.demenagement.gf@gmail.com"}',
ARRAY['déménagement', 'transport', 'camion', 'stockage', 'emballage'], 'active'),

-- Services Événementiel
('service-010', '25253eb9-3236-47a5-920f-3522c2a1d9bb', 'Organisation Mariage Créole', 
'Organisation complète de mariages créoles traditionnels. Décoration, traiteur, musique, animation. Connaissance parfaite des traditions guyanaises et des lieux d''exception.', 
2500.00, 'fixed', 'evenementiel', 'Saint-Georges-de-l''Oyapock',
ARRAY['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop'],
'{"disponible": true, "consultation": "gratuite", "forfait": "tout inclus possible"}',
'{"phone": "0594 67 43 29", "email": "mariage.creole.guyane@gmail.com"}',
ARRAY['mariage', 'créole', 'traditionnel', 'décoration', 'traiteur'], 'active');

-- 3. Ajout d'annonces réalistes pour la Guyane
INSERT INTO announcements (id, user_id, title, description, price, category, location, images) VALUES

-- Véhicules
('announce-001', '7169064c-25d9-4143-95ca-bbca16316ab7', 'Toyota Hilux 4x4 2019', 
'Toyota Hilux double cabine, 4x4, diesel, 85 000 km. Entretien suivi en concession, climatisation, GPS. Parfait état, idéal pour la brousse guyanaise. Contrôle technique OK.', 
28500.00, 'Véhicules', 'Cayenne',
ARRAY['https://images.unsplash.com/photo-1562911791-c7a97b729ec5?w=400&h=300&fit=crop']),

('announce-002', '42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', 'Scooter Yamaha 125cc', 
'Scooter Yamaha XMAX 125cc, 2021, 12 000 km. Révision récente, pneus neufs, top case inclus. Idéal circulation urbaine Cayenne. Papiers en règle, 2 casques offerts.', 
3800.00, 'Véhicules', 'Matoury',
ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop']),

-- Immobilier
('announce-003', 'a5b6dab7-d0a9-41c6-871b-70901a036ca7', 'Villa F4 avec Piscine', 
'Belle villa F4 (120m²) avec piscine, jardin tropical 800m². 3 chambres, 2 SDB, cuisine équipée, terrasse couverte, parking. Quartier calme, proche écoles et commerces.', 
285000.00, 'Immobilier', 'Rémire-Montjoly',
ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop']),

('announce-004', '25253eb9-3236-47a5-920f-3522c2a1d9bb', 'Appartement T3 Centre-Ville', 
'Appartement T3 de 75m² hypercentre Cayenne. 2 chambres, salon, cuisine équipée, balcon, place parking. Immeuble récent avec ascenseur. Idéal investissement locatif ou résidence principale.', 
165000.00, 'Immobilier', 'Cayenne',
ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop']),

-- Électronique & Informatique
('announce-005', '7169064c-25d9-4143-95ca-bbca16316ab7', 'iPhone 14 Pro 256Go', 
'iPhone 14 Pro 256Go, couleur violet, état impeccable. Acheté il y a 8 mois, sous garantie Apple. Coque et film protecteur depuis l''achat. Chargeur et boîte d''origine inclus.', 
850.00, 'Électronique', 'Kourou',
ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop']),

('announce-006', '42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', 'PC Gamer Complet', 
'PC gamer complet: Ryzen 7, RTX 3070, 32Go RAM, SSD 1To. Écran 27" 144Hz, clavier mécanique, souris gaming. Parfait pour jeux récents en ultra. Garantie constructeur restante.', 
1450.00, 'Électronique', 'Cayenne',
ARRAY['https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop']),

-- Maison & Jardin
('announce-007', 'a5b6dab7-d0a9-41c6-871b-70901a036ca7', 'Mobilier de Jardin Teck', 
'Ensemble mobilier jardin en teck massif: table 8 personnes + 8 chaises + parasol déporté. Résistant climat tropical, entretien facile. Coussins imperméables inclus.', 
1200.00, 'Maison & Jardin', 'Macouria',
ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop']),

('announce-008', '25253eb9-3236-47a5-920f-3522c2a1d9bb', 'Générateur Essence 5000W', 
'Générateur Honda 5000W, essence, démarrage électrique. Peu servi, entretien régulier. Indispensable pour coupures électriques. Manuel et accessoires inclus.', 
1800.00, 'Maison & Jardin', 'Saint-Laurent-du-Maroni',
ARRAY['https://images.unsplash.com/photo-1621905252472-e1c7ad7e7ac1?w=400&h=300&fit=crop']),

-- Sports & Loisirs
('announce-009', '7169064c-25d9-4143-95ca-bbca16316ab7', 'Kayak 2 Places + Équipement', 
'Kayak mer 2 places avec sièges réglables, pagaies carbone, gilets sauvetage, sac étanche. Parfait pour explorer les rivières guyanaises. Très bon état, peu utilisé.', 
680.00, 'Loisirs', 'Iracoubo',
ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop']),

('announce-010', '42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', 'VTT Électrique Trek', 
'VTT électrique Trek PowerFly 7, batterie 625Wh, moteur Bosch. Suspension intégrale, parfait pour sentiers forestiers. 2 ans, 1500km, révision récente chez Trek.', 
2200.00, 'Loisirs', 'Maripasoula',
ARRAY['https://images.unsplash.com/photo-1544191696-15693072f5a0?w=400&h=300&fit=crop']);

-- 4. Mise à jour des compteurs et métadonnées
UPDATE services SET 
  views = floor(random() * 50 + 10),
  unique_views = floor(random() * 30 + 5),
  total_views = floor(random() * 80 + 15),
  rating = round((random() * 4 + 1)::numeric, 1),
  reviews_count = floor(random() * 8 + 1);

-- 5. Ajout de quelques avis pour rendre les services crédibles
INSERT INTO reviews (user_id, target_user_id, service_id, rating, comment) VALUES
('25253eb9-3236-47a5-920f-3522c2a1d9bb', '7169064c-25d9-4143-95ca-bbca16316ab7', 'service-001', 5, 'Service excellent ! Réparation de mon PC rapide et efficace. Je recommande vivement.'),
('42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', '7169064c-25d9-4143-95ca-bbca16316ab7', 'service-005', 4, 'Très bon salon, coiffure impeccable. Seul bémol: attente un peu longue.'),
('a5b6dab7-d0a9-41c6-871b-70901a036ca7', '25253eb9-3236-47a5-920f-3522c2a1d9bb', 'service-002', 5, 'Site web magnifique et fonctionnel. Travail professionnel, à l''écoute des besoins.'),
('7169064c-25d9-4143-95ca-bbca16316ab7', '42d08f18-1525-47cf-bc51-5f7d9f6f6d3f', 'service-003', 5, 'Excellente pédagogie, mon fils a progressé rapidement en maths. Merci !'),
('25253eb9-3236-47a5-920f-3522c2a1d9bb', 'a5b6dab7-d0a9-41c6-871b-70901a036ca7', 'service-004', 4, 'Cours de créole très enrichissant, bonne ambiance. J''ai beaucoup appris sur la culture locale.');

-- 6. Ajout de vues pour simuler l'activité
INSERT INTO service_views (service_id, user_id, ip_address, user_agent, session_id)
SELECT 
  s.id,
  p.id,
  ('192.168.1.' || floor(random() * 254 + 1)::text)::inet,
  'Mozilla/5.0 (compatible; GuyaneMarketplace/1.0)',
  gen_random_uuid()::text
FROM services s
CROSS JOIN (SELECT id FROM profiles ORDER BY random() LIMIT 3) p
WHERE random() < 0.7; -- 70% de chance d'avoir une vue

-- Résumé des données ajoutées:
-- ✅ 10 services réalistes couvrant diverses catégories
-- ✅ 10 annonces variées avec prix du marché guyanais
-- ✅ 5 avis clients authentiques
-- ✅ Données de vues simulées pour l'activité
-- ✅ Nettoyage des données de test précédentes

-- Pour vérifier les données ajoutées:
SELECT 'Services ajoutés' as type, count(*) as count FROM services WHERE id LIKE 'service-%'
UNION ALL
SELECT 'Annonces ajoutées' as type, count(*) as count FROM announcements WHERE id LIKE 'announce-%'
UNION ALL  
SELECT 'Avis ajoutés' as type, count(*) as count FROM reviews WHERE service_id LIKE 'service-%';