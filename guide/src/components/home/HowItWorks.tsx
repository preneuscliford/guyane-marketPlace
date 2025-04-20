import React from 'react';
import { Container } from '../ui/Container';
import { Search, ClipboardCheck, MessageSquare, Star } from 'lucide-react';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: number;
}

const Step: React.FC<StepProps> = ({ icon, title, description, number }) => {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="absolute top-0 -left-16 right-0 h-0.5 bg-purple-200 hidden md:block" style={{ width: 'calc(100% + 4rem)' }}></div>
      
      <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 text-white mb-6">
        {icon}
      </div>
      
      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-700">
        {number}
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Recherchez",
      description: "Trouvez le service ou le produit dont vous avez besoin parmi nos nombreuses catégories",
      number: 1
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Contactez",
      description: "Discutez directement avec le vendeur ou le prestataire pour définir vos besoins",
      number: 2
    },
    {
      icon: <ClipboardCheck className="h-8 w-8" />,
      title: "Réservez",
      description: "Finalisez votre commande ou réservation en toute simplicité",
      number: 3
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Évaluez",
      description: "Partagez votre expérience et aidez la communauté à faire les meilleurs choix",
      number: 4
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comment ça marche</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Notre marketplace est conçue pour rendre votre expérience simple et efficace
          </p>
        </div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
      </Container>
    </section>
  );
};