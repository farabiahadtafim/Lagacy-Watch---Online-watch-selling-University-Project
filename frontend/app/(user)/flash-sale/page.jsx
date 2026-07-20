"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { Timer } from 'lucide-react';

const FlashSalePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 24, m: 0, s: 0 });

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await api.get('/products', { params: { flash_sale: 1 } });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashSale();

    // Countdown Timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
            else {
              clearInterval(timer);
              return prev;
            }
          }
        }
        return { h, m, s };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) return <div className="h-screen bg-dark flex items-center justify-center text-white">Loading Flash Sale...</div>;

  return (
    <main className="min-h-screen pt-24 bg-dark">
      <Navbar />
      
      {/* Header with Countdown */}
      <div className="bg-red-600/10 border-b border-red-600/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Timer className="w-4 h-4" />
            <span>Limited Time Offer</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-8">Flash Sale</h1>
          
          <div className="flex justify-center space-x-4 md:space-x-8">
            {[
              { label: 'Hours', value: timeLeft.h },
              { label: 'Minutes', value: timeLeft.m },
              { label: 'Seconds', value: timeLeft.s }
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="glass w-20 h-20 md:w-28 md:h-28 rounded-2xl flex items-center justify-center text-3xl md:text-5xl font-bold border-red-600/30">
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mt-4">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-20">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center glass rounded-3xl">
            <p className="text-gray-400">No products in flash sale right now.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default FlashSalePage;
