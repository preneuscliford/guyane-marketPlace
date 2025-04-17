import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <h1>Bienvenue sur Guyane Marketplace</h1>
        <p className="text-lg text-gray-600 mb-8">
          La place de marché locale pour tous vos besoins en Guyane
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2>Services</h2>
            <p className="text-gray-600 mb-4">
              Trouvez des prestataires de services locaux qualifiés
            </p>
            <a href="/marketplace" className="inline-block">
              Découvrir les services →
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2>Annonces</h2>
            <p className="text-gray-600 mb-4">
              Consultez les dernières annonces de la communauté
            </p>
            <a href="/annonces" className="inline-block">
              Voir les annonces →
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2>Actualités</h2>
            <p className="text-gray-600 mb-4">
              Restez informé des dernières actualités locales
            </p>
            <a href="/actualites" className="inline-block">
              Lire les actualités →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
