"use client";

import { generateJSONLD } from "@/lib/seo";
import Script from "next/script";

interface StructuredDataProps {
  type: "Organization" | "Product" | "Service" | "WebPage" | "BreadcrumbList";
  title?: string;
  description?: string;
  image?: string;
  price?: number;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  location?:
    | "cayenne"
    | "kourou"
    | "saint-laurent"
    | "maripasoula"
    | "grand-santi"
    | "apatou";
  breadcrumbs?: { name: string; url: string }[];
}

/**
 * Composant pour injecter des données structurées JSON-LD
 * Améliore le référencement et l'affichage dans les résultats de recherche
 */
export default function StructuredData({
  type,
  title = "",
  description = "",
  image = "/images/guyane-marketplace-og.jpg",
  price,
  availability = "InStock",
  location,
  breadcrumbs,
}: StructuredDataProps) {
  const jsonLD = generateJSONLD({
    type,
    title,
    description,
    image,
    price,
    availability,
    location,
    breadcrumbs,
  });

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
    />
  );
}
