import { Metadata } from "next";
import { generateGuyaneSEO, SEO_TEMPLATES } from "@/lib/seo";

interface LayoutProps {
  children: React.ReactNode;
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
    ? `/services?${queryParams}`
    : "/services";

  // Créer le titre et description dynamiques
  let title = "Services Guyane - Trouvez les meilleurs prestataires";
  let description =
    "Plateforme #1 des services en Guyane française. Plombiers, électriciens, ménage, santé et bien plus.";

  if (location && category) {
    title = `${category} à ${location} - Services Guyane`;
    description = `Besoin d'un ${category.toLowerCase()} à ${location}? Trouvez les meilleurs prestataires vérifiés.`;
  } else if (location) {
    title = `Services à ${location} - Guyane`;
    description = `Découvrez tous les services disponibles à ${location}. Prestataires fiables et vérifiés.`;
  } else if (category) {
    title = `${category} en Guyane - Services Guyane`;
    description = `Trouvez un bon ${category.toLowerCase()} en Guyane française. Services de qualité.`;
  }

  return generateGuyaneSEO({
    ...SEO_TEMPLATES.services,
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

export default function ServicesLayout({
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
            name: "Services Guyane",
            description:
              "Plateforme des services professionnels et artisanaux en Guyane française",
            url: "https://www.mcguyane.com/services",
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
                  name: "Services",
                  item: "https://www.mcguyane.com/services",
                },
              ],
            },
          }),
        }}
      />
    </>
  );
}
