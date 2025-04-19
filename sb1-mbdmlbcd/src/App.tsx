import React from 'react';
import { Header } from './components/layout/Header';
import { Hero } from './components/home/Hero';
import { Categories } from './components/home/Categories';
import { FeaturedListings } from './components/home/FeaturedListings';
import { Testimonials } from './components/home/Testimonials';
import { HowItWorks } from './components/home/HowItWorks';
import { CallToAction } from './components/home/CallToAction';
import { Newsletter } from './components/home/Newsletter';
import { Footer } from './components/layout/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-16">
        <Hero />
        <Categories />
        <FeaturedListings />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

export default App;