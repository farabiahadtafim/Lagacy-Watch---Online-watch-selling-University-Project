"use client";
import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const addToCart = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cart', { product_id: product.id, quantity: 1 });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Please login first');
    }
  };

  const addToWatchlist = async (e) => {
    e.preventDefault();
    try {
      await api.post('/watchlist', { product_id: product.id });
      toast.success('Added to watchlist!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Please login first');
    }
  };

  const API_URL = '';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <img 
            src={product.main_image?.startsWith('http') ? product.main_image : `${API_URL}${product.main_image}`} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>
        
        {/* Badge */}
        {product.is_flash_sale === 1 && (
          <div className="absolute top-4 left-4 z-10 bg-gold text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-widest rounded-full shadow-lg">
            -{product.discount_percent}%
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button 
            onClick={addToWatchlist}
            className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-gold hover:text-white transition-all shadow-xl"
          >
            <Heart className="w-4 h-4" />
          </button>
          <Link 
            href={`/product/${product.id}`}
            className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-gold hover:text-white transition-all shadow-xl"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button 
            onClick={addToCart}
            className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-gold hover:text-white transition-all shadow-xl"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <p className="text-[10px] text-gold font-black uppercase tracking-[0.2em] mb-1">{product.brand}</p>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug hover:text-gold transition-colors">{product.title}</h3>
          </Link>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-lg font-black text-gray-900 tracking-tight">৳{product.price.toLocaleString()}</span>
            {product.original_price && (
              <span className="text-xs text-gray-400 line-through">৳{product.original_price.toLocaleString()}</span>
            )}
          </div>
          
          <button 
            onClick={addToCart}
            className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-white border border-gold/20 hover:bg-gold px-4 py-2.5 rounded-full transition-all"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
