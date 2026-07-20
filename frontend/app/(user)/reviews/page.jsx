"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { Star, MessageSquareQuote } from 'lucide-react';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews');
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <div className="h-screen bg-dark flex items-center justify-center text-white">Loading Reviews...</div>;

  return (
    <main className="min-h-screen pt-24 bg-dark">
      <Navbar />
      
      <div className="bg-dark-lighter py-20 border-b border-white/5">
        <div className="container mx-auto px-4 text-center">
          <MessageSquareQuote className="w-12 h-12 text-gold mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-playfair font-bold">Customer Testimonials</h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Hear what our collectors have to say about their experience with Legacy Watches.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div key={rev.id} className="glass p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -mr-12 -mt-12"></div>
              
              <div className="flex text-gold mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-gold' : 'text-gray-600'}`} />
                ))}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed italic mb-8">
                "{rev.comment}"
              </p>

              <div className="flex items-center space-x-4 pt-6 border-t border-white/5">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center font-bold text-black uppercase">
                  {rev.user_name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{rev.user_name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(rev.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ReviewsPage;
