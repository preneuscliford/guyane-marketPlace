-- Seed data for Community Posts
-- VERSION CORRIGÉE : Utilisation des profils "Demo" existants
--
-- Utilisateurs utilisés :
-- 1. Jean-Pierre (f47ac10b-58cc-4372-a567-0e02b2c3d479)
-- 2. Marie-Claire (6ba7b810-9dad-11d1-80b4-00c04fd430c8)
-- 3. Alexandre (550e8400-e29b-41d4-a716-446655440000)
-- 4. Sophie (6ba7b811-9dad-11d1-80b4-00c04fd430c8)
-- 5. Michel (550e8401-e29b-41d4-a716-446655440000)

INSERT INTO public.posts (content, user_id, created_at, updated_at, is_hidden)
VALUES
  -- Questions locales
  ('Quel est le meilleur opérateur internet à Cayenne en ce moment ? Je galère avec ma connexion actuelle...', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', false),
  ('Bonjour à tous, quel quartier recommandez-vous pour une famille avec 2 enfants à Kourou ? On cherche du calme.', '6ba7b811-9dad-11d1-80b4-00c04fd430c8', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', false),
  ('Est-ce que le sentier du Rorota est praticable avec les pluies récentes ?', '550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours', false),
  ('Où trouver les meilleurs madras pour une tenue traditionnelle sur Cayenne ?', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', false),

  -- Services / Opportunités
  ('Urgent : Je cherche un réparateur de téléphone fiable sur Remire-Montjoly. Mon écran est HS.', '550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours', false),
  ('Je cherche un plombier disponible rapidement pour une fuite à Matoury. Des recommandations ?', '550e8401-e29b-41d4-a716-446655440000', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', false),
  ('Besoin d''un coup de main pour un déménagement ce samedi matin sur Cayenne. Rémunération et repas offerts !', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours', false),
  ('Cherche photographe pour un mariage en juillet prochain. Style naturel souhaité.', '6ba7b811-9dad-11d1-80b4-00c04fd430c8', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', false),
  ('Quelqu''un connaît un bon mécanicien honnête pour une révision complète ?', '550e8401-e29b-41d4-a716-446655440000', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours', false),

  -- Discussions / Bons plans
  ('Vous utilisez quel site pour acheter/vendre vos meubles d''occasion en Guyane ?', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', false),
  ('Bon plan : Il y a une super promo sur les climatiseurs chez Carrefour Matoury en ce moment.', '550e8401-e29b-41d4-a716-446655440000', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', false),
  ('Où allez-vous pour acheter du poisson frais le dimanche quand le marché est fermé ?', '6ba7b811-9dad-11d1-80b4-00c04fd430c8', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', false),
  ('Avis sur le nouveau restaurant qui a ouvert rue Lallouette ? Ça vaut le coup ?', '550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours', false),
  ('Quelqu''un a déjà testé la fibre Orange à Macouria ? C''est stable ?', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', false),

  -- Entraide / Avertissements
  ('⚠️ Attention : une arnaque circule sur Facebook Marketplace concernant des locations de vacances. Ne payez jamais par coupon PCS !', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', false),
  ('Besoin de conseils pour les démarches d''installation en Guyane (venant de métropole). Par quoi commencer ?', '6ba7b811-9dad-11d1-80b4-00c04fd430c8', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', false),
  ('Je donne des cartons de déménagement si ça intéresse quelqu''un. À venir chercher sur Cayenne.', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '8 hours', false),
  ('Qui aurait des recommandations pour un club de sport sympa pour débutants sur Matoury ?', '550e8401-e29b-41d4-a716-446655440000', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', false),
  ('Recherche covoiturage Cayenne -> Saint-Laurent pour vendredi soir. Participation aux frais bien sûr.', '550e8400-e29b-41d4-a716-446655440000', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', false),
  ('Sait-on quand la route de l''Est sera rouverte normalement ?', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', false);
