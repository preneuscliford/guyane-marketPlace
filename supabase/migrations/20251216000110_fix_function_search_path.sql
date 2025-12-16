-- Fixer le search_path des fonctions pour éviter toute résolution mutable
-- Nous restreignons la recherche aux schémas sûrs: pg_catalog, public
ALTER FUNCTION public.ban_user(p_user_id uuid, p_moderator_id uuid, p_reason text, p_duration_hours integer)
  SET search_path = pg_catalog, public;
ALTER FUNCTION public.unban_user(p_user_id uuid, p_moderator_id uuid)
  SET search_path = pg_catalog, public;
ALTER FUNCTION public.send_warning(p_user_id uuid, p_moderator_id uuid, p_warning_type character varying, p_message text)
  SET search_path = pg_catalog, public;
ALTER FUNCTION public.generate_username_from_fullname(full_name_input text, user_id uuid)
  SET search_path = pg_catalog, public;
ALTER FUNCTION public.get_moderation_stats()
  SET search_path = pg_catalog, public;
ALTER FUNCTION public.get_service_view_stats(p_service_id uuid)
  SET search_path = pg_catalog, public;
ALTER FUNCTION public.increment_service_views(p_service_id uuid, p_user_id uuid, p_ip_address inet, p_session_id text, p_user_agent text)
  SET search_path = pg_catalog, public;
ALTER FUNCTION public.update_updated_at_column()
  SET search_path = pg_catalog, public;
ALTER FUNCTION public.update_advertisement_stats()
  SET search_path = pg_catalog, public;
COMMIT;
