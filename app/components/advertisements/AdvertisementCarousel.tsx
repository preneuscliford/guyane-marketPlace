'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
// import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useWeightedCarousel, useAdvertisementStats } from '../../hooks/useAdvertisements';
import { WeightedAdvertisement } from '../../types/advertisements';
import { useAuth } from '../../hooks/useAuth';

interface AdvertisementCarouselProps {
  autoRotate?: boolean;
  rotationInterval?: number;
  maxAds?: number;
  className?: string;
  showControls?: boolean;
  showCloseButton?: boolean;
}

/**
 * Composant carrousel de publicités pondérées
 * Affiche les publicités en fonction de leur budget (plus de budget = plus de chances d'apparaître)
 */
export default function AdvertisementCarousel({
  autoRotate = true,
  rotationInterval = 8000,
  maxAds = 5,
  className = '',
  showControls = true,
  showCloseButton = false
}: AdvertisementCarouselProps) {
  const {
    weightedAds,
    currentAd,
    loading,
    fetchWeightedAdvertisements,
    selectRandomAdvertisement,
    setCurrentAd
  } = useWeightedCarousel();
  
  const { recordImpression, recordClick } = useAdvertisementStats();
  const { user } = useAuth();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Charger les publicités au montage
  useEffect(() => {
    fetchWeightedAdvertisements();
  }, [fetchWeightedAdvertisements]);

  // Sélectionner la première publicité quand les données sont chargées
  useEffect(() => {
    if (weightedAds.length > 0 && !currentAd) {
      const selected = selectRandomAdvertisement(weightedAds.slice(0, maxAds));
      setCurrentAd(selected);
    }
  }, [weightedAds, currentAd, selectRandomAdvertisement, maxAds, setCurrentAd]);

  // Enregistrer l'impression quand une publicité est affichée
  useEffect(() => {
    if (currentAd && isVisible) {
      recordImpression(currentAd.id, user?.id);
    }
  }, [currentAd, isVisible, recordImpression, user?.id]);

  // Rotation automatique
  useEffect(() => {
    if (!autoRotate || hasInteracted || weightedAds.length <= 1) return;

    const interval = setInterval(() => {
      const availableAds = weightedAds.slice(0, maxAds);
      const selected = selectRandomAdvertisement(availableAds);
      setCurrentAd(selected);
      
      // Mettre à jour l'index pour les indicateurs
      if (selected) {
        const index = availableAds.findIndex(ad => ad.id === selected.id);
        setCurrentIndex(index >= 0 ? index : 0);
      }
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, hasInteracted, weightedAds, maxAds, rotationInterval, selectRandomAdvertisement, setCurrentAd]);

  /**
   * Gère le clic sur une publicité
   */
  const handleAdClick = useCallback(async (ad: WeightedAdvertisement) => {
    // Enregistrer le clic
    await recordClick(ad.id, user?.id);
    
    // Ouvrir le lien dans un nouvel onglet si spécifié
    if (ad.target_url) {
      window.open(ad.target_url, '_blank', 'noopener,noreferrer');
    }
  }, [recordClick, user?.id]);

  /**
   * Navigation manuelle vers la publicité précédente
   */
  const goToPrevious = useCallback(() => {
    setHasInteracted(true);
    const availableAds = weightedAds.slice(0, maxAds);
    const newIndex = currentIndex > 0 ? currentIndex - 1 : availableAds.length - 1;
    setCurrentIndex(newIndex);
    setCurrentAd(availableAds[newIndex]);
  }, [currentIndex, weightedAds, maxAds, setCurrentAd]);

  /**
   * Navigation manuelle vers la publicité suivante
   */
  const goToNext = useCallback(() => {
    setHasInteracted(true);
    const availableAds = weightedAds.slice(0, maxAds);
    const newIndex = currentIndex < availableAds.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setCurrentAd(availableAds[newIndex]);
  }, [currentIndex, weightedAds, maxAds, setCurrentAd]);

  /**
   * Navigation directe vers une publicité
   */
  const goToAd = useCallback((index: number) => {
    setHasInteracted(true);
    const availableAds = weightedAds.slice(0, maxAds);
    setCurrentIndex(index);
    setCurrentAd(availableAds[index]);
  }, [weightedAds, maxAds, setCurrentAd]);

  /**
   * Ferme le carrousel
   */
  const closeCarousel = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Ne pas afficher si pas de publicités ou si fermé
  if (!isVisible || loading || !currentAd || weightedAds.length === 0) {
    return null;
  }

  const availableAds = weightedAds.slice(0, maxAds);

  return (
    <div className={`relative w-full bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl overflow-hidden shadow-soft ${className}`}>
      {/* Bouton de fermeture */}
      {showCloseButton && (
        <button
          onClick={closeCarousel}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110"
          aria-label="Fermer les publicités"
        >
          <XMarkIcon className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Contenu principal */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAd.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="relative"
        >
          <div 
            className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 cursor-pointer group"
            onClick={() => handleAdClick(currentAd)}
          >
            {/* Image de la publicité */}
            {currentAd.image_url && (
              <div className="relative w-full h-48 sm:w-20 sm:h-20 md:w-32 md:h-32 flex-shrink-0 sm:mr-4 md:mr-6 mb-4 sm:mb-0">
                <Image
                  src={currentAd.image_url}
                  alt={currentAd.title}
                  fill
                  className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80px, 128px"
                />
              </div>
            )}

            {/* Contenu textuel */}
            <div className="flex-1 min-w-0 w-full">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200 leading-tight">
                {currentAd.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-sm md:text-base line-clamp-2 mb-3 leading-relaxed">
                {currentAd.description}
              </p>
              
              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-xs md:text-sm text-gray-500">
                {currentAd.category && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                    {currentAd.category}
                  </span>
                )}
                {currentAd.location && (
                  <span className="flex items-center text-xs">
                    📍 {currentAd.location}
                  </span>
                )}
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium text-xs">
                  Sponsorisé
                </span>
              </div>
            </div>

            {/* Indicateur de lien externe */}
            {currentAd.target_url && (
              <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-4 self-center">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-200">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Contrôles de navigation */}
      {showControls && availableAds.length > 1 && (
        <>
          {/* Boutons précédent/suivant */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110 z-10"
            aria-label="Publicité précédente"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110 z-10"
            aria-label="Publicité suivante"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>

          {/* Indicateurs de pagination */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {availableAds.map((_, index) => (
              <button
                key={index}
                onClick={() => goToAd(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-primary-500 w-6'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Aller à la publicité ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Badge de pondération (visible en mode développement) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
          Poids: {currentAd.weight.toFixed(1)} | Prob: {(currentAd.probability * 100).toFixed(1)}%
        </div>
      )}
    </div>
  );
}

/**
 * Composant carrousel compact pour la sidebar
 */
export function CompactAdvertisementCarousel({ className = '' }: { className?: string }) {
  return (
    <AdvertisementCarousel
      autoRotate={true}
      rotationInterval={10000}
      maxAds={3}
      showControls={false}
      showCloseButton={true}
      className={`${className} max-w-sm`}
    />
  );
}

/**
 * Composant carrousel pour la page d'accueil
 */
export function HeroAdvertisementCarousel({ className = '' }: { className?: string }) {
  return (
    <AdvertisementCarousel
      autoRotate={true}
      rotationInterval={6000}
      maxAds={8}
      showControls={true}
      showCloseButton={false}
      className={`${className} max-w-4xl mx-auto`}
    />
  );
}

/**
 * Composant carrousel mobile optimisé
 */
export function MobileAdvertisementCarousel({ className = '' }: { className?: string }) {
  return (
    <AdvertisementCarousel
      autoRotate={true}
      rotationInterval={7000}
      maxAds={5}
      showControls={true}
      showCloseButton={true}
      className={`${className} lg:hidden`}
    />
  );
}