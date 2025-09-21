"use client";

import { Search, FileCheck, CheckCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    title: "Parcourez les services",
    description:
      "Explorez notre large éventail de services proposés par des talents locaux en Guyane.",
  },
  {
    icon: FileCheck,
    title: "Trouvez le service idéal",
    description:
      "Comparez les profils, les avis et portfolios pour trouver le professionnel parfait pour votre besoin.",
  },
  {
    icon: CheckCircle,
    title: "Contactez & commandez",
    description:
      "Échangez avec le prestataire et passez commande en toute sécurité via notre plateforme.",
  },
  {
    icon: Zap,
    title: "Recevez & appréciez",
    description:
      "Recevez votre service dans les délais convenus et laissez un avis pour aider la communauté.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Comment fonctionne mcGuyane
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Notre marketplace met en relation les talents guyanais avec ceux qui
            ont besoin de leurs services, en toute simplicité
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center text-white mb-4 sm:mb-6">
                <step.icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
                {index + 1}. {step.title}
              </h3>

              <p className="text-gray-600 text-sm sm:text-base">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <a
              href="#"
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-medium rounded-full hover:shadow-lg transition-shadow inline-block text-sm sm:text-base"
            >
              Commencer à explorer
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
