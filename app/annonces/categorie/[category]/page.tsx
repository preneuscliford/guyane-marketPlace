import { redirect } from "next/navigation";

interface Props {
  category: string;
}

/**
 * Composant pour afficher les annonces filtrées par catégorie
 * Actuellement redirige vers la page principale des annonces avec filtre
 */
export default function AnnouncementsByCategoryPage({ category }: Props) {
  // Normaliser le nom de la catégorie
  const normalizedCategory = category.toLowerCase().replace(/-/g, " ");

  // Rediriger vers la page des annonces avec un filtre de catégorie
  redirect(`/annonces?category=${encodeURIComponent(normalizedCategory)}`);
}
