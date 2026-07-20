"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api, { imgUrl } from '@/lib/api';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useApp } from '@/lib/context';

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const { fetchCart: fetchGlobalCart } = useApp();

  const updateQuantity = async (id, quantity) => {
    const newQty = parseInt(quantity, 10);
    if (newQty < 1) return;
    
    // Optimistic UI update
    setItems(prevItems => prevItems.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    
    try {
      await api.put(`/cart/${id}`, { quantity: newQty });
      // Update global context silently so Navbar cart count is accurate
      fetchGlobalCart();
    } catch (err) {
      toast.error('Error updating quantity');
      fetchCart(); // revert local UI on error
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      fetchCart();
      toast.success('Item removed');
    } catch (err) {
      toast.error('Error removing item');
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <div className="h-screen bg-dark flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen pt-24 bg-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-playfair font-bold mb-12">Shopping Bag</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="glass p-6 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-24 h-32 rounded-lg overflow-hidden shrink-0">
                    <img src={imgUrl(item.main_image)} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gold font-bold text-lg mb-6">৳{item.price.toLocaleString()}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-white/10 transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-white/10 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-400">Total: ৳{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="glass p-8 rounded-3xl sticky top-28">
                <h2 className="text-2xl font-playfair font-bold mb-8">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>৳{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-gold">৳{total.toLocaleString()}</span>
                  </div>
                </div>
                <Link 
                  href="/checkout" 
                  className="w-full bg-gold text-white font-bold py-4 rounded-full flex items-center justify-center space-x-3 hover:scale-[1.02] transition-transform shadow-lg shadow-gold/20"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center glass rounded-3xl">
            <ShoppingBag className="w-16 h-16 text-gray-600 mb-6" />
            <p className="text-xl text-gray-400 mb-8">Your shopping bag is empty.</p>
            <Link href="/shop" className="gold-gradient text-black font-bold py-4 px-10 rounded-full">
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default CartPage;
