"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api, { imgUrl } from '@/lib/api';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_phone: '',
    shipping_address: '',
    payment_method: 'cod',
    note: ''
  });
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get('/cart');
        setItems(res.data);
        if (res.data.length === 0) router.push('/cart');

        // Pre-fill user data if available
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const u = JSON.parse(savedUser);
          setFormData(prev => ({ ...prev, shipping_name: u.name, shipping_phone: u.phone || '' }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/orders', formData);
      toast.success('Order placed successfully!');
      router.push(`/profile?order_id=${res.data.orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error placing order');
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <div className="h-screen bg-dark flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen pt-24 bg-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <h2 className="text-3xl font-playfair font-bold mb-8 flex items-center">
              <Truck className="w-8 h-8 text-gold mr-4" />
              Shipping Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.shipping_name}
                    onChange={(e) => setFormData({...formData, shipping_name: e.target.value})}
                    className="w-full bg-dark-lighter border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Phone Number</label>
                  <input 
                    required
                    type="text" 
                    value={formData.shipping_phone}
                    onChange={(e) => setFormData({...formData, shipping_phone: e.target.value})}
                    className="w-full bg-dark-lighter border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Complete Address</label>
                <textarea 
                  required
                  rows="4"
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
                  className="w-full bg-dark-lighter border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Order Note (Optional)</label>
                <input 
                  type="text" 
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                  className="w-full bg-dark-lighter border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-gold"
                />
              </div>

              <h3 className="text-xl font-playfair font-bold pt-6 mb-6">Payment Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setFormData({...formData, payment_method: 'cod'})}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all flex flex-col items-center justify-center ${formData.payment_method === 'cod' ? 'border-gold bg-gold/5' : 'border-white/10 bg-white/5'}`}
                >
                  <CheckCircle className={`w-8 h-8 mb-2 ${formData.payment_method === 'cod' ? 'text-gold' : 'text-gray-600'}`} />
                  <span className="font-bold">Cash on Delivery</span>
                </div>
                <div className="p-6 rounded-2xl border border-white/10 bg-white/5 opacity-40 cursor-not-allowed flex flex-col items-center justify-center">
                  <CreditCard className="w-8 h-8 mb-2 text-gray-600" />
                  <span className="font-bold">Online Payment</span>
                  <span className="text-[10px] uppercase text-gold">Coming Soon</span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-gold text-white font-bold py-5 rounded-full text-lg mt-8 hover:scale-[1.02] transition-transform shadow-lg shadow-gold/20"
              >
                Place Order (৳{total.toLocaleString()})
              </button>
            </form>
          </div>

          {/* Review Items */}
          <div>
            <h2 className="text-2xl font-playfair font-bold mb-8">Order Review</h2>
            <div className="glass p-8 rounded-3xl space-y-6">
              <div className="max-h-96 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b border-white/5 pb-4">
                    <img src={imgUrl(item.main_image)} className="w-16 h-20 object-cover rounded-lg" alt="" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold">{item.title}</h4>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-gold font-bold">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping Fee</span>
                  <span>৳0</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-white/10 pt-4">
                  <span>Grand Total</span>
                  <span className="text-gold">৳{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default CheckoutPage;
