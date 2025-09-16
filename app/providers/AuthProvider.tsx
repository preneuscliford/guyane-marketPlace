"use client";

import { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { AuthUser, UseAuthReturn } from "@/hooks/useAuth";

export const AuthContext = createContext<UseAuthReturn>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({}),
  signInWithGoogle: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  updateProfile: async () => ({}),
  resetPassword: async () => ({}),
  updatePassword: async () => ({}),
  isAuthenticated: false,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check active session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          setSession(session);
          const { user } = session;
          if (user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .single();

            setUser({ ...user, profile } as AuthUser);
          }
        }

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          setSession(session);
          if (session?.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            setUser({ ...session.user, profile } as AuthUser);
          } else {
            setUser(null);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: error as Error };
    }
  };

  /**
   * Connexion avec Google OAuth
   */
  const signInWithGoogle = async () => {
    try {
      // Utiliser NEXT_PUBLIC_SITE_URL en priorité, sinon window.location.origin
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      console.log("🔗 OAuth Redirect URL:", `${siteUrl}/auth/callback`);
      console.log("🌍 Site URL:", siteUrl);
      console.log("🪟 Window origin:", window.location.origin);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });
      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // Vérifier d'abord si le nom d'utilisateur est disponible
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .single();

      if (existingUser) {
        throw new Error(
          "Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre."
        );
      }

      // Créer le compte utilisateur avec les métadonnées
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            full_name: "",
          },
        },
      });

      if (error) throw error;

      return { data };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: Partial<AuthUser["profile"]>) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id);

      if (error) throw error;

      // Correction du typage pour setUser
      setUser((prev: AuthUser | null): AuthUser | null => {
        if (!prev) return null;
        return {
          ...prev,
          profile: { ...prev.profile, ...data },
        } as AuthUser;
      });

      return {};
    } catch (error) {
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return {};
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return {};
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        updateProfile,
        resetPassword,
        updatePassword,
        isAuthenticated: !!user && !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
