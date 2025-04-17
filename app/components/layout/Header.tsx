"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export function Header() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-lg font-semibold text-slate-800 hover:text-teal-600 transition-colors"
          >
            Guyane Marketplace
          </Link>
          {user && (
            <nav className="hidden md:flex items-center space-x-2">
              <Link
                href="/marketplace"
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive("/marketplace")
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                Services
              </Link>
              <Link
                href="/annonces"
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive("/annonces")
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                Annonces
              </Link>
              <Link
                href="/actualites"
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive("/actualites")
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                Actualités
              </Link>
              <Link
                href="/messages"
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive("/messages")
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                Messages
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="hidden md:inline text-sm text-slate-600">
                {user.email}
              </span>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <Button
              asChild
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Link href="/auth">Connexion</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
