import { Header } from "@/components/layout/Header";

export default function Actualites() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <h1>Actualités</h1>
        <p className="text-lg text-gray-600 mb-8">
          Restez informé des dernières actualités de Guyane
        </p>
        {/* Le contenu des actualités sera ajouté ici */}
      </main>
    </div>
  );
}
