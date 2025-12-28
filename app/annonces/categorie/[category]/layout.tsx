import { Metadata } from "next";
import { generateGuyaneSEO } from "@/lib/seo";
import AnnouncementsByCategoryPage from "./page";

interface Props {
  params: {
    category: string;
  };
}

const categoryMetadata: Record<
  string,
  { title: string; description: string; keywords: string }
> = {
  vehicules: {
    title: "Petites Annonces Véhicules Guyane - Achetez & Vendez des Voitures",
    description:
      "Trouvez les meilleures offres de véhicules en Guyane française. Voitures neuves et d'occasion, motos, scooters. Achetez ou vendez facilement à Cayenne, Kourou et partout en Guyane.",
    keywords:
      "petit annonce véhicules guyane, vendre voiture guyane, acheter voiture guyane, annonces auto guyane, occasion guyane",
  },
  immobilier: {
    title: "Petites Annonces Immobilier Guyane - Achetez & Louez",
    description:
      "Découvrez les petites annonces immobilier en Guyane française. Maisons, appartements, terrains à vendre ou louer à Cayenne, Kourou et Saint-Laurent.",
    keywords:
      "petit annonce immobilier guyane, maison guyane, appartement cayenne, location immobilier guyane, acheter maison guyane",
  },
  emploi: {
    title: "Petites Annonces Emploi Guyane - Trouvez un Travail",
    description:
      "Explorez les offres d'emploi en Guyane française. CDI, CDD, stage, mission intérim. Trouvez votre prochain emploi à Cayenne, Kourou et partout en Guyane.",
    keywords:
      "petit annonce emploi guyane, offre emploi guyane, travail guyane, recrutement guyane, offres emploi cayenne",
  },
  mode: {
    title: "Petites Annonces Mode Guyane - Vêtements & Accessoires",
    description:
      "Achetez et vendez des vêtements, chaussures et accessoires en Guyane française. Mode, fashion, styles locaux et internationaux.",
    keywords:
      "petit annonce mode guyane, vêtements guyane, chaussures guyane, mode cayenne, accessoires guyane",
  },
  maison: {
    title: "Petites Annonces Maison Guyane - Meubles & Décoration",
    description:
      "Trouvez tout pour votre maison en Guyane française. Meubles, décoration, électroménager. Achetez et vendez localement à meilleur prix.",
    keywords:
      "petit annonce maison guyane, meubles guyane, décoration guyane, électroménager guyane, mobilier cayenne",
  },
  multimédia: {
    title: "Petites Annonces Multimédia Guyane - Électronique & Tech",
    description:
      "Découvrez les annonces multimédia en Guyane française. Téléphones, ordinateurs, TV, appareils photo. Achetez et vendez de la tech.",
    keywords:
      "petit annonce multimédia guyane, téléphone guyane, ordinateur guyane, électronique cayenne, tech guyane",
  },
  loisirs: {
    title: "Petites Annonces Loisirs Guyane - Sports & Divertissement",
    description:
      "Trouvez tout pour vos loisirs en Guyane française. Sports, jeux, équipements outdoor. Achetez et vendez vos loisirs.",
    keywords:
      "petit annonce loisirs guyane, sports guyane, équipements guyane, loisirs cayenne, activités guyane",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = params.category.toLowerCase().replace(/-/g, " ");
  const normalizedCategory = category.toLowerCase().replace(/ /g, "-");
  const metadata =
    categoryMetadata[normalizedCategory] || categoryMetadata.emploi;

  return generateGuyaneSEO({
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    category: "annonces",
    canonicalUrl: `/annonces/categorie/${params.category.toLowerCase()}`,
  });
}

export default function AnnouncementsByCategory({ params }: Props) {
  return <AnnouncementsByCategoryPage category={params.category} />;
}
