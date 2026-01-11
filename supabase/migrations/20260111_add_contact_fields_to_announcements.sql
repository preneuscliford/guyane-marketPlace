-- Ajouter les champs de contact à la table announcements
-- phone_number: Numéro de téléphone optionnel du vendeur
-- contact_email: Email de contact optionnel (null = utiliser l'email du profil)

ALTER TABLE announcements
ADD COLUMN phone_number VARCHAR(20),
ADD COLUMN contact_email VARCHAR(255);

-- Créer des indices pour les recherches rapides
CREATE INDEX idx_announcements_phone_number ON announcements(phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX idx_announcements_contact_email ON announcements(contact_email) WHERE contact_email IS NOT NULL;

-- Ajouter des commentaires aux colonnes
COMMENT ON COLUMN announcements.phone_number IS 'Numéro de téléphone de contact optionnel du vendeur';
COMMENT ON COLUMN announcements.contact_email IS 'Adresse email de contact optionnelle (null = utiliser l''email du profil utilisateur)';
