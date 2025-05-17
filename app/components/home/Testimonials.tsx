import Image from 'next/image';
import { Star } from 'lucide-react';

interface TestimonialProps {
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
  location: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ name, role, text, avatar, rating, location }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative">
        {/* Décor supérieur */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-purple-100 to-teal-50"></div>
        
        {/* Icone de guillemet */}
        <div className="absolute top-6 right-6 text-purple-300 text-5xl font-serif opacity-50">“</div>
        
        <div className="relative pt-8 px-8 pb-8">
          <div className="flex items-center mb-6">
            <div className="relative w-16 h-16 mr-4 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
              <Image 
                src={avatar} 
                alt={name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900">{name}</h4>
              <p className="text-gray-600 text-sm flex items-center">
                {role} • <span className="ml-1">{location}</span>
              </p>
              <div className="flex mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3.5 w-3.5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 relative">
            <span className="absolute -left-2 -top-2 text-purple-200 text-lg font-serif">“</span>
            {text}
            <span className="text-purple-200 text-lg font-serif">”</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export function Testimonials() {
  const testimonials: TestimonialProps[] = [
    {
      name: "Marie Dubois",
      role: "Artisane d'art",
      text: "Cette plateforme m'a permis de développer mon activité de création de bijoux traditionnels. Je reçois maintenant des commandes de toute la Guyane grâce à ma visibilité sur Blada Market !",
      avatar: "/images/avatar1.jpg",
      rating: 5,
      location: "Cayenne"
    },
    {
      name: "Paul Terieur",
      role: "Utilisateur",
      text: "J'ai trouvé un excellent service de réparation pour mon ordinateur en moins d'une heure. Le prestataire était très professionnel et les tarifs transparents. Je recommande vivement !",
      avatar: "/images/avatar2.jpg",
      rating: 4,
      location: "Kourou"
    },
    {
      name: "Sarah Kintambo",
      role: "Commerçante",
      text: "Une vraie bouffée d'air frais pour l'économie locale. Grâce à cette plateforme, j'ai pu étendre mon réseau de distribution et toucher une clientèle que je n'aurais jamais atteinte autrement.",
      avatar: "/images/avatar3.jpg",
      rating: 5,
      location: "St-Laurent"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-50 opacity-60 -z-10"></div>
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-teal-50 opacity-60 -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ce que disent nos utilisateurs</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les expériences de notre communauté grandissante en Guyane
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
