import React from 'react';
import { Container } from '../ui/Container';
import { Star, MapPin, Heart } from 'lucide-react';

interface ListingProps {
  id: number;
  title: string;
  image: string;
  price: string;
  rating: number;
  reviews: number;
  location: string;
  category: string;
}

const ListingCard: React.FC<ListingProps> = ({ 
  id, title, image, price, rating, reviews, location, category 
}) => {
  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-200">
          <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-600 text-white">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-2 truncate">{title}</h3>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-500">({reviews} avis)</span>
          <div className="flex items-center ml-auto text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1" /> {location}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">{price}</span>
          <a 
            href={`/listing/${id}`}
            className="text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline"
          >
            Voir détails
          </a>
        </div>
      </div>
    </div>
  );
};

export const FeaturedListings: React.FC = () => {
  const listings = [
    {
      id: 1,
      title: "Réparation à domicile",
      image: "https://images.pexels.com/photos/3769129/pexels-photo-3769129.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "À partir de 45€",
      rating: 4.8,
      reviews: 24,
      location: "Cayenne",
      category: "Services"
    },
    {
      id: 2,
      title: "Appartement avec vue",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "850€/mois",
      rating: 4.5,
      reviews: 12,
      location: "Kourou",
      category: "Immobilier"
    },
    {
      id: 3,
      title: "Cours de cuisine créole",
      image: "https://images.pexels.com/photos/5907618/pexels-photo-5907618.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "75€/session",
      rating: 4.9,
      reviews: 36,
      location: "Saint-Laurent",
      category: "Cours"
    },
    {
      id: 4,
      title: "SUV à vendre",
      image: "https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "12 500€",
      rating: 4.2,
      reviews: 5,
      location: "Cayenne",
      category: "Véhicules"
    },
    {
      id: 5,
      title: "Service de traiteur",
      image: "https://images.pexels.com/photos/5639531/pexels-photo-5639531.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "Devis gratuit",
      rating: 4.7,
      reviews: 18,
      location: "Matoury",
      category: "Restauration"
    },
    {
      id: 6,
      title: "Coiffure à domicile",
      image: "https://images.pexels.com/photos/3993331/pexels-photo-3993331.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "À partir de 30€",
      rating: 4.6,
      reviews: 42,
      location: "Cayenne",
      category: "Bien-être"
    },
    {
      id: 7,
      title: "Appareil photo professionnel",
      image: "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "550€",
      rating: 4.4,
      reviews: 7,
      location: "Kourou",
      category: "Produits"
    },
    {
      id: 8,
      title: "Bijoux artisanaux",
      image: "https://images.pexels.com/photos/10994770/pexels-photo-10994770.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: "15€ - 75€",
      rating: 4.9,
      reviews: 31,
      location: "Saint-Laurent",
      category: "Artisanat"
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Annonces populaires</h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Découvrez les offres les plus recherchées du moment
            </p>
          </div>
          <a 
            href="/all-listings"
            className="mt-4 md:mt-0 inline-flex items-center font-medium text-purple-600 hover:text-purple-800"
          >
            Voir toutes les annonces
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </Container>
    </section>
  );
};