import { redirect } from "next/navigation";

interface Props {
  city: string;
}

/**
 * Composant pour afficher les annonces filtrées par ville
 * Actuellement redirige vers la page principale des annonces avec filtre
 * À améliorer: ajouter une vraie page avec contenu spécifique à la ville
 */
export default function AnnouncementsByCityPage({ city }: Props) {
  // Normaliser le nom de la ville
  const normalizedCity = city.toLowerCase().replace(/-/g, " ");

  // Rediriger vers la page des annonces avec un filtre de localisation
  // À l'avenir, on pourrait implémenter une vraie page avec plus de contenu SEO
  redirect(`/annonces?location=${encodeURIComponent(normalizedCity)}`);
}
