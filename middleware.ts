import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const targetHost = "www.mcguyane.com";

  // Rediriger tous les domaines/variantes vers https://www.mcguyane.com
  if (host !== targetHost) {
    url.protocol = "https:";
    url.hostname = targetHost;
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-touch-icon.png|manifest.json).*)"],
};
