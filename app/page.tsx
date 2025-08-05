"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { CallToAction } from "@/components/home/CallToAction";
import { Newsletter } from "@/components/home/Newsletter";
import { HeroAdvertisementCarousel } from "@/components/advertisements/AdvertisementCarousel";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/marketplace');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {/* Carrousel de publicités pondérées */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <HeroAdvertisementCarousel />
          </div>
        </section>

        <Categories />
        <FeaturedListings />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
        <Newsletter />
      </main>
    </div>
  );
}
