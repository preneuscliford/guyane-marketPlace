'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, MapPin, Clock } from 'lucide-react';
import { useWeightedCarousel, useAdvertisementStats } from '@/hooks/useAdvertisements';
import { Advertisement } from '@/types/advertisements';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

/**
 * Carrousel publicitaire pour la section hero de la page d'accueil
 */
export default function HeroAdvertisementCarousel() {
  const { advertisements, loading, selectNext, currentIndex } = useWeightedCarousel({
    limit: 5,
    autoRotate: true,
    rotationInterval: 8000
  });
  
  const { recordImpression, recordClick } = useAdvertisementStats();
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (advertisements.length > 0) {
      setCurrentAd(advertisements[currentIndex]);
      setIsVisible(true);
      
      // Enregistrer l'impression
      if (advertisements[currentIndex]) {
        recordImpression(advertisements[currentIndex].id);
      }
    }
  }, [advertisements, currentIndex, recordImpression]);

  const handleAdClick = (ad: Advertisement) => {
    recordClick(ad.id);
    if (ad.target_url) {
      window.open(ad.target_url, '_blank', 'noopener,noreferrer');
    }
  };

  const nextSlide = () => {
    selectNext();
  };

  const prevSlide = () => {
    const prevIndex = currentIndex === 0 ? advertisements.length - 1 : currentIndex - 1;
    setCurrentAd(advertisements[prevIndex]);
  };

  if (loading || !currentAd || advertisements.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-96 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Background Image */}
      {currentAd.image_url && (
        <div className="absolute inset-0">
          <img
            src={currentAd.image_url}
            alt={currentAd.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAd.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="text-white space-y-6"
              >
                {/* Category Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="bg-primary-500 text-white px-3 py-1 text-sm font-medium">
                    {currentAd.category}
                  </Badge>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl lg:text-5xl font-bold leading-tight"
                >
                  {currentAd.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-200 leading-relaxed max-w-lg"
                >
                  {currentAd.description}
                </motion.p>

                {/* Meta Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center gap-4 text-gray-300"
                >
                  {currentAd.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{currentAd.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      Publié {new Date(currentAd.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {currentAd.budget && (
                    <div className="text-sm font-medium">
                      Budget: {formatCurrency(currentAd.budget)}
                    </div>
                  )}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={() => handleAdClick(currentAd)}
                    size="lg"
                    className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Découvrir
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Visual Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="hidden lg:flex justify-center items-center"
            >
              <div className="relative">
                {/* Decorative circles */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
                
                {/* Main visual */}
                <div className="w-64 h-64 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="text-6xl">🛍️</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {advertisements.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
            aria-label="Publicité précédente"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
            aria-label="Publicité suivante"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {advertisements.map((ad, index) => (
              <button
                key={`ad-dot-${ad.id}`}
                onClick={() => setCurrentAd(advertisements[index])}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Aller à la publicité ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Sponsored Label */}
      <div className="absolute top-4 right-4">
        <Badge className="bg-black/50 text-white text-xs px-2 py-1 backdrop-blur-sm">
          Sponsorisé
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <motion.div
          className="h-full bg-primary-400"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
          key={currentIndex}
        />
      </div>
    </div>
  );
}

/**
 * Version compacte du carrousel pour d'autres sections
 */
export function CompactAdvertisementCarousel() {
  const { advertisements, loading, selectNext, currentIndex } = useWeightedCarousel({
    limit: 3,
    autoRotate: true,
    rotationInterval: 6000
  });
  
  const { recordImpression, recordClick } = useAdvertisementStats();

  useEffect(() => {
    if (advertisements.length > 0 && advertisements[currentIndex]) {
      recordImpression(advertisements[currentIndex].id);
    }
  }, [advertisements, currentIndex, recordImpression]);

  const handleAdClick = (ad: Advertisement) => {
    recordClick(ad.id);
    if (ad.target_url) {
      window.open(ad.target_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading || advertisements.length === 0) {
    return (
      <div className="h-32 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Chargement des publicités...</div>
      </div>
    );
  }

  const currentAd = advertisements[currentIndex];

  return (
    <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg overflow-hidden cursor-pointer group"
         onClick={() => handleAdClick(currentAd)}>
      {/* Background */}
      {currentAd.image_url && (
        <div className="absolute inset-0">
          <img
            src={currentAd.image_url}
            alt={currentAd.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex items-center px-6">
        <div className="text-white">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{currentAd.title}</h3>
          <p className="text-sm text-gray-200 line-clamp-2 mb-2">{currentAd.description}</p>
          <Badge className="bg-white/20 text-white text-xs">
            {currentAd.category}
          </Badge>
        </div>
      </div>

      {/* Sponsored Label */}
      <div className="absolute top-2 right-2">
        <Badge className="bg-black/50 text-white text-xs px-2 py-1">
          Pub
        </Badge>
      </div>

      {/* Dots */}
      {advertisements.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {advertisements.map((ad, index) => (
            <div
              key={`ad-indicator-${ad.id}`}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}