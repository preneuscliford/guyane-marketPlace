import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <div className="h-48 overflow-hidden bg-gray-200 relative">
          <Image 
            src={image} 
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        {isNew && (
          <div className="absolute top-3 right-3 bg-purple-600 text-white py-1 px-3 rounded-full text-xs font-medium shadow-md">
            Nouveau
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-purple-700 py-1 px-2 rounded-md text-xs font-medium shadow-sm">
          {category}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {location}
          </span>
          <span className="text-sm text-gray-500 flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {createdAt}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
          {description}
        </p>
        
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">{price}</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-300"
            asChild
          >
            <Link href={`/annonces/${id}`}>Voir détails</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export function FeaturedListings() {
  // Données mockées pour les annonces en vedette
  const featuredListings: ListingProps[] = [
    {
      id: "1",
      title: "Service de jardinage professionnel",
      description: "Entretien complet de jardins et espaces verts, taille de haies, tonte de pelouse et aménagement paysager.",
      price: "50€/jour",
      location: "Cayenne",
      category: "Services",
      rating: 4.8,
      image: "/images/service1.jpg",
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
      image: "/images/cooking.jpg",
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
      image: "/images/amazon.jpg",
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
      image: "/images/craft.jpg",
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
      image: "/images/repair.jpg",
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
      image: "/images/massage.jpg",
      isNew: true,
      createdAt: "Il y a 4 jours"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Annonces en vedette</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les meilleures annonces et services de notre communauté
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
            asChild
          >
            <Link href="/marketplace">Voir toutes les annonces</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
