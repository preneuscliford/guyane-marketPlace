-- Migration: Ajouter la colonne is_admin à la table profiles
-- Permet de marquer certains utilisateurs comme administrateurs avec badge

-- 1. Ajouter la colonne is_admin si elle n'existe pas
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Créer un index pour les requêtes sur les admin
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- 3. Assigner le rôle admin à l'utilisateur spécifié
UPDATE profiles
SET is_admin = TRUE
WHERE id = '7169064c-25d9-4143-95ca-bbca16316ab7';

-- Vérification
SELECT id, username, is_admin FROM profiles WHERE is_admin = TRUE;
