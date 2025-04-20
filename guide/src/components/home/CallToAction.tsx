import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Upload, DollarSign } from 'lucide-react';

export const CallToAction: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Vous avez quelque chose à vendre ou un service à proposer ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Rejoignez notre communauté et commencez à vendre vos produits ou à proposer vos services dès aujourd'hui. C'est simple, rapide et efficace !
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-purple-100 rounded-full mr-4">
                  <Upload className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Publiez gratuitement</h3>
                  <p className="text-gray-600">Créez votre annonce en quelques minutes, ajoutez des photos et une description détaillée.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-purple-100 rounded-full mr-4">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Vendez sans commission</h3>
                  <p className="text-gray-600">Nous ne prenons aucune commission sur vos ventes, vous gardez 100% de vos revenus.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button size="lg">
                Publier une annonce
              </Button>
            </div>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1200" 
              alt="Person using marketplace app" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent flex items-end">
              <div className="p-8">
                <p className="text-white text-xl font-medium mb-2">
                  "J'ai pu développer mon activité grâce à cette plateforme"
                </p>
                <p className="text-purple-100">
                  - Jean Dupont, Artisan
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};