import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import type { Database } from "@/types/supabase";

type Comment = Database["public"]["Tables"]["comments"]["Row"];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f0abfc]">
      <Header />
      <main className="flex-1">
        <section className="space-y-8 pb-8 pt-10 md:pb-16 md:pt-16 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-6 text-center">
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-fuchsia-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent drop-shadow-lg">
              La marketplace locale de la Guyane
            </h1>
            <p className="max-w-[42rem] leading-normal text-lg sm:text-2xl sm:leading-9 text-gray-700 dark:text-gray-200">
              Découvrez les services, annonces et actualités de votre région.<br />
              <span className="font-semibold text-fuchsia-700">Rejoignez notre communauté grandissante !</span>
            </p>
            <div className="space-x-4 mt-4">
              <Button asChild size="lg" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-lg transition-transform hover:scale-105">
                <Link href="/marketplace">Explorer les services</Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="border-fuchsia-600 text-fuchsia-700 hover:bg-fuchsia-50 shadow-md transition-transform hover:scale-105">
                <Link href="/auth">Créer un compte</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container space-y-8 py-10 md:py-16 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-4xl leading-[1.1] sm:text-5xl md:text-6xl bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-sky-400 bg-clip-text text-transparent">
              Fonctionnalités
            </h2>
            <p className="max-w-[85%] leading-normal text-lg sm:text-xl sm:leading-8 text-gray-600 dark:text-gray-300">
              Tout ce dont vous avez besoin pour connecter et développer votre activité en Guyane
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border-2 border-fuchsia-200 bg-white/80 p-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex h-[200px] flex-col justify-between rounded-xl p-6 bg-gradient-to-br from-fuchsia-50 via-indigo-50 to-white">
                <h3 className="font-bold text-fuchsia-700 text-xl mb-2">Marketplace de Services</h3>
                <p className="text-base text-gray-700 dark:text-gray-600">
                  Proposez vos services ou trouvez des prestataires qualifiés
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border-2 border-indigo-200 bg-white/80 p-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex h-[200px] flex-col justify-between rounded-xl p-6 bg-gradient-to-br from-indigo-50 via-fuchsia-50 to-white">
                <h3 className="font-bold text-indigo-700 text-xl mb-2">Petites Annonces</h3>
                <p className="text-base text-gray-700 dark:text-gray-600">
                  Publiez et consultez les annonces locales
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border-2 border-sky-200 bg-white/80 p-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex h-[200px] flex-col justify-between rounded-xl p-6 bg-gradient-to-br from-sky-50 via-fuchsia-50 to-white">
                <h3 className="font-bold text-sky-700 text-xl mb-2">Actualités Locales</h3>
                <p className="text-base text-gray-700 dark:text-gray-600">
                  Restez informé des dernières actualités de votre région
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
