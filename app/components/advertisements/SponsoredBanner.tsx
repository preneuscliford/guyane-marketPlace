"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

interface Advertisement {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  target_url: string | null;
  budget: number | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  user_id: string | null;
  profiles: {
    username: string | null;
    full_name?: string | null;
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
  showControls = true,
}: SponsoredBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [weightedAds, setWeightedAds] = useState<Advertisement[]>([]);

  /**
   * Mélange aléatoirement un tableau
   */
  const shuffleArray = (array: Advertisement[]): Advertisement[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  /**
   * Crée un tableau pondéré basé sur le budget des publicités
   * Plus le budget est élevé, plus la publicité apparaît souvent
   */
  const createWeightedArray = useCallback(
    (ads: Advertisement[]): Advertisement[] => {
      const weighted: Advertisement[] = [];
      const totalBudget = ads.reduce((sum, ad) => sum + (ad.budget || 0), 0);

      ads.forEach((ad) => {
        // Calcule le poids relatif (minimum 1, maximum basé sur le budget)
        const budget = ad.budget || 1;
        const weight = Math.max(1, Math.floor((budget / totalBudget) * 100));

        // Ajoute la publicité plusieurs fois selon son poids
        for (let i = 0; i < weight; i++) {
          weighted.push(ad);
        }
      });

      // Mélange le tableau pour éviter les séquences prévisibles
      return shuffleArray(weighted);
    },
    []
  );

  /**
   * Charge les publicités actives
   */
  const fetchAdvertisements = useCallback(async () => {
    try {
      const now = new Date().toISOString();

      // Récupérer les publicités actives
      const { data: adsData, error: adsError } = await supabase
        .from("advertisements")
        .select("*")
        .eq("status", "active")
        .lte("start_date", now)
        .gte("end_date", now)
        .gt("budget", 0)
        .order("budget", { ascending: false });

      if (adsError) throw adsError;

      if (!adsData || adsData.length === 0) {
        setWeightedAds([]);
        return;
      }

      // Récupérer les profils des utilisateurs
      const userIds = adsData
        .map((ad) => ad.user_id)
        .filter(Boolean) as string[];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, full_name")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Joindre les données
      const adsWithProfiles = adsData.map((ad) => ({
        ...ad,
        profiles: profilesData?.find(
          (profile) => profile.id === ad.user_id
        ) || { username: "", full_name: "" },
      }));

      // Créer un tableau pondéré basé sur le budget
      if (adsWithProfiles.length > 0) {
        const weighted = createWeightedArray(adsWithProfiles);
        setWeightedAds(weighted);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des publicités:",
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      setIsLoading(false);
    }
  }, [createWeightedArray]);

  /**
   * Enregistre une impression publicitaire
   */
  const recordImpression = async (adId: string) => {
    try {
      // Table advertisement_impressions n'existe pas encore, on utilise advertisement_clicks pour l'instant
      await supabase.from("advertisement_clicks").insert({
        advertisement_id: adId,
        user_agent: navigator.userAgent,
        ip_address: null,
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement de l'impression:",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  /**
   * Enregistre un clic publicitaire
   */
  const recordClick = async (adId: string) => {
    try {
      await supabase.from("advertisement_clicks").insert({
        advertisement_id: adId,
        user_agent: navigator.userAgent,
        ip_address: "unknown", // À implémenter côté serveur
        page_url: window.location.href,
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement du clic:",
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  /**
   * Passe à la publicité suivante
   */
  const nextAd = useCallback(() => {
    if (weightedAds.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % weightedAds.length);
    }
  }, [weightedAds.length]);

  /**
   * Passe à la publicité précédente
   */
  const prevAd = () => {
    if (weightedAds.length > 0) {
      setCurrentIndex(
        (prev) => (prev - 1 + weightedAds.length) % weightedAds.length
      );
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
  }, [isPaused, weightedAds.length, autoPlayInterval, nextAd]);

  // Effet pour enregistrer les impressions
  useEffect(() => {
    if (weightedAds.length > 0 && weightedAds[currentIndex]) {
      recordImpression(weightedAds[currentIndex].id);
    }
  }, [currentIndex, weightedAds]);

  // Chargement initial
  useEffect(() => {
    fetchAdvertisements();
  }, [fetchAdvertisements]);

  // Pause/reprise au survol
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (isLoading) {
    return (
      <div
        className={`relative w-full h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (weightedAds.length === 0) {
    return (
      <div
        className={`relative w-full h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl overflow-hidden flex items-center justify-center ${className}`}
      >
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
        {currentAd.image_url && (
          <Image
            src={currentAd.image_url}
            alt={(currentAd.title || "Publicité") as string}
            fill
            className="object-cover"
            priority
            unoptimized={currentAd.image_url.endsWith(".svg")}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Contenu de la publicité */}
      {currentAd.target_url ? (
        <Link
          href={currentAd.target_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleAdClick(currentAd)}
          className="absolute inset-0 flex items-center justify-center text-center text-white hover:bg-black/10 transition-colors"
        >
          <div className="max-w-2xl px-3 sm:px-6">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 drop-shadow-lg leading-tight">
              {currentAd.title || "Titre non disponible"}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 drop-shadow-md opacity-90 leading-relaxed">
              {currentAd.description || "Description non disponible"}
            </p>
            <div className="inline-flex items-center gap-1 sm:gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Cliquez pour découvrir</span>
              <span className="sm:hidden">Découvrir</span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="max-w-2xl px-3 sm:px-6">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 drop-shadow-lg leading-tight">
              {currentAd.title || "Titre non disponible"}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 drop-shadow-md opacity-90 leading-relaxed">
              {currentAd.description || "Description non disponible"}
            </p>
          </div>
        </div>
      )}

      {/* Contrôles de navigation */}
      {showControls && weightedAds.length > 1 && (
        <>
          <button
            onClick={prevAd}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 touch-manipulation"
            aria-label="Publicité précédente"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>

          <button
            onClick={nextAd}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 touch-manipulation"
            aria-label="Publicité suivante"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
        </>
      )}

      {/* Indicateurs de pagination */}
      {weightedAds.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2">
          {Array.from(new Set(weightedAds.map((ad) => ad.id))).map(
            (adId, index) => {
              const isActive = weightedAds[currentIndex]?.id === adId;
              return (
                <button
                  key={adId}
                  onClick={() => {
                    const targetIndex = weightedAds.findIndex(
                      (ad) => ad.id === adId
                    );
                    if (targetIndex !== -1) {
                      setCurrentIndex(targetIndex);
                    }
                  }}
                  className={`h-1.5 sm:h-2 w-6 sm:w-8 rounded-full transition-all touch-manipulation ${
                    isActive ? "bg-white" : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Aller à la publicité ${index + 1}`}
                />
              );
            }
          )}
        </div>
      )}

      {/* Badge "Sponsorisé" */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
        <Eye className="h-3 w-3" />
        <span className="hidden sm:inline">Sponsorisé</span>
        <span className="sm:hidden">Pub</span>
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
