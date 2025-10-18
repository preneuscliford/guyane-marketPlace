import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo et description */}
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="mb-8 md:mb-0 md:max-w-sm">
            <Link href="/" className="flex items-center mb-4">
              <ShoppingBag className="h-8 w-8 text-purple-400" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-teal-300 bg-clip-text text-transparent">
                mcGuyane
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              La première plateforme dédiée aux services et annonces en Guyane.
              Rejoignez notre communauté et découvrez tout ce que la Guyane a à
              offrir.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-white text-lg mb-4">
                À propos
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    Qui sommes-nous
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white text-lg mb-4">
                Services
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/annonces"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    Annonces
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marketplace"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    href="/communaute"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    Communauté
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white text-lg mb-4">
                Paramètres
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/parametres/pwa"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    Paramètres PWA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    Conditions d&apos;utilisation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    Politique de cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-4 pt-8 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Guyane Marketplace. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
