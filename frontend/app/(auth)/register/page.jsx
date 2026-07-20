"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useApp } from '@/lib/context';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      login(res.data.token, res.data.user);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 bg-dark flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-playfair font-bold mb-4">Create Account</h1>
            <p className="text-gray-400">Join the Legacy and discover timeless elegance.</p>
          </div>

          <div className="glass p-8 md:p-10 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gold">Full Name</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 pl-12 focus:outline-none focus:border-gold transition-all"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gold">Email Address</label>
                <div className="relative">
                  <input 
                    required
                    type="email" 
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 pl-12 focus:outline-none focus:border-gold transition-all"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gold">Password</label>
                <div className="relative">
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 pl-12 focus:outline-none focus:border-gold transition-all"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
              </div>

              <button 
                disabled={loading}
                type="submit"
                className="w-full gold-gradient text-black font-bold py-4 rounded-xl flex items-center justify-center space-x-3 hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : (
                  <>
                    <span>Join Legacy</span>
                    <UserPlus className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account? <Link href="/login" className="text-gold font-bold hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default RegisterPage;
