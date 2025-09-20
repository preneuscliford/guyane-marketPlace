import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import StructuredData from "./StructuredData";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Composant de fil d'Ariane optimisé SEO pour la navigation
 * Inclut les données structurées pour un meilleur référencement
 */
export default function Breadcrumbs({
  items,
  className = "",
}: BreadcrumbsProps) {
  // Ajouter la page d'accueil au début si elle n'y est pas
  const breadcrumbItems =
    items[0]?.url !== "/" ? [{ name: "Accueil", url: "/" }, ...items] : items;

  return (
    <>
      {/* Données structurées pour Google */}
      <StructuredData type="BreadcrumbList" breadcrumbs={breadcrumbItems} />

      {/* Interface utilisateur */}
      <nav
        aria-label="Fil d'Ariane"
        className={`bg-white border-b border-gray-200 ${className}`}
      >
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbItems.map((item, index) => (
              <li key={item.url} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}

                {index === breadcrumbItems.length - 1 ? (
                  // Dernier élément - page actuelle
                  <span className="font-medium text-gray-900 flex items-center">
                    {index === 0 && <Home className="w-4 h-4 mr-1" />}
                    {item.name}
                  </span>
                ) : (
                  // Liens de navigation
                  <Link
                    href={item.url}
                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                  >
                    {index === 0 && <Home className="w-4 h-4 mr-1" />}
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
