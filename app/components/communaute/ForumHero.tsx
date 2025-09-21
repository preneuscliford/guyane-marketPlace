"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function ForumHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/communaute/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-fuchsia-600 to-cyan-600 pt-20 sm:pt-24 pb-12 sm:pb-16">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Communauté mcGuyane
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 px-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Rejoignez les discussions de la communauté guyanaise, posez vos
            questions et partagez vos expériences
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="px-4"
          >
            <form
              onSubmit={handleSearch}
              className="relative max-w-xl sm:max-w-2xl mx-auto"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Rechercher dans les discussions..."
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-1 sm:right-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-2 sm:p-3 rounded-full hover:from-purple-700 hover:to-fuchsia-700 transition-all"
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </form>
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
            fill="#f9fafb"
            fillOpacity="1"
            d="M0,64L60,64C120,64,240,64,360,58.7C480,53,600,43,720,48C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
      </div>
    </div>
  );
}
