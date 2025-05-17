import { UserPlus, Send, MessageCircle } from 'lucide-react';

interface StepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Step: React.FC<StepProps & { number: number }> = ({ title, description, icon, number }) => {
  return (
    <div className="relative group">
      {/* Connector line */}
      {number < 3 && (
        <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gray-200 -z-10">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-500 w-0 group-hover:w-full transition-all duration-700 ease-in-out"></div>
        </div>
      )}
      
      <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full">
        <div className="relative mb-8">
          {/* Step number bubble */}
          <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {number}
          </div>
          
          {/* Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-300">
            {icon}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
};

export function HowItWorks() {
  const steps: StepProps[] = [
    {
      title: "Inscription facile",
      description: "Créez votre compte en moins de 2 minutes. Il vous suffit d'une adresse email valide pour commencer votre expérience sur Blada Market.",
      icon: <UserPlus className="h-8 w-8" />
    },
    {
      title: "Publication rapide",
      description: "Déposez votre annonce en quelques clics. Ajoutez une description détaillée, des photos et fixez votre prix selon vos conditions.",
      icon: <Send className="h-8 w-8" />
    },
    {
      title: "Communication directe",
      description: "Échangez avec les autres utilisateurs via notre messagerie sécurisée intégrée. Organisez vos rendez-vous en toute simplicité.",
      icon: <MessageCircle className="h-8 w-8" />
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trois étapes simples pour profiter pleinement de la plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <Step key={index} {...step} number={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
