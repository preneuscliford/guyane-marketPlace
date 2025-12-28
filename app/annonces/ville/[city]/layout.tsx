import { Metadata } from "next";
import { generateGuyaneSEO } from "@/lib/seo";
import AnnouncementsByCityPage from "./page";

interface Props {
  params: {
    city: string;
  };
}

const cityMetadata: Record<
  string,
  { title: string; description: string; keywords: string }
> = {
  cayenne: {
    title: "Petites Annonces Cayenne - Achetez & Vendez à Cayenne, Guyane",
    description:
      "Trouvez les meilleures petites annonces à Cayenne, chef-lieu de la Guyane française. Immobilier, véhicules, emploi, services. Achetez et vendez facilement à Cayenne.",
    keywords:
      "petit annonce cayenne, annonces cayenne, acheter vendre cayenne, immobilier cayenne, véhicules cayenne, emploi cayenne",
  },
  kourou: {
    title: "Petites Annonces Kourou - Achetez & Vendez à Kourou, Guyane",
    description:
      "Découvrez les petites annonces à Kourou, centre spatial de la Guyane française. Immobilier, véhicules, emploi et services. Marketplace locale Kourou.",
    keywords:
      "petit annonce kourou, annonces kourou, acheter vendre kourou, immobilier kourou, véhicules kourou, emploi kourou",
  },
  "saint-laurent": {
    title:
      "Petites Annonces Saint-Laurent - Achetez & Vendez à Saint-Laurent-du-Maroni",
    description:
      "Trouvez les petites annonces à Saint-Laurent-du-Maroni, ouest de la Guyane française. Immobilier, services, emploi. Plateforme locale.",
    keywords:
      "petit annonce saint-laurent, annonces saint-laurent du maroni, acheter vendre saint-laurent, immobilier saint-laurent",
  },
  maripasoula: {
    title:
      "Petites Annonces Maripasoula - Achetez & Vendez à Maripasoula, Guyane",
    description:
      "Découvrez les petites annonces à Maripasoula, sud de la Guyane française. Annonces locales, services et communauté.",
    keywords:
      "petit annonce maripasoula, annonces maripasoula, acheter vendre maripasoula, services maripasoula",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = params.city.toLowerCase().replace(/-/g, " ");
  const metadata =
    cityMetadata[city.replace(/ /g, "-")] || cityMetadata.cayenne;

  return generateGuyaneSEO({
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    location: city.replace(/ /g, "-") as any,
    category: "annonces",
    canonicalUrl: `/annonces/ville/${params.city.toLowerCase()}`,
  });
}

export default function AnnouncesByCity({ params }: Props) {
  return <AnnouncementsByCityPage city={params.city} />;
}
