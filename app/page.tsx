"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CallToAction } from "@/components/home/CallToAction";
import StructuredData from "@/components/seo/StructuredData";

import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/marketplace");
    }
  }, [isAuthenticated, router]);

  return (
    <>
      {/* Données structurées pour la page d'accueil */}
      <StructuredData
        type="Organization"
        title="Guyane Marketplace - Commerce Local en Guyane Française"
        description="La première marketplace de Guyane française pour le commerce local"
      />

      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">
          <Hero />
          <Categories />
          <FeaturedListings />
          <HowItWorks />
          <CallToAction />
        </main>
      </div>
    </>
  );
}
