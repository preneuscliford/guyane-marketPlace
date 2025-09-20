'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Composant pour nettoyer l'URL après l'authentification OAuth
 * Supprime les paramètres access_token, refresh_token, etc.
 */
export default function AuthURLCleaner() {
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'URL contient des paramètres d'authentification
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    
    if (hash.includes('access_token') || 
        hash.includes('refresh_token') || 
        searchParams.has('code') || 
        searchParams.has('state')) {
      
      // Nettoyer l'URL sans recharger la page
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  return null; // Ce composant ne rend rien visuellement
}