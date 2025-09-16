import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Route de callback pour l'authentification OAuth (Google, etc.)
 * Gère l'échange du code d'autorisation contre une session utilisateur
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // Utiliser NEXT_PUBLIC_SITE_URL ou fallback sur l'origin de la requête
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      // Échange le code d'autorisation contre une session
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Erreur lors de l\'échange du code OAuth:', error);
      // Rediriger vers la page d'authentification avec une erreur
      return NextResponse.redirect(new URL("/auth?error=oauth_error", siteUrl));
    }
  }

  // Rediriger vers la page d'accueil après une authentification réussie
  return NextResponse.redirect(new URL("/", siteUrl));
}