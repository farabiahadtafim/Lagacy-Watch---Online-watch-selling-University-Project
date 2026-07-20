"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api, { imgUrl } from '@/lib/api';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const WatchlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      const res = await api.get('/watchlist');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const removeItem = async (id) => {
    try {
      await api.delete(`/watchlist/${id}`);
      fetchWatchlist();
      toast.success('Removed from watchlist');
    } catch (err) {
      toast.error('Error removing item');
    }
  };

  const addToCart = async (product_id) => {
    try {
      await api.post('/cart', { product_id, quantity: 1 });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Error adding to cart');
    }
  };

  if (loading) return <div className="h-screen bg-dark flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen pt-24 bg-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center space-x-4 mb-12">
          <Heart className="w-10 h-10 text-gold fill-gold" />
          <h1 className="text-4xl font-playfair font-bold">My Watchlist</h1>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <div key={item.id} className="group relative glass rounded-2xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all">
                <Link href={`/product/${item.product_id}`} className="block aspect-[4/5] overflow-hidden">
                  <img 
                    src={imgUrl(item.main_image)} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>

                <div className="p-6">
                  <Link href={`/product/${item.product_id}`}>
                    <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-gold transition-colors">{item.title}</h3>
                  </Link>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-gold">৳{item.price.toLocaleString()}</span>
                      {item.discount_percent > 0 && (
                        <span className="text-xs text-gray-500 line-through">৳{item.original_price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => addToCart(item.product_id)}
                      className="flex-1 gold-gradient text-black font-bold py-3 rounded-xl flex items-center justify-center space-x-2 text-sm hover:scale-[1.05] transition-transform"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button 
                      onClick={() => removeItem(item.product_id)}
                      className="w-12 h-12 rounded-xl glass flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center glass rounded-3xl">
            <Heart className="w-16 h-16 text-gray-600 mb-6" />
            <p className="text-xl text-gray-400 mb-8">Your watchlist is empty.</p>
            <Link href="/shop" className="gold-gradient text-black font-bold py-4 px-10 rounded-full">
              Explore Products
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default WatchlistPage;
