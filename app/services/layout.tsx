import { Metadata } from "next";
import { generateGuyaneSEO, SEO_TEMPLATES } from "@/lib/seo";

export const metadata: Metadata = generateGuyaneSEO({
  ...SEO_TEMPLATES.services,
  canonicalUrl: "/services",
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
