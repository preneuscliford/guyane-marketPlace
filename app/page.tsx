"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Search } from "lucide-react";
import { Categories } from "@/components/home/Categories";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { CallToAction } from "@/components/home/CallToAction";
import { Newsletter } from "@/components/home/Newsletter";
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
        <section className="relative pt-32 pb-16 md:pb-24 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50 to-teal-50 -z-10"></div>
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-bl from-purple-300/20 to-transparent rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-teal-300/20 to-transparent rounded-full blur-3xl -z-10"></div>
          
          <div className="container flex max-w-4xl flex-col items-center gap-6 text-center mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-500 bg-clip-text text-transparent">
              Blada Market - Plateforme communautaire guyanaise
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Découvrez les services, annonces et actualités de votre région.
              <span className="block mt-2 font-medium text-purple-700">Rejoignez notre communauté grandissante !</span>
            </p>
            <div className="relative max-w-xl w-full mb-8">
              <input
                type="text"
                placeholder="Que recherchez-vous ?"
                className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
              <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
              <Button 
                className="absolute right-2 top-2"
              >
                Rechercher
              </Button>
            </div>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-transform hover:scale-105" asChild>
                  <Link href="/marketplace">Explorer les services</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-purple-600 text-purple-700 hover:bg-purple-50 shadow-md transition-transform hover:scale-105" asChild>
                  <Link href="/auth">Créer un compte</Link>
                </Button>
              </div>
            )}
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
