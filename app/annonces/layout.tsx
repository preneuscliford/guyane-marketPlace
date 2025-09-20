import { Metadata } from "next";
import { generateGuyaneSEO, SEO_TEMPLATES } from "@/lib/seo";

export const metadata: Metadata = generateGuyaneSEO({
  ...SEO_TEMPLATES.annonces,
  canonicalUrl: "/annonces",
});

export default function AnnoncesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
