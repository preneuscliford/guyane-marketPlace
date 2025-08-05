"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { RatingStars } from "@/components/ui/RatingStars";

interface Service {
  id: string;
  title: string;
  image: string;
  price: number;
  location: string;
  rating: number;
  provider: {
    name: string;
    avatar: string;
    level: string;
  };
  createdAt: string;
}

// Exemple de services en vedette
const featuredServices: Service[] = [
  {
    id: "s1",
    title: "Création de logo professionnel pour votre entreprise",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop&crop=center",
    price: 75,
    location: "Cayenne",
    rating: 4.9,
    provider: {
      name: "Marie L.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      level: "Pro Seller"
    },
    createdAt: "2023-09-15"
  },
  {
    id: "s2",
    title: "Développement de site web responsive sur mesure",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center",
    price: 150,
    location: "Kourou",
    rating: 4.7,
    provider: {
      name: "Thomas F.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      level: "Top Rated"
    },
    createdAt: "2023-10-03"
  },
  {
    id: "s3",
    title: "Design d'application mobile intuitive",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&crop=center",
    price: 120,
    location: "Matoury",
    rating: 4.8,
    provider: {
      name: "Sophie D.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      level: "Top Rated"
    },
    createdAt: "2023-11-08"
  },
  {
    id: "s4",
    title: "Gestion de vos réseaux sociaux pendant 1 mois",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&crop=center",
    price: 95,
    location: "Saint-Laurent",
    rating: 4.6,
    provider: {
      name: "David M.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      level: "Level 2"
    },
    createdAt: "2023-12-04"
  },
  {
    id: "s5",
    title: "Traduction français-créole de documents",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center",
    price: 45,
    location: "Cayenne",
    rating: 4.9,
    provider: {
      name: "Léa K.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      level: "Pro Seller"
    },
    createdAt: "2024-01-12"
  },
  {
    id: "s6",
    title: "Montage vidéo professionnel pour vos projets",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop&crop=center",
    price: 85,
    location: "Rémire-Montjoly",
    rating: 4.8,
    provider: {
      name: "Lucas B.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      level: "Level 2"
    },
    createdAt: "2024-02-08"
  }
];

export function FeaturedServices() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Services populaires</h2>
        <p className="text-gray-600 mb-10">Découvrez les meilleurs services offerts par nos talents guyanais</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <Link href={`/marketplace/${service.id}`}>
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={service.provider.avatar}
                        alt={service.provider.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{service.provider.name}</p>
                      <p className="text-xs text-purple-600">{service.provider.level}</p>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{service.title}</h3>
                  
                  <div className="flex items-center mb-3">
                    <RatingStars rating={service.rating} size="sm" />
                    <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{service.location}</span>
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    <span>Ajouté le {new Date(service.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3 flex justify-between items-center">
                    <p className="text-sm text-gray-500">À partir de</p>
                    <p className="text-xl font-bold text-purple-600">{service.price} €</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/marketplace/all" 
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium rounded-full hover:shadow-lg transition-shadow"
          >
            Voir tous les services
          </Link>
        </div>
      </div>
    </section>
  );
}
