"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, TrendingUp, Users, Star } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  color: string;
  description: string;
  slug: string;
  serviceCount: number;
  trending?: boolean;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Design Graphique",
    icon: "🎨",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop&crop=center",
    color: "from-purple-500 to-pink-500",
    description: "Logos, flyers, affiches et plus",
    slug: "design-graphique",
    serviceCount: 127,
    trending: true
  },
  {
    id: "2",
    name: "Développement Web",
    icon: "💻",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center",
    color: "from-blue-500 to-teal-400",
    description: "Sites web, applications et programmation",
    slug: "developpement-web",
    serviceCount: 89,
    trending: true
  },
  {
    id: "3",
    name: "Marketing Digital",
    icon: "📱",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center",
    color: "from-pink-500 to-orange-400",
    description: "Réseaux sociaux, SEO et publicité",
    slug: "marketing-digital",
    serviceCount: 156
  },
  {
    id: "4",
    name: "Traduction & Langues",
    icon: "🌎",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&crop=center",
    color: "from-teal-400 to-green-500",
    description: "Traduction, correction et transcription",
    slug: "traduction-langues",
    serviceCount: 73
  },
  {
    id: "5",
    name: "Services en Guyane",
    icon: "🏝️",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
    color: "from-orange-400 to-amber-600",
    description: "Services locaux et spécialisés",
    slug: "services-guyane",
    serviceCount: 234,
    trending: true
  },
  {
    id: "6",
    name: "Musique & Audio",
    icon: "🎵",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&crop=center",
    color: "from-violet-600 to-purple-500",
    description: "Production, mixage et voix off",
    slug: "musique-audio",
    serviceCount: 45
  },
  {
    id: "7",
    name: "Immobilier",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center", 
    color: "from-cyan-500 to-blue-500",
    description: "Location, vente et conseils",
    slug: "immobilier",
    serviceCount: 198
  },
  {
    id: "8",
    name: "Voir Plus",
    icon: "➕",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop&crop=center",
    color: "from-gray-500 to-gray-700",
    description: "Découvrir toutes les catégories",
    slug: "toutes-categories",
    serviceCount: 0
  }
];

export function FeaturedCategories() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-purple-50/30 to-emerald-50/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section amélioré */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full shadow-sm mb-6">
            <Star className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Catégories populaires</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
              Explorez par catégorie
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Découvrez une large gamme de services professionnels adaptés à vos besoins
          </p>
          <Link 
            href="/marketplace/categories" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-full text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
          >
            Voir toutes les catégories 
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
        
        {/* Grille de catégories améliorée */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Link href={`/marketplace/categories/${category.slug}`}>
                <div className="relative overflow-hidden rounded-2xl shadow-lg h-80 group cursor-pointer bg-white">
                  {/* Badge trending */}
                  {category.trending && (
                    <div className="absolute top-4 right-4 z-30">
                      <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-semibold shadow-lg">
                        <TrendingUp className="w-3 h-3" />
                        Tendance
                      </div>
                    </div>
                  )}
                  
                  {/* Image de fond avec overlay */}
                  <div className="absolute inset-0">
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-50 transition-all duration-300`} />
                  </div>
                  
                  {/* Contenu de la carte */}
                  <div className="relative h-full flex flex-col justify-between p-6 text-white z-20">
                    {/* Icône et compteur */}
                    <div className="flex items-start justify-between">
                      <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      {category.serviceCount > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                          <Users className="w-3 h-3" />
                          {category.serviceCount}
                        </div>
                      )}
                    </div>
                    
                    {/* Informations de la catégorie */}
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm opacity-90 leading-relaxed">
                        {category.description}
                      </p>
                      {category.serviceCount > 0 && (
                        <p className="text-xs mt-2 opacity-75">
                          {category.serviceCount} services disponibles
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Effet de hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Section statistiques */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                8+
              </p>
              <p className="text-gray-600 font-medium">Catégories principales</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                900+
              </p>
              <p className="text-gray-600 font-medium">Services actifs</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                24/7
              </p>
              <p className="text-gray-600 font-medium">Support disponible</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
