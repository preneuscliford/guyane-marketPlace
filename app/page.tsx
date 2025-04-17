import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import type { Database } from "@/types/supabase";

type Comment = Database["public"]["Tables"]["comments"]["Row"];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              La marketplace locale de la Guyane
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Découvrez les services, annonces et actualités de votre région.
              Rejoignez notre communauté grandissante !
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/marketplace">Explorer les services</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/auth">Créer un compte</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Fonctionnalités
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Tout ce dont vous avez besoin pour connecter et développer votre
              activité en Guyane
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <h3 className="font-bold">Marketplace de Services</h3>
                <p className="text-sm text-muted-foreground">
                  Proposez vos services ou trouvez des prestataires qualifiés
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <h3 className="font-bold">Petites Annonces</h3>
                <p className="text-sm text-muted-foreground">
                  Publiez et consultez les annonces locales
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <h3 className="font-bold">Actualités Locales</h3>
                <p className="text-sm text-muted-foreground">
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
