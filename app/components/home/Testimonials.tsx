import Image from "next/image";
import { Star, Quote, MapPin, Award, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import { getFallbackImage } from "../../lib/utils";

interface TestimonialProps {
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
  location: string;
}

const TestimonialCard: React.FC<TestimonialProps & { index: number }> = ({
  name,
  role,
  text,
  avatar,
  rating,
  location,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 h-full">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-emerald-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative">
          {/* Décor supérieur amélioré */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-purple-100/80 via-fuchsia-50/60 to-emerald-100/80"></div>

          {/* Icone de guillemet améliorée */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
            viewport={{ once: true }}
            className="absolute top-4 right-6 w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300"
          >
            <Quote className="w-6 h-6 text-white" />
          </motion.div>

          <div className="relative pt-10 px-8 pb-8">
            {/* Section profil améliorée */}
            <div className="flex items-start mb-6">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
                viewport={{ once: true }}
                className="relative w-20 h-20 mr-4 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl group-hover:ring-purple-200 transition-all duration-300"
              >
                <Image
                  src={avatar}
                  alt={name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                {/* Badge de vérification */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Award className="w-3 h-3 text-white" />
                </div>
              </motion.div>

              <div className="flex-1">
                <motion.h4
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                  viewport={{ once: true }}
                  className="font-bold text-xl text-gray-900 group-hover:text-purple-700 transition-colors duration-300"
                >
                  {name}
                </motion.h4>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.6 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 text-gray-600 text-sm mb-2"
                >
                  <span className="font-medium">{role}</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{location}</span>
                  </div>
                </motion.div>

                {/* Étoiles améliorées */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.7 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-1"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.2 + 0.8 + i * 0.1,
                      }}
                      viewport={{ once: true }}
                    >
                      <Star
                        className={`h-4 w-4 transition-colors duration-200 ${
                          i < rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </motion.div>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {rating}/5
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Texte du témoignage amélioré */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 + 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <p className="text-gray-700 leading-relaxed text-base italic">
                "{text}"
              </p>

              {/* Badge de recommandation */}
              <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200 w-fit">
                <ThumbsUp className="w-4 h-4" />
                Recommande
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function Testimonials() {
  const testimonials: TestimonialProps[] = [
    {
      name: "Marie Dubois",
      role: "Artisane d'art",
      text: "Cette plateforme m'a permis de développer mon activité de création de bijoux traditionnels. Je reçois maintenant des commandes de toute la Guyane grâce à ma visibilité sur mcGuyane !",
      avatar: getFallbackImage("sarah-kintambo", 100, 100),
      rating: 5,
      location: "Cayenne",
    },
    {
      name: "Paul Terieur",
      role: "Utilisateur",
      text: "J'ai trouvé un excellent service de réparation pour mon ordinateur en moins d'une heure. Le prestataire était très professionnel et les tarifs transparents. Je recommande vivement !",
      avatar: getFallbackImage("paul-terieur", 100, 100),
      rating: 4,
      location: "Kourou",
    },
    {
      name: "Sarah Kintambo",
      role: "Commerçante",
      text: "Une vraie bouffée d'air frais pour l'économie locale. Grâce à cette plateforme, j'ai pu étendre mon réseau de distribution et toucher une clientèle que je n'aurais jamais atteinte autrement.",
      avatar: getFallbackImage("sarah-kintambo", 100, 100),
      rating: 5,
      location: "St-Laurent",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-slate-50 via-purple-50/20 to-emerald-50/30 relative overflow-hidden">
      {/* Éléments décoratifs améliorés */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-200/30 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-fuchsia-200/20 to-transparent rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête de section amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full shadow-sm mb-6">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              Témoignages clients
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
              Ce que disent nos utilisateurs
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Découvrez les expériences authentiques de notre communauté
            grandissante en Guyane
          </p>

          {/* Statistiques de satisfaction */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                4.8/5 moyenne
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50">
              <ThumbsUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                98% de satisfaction
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Grille des témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} index={index} />
          ))}
        </div>

        {/* Call-to-action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Rejoignez notre communauté satisfaite
            </h3>
            <p className="text-gray-600 mb-6">
              Découvrez pourquoi des milliers d&apos;utilisateurs font confiance
              à mcGuyane pour leurs achats et ventes en Guyane.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Commencer maintenant
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
