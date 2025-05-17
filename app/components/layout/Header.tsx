"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { Menu, Bell, User, LogOut, Plus, ShoppingBag } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function Header({ className }: { className?: string }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isCreateAnnouncePage = pathname === '/annonces/nouvelle';
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
    <header className={`fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200 shadow-sm ${className || ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-500 bg-clip-text text-transparent">Blada Market</span>
            </Link>
            
            {!isCreateAnnouncePage && (
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-gray-700 hover:text-purple-600 font-medium ${pathname === item.href ? 'text-purple-600' : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="hidden md:block w-full max-w-md mx-4">
            <SearchBar />
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex bg-white hover:bg-purple-50 border-gray-200 text-gray-700 hover:text-purple-600 shadow-sm transition-all duration-300"
                  onClick={handlePublish}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Publier
                </Button>

                <button 
                  type="button"
                  className="relative p-2 text-gray-600 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-colors duration-300"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-purple-600 animate-pulse" />
                </button>

                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-purple-50 transition-all duration-300"
                  >
                    <div className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-purple-100">
                      <Image
                        src={user.profile?.avatar_url || "/default-avatar.png"}
                        alt="Avatar"
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <span className="hidden md:block text-gray-700">
                      {user.profile?.username || 'User'}
                    </span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-100 transform transition-all duration-300">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
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
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50" asChild>
                  <Link href="/auth">Connexion</Link>
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700" asChild>
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
                      ? "bg-primary/10 text-primary shadow-soft"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
