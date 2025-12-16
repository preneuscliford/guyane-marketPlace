-- Sécuriser les vues publiques pour respecter les politiques RLS
-- Passage en SECURITY INVOKER afin d'utiliser les permissions de l'appelant
ALTER VIEW public.reports_with_users SET (security_invoker = true);
ALTER VIEW public.users_with_moderation_info SET (security_invoker = true);
COMMIT;
