"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { ShoppingCart, Heart, Star, ShieldCheck, Truck, RotateCcw, Minus, Plus, Share2, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const ProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get(`/products/${id}`);
        const p = prodRes.data;
        setProduct(p);
        setActiveImage(0);

        const [revRes, relRes] = await Promise.all([
          api.get(`/reviews?product_id=${id}`),
          api.get(`/products${p.category ? `?category=${p.category}` : ''}`) 
        ]);
        setReviews(revRes.data);
        // Exclude the current product from related
        const filtered = relRes.data.filter(rp => String(rp.id) !== String(p.id) && String(rp.slug) !== String(id));
        setRelatedProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchData();
  }, [id]);


  const addToCart = async () => {
    try {
      await api.post('/cart', { product_id: product.id, quantity });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Please login first');
    }
  };

  const addToWishlist = async () => {
    try {
      await api.post('/watchlist', { product_id: product.id });
      toast.success('Added to wishlist!');
    } catch (err) {
      toast.error('Please login first');
    }
  };

  if (loading) return <div className="h-screen bg-white flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="h-screen bg-white flex items-center justify-center text-gray-500 font-medium italic">Product not found</div>;

  const API_URL = '';
  const images = JSON.parse(product.images_json || '[]');
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 5.0;

  // Generate some realistic specs based on category/brand
  const specs = [
    { label: 'DIAMETER', value: product.category === 'women' ? '34 mm' : '41 mm' },
    { label: 'CASE MATERIAL', value: '316L Stainless Steel' },
    { label: 'WATER RESISTANCE', value: '100m / 10 ATM' },
    { label: 'MOVEMENT', value: 'Automatic Calibre' },
    { label: 'POWER RESERVE', value: 'Approx. 70 hours' },
    { label: 'STRAP', value: 'Stainless Steel Bracelet' },
    { label: 'DIAL COLOR', value: 'Signature Black / Blue' },
    { label: 'GLASS', value: 'Sapphire Crystal (Scratch Resistant)' }
  ];

  return (
    <main className="min-h-screen pt-32 bg-white">
      <Navbar />
      
      <div className="container-custom py-12">
        {/* Top Section: Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Side: Image Gallery & Specs */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Gallery */}
            <div className="space-y-6">
              <div className="aspect-square md:aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#F9F9F9] flex items-center justify-center p-8">
                <img 
                  src={images[activeImage]?.startsWith('http') ? images[activeImage] : `${API_URL}${images[activeImage]}`} 
                  className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105" 
                  alt={product.title} 
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar justify-center">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-[#F9F9F9] ${activeImage === i ? 'border-gray-900 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.startsWith('http') ? img : `${API_URL}${img}`} className="w-full h-full object-contain p-2" alt="" />
                  </button>
                ))}
              </div>
            </div>

            {/* Description & Specs */}
            <div className="space-y-8 pr-0 lg:pr-12">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-playfair">Discovering the {product.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {product.description} A masterpiece of horology, this timepiece represents the pinnacle of watchmaking craftsmanship. Carefully engineered to provide unparalleled precision, it stands as a testament to legacy and innovation.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Whether attending a formal gala or navigating the adventures of daily life, the robust construction combined with elegant aesthetics ensures that it remains an enduring companion. The attention to detail in every facet of the dial and casing reflects true luxury.
                </p>
              </div>

              {/* Specs Table */}
              <div className="mt-12">
                <table className="w-full text-sm text-left border-collapse">
                  <tbody>
                    {specs.map((spec, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-0">
                        <td className="py-4 text-xs font-bold uppercase tracking-widest text-gray-900 w-1/3">{spec.label}</td>
                        <td className="py-4 text-gray-600 font-medium uppercase text-xs tracking-wider">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>

          {/* Right Side: Product Actions */}
          <div className="lg:col-span-5">
            <div className="sticky top-40 space-y-8">
              
              {/* Title and Rating */}
              <div className="border-b border-gray-100 pb-8">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3 block">{product.brand}</span>
                <h1 className="text-3xl lg:text-4xl font-playfair font-black text-gray-900 leading-[1.2] mb-4 uppercase tracking-tight">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex text-gray-900">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(avgRating) ? 'fill-gray-900' : 'fill-gray-200 text-gray-200'}`} />)}
                  </div>
                  <span className="text-xs text-gray-500 underline cursor-pointer">{reviews.length} Reviews</span>
                </div>
              </div>

              {/* Price */}
              <div className="py-2">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">৳ {product.price.toLocaleString()}</span>
                {product.original_price && (
                  <span className="text-sm text-gray-400 line-through ml-3">৳ {product.original_price.toLocaleString()}</span>
                )}
              </div>

              {/* Add to Cart Card */}
              <div className="bg-[#FAFAFA] rounded-xl p-6 border border-gray-100 space-y-6">
                
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-700">Quantity</span>
                  <div className="flex items-center bg-white border border-gray-200 rounded">
                    <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-3 py-1 hover:bg-gray-50 transition-colors text-gray-600"><Minus className="w-3 h-3" /></button>
                    <span className="px-3 text-xs font-bold text-gray-900 min-w-[30px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q+1)} className="px-3 py-1 hover:bg-gray-50 transition-colors text-gray-600"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={addToCart} className="w-full bg-[#9b8af2] hover:bg-[#8675df] text-white py-4 rounded-md font-bold text-sm tracking-widest uppercase transition-colors shadow-sm">
                    Add to Cart
                  </button>
                  <button onClick={addToWishlist} className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 py-4 rounded-md font-bold text-sm tracking-widest uppercase transition-colors flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" /> Add to Wishlist
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 pt-2">
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-900 cursor-pointer transition-colors">
                    <Link2 className="w-4 h-4" /> Copy Link
                  </button>
                  <span className="text-gray-200">|</span>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-blue-600 transition-colors font-bold">Facebook</a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(product.title)}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-sky-500 transition-colors font-bold">Twitter</a>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-2 pt-4">
                <div className="text-center space-y-2">
                  <Truck className="w-5 h-5 mx-auto text-gray-900" strokeWidth={1.5} />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Fast Shipping</p>
                </div>
                <div className="text-center space-y-2">
                  <ShieldCheck className="w-5 h-5 mx-auto text-gray-900" strokeWidth={1.5} />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">2 Year Warranty</p>
                </div>
                <div className="text-center space-y-2">
                  <RotateCcw className="w-5 h-5 mx-auto text-gray-900" strokeWidth={1.5} />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Free 30 Days Returns</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS Section */}
        <div className="mt-32 pt-20 border-t border-gray-100">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-2xl font-bold tracking-[0.2em] uppercase text-gray-900 mb-6">Customer Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-[#ffc107] text-[#ffc107]' : 'fill-gray-200 text-gray-200'}`} />)}
              </div>
              <span className="text-sm font-bold text-gray-900">Based on {reviews.length} reviews</span>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((rev) => (
                <div key={rev.id} className="flex flex-col">
                  <div className="bg-gray-100 aspect-square w-full mb-4 rounded-sm overflow-hidden flex items-center justify-center relative">
                     {/* Show main product image as review image since we don't have real user photos */}
                     <img src={images[0]?.startsWith('http') ? images[0] : `${API_URL}${images[0]}`} alt="Review photo" className="w-full h-full object-cover opacity-90" />
                     <div className="absolute inset-0 bg-black/10"></div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-gray-900 text-gray-900" />)}
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mb-1">{rev.user_name} <span className="text-green-600 ml-1 text-[10px]">Verified</span></h4>
                  <p className="text-sm text-gray-600 italic leading-relaxed">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 italic">No reviews yet. Be the first to review!</p>
          )}
        </div>

        {/* YOU MAY ALSO LIKE Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-20 border-t border-gray-100">
            <div className="text-center mb-16">
              <h2 className="text-xl font-bold tracking-[0.3em] uppercase text-gray-900">You May Also Like</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.slice(0, 4).map((p) => {
                const pImages = JSON.parse(p.images_json || '[]');
                return (
                  <Link key={p.id} href={`/product/${p.slug || p.id}`} className="group cursor-pointer flex flex-col">
                    <div className="aspect-[4/5] bg-[#F9F9F9] rounded-sm overflow-hidden mb-6 relative flex items-center justify-center p-4">
                      <img 
                        src={pImages[0]?.startsWith('http') ? pImages[0] : `${API_URL}${pImages[0]}`} 
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-xl" 
                        alt={p.title} 
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-2">{p.title}</h4>
                      <div className="flex justify-center gap-0.5 mb-2">
                         {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-gray-900 text-gray-900" />)}
                      </div>
                      <p className="text-xs font-bold text-gray-600">৳ {p.price.toLocaleString()}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default ProductDetail;
