/**
 * Wrapper serveur pour la page Services
 * Génère les métadonnées dynamiques et passe les params au client
 */

import { Suspense } from "react";
import ServicesPageClient from "./page.client";

interface PageProps {
  searchParams: Promise<{
    location?: string;
    category?: string;
    search?: string;
    sort_by?: string;
    sort_order?: string;
    price_min?: string;
    price_max?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ServicesPageClient initialParams={params} />
    </Suspense>
  );
}
