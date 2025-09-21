"use client";

import { useState } from "react";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import SponsoredBanner from "@/components/advertisements/SponsoredBanner";
import { getFallbackImage } from "../../lib/utils";

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const popularSearches = [
    "Design Logo",
    "Développement Web",
    "Traduction",
    "Marketing Digital",
    "Immobilier",
  ];

  return (
    <div className="relative w-full overflow-hidden z-0">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getFallbackImage("hero-background", 1200, 800)}
          alt="mcGuyane Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/70 via-fuchsia-700/60 to-cyan-600/70" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 container mx-auto px-4 py-8 sm:py-12 mt-32 sm:mt-20"
        style={{ height: "300px" }}
      >
        <div className="max-w-3xl mx-auto text-center h-full flex flex-col justify-center">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Trouvez des services parfaits pour vos besoins en Guyane
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-white/90 mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            La marketplace locale qui connecte les talents guyanais
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="relative max-w-xl mx-auto mb-3"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Que recherchez-vous ?"
                  className="w-full px-4 py-2 sm:py-3 rounded-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-2 rounded-full hover:from-purple-700 hover:to-fuchsia-700 transition-all"
                >
                  <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.slice(0, 4).map((term, index) => (
                <button
                  key={index}
                  className="text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 px-2 py-1 rounded-full text-xs transition-colors"
                  onClick={() => {
                    setSearchQuery(term);
                    onSearch(term);
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave shape at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full h-auto"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L60,64C120,64,240,64,360,58.7C480,53,600,43,720,48C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
      </div>

      {/* Section carousel full-width séparée */}
      <div className="bg-white w-full">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Publicités Sponsorisées
          </h2>
          <div className="w-full">
            <div className="h-64 sm:h-80 md:h-96">
              <SponsoredBanner autoPlayInterval={6000} showControls={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
