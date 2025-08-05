import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Clock, TrendingUp, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

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
  // Données mockées pour les annonces en vedette avec plus de détails
  const featuredListings: ListingProps[] = [
    {
      id: "1",
      title: "Service de jardinage professionnel",
      description: "Entretien complet de jardins et espaces verts, taille de haies, tonte de pelouse et aménagement paysager.",
      price: "50€/jour",
      location: "Cayenne",
      category: "Services",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center",
      isNew: true,
      createdAt: "Il y a 2 jours"
    },
    {
      id: "2",
      title: "Cours de cuisine créole authentique",
      description: "Apprenez à cuisiner les plats traditionnels guyanais avec un chef local. Ingrédients frais et recettes authentiques.",
      price: "35€/personne",
      location: "Kourou",
      category: "Cours",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center",
      createdAt: "Il y a 5 jours"
    },
    {
      id: "3",
      title: "Guide touristique pour l'Amazonie",
      description: "Découvrez la forêt amazonienne avec un guide expérimenté. Excursions d'une journée ou circuits de plusieurs jours.",
      price: "80€/jour",
      location: "St-Laurent",
      category: "Tourisme",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=center",
      isNew: true,
      createdAt: "Il y a 1 jour"
    },
    {
      id: "4",
      title: "Artisanat local - Paniers tressés",
      description: "Magnifiques paniers tressés à la main selon les techniques traditionnelles amérindiennes. Pièces uniques.",
      price: "25€",
      location: "Matoury",
      category: "Artisanat",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
      createdAt: "Il y a 1 semaine"
    },
    {
      id: "5",
      title: "Réparation d'électronique à domicile",
      description: "Service de réparation pour tous vos appareils électroniques : ordinateurs, smartphones, télévisions. Déplacement à domicile.",
      price: "À partir de 40€",
      location: "Cayenne",
      category: "Services",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop&crop=center",
      createdAt: "Il y a 3 jours"
    },
    {
      id: "6",
      title: "Massage thérapeutique professionnel",
      description: "Massages relaxants et thérapeutiques par un professionnel certifié. Techniques variées pour soulager stress et tensions.",
      price: "60€/heure",
      location: "Rémire-Montjoly",
      category: "Bien-être",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop&crop=center",
      isNew: true,
      createdAt: "Il y a 4 jours"
    }
  ];

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
            <span className="text-sm font-medium text-gray-700">Sélection premium</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
              Annonces en vedette
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Découvrez les meilleures offres sélectionnées par notre équipe pour leur qualité exceptionnelle
          </p>
        </motion.div>
        
        {/* Grille d'annonces */}
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
              Plus de 500 annonces vous attendent
            </h3>
            <p className="text-gray-600 mb-6">
              Explorez notre marketplace complète et trouvez exactement ce que vous cherchez
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl"
                asChild
              >
                <Link href="/marketplace">Explorer toutes les annonces</Link>
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 shadow-lg transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl bg-white/80 backdrop-blur-sm"
                asChild
              >
                <Link href="/marketplace/nouveau">Publier une annonce</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
