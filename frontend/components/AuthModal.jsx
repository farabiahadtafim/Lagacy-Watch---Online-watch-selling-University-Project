"use client";
import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useApp } from '@/lib/context';
import api from '@/lib/api';
import { GoogleLogin } from '@react-oauth/google';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', phone: '' });
  const router = useRouter();
  const { login } = useApp();

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', loginForm);
      login(res.data.token, res.data.user);
      toast.success('Welcome back!');
      onClose();
      if (res.data.user.role === 'admin') {
        router.push('/admin');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', registerForm);
      login(res.data.token, res.data.user);
      toast.success('Account created successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', {
        credential: credentialResponse.credential
      });
      login(res.data.token, res.data.user);
      toast.success('Google login successful!');
      onClose();
      if (res.data.user.role === 'admin') {
        router.push('/admin');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Google login failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed. Try the mock login below!');
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
      onClose();
      if (res.data.user.role === 'admin') {
        router.push('/admin');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Mock login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md mx-4">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gold transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="glass p-8 md:p-10 rounded-[2rem]">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-playfair font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Sign in to your Legacy account' : 'Join the Legacy family'}
            </p>
          </div>

          {/* Real Google Login Button */}
          <div className="mb-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_blue"
              text={isLogin ? "signin_with" : "signup_with"}
              shape="pill"
              size="large"
              locale="en"
            />
          </div>

          {/* Mock Google Login Fallback */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={handleMockGoogleLogin}
              className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-full transition-all"
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
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-xs text-gray-400 font-bold uppercase tracking-widest">or</span>
            </div>
          </div>

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gold">Email Address</label>
                <div className="relative">
                  <input 
                    required
                    type="email" 
                    placeholder="name@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 px-5 pl-12 focus:outline-none focus:border-gold transition-all"
                  />
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-gold">Password</label>
                </div>
                <div className="relative">
                  <input 
                    required
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 px-5 pl-12 pr-12 focus:outline-none focus:border-gold transition-all"
                  />
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full btn-primary"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gold">Full Name</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 px-5 pl-12 focus:outline-none focus:border-gold transition-all"
                  />
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gold">Email Address</label>
                <div className="relative">
                  <input 
                    required
                    type="email" 
                    placeholder="name@example.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 px-5 pl-12 focus:outline-none focus:border-gold transition-all"
                  />
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gold">Password</label>
                <div className="relative">
                  <input 
                    required
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 px-5 pl-12 pr-12 focus:outline-none focus:border-gold transition-all"
                  />
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gold">Phone (Optional)</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    placeholder="+880 1XXXXXXXXX"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 px-5 pl-12 focus:outline-none focus:border-gold transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full btn-primary"
              >
                Join Legacy
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-gold font-bold hover:underline"
              >
                {isLogin ? 'Register Now' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
