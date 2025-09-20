'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Clock, TrendingUp, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useServices } from '@/hooks/useServices';
import { useEffect } from 'react';
import { ServiceWithProfile } from '@/types/services';

interface ListingProps {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  category: string;
  rating: number;
  image: string;
  isNew?: boolean;
  createdAt: string;
}

/**
 * Formate le prix d'un service
 */
const formatPrice = (service: ServiceWithProfile): string => {
  if (!service.price) return 'Prix sur demande';
  
  const price = `${service.price}€`;
  
  switch (service.price_type) {
    case 'hourly':
      return `${price}/heure`;
    case 'daily':
      return `${price}/jour`;
    case 'negotiable':
      return `${price}/semaine`;
    case 'fixed':
      return `${price}/mois`;
    case 'fixed':
    default:
      return price;
  }
};

/**
 * Formate la date de création
 */
const formatCreatedAt = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Il y a 1 jour';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 14) return 'Il y a 1 semaine';
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  return `Il y a ${Math.floor(diffDays / 30)} mois`;
};

/**
 * Détermine si un service est nouveau (créé dans les 7 derniers jours)
 */
const isNewService = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

const ListingCard: React.FC<ListingProps> = ({
  id,
  title,
  description,
  price,
  location,
  category,
  rating,
  image,
  isNew,
  createdAt
}) => {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100"
    >
      <div className="relative overflow-hidden">
        <div className="h-56 overflow-hidden bg-gray-200 relative">
          <Image 
            src={image} 
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="bg-white/95 backdrop-blur-sm text-purple-700 py-2 px-3 rounded-xl text-xs font-semibold shadow-lg border border-purple-100">
            {category}
          </div>
          {isNew && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-3 rounded-xl text-xs font-semibold shadow-lg">
              <TrendingUp className="w-3 h-3" />
              Nouveau
            </div>
          )}
        </div>
        
        {/* Actions rapides */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-200">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-200">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {/* Métadonnées */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500 flex items-center bg-gray-50 px-3 py-1 rounded-full">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {location}
          </span>
          <span className="text-sm text-gray-500 flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {createdAt}
          </span>
        </div>
        
        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300 leading-tight">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>
        
        {/* Rating */}
        <div className="flex items-center mb-5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
          <span className="ml-1 text-xs text-gray-500">(24 avis)</span>
        </div>
        
        {/* Prix et action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              {price}
            </span>
            <span className="text-xs text-gray-500">Prix indicatif</span>
          </div>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
            asChild
          >
            <Link href={`/annonces/${id}`} className="flex items-center gap-2">
              Voir détails
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export function FeaturedListings() {
  const { services, loading, fetchServices } = useServices();

  // Charger les services populaires au montage
  useEffect(() => {
    fetchServices({
      sort_by: 'created_at',
      sort_order: 'desc',
      limit: 6
    });
  }, [fetchServices]);

  // Convertir les services en format ListingProps
  const featuredListings: ListingProps[] = services.map(service => ({
    id: service.id,
    title: service.title,
    description: service.description,
    price: formatPrice(service),
    location: service.location || 'Guyane',
    category: service.category,
    rating: service.rating || 0,
    image: service.images?.[0] || '/images/services.svg',
    isNew: isNewService(service.created_at),
    createdAt: formatCreatedAt(service.created_at)
  }));



  if (loading) {
    return (
      <section className="py-20 md:py-28 bg-gradient-to-br from-white via-purple-50/20 to-emerald-50/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
                Services populaires
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Découvrez les meilleurs services offerts par nos talents guyanais
            </p>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des services populaires...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-white via-purple-50/20 to-emerald-50/10">
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
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Les plus populaires</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
              Services populaires
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Découvrez les meilleurs services offerts par nos talents guyanais
          </p>
        </motion.div>
        
        {/* Grille d'annonces */}
        {featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {featuredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ListingCard {...listing} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucun service populaire trouvé pour le moment.</p>
            <p className="text-gray-500 mt-2">Revenez bientôt pour découvrir nos services en vedette !</p>
          </div>
        )}
        
        {/* Call to action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Découvrez tous nos services
            </h3>
            <p className="text-gray-600 mb-6">
              Explorez notre catalogue complet de services et trouvez le talent qu'il vous faut
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl"
                asChild
              >
                <Link href="/services">Voir tous les services</Link>
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 shadow-lg transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl bg-white/80 backdrop-blur-sm"
                asChild
              >
                <Link href="/services/nouveau">Proposer un service</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
