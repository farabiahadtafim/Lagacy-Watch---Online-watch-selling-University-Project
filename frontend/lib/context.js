'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, cartAPI, watchlistAPI } from '@/lib/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lw_token');
    const savedUser = localStorage.getItem('lw_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      fetchCart();
      fetchWatchlist();
    }
    setLoading(false);
  }, []);

  const fetchCart = async () => {
    try {
      const res = await cartAPI.get();
      setCart(res.data);
    } catch { setCart([]); }
  };

  const fetchWatchlist = async () => {
    try {
      const res = await watchlistAPI.get();
      setWatchlist(res.data);
    } catch { setWatchlist([]); }
  };

  const login = (token, userData) => {
    localStorage.setItem('lw_token', token);
    localStorage.setItem('lw_user', JSON.stringify(userData));
    setUser(userData);
    fetchCart();
    fetchWatchlist();
  };

  const updateUser = (userData) => {
    const updated = { ...user, ...userData };
    localStorage.setItem('lw_user', JSON.stringify(updated));
    setUser(updated);
  };

  const logout = () => {
    localStorage.removeItem('lw_token');
    localStorage.removeItem('lw_user');
    setUser(null);
    setCart([]);
    setWatchlist([]);
  };

  const addToCart = async (product_id, quantity = 1) => {
    if (!user) return false;
    await cartAPI.add(product_id, quantity);
    await fetchCart();
    return true;
  };

  const removeFromCart = async (id) => {
    await cartAPI.remove(id);
    await fetchCart();
  };

  const updateCartQty = async (id, quantity) => {
    await cartAPI.update(id, quantity);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartAPI.clear();
    setCart([]);
  };

  const addToWatchlist = async (product_id) => {
    if (!user) return false;
    try {
      await watchlistAPI.add(product_id);
      await fetchWatchlist();
      return true;
    } catch { return false; }
  };

  const removeFromWatchlist = async (product_id) => {
    await watchlistAPI.remove(product_id);
    await fetchWatchlist();
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AppContext.Provider value={{
      user, login, logout, updateUser, loading,
      cart, cartCount, cartTotal, addToCart, removeFromCart, updateCartQty, clearCart, fetchCart,
      watchlist, addToWatchlist, removeFromWatchlist, fetchWatchlist,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
