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
    ? `/marketplace?${queryParams}`
    : "/marketplace";

  // Créer le titre et description dynamiques
  let title = "Marketplace Guyane";
  let description = "Achetez et vendez des produits en Guyane française";

  if (location && category) {
    title = `${category} à ${location} - Marketplace Guyane`;
    description = `Trouvez les meilleurs ${category.toLowerCase()} à ${location}. Achetez et vendez sur Marketplace Guyane.`;
  } else if (location) {
    title = `Marketplace à ${location} - Guyane`;
    description = `Découvrez tous nos produits et services à ${location}. Achetez et vendez en Guyane française.`;
  } else if (category) {
    title = `${category} - Marketplace Guyane`;
    description = `Parcourez notre sélection de ${category.toLowerCase()}. Acheter et vendre en Guyane.`;
  }

  return generateGuyaneSEO({
    title,
    description,
    keywords: location
      ? `${
          category || "produits"
        } ${location}, marketplace guyane, acheter ${location}`
      : `marketplace guyane, ${category || "produits"}, acheter vendre`,
    canonicalUrl: canonicalPath,
    ogTitle: title,
    ogDescription: description,
  });
}

export default async function MarketplaceMetadataWrapper({
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
