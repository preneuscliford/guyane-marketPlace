import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Mail } from 'lucide-react';

export const Newsletter: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-purple-700">
      <Container>
        <div className="rounded-2xl bg-gradient-to-br from-purple-800 to-purple-600 p-8 md:p-12 shadow-xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Restez informé de nos dernières annonces
              </h2>
              <p className="text-purple-100 text-lg max-w-2xl">
                Inscrivez-vous à notre newsletter pour recevoir les meilleures offres et les actualités de notre marketplace
              </p>
            </div>
            
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-purple-400 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
              </div>
              <Button 
                className="bg-white text-purple-700 hover:bg-purple-50 whitespace-nowrap"
              >
                S'abonner
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};