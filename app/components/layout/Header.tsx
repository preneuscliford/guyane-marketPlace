"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/Button";

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Annonces", href: "/annonces" },
    { name: "Actualités", href: "/actualites" },
  ];

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Guyane Marketplace
            </Link>
            <div className="ml-10 hidden space-x-8 md:block">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium ${
                    pathname === link.href
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="ml-10 space-x-4">
            {user ? (
              <Button variant="outline" asChild>
                <Link href="/profile">Mon Profil</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/auth">Connexion</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
