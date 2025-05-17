import Link from 'next/link';

export function CallToAction() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à commencer votre aventure sur Blada Market ?
          </h2>
          <p className="text-lg text-purple-100 mb-10 max-w-2xl mx-auto">
            Rejoignez dès maintenant la première plateforme dédiée aux services et annonces en Guyane.
            Créez votre compte en quelques clics et commencez à explorer ou à publier des annonces !
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link 
              href="/auth?mode=signup"
              className="inline-flex items-center justify-center rounded-full font-medium transition duration-200 ease-in-out transform hover:scale-105 px-6 py-3 text-lg bg-white text-purple-700 hover:bg-purple-50 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Créer un compte
            </Link>
            <Link 
              href="/marketplace"
              className="inline-flex items-center justify-center rounded-full font-medium transition duration-200 ease-in-out transform hover:scale-105 px-6 py-3 text-lg border-2 border-white text-white hover:bg-purple-700/50 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Explorer la marketplace
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
