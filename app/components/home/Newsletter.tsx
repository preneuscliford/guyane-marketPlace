const buttonText = "S'abonner";

export function Newsletter() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Restez informé
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Recevez les dernières actualités et annonces directement par email
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Entrez votre email"
              className="px-6 py-3 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
