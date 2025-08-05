"use client";

import { useState } from 'react';
import { Mail, Bell, CheckCircle, Gift, Zap, Users, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Subscription for:', email);
      setSubscribed(true);
      setEmail('');
      setIsLoading(false);
      
      // Réinitialiser après 5 secondes
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  const benefits = [
    {
      icon: <Zap className="h-5 w-5" />,
      text: "Nouvelles annonces en temps réel",
      color: "text-yellow-300"
    },
    {
      icon: <Users className="h-5 w-5" />,
      text: "Actualités de la communauté",
      color: "text-emerald-300"
    },
    {
      icon: <Gift className="h-5 w-5" />,
      text: "Offres exclusives et promotions",
      color: "text-fuchsia-300"
    },
    {
      icon: <Bell className="h-5 w-5" />,
      text: "Événements locaux en Guyane",
      color: "text-blue-300"
    }
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Arrière-plan avec dégradé amélioré */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/30 to-emerald-50/20 -z-10"></div>
      
      {/* Éléments décoratifs améliorés */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-emerald-200/30 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-fuchsia-200/20 to-transparent rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête de section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full shadow-sm mb-6">
            <Mail className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Newsletter exclusive</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
              Restez connecté à l'actualité
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ne manquez aucune opportunité ! Recevez les meilleures annonces et actualités de Guyane directement dans votre boîte mail.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
            <div className="flex flex-col lg:flex-row">
              {/* Colonne gauche avec dégradé amélioré */}
              <div className="w-full lg:w-2/5 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-emerald-600 p-8 lg:p-12 text-white flex flex-col justify-center relative overflow-hidden">
                {/* Éléments décoratifs dans la colonne */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-8 shadow-lg"
                  >
                    <Mail className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold mb-4"
                  >
                    Restez informé
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-white/90 mb-8 text-lg"
                  >
                    Rejoignez plus de 5000 abonnés et recevez :
                  </motion.p>
                  
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                      >
                        <div className={`${benefit.color} flex-shrink-0`}>
                          {benefit.icon}
                        </div>
                        <span className="text-white/90 font-medium">{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Statistiques */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    viewport={{ once: true }}
                    className="mt-8 pt-6 border-t border-white/20"
                  >
                    <div className="flex items-center justify-between text-center">
                      <div>
                        <p className="text-2xl font-bold text-white">5000+</p>
                        <p className="text-white/70 text-sm">Abonnés</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">98%</p>
                        <p className="text-white/70 text-sm">Satisfaction</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">0</p>
                        <p className="text-white/70 text-sm">Spam</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Formulaire d'inscription amélioré */}
              <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    Rejoignez notre newsletter
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">
                    Recevez les dernières actualités et annonces directement dans votre boîte mail, sans spam.
                  </p>
                </motion.div>
                
                {subscribed ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">Merci pour votre inscription !</h3>
                    <p className="text-green-600">Vous recevrez bientôt nos actualités dans votre boîte mail.</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-green-700">
                      <Gift className="w-4 h-4" />
                      <span className="text-sm font-medium">Cadeau de bienvenue en route !</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                    <div className="relative group">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Entrez votre adresse email"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-lg"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Inscription en cours...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            S'abonner à la newsletter
                          </>
                        )}
                      </Button>
                    </motion.div>
                    
                    <p className="text-sm text-gray-500 text-center leading-relaxed">
                      En vous inscrivant, vous acceptez de recevoir des emails de notre part. 
                      <br />Vous pourrez vous désinscrire à tout moment.
                    </p>
                    
                    {/* Badges de confiance */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Sans spam
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Désabonnement facile
                      </div>
                    </div>
                  </motion.form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
