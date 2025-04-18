"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { Menu, Bell, User, LogOut, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function Header() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handlePublish = () => {
    router.push("/annonces/nouvelle");
  };

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Annonces", href: "/annonces" },
    { name: "Actualités", href: "/actualites" },
  ];

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-foreground">
              Guyane Market
            </Link>
            
            <nav className="hidden md:ml-8 md:flex md:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex md:w-1/3 mx-4">
            <SearchBar className="w-full" />
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex"
                  onClick={handlePublish}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Publier
                </Button>

                <button 
                  type="button"
                  className="relative p-2 text-foreground/60 hover:text-foreground"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
                </button>

                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
                  >
                    <img
                      src={user.profile?.avatar_url || "/default-avatar.png"}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="hidden md:block">
                      {user.profile?.username || 'User'}
                    </span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-card shadow-lg border border-border">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth">Connexion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth?mode=signup">Inscription</Link>
                </Button>
              </div>
            )}

            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <SearchBar className="mb-4" />
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
