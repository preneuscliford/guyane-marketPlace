import React from 'react';
import { Container } from '../ui/Container';
import { Star, Quote } from 'lucide-react';

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ 
  content, author, role, avatar, rating 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Quote className="h-16 w-16 text-purple-600 transform rotate-180" />
      </div>
      
      <div className="flex items-center mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`h-5 w-5 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      
      <blockquote className="text-gray-700 mb-6">
        "{content}"
      </blockquote>
      
      <div className="flex items-center mt-6">
        <img 
          src={avatar} 
          alt={author} 
          className="h-12 w-12 rounded-full object-cover mr-4"
        />
        <div>
          <p className="font-medium text-gray-900">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      content: "Cette marketplace a transformé mon activité! J'ai pu trouver de nouveaux clients et développer mon réseau. Le processus est simple et efficace.",
      author: "Marie Dubois",
      role: "Prestataire de Services",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 5
    },
    {
      content: "J'ai trouvé exactement ce que je cherchais et à un prix raisonnable. La communication avec le vendeur était excellente et la transaction s'est déroulée sans problème.",
      author: "Thomas Laurent",
      role: "Client satisfait",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 4
    },
    {
      content: "En tant que nouvelle arrivante en Guyane, cette plateforme m'a permis de découvrir facilement les services locaux et de m'intégrer rapidement dans la communauté.",
      author: "Sophie Martin",
      role: "Utilisatrice régulière",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800",
      rating: 5
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-white">
      <Container>
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ce que disent nos utilisateurs</h2>
          <p className="text-lg text-gray-600">
            Des milliers d'utilisateurs nous font confiance pour trouver et proposer des services de qualité
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="/testimonials"
            className="inline-flex items-center font-medium text-purple-600 hover:text-purple-800"
          >
            Voir tous les témoignages
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </Container>
    </section>
  );
};