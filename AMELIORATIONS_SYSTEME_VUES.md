# Améliorations du Système de Vues des Services

## Problème Actuel

Le système de vues actuel présente plusieurs limitations :

1. **Comptage multiple** : Un même utilisateur peut incrémenter les vues plusieurs fois en visitant la page
2. **Pas de distinction** : Aucune différence entre vues uniques et vues totales
3. **Pas de tracking temporel** : Impossible de savoir quand les vues ont eu lieu
4. **Pas de filtrage** : Les vues du propriétaire du service sont comptées

## Solutions Proposées

### 1. Système de Vues Uniques

#### Création d'une table `service_views`
```sql
CREATE TABLE service_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT,
  UNIQUE(service_id, user_id),
  UNIQUE(service_id, ip_address, session_id)
);
```

#### Modification de la table `services`
```sql
ALTER TABLE services 
ADD COLUMN unique_views INTEGER DEFAULT 0,
ADD COLUMN total_views INTEGER DEFAULT 0;
```

### 2. Fonction de Comptage Intelligent

```sql
CREATE OR REPLACE FUNCTION increment_service_views(
  p_service_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_is_new_view BOOLEAN := FALSE;
  v_is_owner BOOLEAN := FALSE;
  v_result JSON;
BEGIN
  -- Vérifier si l'utilisateur est le propriétaire du service
  SELECT (user_id = p_user_id) INTO v_is_owner
  FROM services 
  WHERE id = p_service_id;
  
  -- Ne pas compter les vues du propriétaire
  IF v_is_owner THEN
    RETURN json_build_object(
      'success', true,
      'is_new_view', false,
      'reason', 'owner_view'
    );
  END IF;
  
  -- Essayer d'insérer une nouvelle vue
  BEGIN
    INSERT INTO service_views (service_id, user_id, ip_address, session_id)
    VALUES (p_service_id, p_user_id, p_ip_address, p_session_id);
    
    v_is_new_view := TRUE;
    
    -- Incrémenter les compteurs
    UPDATE services 
    SET 
      unique_views = unique_views + 1,
      total_views = total_views + 1,
      updated_at = NOW()
    WHERE id = p_service_id;
    
  EXCEPTION WHEN unique_violation THEN
    -- Vue déjà enregistrée, incrémenter seulement total_views
    UPDATE services 
    SET 
      total_views = total_views + 1,
      updated_at = NOW()
    WHERE id = p_service_id;
  END;
  
  RETURN json_build_object(
    'success', true,
    'is_new_view', v_is_new_view
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Hook Amélioré

```typescript
// hooks/useServiceViews.ts
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

interface ViewResult {
  success: boolean;
  is_new_view: boolean;
  reason?: string;
}

export function useServiceViews() {
  const { user } = useAuth();
  const [sessionId] = useState(() => 
    typeof window !== 'undefined' 
      ? sessionStorage.getItem('session_id') || generateSessionId()
      : null
  );

  // Générer un ID de session unique
  const generateSessionId = useCallback(() => {
    const id = Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('session_id', id);
    }
    return id;
  }, []);

  // Obtenir l'adresse IP du client
  const getClientIP = useCallback(async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  }, []);

  // Incrémenter les vues de manière intelligente
  const incrementViews = useCallback(async (serviceId: string): Promise<ViewResult> => {
    try {
      const ip = await getClientIP();
      
      const { data, error } = await supabase.rpc('increment_service_views', {
        p_service_id: serviceId,
        p_user_id: user?.id || null,
        p_ip_address: ip,
        p_session_id: sessionId
      });

      if (error) throw error;
      
      return data as ViewResult;
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des vues:', error);
      return { success: false, is_new_view: false };
    }
  }, [user?.id, sessionId, getClientIP]);

  return {
    incrementViews,
    sessionId
  };
}
```

### 4. Composant d'Affichage Amélioré

```typescript
// components/services/ServiceViewsDisplay.tsx
import { Eye, Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ServiceViewsDisplayProps {
  uniqueViews: number;
  totalViews: number;
  showDetailed?: boolean;
}

export function ServiceViewsDisplay({ 
  uniqueViews, 
  totalViews, 
  showDetailed = false 
}: ServiceViewsDisplayProps) {
  if (showDetailed) {
    return (
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{uniqueViews} visiteurs uniques</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nombre de personnes différentes ayant vu ce service</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{totalViews} vues totales</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nombre total de visites (incluant les visites répétées)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm text-gray-600">
      <Eye className="h-4 w-4" />
      <span>{uniqueViews} vues</span>
    </div>
  );
}
```

### 5. Analytics Avancées

```typescript
// hooks/useServiceAnalytics.ts
export function useServiceAnalytics(serviceId: string) {
  const [analytics, setAnalytics] = useState({
    viewsToday: 0,
    viewsThisWeek: 0,
    viewsThisMonth: 0,
    topReferrers: [],
    viewsByHour: [],
    uniqueVisitors: 0
  });

  const fetchAnalytics = useCallback(async () => {
    const { data, error } = await supabase.rpc('get_service_analytics', {
      p_service_id: serviceId
    });
    
    if (data && !error) {
      setAnalytics(data);
    }
  }, [serviceId]);

  return { analytics, fetchAnalytics };
}
```

## Avantages de cette Approche

1. **Précision** : Distinction entre vues uniques et totales
2. **Anti-spam** : Évite les comptages multiples abusifs
3. **Analytics** : Données plus riches pour les propriétaires de services
4. **Performance** : Optimisé avec des index sur les colonnes importantes
5. **Respect de la vie privée** : Possibilité de fonctionner sans cookies
6. **Flexibilité** : Peut s'adapter aux utilisateurs connectés et anonymes

## Migration

1. Créer les nouvelles tables et fonctions
2. Migrer les données existantes
3. Mettre à jour les composants
4. Tester en parallèle
5. Basculer progressivement

## Recommandations

- Implémenter d'abord la version simple (vues uniques par utilisateur/IP)
- Ajouter progressivement les analytics avancées
- Considérer l'ajout d'un cache Redis pour les gros volumes
- Prévoir une purge périodique des anciennes données de vues