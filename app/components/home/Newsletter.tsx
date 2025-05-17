"use client";

import { useState } from 'react';
import { Mail, Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Ici, on simulerait l'envoi à un service de newsletter
      console.log('Subscription for:', email);
      setSubscribed(true);
      setEmail('');
      
      // Réinitialiser après 5 secondes
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Arrière-plan avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-teal-50 -z-10"></div>
      
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply opacity-30 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply opacity-30 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Colonne gauche avec dégradé */}
            <div className="w-full md:w-2/5 bg-gradient-to-br from-purple-600 to-indigo-700 p-8 md:p-12 text-white flex flex-col justify-center">
              <div className="bg-white/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Restez informé</h3>
              <p className="text-purple-100 mb-6">
                Inscrivez-vous à notre newsletter pour recevoir :
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-teal-300" />
                  Les nouvelles annonces pertinentes
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-teal-300" />
                  Les actualités locales de Guyane
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-teal-300" />
                  Les événements communautaires
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-teal-300" />
                  Des offres exclusives
                </li>
              </ul>
            </div>
            
            {/* Formulaire d'inscription */}
            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Rejoignez notre newsletter
              </h2>
              <p className="text-gray-600 mb-8">
                Recevez les dernières actualités et annonces directement dans votre boîte mail, sans spam.
              </p>
              
              {subscribed ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-green-800 font-medium">Merci pour votre inscription !</p>
                  <p className="text-green-600 text-sm">Vous recevrez bientôt nos actualités.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Entrez votre adresse email"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    S&apos;abonner à la newsletter
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    En vous inscrivant, vous acceptez de recevoir des emails de notre part. 
                    Vous pourrez vous désinscrire à tout moment.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
