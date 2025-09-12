"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { RatingStars } from "@/components/ui/RatingStars";
import { useServices } from "@/hooks/useServices";

// Interface pour les services affichés
interface ListingProps {
  id: string;
  title: string;
  image: string;
  price: string;
  location: string;
  rating: number;
  reviewsCount: number;
  provider: {
    name: string;
    avatar: string;
    level: string;
  };
  createdAt: string;
  isNew?: boolean;
}

/**
 * Formate le prix pour l'affichage
 */
const formatPrice = (price: number | null): string => {
  if (!price) return "Prix sur demande";
  return `${price} €`;
};

/**
 * Formate la date de création
 */
const formatCreatedAt = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

/**
 * Détermine le niveau du prestataire basé sur la note
 */
const getProviderLevel = (rating: number): string => {
  if (rating >= 4.8) return "Pro Seller";
  if (rating >= 4.5) return "Top Rated";
  if (rating >= 4.0) return "Level 2";
  return "Nouveau";
};

/**
 * Détermine si un service est nouveau (créé dans les 30 derniers jours)
 */
const isNewService = (createdAt: string): boolean => {
  const serviceDate = new Date(createdAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return serviceDate > thirtyDaysAgo;
};

export function FeaturedServices() {
  const { services, loading, fetchServices } = useServices();
  const [isMounted, setIsMounted] = useState(false);

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Récupérer les services au montage du composant
  useEffect(() => {
    if (isMounted) {
      console.log('FeaturedServices: Récupération des services...');
      fetchServices({
        sort_by: 'created_at',
        sort_order: 'desc',
        limit: 6
      }).then(() => {
        console.log('FeaturedServices: Services récupérés avec succès');
      }).catch((error) => {
        console.error('FeaturedServices: Erreur lors de la récupération des services:', error);
      });
    }
  }, [fetchServices, isMounted]);

  // Mapper les services de la base de données vers le format d'affichage
  console.log('FeaturedServices: Services disponibles:', services.length, services);
  
  let featuredListings: ListingProps[] = [];
  
  try {
    featuredListings = services.map(service => {
      console.log('FeaturedServices: Mapping service:', service.id, service.title);
      
      // Utiliser le nom complet s'il existe, sinon le username, sinon "Utilisateur"
      const displayName = service.profiles?.full_name?.trim() || 
                         service.profiles?.username || 
                         'Utilisateur';
      
      const mappedService = {
         id: service.id,
         title: service.title,
         image: service.images?.[0] || '/images/services.svg',
         price: formatPrice(service.price),
         location: service.location || 'Guyane',
         rating: service.rating || 0,
         reviewsCount: service.reviews_count || 0,
         provider: {
           name: displayName,
           avatar: service.profiles?.avatar_url || '/default-avatar.svg',
           level: getProviderLevel(service.rating || 0)
         },
         createdAt: formatCreatedAt(service.created_at),
         isNew: isNewService(service.created_at)
       };
       
       console.log('FeaturedServices: Service mappé:', mappedService);
       return mappedService;
    });
    
    console.log('FeaturedServices: Tous les services mappés:', featuredListings.length, featuredListings);
  } catch (error) {
    console.error('FeaturedServices: Erreur lors du mapping des services:', error);
    featuredListings = [];
  }

  // Afficher un état de chargement pendant le montage et le chargement des données
  if (!isMounted || loading) {
    return (
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Services populaires</h2>
          <p className="text-gray-600 mb-8 sm:mb-10">Découvrez les meilleurs services offerts par nos talents guyanais</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4 sm:p-5">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredListings.length === 0) {
    return (
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Services populaires</h2>
          <p className="text-gray-600 mb-8 sm:mb-10">Découvrez les meilleurs services offerts par nos talents guyanais</p>
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 mb-4 text-sm sm:text-base">Aucun service populaire trouvé pour le moment.</p>
            <Link 
              href="/services/nouveau" 
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium rounded-full hover:shadow-lg transition-shadow text-sm sm:text-base"
            >
              Proposer un service
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">Services populaires</h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-8 sm:mb-10 lg:mb-12">Découvrez les meilleurs services offerts par nos talents guyanais</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {featuredListings.map((service) => (
            <Link key={service.id} href={`/services/${service.id}`}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative h-48">
                  {service.isNew && (
                    <div className="absolute top-3 left-3 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Nouveau
                    </div>
                  )}
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-4 sm:p-5">
                  <div className="flex items-center mb-3">
                    <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden mr-2 sm:mr-3">
                      <Image
                        src={service.provider.avatar}
                        alt={service.provider.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-medium text-gray-900">{service.provider.name}</p>
                      <p className="text-xs sm:text-xs text-purple-600">{service.provider.level}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 line-clamp-2">{service.title}</h3>
                  
                  <div className="flex items-center mb-3">
                    <RatingStars rating={service.rating} size="sm" />
                    <span className="text-sm text-gray-600 ml-1">
                      {service.rating > 0 ? service.rating.toFixed(1) : 'Nouveau'}
                      {service.reviewsCount > 0 && (
                        <span className="text-gray-500"> ({service.reviewsCount} avis)</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-3">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span>{service.location}</span>
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 ml-2 sm:ml-3 mr-1" />
                    <span className="hidden sm:inline">Ajouté le {service.createdAt}</span>
                    <span className="sm:hidden">{service.createdAt}</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3 flex justify-between items-center">
                    <p className="text-xs sm:text-sm text-gray-500">À partir de</p>
                    <p className="text-lg sm:text-xl font-bold text-purple-600">{service.price}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 sm:mt-12 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <Link 
              href="/services" 
              className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium rounded-full hover:shadow-lg transition-shadow text-sm sm:text-base"
            >
              Voir tous les services
            </Link>
            <Link 
              href="/services/nouveau" 
              className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-white border-2 border-purple-600 text-purple-600 font-medium rounded-full hover:bg-purple-50 transition-colors text-sm sm:text-base"
            >
              Proposer un service
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
