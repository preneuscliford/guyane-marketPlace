"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

interface Advertisement {
  id: string;
  title: string;
  description: string;
  image_url: string;
  target_url: string;
  budget: number;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    full_name?: string;
  };
}

interface SponsoredBannerProps {
  className?: string;
  autoPlayInterval?: number;
  showControls?: boolean;
}

/**
 * Composant d'affichage des affiches sponsorisées avec carrousel automatique
 * pondéré par le budget publicitaire
 */
export default function SponsoredBanner({ 
  className = "", 
  autoPlayInterval = 5000,
  showControls = true 
}: SponsoredBannerProps) {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [weightedAds, setWeightedAds] = useState<Advertisement[]>([]);

  /**
   * Charge les publicités actives
   */
  const fetchAdvertisements = async () => {
    try {
      const now = new Date().toISOString();
      
      // Récupérer les publicités actives
      const { data: adsData, error: adsError } = await supabase
        .from('advertisements')
        .select('*')
        .eq('status', 'active')
        .lte('start_date', now)
        .gte('end_date', now)
        .gt('budget', 0)
        .order('budget', { ascending: false });

      if (adsError) throw adsError;

      if (!adsData || adsData.length === 0) {
        setAdvertisements([]);
        setWeightedAds([]);
        return;
      }

      // Récupérer les profils des utilisateurs
      const userIds = adsData.map(ad => ad.user_id).filter(Boolean);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Joindre les données
      const adsWithProfiles = adsData.map(ad => ({
        ...ad,
        profiles: profilesData?.find(profile => profile.id === ad.user_id) || { username: '', full_name: '' }
      }));

      setAdvertisements(adsWithProfiles);
      
      // Créer un tableau pondéré basé sur le budget
      if (adsWithProfiles.length > 0) {
        const weighted = createWeightedArray(adsWithProfiles);
        setWeightedAds(weighted);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des publicités:', error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Crée un tableau pondéré basé sur le budget des publicités
   * Plus le budget est élevé, plus la publicité apparaît souvent
   */
  const createWeightedArray = (ads: Advertisement[]): Advertisement[] => {
    const weighted: Advertisement[] = [];
    const totalBudget = ads.reduce((sum, ad) => sum + ad.budget, 0);
    
    ads.forEach(ad => {
      // Calcule le poids relatif (minimum 1, maximum basé sur le budget)
      const weight = Math.max(1, Math.floor((ad.budget / totalBudget) * 100));
      
      // Ajoute la publicité plusieurs fois selon son poids
      for (let i = 0; i < weight; i++) {
        weighted.push(ad);
      }
    });
    
    // Mélange le tableau pour éviter les séquences prévisibles
    return shuffleArray(weighted);
  };

  /**
   * Mélange un tableau (algorithme Fisher-Yates)
   */
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  /**
   * Enregistre une impression publicitaire
   */
  const recordImpression = async (adId: string) => {
    try {
      await supabase
        .from('advertisement_impressions')
        .insert({
          advertisement_id: adId,
          user_agent: navigator.userAgent,
          ip_address: 'unknown', // À implémenter côté serveur
          page_url: window.location.href
        });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'impression:', error instanceof Error ? error.message : String(error));
    }
  };

  /**
   * Enregistre un clic publicitaire
   */
  const recordClick = async (adId: string) => {
    try {
      await supabase
        .from('advertisement_clicks')
        .insert({
          advertisement_id: adId,
          user_agent: navigator.userAgent,
          ip_address: 'unknown', // À implémenter côté serveur
          page_url: window.location.href
        });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du clic:', error instanceof Error ? error.message : String(error));
    }
  };

  /**
   * Passe à la publicité suivante
   */
  const nextAd = () => {
    if (weightedAds.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % weightedAds.length);
    }
  };

  /**
   * Passe à la publicité précédente
   */
  const prevAd = () => {
    if (weightedAds.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + weightedAds.length) % weightedAds.length);
    }
  };

  /**
   * Gère le clic sur une publicité
   */
  const handleAdClick = (ad: Advertisement) => {
    recordClick(ad.id);
    // Le lien s'ouvrira automatiquement grâce au composant Link
  };

  // Effet pour le carrousel automatique
  useEffect(() => {
    if (!isPaused && weightedAds.length > 1) {
      intervalRef.current = setInterval(nextAd, autoPlayInterval);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, weightedAds.length, autoPlayInterval]);

  // Effet pour enregistrer les impressions
  useEffect(() => {
    if (weightedAds.length > 0 && weightedAds[currentIndex]) {
      recordImpression(weightedAds[currentIndex].id);
    }
  }, [currentIndex, weightedAds]);

  // Chargement initial
  useEffect(() => {
    fetchAdvertisements();
  }, []);

  // Pause/reprise au survol
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (isLoading) {
    return (
      <div className={`relative w-full h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (weightedAds.length === 0) {
    return (
      <div className={`relative w-full h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl overflow-hidden flex items-center justify-center ${className}`}>
        <div className="text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Marketplace Guyane</h3>
          <p className="text-teal-100">Votre plateforme locale de confiance</p>
        </div>
      </div>
    );
  }

  const currentAd = weightedAds[currentIndex];

  return (
    <div 
      className={`relative w-full h-full rounded-xl overflow-hidden group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src={currentAd.image_url}
          alt={currentAd.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Contenu de la publicité */}
      <Link
        href={currentAd.target_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleAdClick(currentAd)}
        className="absolute inset-0 flex items-center justify-center text-center text-white hover:bg-black/10 transition-colors"
      >
        <div className="max-w-2xl px-6">
          <h2 className="text-3xl font-bold mb-3 drop-shadow-lg">
            {currentAd.title}
          </h2>
          <p className="text-lg text-gray-100 mb-4 drop-shadow">
            {currentAd.description}
          </p>
          <div className="flex items-center justify-center gap-2 text-teal-200">
            <ExternalLink className="h-5 w-5" />
            <span className="font-medium">
              Par {currentAd.profiles.full_name || currentAd.profiles.username}
            </span>
          </div>
        </div>
      </Link>

      {/* Contrôles de navigation */}
      {showControls && weightedAds.length > 1 && (
        <>
          <button
            onClick={prevAd}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Publicité précédente"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextAd}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Publicité suivante"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Indicateurs de pagination */}
      {weightedAds.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from(new Set(weightedAds.map(ad => ad.id))).map((adId, index) => {
            const isActive = weightedAds[currentIndex]?.id === adId;
            return (
              <button
                key={adId}
                onClick={() => {
                  const targetIndex = weightedAds.findIndex(ad => ad.id === adId);
                  if (targetIndex !== -1) {
                    setCurrentIndex(targetIndex);
                  }
                }}
                className={`h-2 w-8 rounded-full transition-all ${
                  isActive ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Aller à la publicité ${index + 1}`}
              />
            );
          })}
        </div>
      )}

      {/* Badge "Sponsorisé" */}
      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
        <Eye className="h-3 w-3" />
        Sponsorisé
      </div>

      {/* Indicateur de pause */}
      {isPaused && weightedAds.length > 1 && (
        <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
          Pause
        </div>
      )}
    </div>
  );
}