"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log('🔒 ProtectedLayout - User:', user?.id, 'Loading:', loading);
  console.log('🔒 ProtectedLayout - User profile:', user?.profile);

  useEffect(() => {
    console.log('🔒 ProtectedLayout useEffect - User:', user?.id, 'Loading:', loading);
    if (!loading && !user) {
      console.log('🔒 ProtectedLayout - Redirecting to auth...');
      router.push("/auth");
    } else if (!loading && user && !user.profile) {
      console.log('🚨 User has no profile, forcing logout...');
      supabase.auth.signOut().then(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/auth';
      });
    }
  }, [user, loading, router]);

  if (loading) {
    console.log('🔒 ProtectedLayout - Showing loading...');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    console.log('🔒 ProtectedLayout - No user, returning null...');
    return null;
  }

  console.log('🔒 ProtectedLayout - Rendering children for user:', user.id);
  return <>{children}</>;
}
