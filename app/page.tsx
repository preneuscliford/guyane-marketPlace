import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Search, ShoppingBag, Briefcase, Newspaper } from "lucide-react";

export default function Home() {
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
              La marketplace locale de la Guyane
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-transform hover:scale-105" asChild>
                <Link href="/marketplace">Explorer les services</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-purple-600 text-purple-700 hover:bg-purple-50 shadow-md transition-transform hover:scale-105" asChild>
                <Link href="/auth">Créer un compte</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explorez nos catégories</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Découvrez tous les services et produits disponibles dans notre marketplace
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group relative overflow-hidden bg-white rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-purple-600 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="flex flex-col items-center justify-center p-6 text-center h-48">
                  <div className="p-3 rounded-full bg-purple-600 bg-opacity-10 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBag className="h-7 w-7 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Marketplace de Services</h3>
                  <p className="text-gray-500">234 services</p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-blue-600 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="flex flex-col items-center justify-center p-6 text-center h-48">
                  <div className="p-3 rounded-full bg-blue-600 bg-opacity-10 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Petites Annonces</h3>
                  <p className="text-gray-500">192 annonces</p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-teal-600 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="flex flex-col items-center justify-center p-6 text-center h-48">
                  <div className="p-3 rounded-full bg-teal-600 bg-opacity-10 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Newspaper className="h-7 w-7 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Actualités Locales</h3>
                  <p className="text-gray-500">85 articles</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
