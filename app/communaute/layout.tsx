import { Metadata } from "next";
import { generateGuyaneSEO, SEO_TEMPLATES } from "@/lib/seo";

export const metadata: Metadata = generateGuyaneSEO({
  ...SEO_TEMPLATES.communaute,
  canonicalUrl: "/communaute",
});

export default function CommunauteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
