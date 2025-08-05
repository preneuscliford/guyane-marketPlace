import { UserPlus, Send, MessageCircle, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Step: React.FC<StepProps & { number: number; index: number }> = ({ title, description, icon, number, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="relative group"
    >
      {/* Connector line amélioré */}
      {number < 3 && (
        <div className="hidden lg:block absolute top-20 left-full w-full h-1 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            transition={{ duration: 1, delay: index * 0.3 + 0.5 }}
            viewport={{ once: true }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full"
          ></motion.div>
          {/* Flèche animée */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.3 + 1 }}
            viewport={{ once: true }}
            className="absolute -right-2 -top-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center"
          >
            <ArrowRight className="w-2 h-2 text-white" />
          </motion.div>
        </div>
      )}
      
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 h-full relative overflow-hidden"
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-fuchsia-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="relative mb-8">
            {/* Step number bubble amélioré */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
              viewport={{ once: true }}
              className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
            >
              {number}
            </motion.div>
            
            {/* Icon container amélioré */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
              viewport={{ once: true }}
              className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center text-purple-600 group-hover:from-purple-200 group-hover:to-fuchsia-200 transition-all duration-300 shadow-md group-hover:shadow-lg"
            >
              {icon}
            </motion.div>
          </div>
          
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 + 0.6 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300 text-center"
          >
            {title}
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 + 0.7 }}
            viewport={{ once: true }}
            className="text-gray-600 leading-relaxed text-center"
          >
            {description}
          </motion.p>
          
          {/* Indicateur de succès */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.2 + 0.8 }}
            viewport={{ once: true }}
            className="mt-6 flex justify-center"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
              <CheckCircle className="w-4 h-4" />
              Étape validée
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export function HowItWorks() {
  const steps: StepProps[] = [
    {
      title: "Inscription facile",
      description: "Créez votre compte en moins de 2 minutes. Il vous suffit d'une adresse email valide pour commencer votre expérience sur Blada Market.",
      icon: <UserPlus className="h-10 w-10" />
    },
    {
      title: "Publication rapide",
      description: "Déposez votre annonce en quelques clics. Ajoutez une description détaillée, des photos et fixez votre prix selon vos conditions.",
      icon: <Send className="h-10 w-10" />
    },
    {
      title: "Communication directe",
      description: "Échangez avec les autres utilisateurs via notre messagerie sécurisée intégrée. Organisez vos rendez-vous en toute simplicité.",
      icon: <MessageCircle className="h-10 w-10" />
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-slate-50 via-purple-50/30 to-emerald-50/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-emerald-200/20 to-transparent rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section amélioré */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full shadow-sm mb-6">
            <Star className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Processus simplifié</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
              Comment ça marche ?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Trois étapes simples pour rejoindre notre communauté et commencer à échanger
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-full text-purple-700 font-medium border border-purple-200"
          >
            <CheckCircle className="w-5 h-5" />
            Processus 100% gratuit
          </motion.div>
        </motion.div>

        {/* Grille des étapes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 mb-16">
          {steps.map((step, index) => (
            <Step key={index} {...step} number={index + 1} index={index} />
          ))}
        </div>
        
        {/* Section de statistiques */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Rejoignez des milliers d'utilisateurs satisfaits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                  &lt; 2 min
                </p>
                <p className="text-gray-600 font-medium">Temps d'inscription</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  98%
                </p>
                <p className="text-gray-600 font-medium">Taux de satisfaction</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                  24/7
                </p>
                <p className="text-gray-600 font-medium">Support disponible</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
