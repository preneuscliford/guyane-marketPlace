"use client";

import { Header } from "./Header";

/**
 * Wrapper client pour le composant Header
 * Permet d'utiliser le Header dans le layout côté serveur
 */
export function HeaderWrapper() {
  return <Header />;
}
