"use client";

import { useEffect } from 'react';

/**
 * Composant pour gérer les styles spécifiques à la PWA et aux petits écrans
 * Applique des ajustements dynamiques pour améliorer l'expérience utilisateur
 */
export function PWAStyles() {
  useEffect(() => {
    // Détection de la PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone ||
                  document.referrer.includes('android-app://');

    // Ajustements pour la PWA
    if (isPWA) {
      document.documentElement.classList.add('pwa-mode');
      
      // Gestion de la barre de statut iOS
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.documentElement.classList.add('ios-pwa');
      }
    }

    // Détection des très petits écrans
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Ajustements pour écrans 320px
      if (width <= 320) {
        document.documentElement.classList.add('screen-320');
        document.documentElement.classList.remove('screen-375');
      }
      // Ajustements pour écrans 375px
      else if (width <= 375) {
        document.documentElement.classList.add('screen-375');
        document.documentElement.classList.remove('screen-320');
      }
      // Écrans plus larges
      else {
        document.documentElement.classList.remove('screen-320', 'screen-375');
      }
    };

    // Appel initial et écoute des changements
    handleResize();
    window.addEventListener('resize', handleResize);

    // Amélioration des performances de défilement
    document.documentElement.style.scrollBehavior = 'smooth';

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return null;
}

export default PWAStyles;