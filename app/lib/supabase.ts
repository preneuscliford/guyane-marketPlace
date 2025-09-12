import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client principal pour l'authentification et les requêtes générales
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Crée un client Supabase authentifié avec le token de l'utilisateur actuel
 * Utilise la session active pour inclure le token d'accès dans les en-têtes
 */
export const createAuthenticatedClient = async () => {
  try {
    // Récupérer la session actuelle
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      console.warn('Aucune session active trouvée');
      return null;
    }

    // Créer un nouveau client avec le token d'accès
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${session.access_token}`
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du client authentifié:', error);
    return null;
  }
};

/**
 * Crée un client Supabase administrateur avec la clé de service
 * À utiliser uniquement pour les opérations administratives
 */
export const createAdminClient = () => {
  const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    console.error('Clé de service Supabase non trouvée');
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
