import {
  ShoppingBag,
  Briefcase,
  Leaf,
  Compass,
  Utensils,
  Camera,
  Scissors,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
  href: string;
}

const CategoryCard: React.FC<CategoryProps> = ({
  icon,
  title,
  count,
  color,
  href,
}) => {
  return (
    <Link href={href} className="group block">
      <Card className="relative overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
        <div
          className={`absolute inset-0 ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
        />
        <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 text-center h-32 xs:h-36 sm:h-40 md:h-44">
          <div
            className={`p-2 sm:p-2.5 md:p-3 rounded-full ${color} bg-opacity-10 mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <div className="[&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6 md:[&>svg]:h-7 md:[&>svg]:w-7">
              {icon}
            </div>
          </div>
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-1 leading-tight px-1">
            {title}
          </h3>
          {/* Nombres masqués temporairement */}
          {false && (
            <p className="text-gray-500 text-xs sm:text-sm">{count} annonces</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export function Categories() {
  const categories = [
    {
      icon: <Scissors className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600" />,
      title: "Artisanat",
      count: 78,
      color: "bg-indigo-600",
      href: "/marketplace/artisanat",
    },
    {
      icon: <Briefcase className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />,
      title: "Services",
      count: 192,
      color: "bg-blue-600",
      href: "/marketplace/services",
    },
    {
      icon: <Leaf className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600" />,
      title: "Agriculture",
      count: 54,
      color: "bg-emerald-600",
      href: "/marketplace/agriculture",
    },
    {
      icon: <Compass className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600" />,
      title: "Tourisme",
      count: 67,
      color: "bg-amber-600",
      href: "/marketplace/tourisme",
    },
    {
      icon: <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />,
      title: "Produits",
      count: 234,
      color: "bg-purple-600",
      href: "/marketplace/produits",
    },
    {
      icon: <Utensils className="h-6 w-6 sm:h-7 sm:w-7 text-red-600" />,
      title: "Restauration",
      count: 89,
      color: "bg-red-600",
      href: "/marketplace/restauration",
    },
    {
      icon: <Camera className="h-6 w-6 sm:h-7 sm:w-7 text-teal-600" />,
      title: "Événements",
      count: 46,
      color: "bg-teal-600",
      href: "/marketplace/evenements",
    },
    {
      icon: <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-pink-600" />,
      title: "Bien-être",
      count: 54,
      color: "bg-pink-600",
      href: "/marketplace/bien-etre",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Explorez nos catégories
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
            Découvrez tous les services et produits disponibles dans notre
            marketplace
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
