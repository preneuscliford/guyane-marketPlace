import { Metadata } from "next";
import { generateGuyaneSEO, SEO_TEMPLATES } from "@/lib/seo";

interface LayoutProps {
  children: React.ReactNode;
  searchParams?: Promise<{
    location?: string;
    sort?: string;
    [key: string]: string | undefined;
  }>;
}

export async function generateMetadata({
  searchParams,
}: LayoutProps): Promise<Metadata> {
  const params = await searchParams;
  const location = params?.location ? decodeURIComponent(params.location) : "";

  // Construire l'URL canonical avec query string
  const queryParams = new URLSearchParams();
  if (location) queryParams.append("location", location);
  if (params?.sort) queryParams.append("sort", params.sort);
  const canonicalPath = queryParams.toString()
    ? `/communaute?${queryParams}`
    : "/communaute";

  // Créer le titre et description dynamiques
  let title = "Communauté Guyane - Forum et Discussions";
  let description =
    "Connectez-vous avec la communauté guyanese. Partagez vos expériences, conseils et discussions.";

  if (location) {
    title = `Communauté à ${location} - Guyane`;
    description = `Connectez-vous avec les gens à ${location}. Partagez vos expériences et conseils.`;
  }

  return generateGuyaneSEO({
    ...SEO_TEMPLATES.communaute,
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

export default function CommunauteLayout({
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
            name: "Communauté Guyane",
            description:
              "Forum et communauté des habitants de Guyane française",
            url: "https://www.mcguyane.com/communaute",
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
                  name: "Communauté",
                  item: "https://www.mcguyane.com/communaute",
                },
              ],
            },
          }),
        }}
      />
    </>
  );
}
