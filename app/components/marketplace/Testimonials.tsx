"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { RatingStars } from "@/components/ui/RatingStars";
import { getFallbackImage } from "../../lib/utils";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  service: string;
}

const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Jean-Marc Dupont",
    role: "Entrepreneur, Cayenne",
    avatar: getFallbackImage("jean-marc-dupont", 100, 100),
    content:
      "J'ai engagé un designer sur mcGuyane pour créer le logo de ma nouvelle entreprise. Le résultat a dépassé mes attentes et a été livré en avance. Je recommande vivement cette plateforme à tous les entrepreneurs guyanais.",
    rating: 5.0,
    service: "Design Graphique",
  },
  {
    id: "t2",
    name: "Sophia Williams",
    role: "Blogueuse, Kourou",
    avatar: getFallbackImage("sophia-williams", 100, 100),
    content:
      "mcGuyane m'a permis de trouver un développeur local pour mon blog. Le processus a été simple, transparent et j'ai pu collaborer facilement. Un vrai plus pour notre économie locale!",
    rating: 4.5,
    service: "Développement Web",
  },
  {
    id: "t3",
    name: "Michel Lambert",
    role: "Artisan, Saint-Laurent",
    avatar: getFallbackImage("michel-lambert", 100, 100),
    content:
      "Grâce à un expert marketing trouvé sur mcGuyane, j'ai pu augmenter significativement mes ventes en ligne. Sa connaissance du marché guyanais a fait toute la différence dans ma stratégie.",
    rating: 5.0,
    service: "Marketing Digital",
  },
  {
    id: "t4",
    name: "Amandine Rousseau",
    role: "Enseignante, Rémire-Montjoly",
    avatar: getFallbackImage("amandine-rousseau", 100, 100),
    content:
      "J'ai demandé une traduction de documents pédagogiques en créole. Le service était rapide et précis. Parfait pour mes besoins éducatifs spécifiques à notre région.",
    rating: 4.8,
    service: "Traduction & Langues",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, currentIndex]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  return (
    <section
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-700 to-fuchsia-700"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base">
            Découvrez les expériences de ceux qui ont trouvé le service idéal
            sur mcGuyane
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Testimonial Carousel */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="p-6 sm:p-8 md:p-12 relative">
              <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 text-purple-500 opacity-20">
                <Quote className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20" />
              </div>

              <motion.div
                key={testimonials[currentIndex].id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="relative h-12 w-12 sm:h-16 sm:w-16 rounded-full overflow-hidden mr-3 sm:mr-4 border-2 border-purple-200">
                    <Image
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 italic">
                  &ldquo;{testimonials[currentIndex].content}&rdquo;
                </p>

                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <RatingStars
                      rating={testimonials[currentIndex].rating}
                      size="md"
                    />
                    <span className="ml-2 text-gray-700 text-sm sm:text-base">
                      {testimonials[currentIndex].rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm text-purple-600 font-medium">
                    Service utilisé: {testimonials[currentIndex].service}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-6 sm:mt-8 space-x-3 sm:space-x-4">
            <button
              onClick={prev}
              className="p-2 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Indicators */}
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Témoignage ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
