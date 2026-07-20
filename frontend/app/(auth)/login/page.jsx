"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useApp } from '@/lib/context';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      
      if (res.data.user.role === 'admin') router.push('/admin');
      else router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', {
        credential: credentialResponse.credential
      });
      login(res.data.token, res.data.user);
      toast.success('Google login successful!');
      if (res.data.user.role === 'admin') router.push('/admin');
      else router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Google login failed');
    }
  };

  const handleMockGoogleLogin = async () => {
    try {
      const res = await api.post('/auth/google', {
        email: 'demo@legacywatches.com',
        name: 'Demo User',
        googleId: 'demo_google_id_123'
      });
      login(res.data.token, res.data.user);
      toast.success('Mock Google login successful!');
      if (res.data.user.role === 'admin') router.push('/admin');
      else router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Mock login failed');
    }
  };

  return (
    <main className="min-h-screen pt-24 bg-dark flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-playfair font-bold mb-4">Welcome Back</h1>
            <p className="text-gray-400">Please enter your credentials to access your account.</p>
          </div>

          <div className="glass p-8 md:p-10 rounded-3xl">
            {/* Google Login Buttons */}
            <div className="mb-4 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google login failed. Try the demo button below!')}
                theme="filled_blue"
                text="signin_with"
                shape="pill"
                size="large"
                locale="en"
              />
            </div>

            <div className="mb-6 flex justify-center">
              <button
                onClick={handleMockGoogleLogin}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold px-6 py-3 rounded-full transition-all border border-white/10"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Demo Google Login
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-[#0a0a0f] text-xs text-gray-500 font-bold uppercase tracking-widest">or use email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-gold">Password</label>
                  <Link href="#" className="text-[10px] uppercase font-bold text-gray-500 hover:text-gold">Forgot Password?</Link>
                </div>
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
                {loading ? 'Authenticating...' : (
                  <>
                    <span>Sign In</span>
                    <LogIn className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account? <Link href="/register" className="text-gold font-bold hover:underline">Register Now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default LoginPage;
