import { Metadata } from "next";
import { generateGuyaneSEO, SEO_TEMPLATES } from "@/lib/seo";

export const metadata: Metadata = generateGuyaneSEO({
  ...SEO_TEMPLATES.marketplace,
  canonicalUrl: "/marketplace",
});

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
