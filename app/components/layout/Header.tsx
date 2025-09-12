"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  Menu,
  Bell,
  User,
  LogOut,
  Plus,
  ShoppingBag,
  Search,
  X,
  Shield,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function Header({ className }: { className?: string }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isCreateAnnouncePage = pathname === "/annonces/nouvelle";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfileMenuClick = () => {
    setIsProfileMenuOpen(false);
  };

  const handlePublish = () => {
    router.push("/annonces/nouvelle");
  };

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Services", href: "/services" },
    { name: "Annonces", href: "/annonces" },
    { name: "Communauté", href: "/communaute" },
    ...(user ? [{ name: "Mes Publicités", href: "/publicites" }] : []),
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md z-[9999] border-b border-gray-200 shadow-sm ${
        className || ""
      }`}
    >
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
          {/* Logo et Navigation */}
          <div className="flex items-center min-w-0 flex-shrink-0">
            <Link href="/" className="flex items-center">
              <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
              <span className="ml-2 sm:ml-4 text-base sm:text-xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-500 bg-clip-text text-transparent whitespace-nowrap hidden xs:block">
                Blada Market
              </span>
              <span className="ml-2 text-sm font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-500 bg-clip-text text-transparent whitespace-nowrap xs:hidden">
                BM
              </span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          {!isCreateAnnouncePage && (
            <nav className="hidden lg:flex lg:space-x-6 xl:space-x-8 flex-shrink-0">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-gray-700 hover:text-purple-600 font-medium whitespace-nowrap text-sm xl:text-base ${
                    pathname === item.href ? "text-purple-600" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-xs">
            <SearchBar />
          </div>

          {/* Mobile Search Toggle */}
          <div className="lg:hidden">
            {isSearchOpen ? (
              <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-2 sm:p-4 z-[10000] shadow-lg">
                <div className="flex items-center space-x-2">
                  <SearchBar className="flex-1" />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-colors duration-300"
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5" />
            </button>

            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex bg-white hover:bg-purple-50 border-gray-200 text-gray-700 hover:text-purple-600 shadow-sm transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3"
                  onClick={handlePublish}
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Publier</span>
                  <span className="sm:hidden">+</span>
                </Button>

                <button
                  type="button"
                  className="relative p-1.5 sm:p-2 text-gray-600 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-colors duration-300"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-purple-600 animate-pulse" />
                </button>

                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                      setIsProfileMenuOpen(!isProfileMenuOpen);
                    }}
                    className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-full hover:bg-purple-50 transition-all duration-300"
                  >
                    <div className="relative h-6 w-6 sm:h-8 sm:w-8 rounded-full overflow-hidden ring-1 sm:ring-2 ring-purple-100">
                      <Image
                        src={user.profile?.avatar_url || "/default-avatar.svg"}
                        alt="Avatar"
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <span className="hidden lg:block text-gray-700 text-sm">
                      {user.profile?.username || "User"}
                    </span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-100 transform transition-all duration-300 z-[10001]">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          onClick={handleProfileMenuClick}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Mon Profil
                        </Link>
                        <Link
                          href="/favoris"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          onClick={handleProfileMenuClick}
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          Mes Favoris
                        </Link>
                        <Link
                          href="/publicites"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          onClick={handleProfileMenuClick}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Mes Publicités
                        </Link>
                        <Link
                          href="/parametres/pwa"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                          onClick={handleProfileMenuClick}
                        >
                          <Menu className="h-4 w-4 mr-2" />
                          Paramètres
                        </Link>
                        {/* Lien Admin pour les administrateurs */}
                        {user?.profile?.role === "admin" && (
                          <>
                            <Link
                              href="/admin/moderation"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                              onClick={handleProfileMenuClick}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Modération
                            </Link>
                            <Link
                              href="/admin/feedback"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                              onClick={handleProfileMenuClick}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Feedbacks
                            </Link>
                          </>
                        )}
                        <div className="border-t border-gray-100 my-1"></div>
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
              <div className="flex space-x-1 sm:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-200 hover:bg-purple-50 text-xs sm:text-sm px-2 sm:px-3"
                  asChild
                >
                  <Link href="/auth">
                    <span className="hidden sm:inline">Connexion</span>
                    <span className="sm:hidden">Login</span>
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm px-2 sm:px-3"
                  asChild
                >
                  <Link href="/auth?mode=signup">
                    <span className="hidden sm:inline">Inscription</span>
                    <span className="sm:hidden">Sign up</span>
                  </Link>
                </Button>
              </div>
            )}

            <button
              type="button"
              className="lg:hidden p-1.5 sm:p-2"
              onClick={() => {
                if (isProfileMenuOpen) setIsProfileMenuOpen(false);
                if (isSearchOpen) setIsSearchOpen(false);
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 sm:py-4 border-t bg-white z-[10000] relative">
            <div className="lg:hidden mb-3 sm:mb-4">
              <SearchBar className="" />
            </div>
            <nav className="space-y-1 sm:space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-sm sm:text-base font-medium whitespace-nowrap ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary shadow-soft"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <Link
                  href="/annonces/nouvelle"
                  className="sm:hidden block px-3 py-2 rounded-md text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-t border-gray-100 mt-2 pt-3"
                >
                  <Plus className="h-4 w-4 mr-2 inline" />
                  Publier une annonce
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
