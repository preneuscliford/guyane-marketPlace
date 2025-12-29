import { Metadata } from "next";
import { generateGuyaneSEO, SEO_TEMPLATES } from "@/lib/seo";

interface LayoutProps {
  children: React.ReactNode;
  params?: Promise<Record<string, string>>;
  searchParams?: Promise<{
    location?: string;
    category?: string;
    [key: string]: string | undefined;
  }>;
}

export async function generateMetadata({
  searchParams,
}: LayoutProps): Promise<Metadata> {
  const params = await searchParams;
  const location = params?.location ? decodeURIComponent(params.location) : "";
  const category = params?.category ? decodeURIComponent(params.category) : "";

  // Construire l'URL canonical avec query string
  const queryParams = new URLSearchParams();
  if (location) queryParams.append("location", location);
  if (category) queryParams.append("category", category);
  const canonicalPath = queryParams.toString()
    ? `/marketplace?${queryParams}`
    : "/marketplace";

  // Créer le titre et description dynamiques
  let title = "Marketplace Guyane - Achetez et Vendez";
  let description =
    "Plateforme de vente en ligne #1 en Guyane. Trouvez des produits, des services et bien plus.";

  if (location && category) {
    title = `${category} à ${location} - Marketplace Guyane`;
    description = `Trouvez les meilleurs ${category.toLowerCase()} à ${location}. Achetez et vendez sur Marketplace Guyane.`;
  } else if (location) {
    title = `Marketplace à ${location} - Guyane française`;
    description = `Découvrez tous nos produits à ${location}. Acheter et vendre en ligne en Guyane.`;
  } else if (category) {
    title = `${category} à vendre - Marketplace Guyane`;
    description = `Parcourez notre sélection de ${category.toLowerCase()}. Meilleures offres en Guyane.`;
  }

  return generateGuyaneSEO({
    ...SEO_TEMPLATES.marketplace,
    title,
    description,
    canonicalUrl: canonicalPath,
    ogTitle: title,
    ogDescription: description,
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  });
}

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Contenu interactif */}
      {children}

      {/* SEO: Contenu structuré JSON-LD pour les rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Marketplace Guyane",
            description:
              "Plateforme de vente en ligne pour acheter et vendre en Guyane française",
            url: "https://www.mcguyane.com/marketplace",
            inLanguage: "fr-GF",
            isPartOf: {
              "@type": "WebSite",
              name: "MCGuyane",
              url: "https://www.mcguyane.com",
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Accueil",
                  item: "https://www.mcguyane.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Marketplace",
                  item: "https://www.mcguyane.com/marketplace",
                },
              ],
            },
          }),
        }}
      />
    </>
  );
}
