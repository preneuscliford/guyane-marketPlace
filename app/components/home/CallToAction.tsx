export function CallToAction() {
  return (
    <section className="py-16 md:py-24 bg-purple-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Prêt à commencer ?
        </h2>
        <p className="text-lg text-purple-50 mb-8 max-w-2xl mx-auto">
          Rejoignez dès maintenant la première plateforme dédiée aux services guyanais
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/auth"
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors"
          >
            Créer un compte
          </a>
        </div>
      </div>
    </section>
  );
}
