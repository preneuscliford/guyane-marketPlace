import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const targetHost = "www.mcguyane.com";
  const targetProtocol = "https";

  // Ignorer les redirections pour localhost et développement local
  if (host.includes("localhost") || host.includes("127.0.0.1") || host.startsWith("192.168")) {
    return NextResponse.next();
  }

  // Rediriger tous les domaines/variantes vers https://www.mcguyane.com
  // Cela couvre:
  // - http://mcguyane.com → https://www.mcguyane.com
  // - https://mcguyane.com → https://www.mcguyane.com
  // - http://www.mcguyane.com → https://www.mcguyane.com
  // - Tout autre domaine → https://www.mcguyane.com
  if (host !== targetHost || protocol !== targetProtocol) {
    const url = req.nextUrl.clone();
    url.protocol = `${targetProtocol}:`;
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
