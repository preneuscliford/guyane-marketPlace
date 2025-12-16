import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // La gestion PKCE/OAuth est effectuée côté client via Supabase JS

  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
