import React from 'react';
import { Container } from '../ui/Container';
import { ShoppingBag, Facebook, Twitter, Instagram, MapPin, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-6">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <ShoppingBag className="h-8 w-8 text-purple-400" />
              <span className="ml-2 text-xl font-bold">MarketPlace</span>
            </div>
            <p className="text-gray-400 mb-6">
              La plateforme de référence pour les services et annonces en Guyane
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-purple-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-purple-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-purple-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Accueil</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white">Services</a></li>
              <li><a href="/annonces" className="text-gray-400 hover:text-white">Annonces</a></li>
              <li><a href="/actualites" className="text-gray-400 hover:text-white">Actualités</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li><a href="/category/immobilier" className="text-gray-400 hover:text-white">Immobilier</a></li>
              <li><a href="/category/vehicules" className="text-gray-400 hover:text-white">Véhicules</a></li>
              <li><a href="/category/services" className="text-gray-400 hover:text-white">Services</a></li>
              <li><a href="/category/restauration" className="text-gray-400 hover:text-white">Restauration</a></li>
              <li><a href="/category/bien-etre" className="text-gray-400 hover:text-white">Bien-être</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-purple-400 mr-3 mt-0.5" />
                <span className="text-gray-400">123 Avenue des Palmiers, 97300 Cayenne, Guyane Française</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-purple-400 mr-3" />
                <a href="mailto:contact@marketplace-guyane.fr" className="text-gray-400 hover:text-white">
                  contact@marketplace-guyane.fr
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-purple-400 mr-3" />
                <a href="tel:+594123456789" className="text-gray-400 hover:text-white">
                  +594 123 456 789
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} MarketPlace Guyane. Tous droits réservés.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-500 hover:text-white text-sm">Politique de confidentialité</a>
              <a href="/terms" className="text-gray-500 hover:text-white text-sm">Conditions d'utilisation</a>
              <a href="/legal" className="text-gray-500 hover:text-white text-sm">Mentions légales</a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};