import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const targetHost = "www.mcguyane.com";

  // Ignorer les redirections pour localhost et développement local
  if (host.includes("localhost") || host.includes("127.0.0.1") || host.startsWith("192.168")) {
    return NextResponse.next();
  }

  // Rediriger tous les domaines/variantes vers https://www.mcguyane.com
  if (host !== targetHost) {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = targetHost;
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-touch-icon.png|manifest.json).*)",
  ],
};
