import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const InfoLayout = ({ title, children }) => {
  return (
    <main className="min-h-screen pt-24 bg-dark">
      <Navbar />
      <div className="bg-dark-lighter py-20 border-b border-white/5">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-center">{title}</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="prose prose-invert prose-gold max-w-none text-gray-400 leading-relaxed space-y-8">
          {children}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default InfoLayout;
