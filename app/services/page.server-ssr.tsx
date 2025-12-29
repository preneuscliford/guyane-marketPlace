/**
 * Page des services - Version serveur pour SEO
 * Le contenu dans <noscript> sera visible à Google même si JavaScript n'est pas exécuté
 */

import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import ServicesPageClient from "./page.client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    location?: string;
    category?: string;
    search?: string;
    [key: string]: string | undefined;
  }>;
}

// Fonction pour récupérer les services server-side (pour le SEO)
async function getServices(location?: string, category?: string) {
  try {
    let query = supabase
      .from("services")
      .select(
        "id, title, description, category, location, price, price_type, images, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(12);

    if (location) {
      query = query.eq("location", location);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching services:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch services:", err);
    return [];
  }
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const location = params?.location;
  const category = params?.category;

  // Récupérer les services pour le rendu serveur
  const serverServices = await getServices(location, category);

  return (
    <>
      {/* Contenu client interactif */}
      <ServicesPageClient />

      {/* Contenu serveur pour SEO (visible à Google) */}
      <noscript>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Services Guyane</h1>
          {location && <p className="text-lg mb-4">Services à {location}</p>}
          {category && <p className="text-lg mb-4">Catégorie: {category}</p>}

          {serverServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serverServices.map((service: any) => (
                <article key={service.id} className="border rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h2>
                  {service.description && (
                    <p className="text-gray-600 mb-3">
                      {service.description.substring(0, 150)}...
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mb-2">
                    Lieu: {service.location || "Non spécifié"}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    Catégorie: {service.category || "Non spécifié"}
                  </p>
                  {service.price && (
                    <p className="font-bold text-green-600 mb-3">
                      {service.price}€{" "}
                      {service.price_type ? `(${service.price_type})` : ""}
                    </p>
                  )}
                  <Link
                    href={`/services/${service.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Voir le service →
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              Aucun service trouvé pour ces critères.
            </p>
          )}
        </div>
      </noscript>
    </>
  );
}
