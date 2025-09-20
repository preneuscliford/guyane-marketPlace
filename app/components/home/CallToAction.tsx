import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, ShoppingBag, Zap } from "lucide-react";

export function CallToAction() {
  // Valeurs prédéfinies pour éviter les problèmes d'hydration
  const floatingElements = [
    { left: "15%", top: "20%", delay: 0, duration: 3.2 },
    { left: "85%", top: "75%", delay: 0.5, duration: 4.1 },
    { left: "25%", top: "60%", delay: 1.2, duration: 3.8 },
    { left: "75%", top: "30%", delay: 0.8, duration: 3.5 },
    { left: "45%", top: "15%", delay: 1.8, duration: 4.2 },
    { left: "65%", top: "80%", delay: 0.3, duration: 3.9 },
  ];

  return (
    <section
      className="relative py-20 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #9333ea 0%, #e879f9 50%, #10b981 100%)",
        minHeight: "60vh",
      }}
    >
      {/* Background overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

      {/* Decorative elements améliorés */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-3xl"
        ></motion.div>
      </div>

      {/* Éléments flottants */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: element.left,
              top: element.top,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
          style={{ color: "white" }}
        >
          {/* Badge d'introduction */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full shadow-lg mb-6 sm:mb-8"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
            <span className="text-white font-medium text-sm sm:text-base">
              Rejoignez la révolution du commerce local
            </span>
          </motion.div>

          {/* Titre principal */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4 sm:px-0"
          >
            <span className="block mb-2">Prêt à commencer votre</span>
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              aventure sur mcGuyane ?
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            Rejoignez dès maintenant la première plateforme dédiée aux services
            et annonces en Guyane. Créez votre compte en quelques clics et
            commencez à explorer ou à publier des annonces !
          </motion.p>

          {/* Statistiques masquées temporairement */}
          {false && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto"
            >
              {/* Statistiques temporairement désactivées */}
            </motion.div>
          )}

          {/* Boutons d'action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4 sm:px-0 w-full sm:w-auto"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth?mode=signup"
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-2xl font-semibold transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg bg-white text-purple-700 hover:bg-yellow-50 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50 w-full sm:min-w-[200px]"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="whitespace-nowrap">Créer un compte</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/marketplace"
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 rounded-2xl font-semibold transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg border-2 border-white/50 text-white hover:bg-white/10 hover:border-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 backdrop-blur-sm w-full sm:min-w-[200px]"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="whitespace-nowrap">Explorer maintenant</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
