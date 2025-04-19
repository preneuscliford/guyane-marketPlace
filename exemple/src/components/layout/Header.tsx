import React, { useState } from 'react';
import { Menu, X, Search, ShoppingBag, User } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-purple-700">MarketPlace</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li><a href="/" className="text-gray-700 hover:text-purple-600 font-medium">Accueil</a></li>
              <li><a href="/categories" className="text-gray-700 hover:text-purple-600 font-medium">Catégories</a></li>
              <li><a href="/services" className="text-gray-700 hover:text-purple-600 font-medium">Services</a></li>
              <li><a href="/annonces" className="text-gray-700 hover:text-purple-600 font-medium">Annonces</a></li>
              <li><a href="/actualites" className="text-gray-700 hover:text-purple-600 font-medium">Actualités</a></li>
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <a href="/account" className="p-2 rounded-full text-gray-600 hover:bg-purple-100 hover:text-purple-700">
              <User className="h-5 w-5" />
            </a>
            
            <button 
              className="hidden md:block bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full font-medium transition duration-200 ease-in-out transform hover:scale-105"
            >
              Publier une annonce
            </button>
            
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md">Accueil</a>
            <a href="/categories" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md">Catégories</a>
            <a href="/services" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md">Services</a>
            <a href="/annonces" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md">Annonces</a>
            <a href="/actualites" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md">Actualités</a>
            
            <div className="relative mt-3 mx-3">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full font-medium">
              Publier une annonce
            </button>
          </div>
        </div>
      )}
    </header>
  );
};