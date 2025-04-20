export function FeaturedListings() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Annonces en vedette</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les dernières annonces publiées par notre communauté
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Exemple de carte d'annonce */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute top-2 right-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                Nouveau
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Service de jardinage</h3>
              <p className="text-gray-600 mb-4">Entretien complet de jardins et espaces verts</p>
              <div className="flex items-center justify-between">
                <span className="text-purple-600 font-bold">50€/jour</span>
                <button className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors">
                  Voir plus
                </button>
              </div>
            </div>
          </div>

          {/* Répéter les cartes similaires */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Annonce {item}</h3>
                <p className="text-gray-600 mb-4">Description de l'annonce exemple</p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-600 font-bold">Prix</span>
                  <button className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors">
                    Voir plus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
