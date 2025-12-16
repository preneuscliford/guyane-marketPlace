-- Activer RLS et définir des politiques de sécurité sur public.feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Lecture: nous limiterons ensuite aux authentifiés dans une migration dédiée
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='feedback' AND policyname='feedback_select_public'
  ) THEN
    CREATE POLICY feedback_select_public
      ON public.feedback FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- Insertion: seuls les utilisateurs authentifiés peuvent créer pour eux-mêmes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='feedback' AND policyname='feedback_insert_own'
  ) THEN
    CREATE POLICY feedback_insert_own
      ON public.feedback FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Mise à jour: propriétaire uniquement
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='feedback' AND policyname='feedback_update_own'
  ) THEN
    CREATE POLICY feedback_update_own
      ON public.feedback FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Suppression: propriétaire uniquement
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='feedback' AND policyname='feedback_delete_own'
  ) THEN
    CREATE POLICY feedback_delete_own
      ON public.feedback FOR DELETE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;
COMMIT;
