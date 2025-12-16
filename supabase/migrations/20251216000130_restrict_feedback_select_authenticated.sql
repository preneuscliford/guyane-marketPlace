-- Restreindre la lecture des feedbacks aux utilisateurs authentifiés
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='feedback' AND policyname='feedback_select_public'
  ) THEN
    DROP POLICY feedback_select_public ON public.feedback;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='feedback' AND policyname='feedback_select_authenticated'
  ) THEN
    CREATE POLICY feedback_select_authenticated
      ON public.feedback FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;
COMMIT;
