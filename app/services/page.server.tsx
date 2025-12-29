import { Metadata } from "next";
import { generateGuyaneSEO } from "@/lib/seo";

interface PageProps {
  searchParams: Promise<{
    location?: string;
    category?: string;
    [key: string]: string | undefined;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const location = params.location ? decodeURIComponent(params.location) : "";
  const category = params.category ? decodeURIComponent(params.category) : "";

  // Construire l'URL canonical
  const queryParams = new URLSearchParams();
  if (location) queryParams.append("location", location);
  if (category) queryParams.append("category", category);
  const canonicalPath = queryParams.toString()
    ? `/services?${queryParams}`
    : "/services";

  // Créer le titre et description dynamiques
  let title = "Services Guyane";
  let description = "Trouvez les meilleurs services en Guyane française";

  if (location && category) {
    title = `${category} à ${location} - Services Guyane`;
    description = `Besoin d'un ${category.toLowerCase()} à ${location}? Trouvez les meilleurs prestataires sur Services Guyane.`;
  } else if (location) {
    title = `Services à ${location} - Guyane`;
    description = `Découvrez tous les services disponibles à ${location}. Trouvez les prestataires de confiance en Guyane.`;
  } else if (category) {
    title = `${category} - Services Guyane`;
    description = `Trouvez un bon ${category.toLowerCase()} en Guyane française. Services de qualité, prestataires vérifiés.`;
  }

  return generateGuyaneSEO({
    title,
    description,
    keywords: location
      ? `${category || "services"} ${location}, guyane, prestataires`
      : `services guyane, ${category || "services"}, prestataires`,
    canonicalUrl: canonicalPath,
    ogTitle: title,
    ogDescription: description,
  });
}

export default async function ServicesMetadataWrapper({
  searchParams,
  children,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
  children: React.ReactNode;
}) {
  // Cette page serveur enveloppe la page client pour les métadonnées
  // Les enfants contiennent le composant client
  return children;
}
