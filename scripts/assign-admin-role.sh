#!/bin/bash
# Script pour assigner le rôle admin à l'utilisateur

# Note: Cette migration sera exécutée automatiquement la prochaine fois que vous déployez
# sur Supabase. Vous pouvez aussi l'exécuter manuellement dans l'SQL Editor de Supabase.

cat << 'EOF'
=============================================================================
MIGRATION ADMIN: Assigner le rôle admin à l'utilisateur
=============================================================================

À exécuter dans Supabase SQL Editor:

-- 1. Ajouter la colonne is_admin si elle n'existe pas
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Créer un index pour les requêtes sur les admin
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- 3. Assigner le rôle admin à l'utilisateur spécifié
UPDATE profiles
SET is_admin = TRUE
WHERE id = '7169064c-25d9-4143-95ca-bbca16316ab7';

-- 4. Vérification
SELECT id, username, is_admin FROM profiles WHERE is_admin = TRUE;

=============================================================================
RÉSULTAT ATTENDU:
- La colonne is_admin sera ajoutée à la table profiles
- L'utilisateur 7169064c-25d9-4143-95ca-bbca16316ab7 sera marqué comme admin
- Un badge "Admin" avec une couronne apparaîtra sur son profil
- Le badge apparaîtra également sur tous ses posts dans la communauté

=============================================================================
EOF
