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
    // La gestion PKCE/OAuth est effectuée côté client via Supabase JS
  }

  // Rediriger vers la page d'accueil après une authentification réussie
  return NextResponse.redirect(new URL("/", siteUrl));
}
