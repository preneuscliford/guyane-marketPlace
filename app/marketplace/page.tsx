import { Header } from "@/components/layout/Header";

export default function Marketplace() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <h1>Services</h1>
        <p className="text-lg text-gray-600 mb-8">
          Découvrez les services proposés par nos prestataires locaux
        </p>
        {/* Le contenu des services sera ajouté ici */}
      </main>
    </div>
  );
}
