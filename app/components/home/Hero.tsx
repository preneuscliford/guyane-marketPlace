"use client";

import { Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative pt-32 pb-16 md:pb-24 lg:pb-32 overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50 to-teal-50 -z-10"></div>
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-bl from-purple-300/20 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-teal-300/20 to-transparent rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex max-w-4xl flex-col items-center gap-6 text-center mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-500 bg-clip-text text-transparent">
            Blada Market 
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
          La marketplace locale de la Guyane
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
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">500+</p>
              <p className="text-gray-600">Services</p>
            </div>
            <div className="hidden md:block h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">5,000+</p>
              <p className="text-gray-600">Utilisateurs</p>
            </div>
            <div className="hidden md:block h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">10K+</p>
              <p className="text-gray-600">Annonces</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
