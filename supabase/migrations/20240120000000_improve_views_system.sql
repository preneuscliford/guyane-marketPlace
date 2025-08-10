-- Migration pour améliorer le système de vues des services
-- Création d'une table pour tracker les vues uniques

-- 1. Créer la table service_views pour tracker les vues individuelles
CREATE TABLE IF NOT EXISTS service_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Ajouter des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_service_views_service_id ON service_views(service_id);
CREATE INDEX IF NOT EXISTS idx_service_views_user_id ON service_views(user_id);
CREATE INDEX IF NOT EXISTS idx_service_views_ip_session ON service_views(ip_address, session_id);
CREATE INDEX IF NOT EXISTS idx_service_views_viewed_at ON service_views(viewed_at);

-- 3. Créer une contrainte unique pour éviter les doublons par utilisateur
CREATE UNIQUE INDEX IF NOT EXISTS idx_service_views_unique_user 
ON service_views(service_id, user_id) 
WHERE user_id IS NOT NULL;

-- 4. Créer une contrainte unique pour éviter les doublons par IP/session
CREATE UNIQUE INDEX IF NOT EXISTS idx_service_views_unique_session 
ON service_views(service_id, ip_address, session_id) 
WHERE ip_address IS NOT NULL AND session_id IS NOT NULL;

-- 5. Ajouter les nouvelles colonnes à la table services
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS unique_views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_views INTEGER DEFAULT 0;

-- 6. Migrer les données existantes (views -> total_views et unique_views)
UPDATE services 
SET 
  total_views = COALESCE(views, 0),
  unique_views = COALESCE(views, 0)
WHERE total_views = 0 AND unique_views = 0;

-- 7. Fonction pour incrémenter les vues de manière intelligente
CREATE OR REPLACE FUNCTION increment_service_views(
  p_service_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_is_new_unique_view BOOLEAN := FALSE;
  v_is_owner BOOLEAN := FALSE;
  v_service_exists BOOLEAN := FALSE;
BEGIN
  -- Vérifier si le service existe et si l'utilisateur est le propriétaire
  SELECT 
    TRUE,
    (user_id = p_user_id)
  INTO 
    v_service_exists,
    v_is_owner
  FROM services 
  WHERE id = p_service_id;
  
  -- Si le service n'existe pas
  IF NOT v_service_exists THEN
    RETURN json_build_object(
      'success', false,
      'error', 'service_not_found'
    );
  END IF;
  
  -- Ne pas compter les vues du propriétaire
  IF v_is_owner THEN
    RETURN json_build_object(
      'success', true,
      'is_new_unique_view', false,
      'reason', 'owner_view'
    );
  END IF;
  
  -- Essayer d'insérer une nouvelle vue unique
  BEGIN
    INSERT INTO service_views (
      service_id, 
      user_id, 
      ip_address, 
      session_id,
      user_agent
    )
    VALUES (
      p_service_id, 
      p_user_id, 
      p_ip_address, 
      p_session_id,
      p_user_agent
    );
    
    v_is_new_unique_view := TRUE;
    
    -- Incrémenter les deux compteurs pour une vue unique
    UPDATE services 
    SET 
      unique_views = unique_views + 1,
      total_views = total_views + 1,
      updated_at = NOW()
    WHERE id = p_service_id;
    
  EXCEPTION WHEN unique_violation THEN
    -- Vue déjà enregistrée pour cet utilisateur/session
    -- Incrémenter seulement total_views
    UPDATE services 
    SET 
      total_views = total_views + 1,
      updated_at = NOW()
    WHERE id = p_service_id;
    
    v_is_new_unique_view := FALSE;
  END;
  
  RETURN json_build_object(
    'success', true,
    'is_new_unique_view', v_is_new_unique_view,
    'reason', CASE 
      WHEN v_is_new_unique_view THEN 'new_unique_view'
      ELSE 'repeat_view'
    END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Fonction pour obtenir les statistiques de vues d'un service
CREATE OR REPLACE FUNCTION get_service_view_stats(p_service_id UUID)
RETURNS JSON AS $$
DECLARE
  v_stats JSON;
BEGIN
  SELECT json_build_object(
    'unique_views', s.unique_views,
    'total_views', s.total_views,
    'views_today', (
      SELECT COUNT(*) 
      FROM service_views sv 
      WHERE sv.service_id = p_service_id 
        AND sv.viewed_at >= CURRENT_DATE
    ),
    'views_this_week', (
      SELECT COUNT(*) 
      FROM service_views sv 
      WHERE sv.service_id = p_service_id 
        AND sv.viewed_at >= DATE_TRUNC('week', CURRENT_DATE)
    ),
    'views_this_month', (
      SELECT COUNT(*) 
      FROM service_views sv 
      WHERE sv.service_id = p_service_id 
        AND sv.viewed_at >= DATE_TRUNC('month', CURRENT_DATE)
    )
  )
  INTO v_stats
  FROM services s
  WHERE s.id = p_service_id;
  
  RETURN COALESCE(v_stats, json_build_object(
    'error', 'service_not_found'
  ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Politique de sécurité RLS pour service_views
ALTER TABLE service_views ENABLE ROW LEVEL SECURITY;

-- Permettre à tous de créer des vues (pour le tracking)
CREATE POLICY "Anyone can create service views" ON service_views
  FOR INSERT WITH CHECK (true);

-- Permettre aux propriétaires de services de voir les vues de leurs services
CREATE POLICY "Service owners can view their service views" ON service_views
  FOR SELECT USING (
    service_id IN (
      SELECT id FROM services WHERE user_id = auth.uid()
    )
  );

-- Permettre aux utilisateurs de voir leurs propres vues
CREATE POLICY "Users can view their own views" ON service_views
  FOR SELECT USING (user_id = auth.uid());

-- 10. Fonction de nettoyage des anciennes vues (optionnel)
CREATE OR REPLACE FUNCTION cleanup_old_service_views(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM service_views 
  WHERE viewed_at < NOW() - INTERVAL '1 day' * days_to_keep;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;