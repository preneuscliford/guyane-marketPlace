"use client";

import { useState } from "react";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
import { motion } from "framer-motion";

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
    "Immobilier"
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&crop=center" 
          alt="Blada Market Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/70 via-fuchsia-700/60 to-cyan-600/70" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Trouvez des services parfaits pour vos besoins en Guyane
          </motion.h1>
          
          <motion.p 
            className="text-xl text-white/90 mb-10"
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
            <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  placeholder="Que recherchez-vous aujourd'hui ?" 
                  className="w-full px-6 py-4 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-3 rounded-full hover:from-purple-700 hover:to-fuchsia-700 transition-all"
                >
                  <SearchIcon className="h-6 w-6" />
                </button>
              </div>
            </form>
            
            <div className="flex flex-wrap justify-center mt-4 gap-2">
              {popularSearches.map((term, index) => (
                <button
                  key={index}
                  className="text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 px-3 py-1 rounded-full text-sm transition-colors"
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,64L60,64C120,64,240,64,360,58.7C480,53,600,43,720,48C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
      </div>
    </div>
  );
}
