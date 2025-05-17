"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  color: string;
  description: string;
  slug: string;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Design Graphique",
    icon: "🎨",
    image: "/images/categories/design.jpg",
    color: "from-purple-500 to-pink-500",
    description: "Logos, flyers, affiches et plus",
    slug: "design-graphique"
  },
  {
    id: "2",
    name: "Développement Web",
    icon: "💻",
    image: "/images/categories/webdev.jpg",
    color: "from-blue-500 to-teal-400",
    description: "Sites web, applications et programmation",
    slug: "developpement-web"
  },
  {
    id: "3",
    name: "Marketing Digital",
    icon: "📱",
    image: "/images/categories/marketing.jpg",
    color: "from-pink-500 to-orange-400",
    description: "Réseaux sociaux, SEO et publicité",
    slug: "marketing-digital"
  },
  {
    id: "4",
    name: "Traduction & Langues",
    icon: "🌎",
    image: "/images/categories/languages.jpg",
    color: "from-teal-400 to-green-500",
    description: "Traduction, correction et transcription",
    slug: "traduction-langues"
  },
  {
    id: "5",
    name: "Services en Guyane",
    icon: "🏝️",
    image: "/images/categories/guyane.jpg",
    color: "from-orange-400 to-amber-600",
    description: "Services locaux et spécialisés",
    slug: "services-guyane"
  },
  {
    id: "6",
    name: "Musique & Audio",
    icon: "🎵",
    image: "/images/categories/music.jpg",
    color: "from-violet-600 to-purple-500",
    description: "Production, mixage et voix off",
    slug: "musique-audio"
  },
  {
    id: "7",
    name: "Immobilier",
    icon: "🏠",
    image: "/images/categories/realestate.jpg", 
    color: "from-cyan-500 to-blue-500",
    description: "Location, vente et conseils",
    slug: "immobilier"
  },
  {
    id: "8",
    name: "Voir Plus",
    icon: "➕",
    image: "/images/categories/more.jpg",
    color: "from-gray-500 to-gray-700",
    description: "Découvrir toutes les catégories",
    slug: "toutes-categories"
  }
];

export function FeaturedCategories() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Parcourir par catégorie</h2>
          <Link href="/marketplace/categories" className="flex items-center text-purple-600 hover:text-purple-700 font-medium">
            Toutes les catégories <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/marketplace/categories/${category.slug}`}>
                <div className="relative overflow-hidden rounded-xl shadow-lg h-64 group cursor-pointer">
                  <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-30 transition-opacity z-10" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80 z-0`} />
                  
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover z-0"
                    />
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
