import { ShoppingBag, Briefcase, Leaf, Compass, Utensils, Camera, Scissors, Heart } from 'lucide-react';
import Link from 'next/link';

interface CategoryProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
  href: string;
}

const CategoryCard: React.FC<CategoryProps> = ({ icon, title, count, color, href }) => {
  return (
    <Link 
      href={href}
      className="group relative overflow-hidden bg-white rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className={`absolute inset-0 ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <div className="flex flex-col items-center justify-center p-6 text-center h-48">
        <div className={`p-3 rounded-full ${color} bg-opacity-10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-500">{count} annonces</p>
      </div>
    </Link>
  );
};

export function Categories() {
  const categories = [
    { icon: <Scissors className="h-7 w-7 text-indigo-600" />, title: "Artisanat", count: 78, color: "bg-indigo-600", href: "/marketplace/artisanat" },
    { icon: <Briefcase className="h-7 w-7 text-blue-600" />, title: "Services", count: 192, color: "bg-blue-600", href: "/marketplace/services" },
    { icon: <Leaf className="h-7 w-7 text-emerald-600" />, title: "Agriculture", count: 54, color: "bg-emerald-600", href: "/marketplace/agriculture" },
    { icon: <Compass className="h-7 w-7 text-amber-600" />, title: "Tourisme", count: 67, color: "bg-amber-600", href: "/marketplace/tourisme" },
    { icon: <ShoppingBag className="h-7 w-7 text-purple-600" />, title: "Produits", count: 234, color: "bg-purple-600", href: "/marketplace/produits" },
    { icon: <Utensils className="h-7 w-7 text-red-600" />, title: "Restauration", count: 89, color: "bg-red-600", href: "/marketplace/restauration" },
    { icon: <Camera className="h-7 w-7 text-teal-600" />, title: "Événements", count: 46, color: "bg-teal-600", href: "/marketplace/evenements" },
    { icon: <Heart className="h-7 w-7 text-pink-600" />, title: "Bien-être", count: 54, color: "bg-pink-600", href: "/marketplace/bien-etre" }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explorez nos catégories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez tous les services et produits disponibles dans notre marketplace
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
