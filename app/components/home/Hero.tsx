"use client";

import { Search, Star, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { HeroAdvertisementCarousel } from '@/components/advertisements/AdvertisementCarousel';

export function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative pt-32 pb-20 md:pb-28 lg:pb-36 overflow-hidden">
      {/* Background avec dégradés améliorés */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/50 to-emerald-50/30 -z-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/30 via-fuchsia-200/20 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-200/30 via-teal-200/20 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-100/20 to-transparent rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex max-w-5xl flex-col items-center gap-8 text-center mx-auto">
          {/* Badge de confiance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full shadow-sm"
          >
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-700">Plateforme de confiance #1 en Guyane</span>
          </motion.div>

          {/* Titre principal avec animation */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
          >
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
              Blada Market
            </span>
          </motion.h1>
          
          {/* Sous-titre amélioré */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 font-light mb-4">
              La marketplace locale de la Guyane
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez des services de qualité, vendez vos produits et connectez-vous avec votre communauté locale
            </p>
          </motion.div>
          
          {/* Barre de recherche améliorée */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative max-w-2xl w-full mb-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher des services, produits ou prestataires..."
                className="w-full pl-14 pr-32 py-5 rounded-2xl border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg placeholder:text-gray-400 transition-all duration-300"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <Button 
                size="lg"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-md transition-all duration-300 hover:scale-105"
              >
                Rechercher
              </Button>
            </div>
          </motion.div>
          
          {/* Boutons d'action */}
          {!isAuthenticated && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl px-8 py-4 text-lg font-semibold" 
                asChild
              >
                <Link href="/marketplace" className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Explorer la marketplace
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-purple-600 text-purple-700 hover:bg-purple-50 shadow-lg transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-semibold bg-white/80 backdrop-blur-sm" 
                asChild
              >
                <Link href="/auth" className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Rejoindre la communauté
                </Link>
              </Button>
            </motion.div>
          )}
          
          {/* Statistiques avec design amélioré */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 w-full max-w-3xl"
          >
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">500+</p>
                <p className="text-gray-600 font-medium">Services disponibles</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">5,000+</p>
                <p className="text-gray-600 font-medium">Utilisateurs actifs</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">10K+</p>
                <p className="text-gray-600 font-medium">Transactions réussies</p>
              </div>
            </div>
          </motion.div>
          
          {/* Carrousel de publicités en grand format */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="w-full max-w-6xl mt-16"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
              <HeroAdvertisementCarousel />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
