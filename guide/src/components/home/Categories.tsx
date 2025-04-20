import React from 'react';
import { Container } from '../ui/Container';
import { ShoppingBag, Briefcase, Home, Car, Utensils, Camera, Scissors, Heart } from 'lucide-react';

interface CategoryProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
}

const CategoryCard: React.FC<CategoryProps> = ({ icon, title, count, color }) => {
  return (
    <a 
      href={`/category/${title.toLowerCase().replace(' ', '-')}`}
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
    </a>
  );
};

export const Categories: React.FC = () => {
  const categories = [
    { icon: <ShoppingBag className="h-7 w-7 text-purple-600" />, title: "Produits", count: 234, color: "bg-purple-600" },
    { icon: <Briefcase className="h-7 w-7 text-blue-600" />, title: "Services", count: 192, color: "bg-blue-600" },
    { icon: <Home className="h-7 w-7 text-teal-600" />, title: "Immobilier", count: 85, color: "bg-teal-600" },
    { icon: <Car className="h-7 w-7 text-emerald-600" />, title: "Véhicules", count: 124, color: "bg-emerald-600" },
    { icon: <Utensils className="h-7 w-7 text-amber-600" />, title: "Restauration", count: 67, color: "bg-amber-600" },
    { icon: <Camera className="h-7 w-7 text-red-600" />, title: "Événements", count: 46, color: "bg-red-600" },
    { icon: <Scissors className="h-7 w-7 text-indigo-600" />, title: "Artisanat", count: 78, color: "bg-indigo-600" },
    { icon: <Heart className="h-7 w-7 text-pink-600" />, title: "Bien-être", count: 54, color: "bg-pink-600" }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <Container>
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
      </Container>
    </section>
  );
};