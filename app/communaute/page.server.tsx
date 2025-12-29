import { Metadata } from "next";
import { generateGuyaneSEO } from "@/lib/seo";

interface PageProps {
  searchParams: Promise<{
    location?: string;
    sort?: string;
    [key: string]: string | undefined;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const location = params.location ? decodeURIComponent(params.location) : "";

  // Construire l'URL canonical
  const queryParams = new URLSearchParams();
  if (location) queryParams.append("location", location);
  if (params.sort) queryParams.append("sort", params.sort);
  const canonicalPath = queryParams.toString()
    ? `/communaute?${queryParams}`
    : "/communaute";

  // Créer le titre et description dynamiques
  let title = "Communauté Guyane";
  let description =
    "Connectez-vous avec la communauté guyanese, partagez vos expériences et conseils";

  if (location) {
    title = `Communauté à ${location} - Guyane`;
    description = `Connectez-vous avec les gens à ${location}. Partagez vos expériences et conseils sur la vie en Guyane.`;
  }

  return generateGuyaneSEO({
    title,
    description,
    keywords: location
      ? `communauté ${location}, forum guyane, ${location} guyane`
      : "communauté guyane, forum guyane, discussion",
    canonicalUrl: canonicalPath,
    ogTitle: title,
    ogDescription: description,
  });
}

export default async function CommunauteMetadataWrapper({
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
