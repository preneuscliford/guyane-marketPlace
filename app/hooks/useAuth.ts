import { useContext, useEffect } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";

export interface AuthUser extends User {
  profile?: {
    username: string;
    avatar_url?: string;
    full_name?: string;
    bio?: string;
    location?: string;
  };
}

export interface UseAuthReturn {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: Error }>;
  signUp: (email: string, password: string) => Promise<{ error?: Error }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser['profile']>) => Promise<{ error?: Error }>;
  resetPassword: (email: string) => Promise<{ error?: Error }>;
  updatePassword: (newPassword: string) => Promise<{ error?: Error }>;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }

  const isAuthenticated = !!context.user && !!context.session;

  return {
    ...context,
    isAuthenticated,
  };
}

// Custom hook for protected routes
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, loading, router]);

  return { user, loading };
}

// Custom hook for auth state persistence
export function usePersistAuth() {
  const { user, session } = useAuth();

  useEffect(() => {
    if (session) {
      localStorage.setItem('auth_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('auth_session');
    }
  }, [session]);

  return { user, session };
}
