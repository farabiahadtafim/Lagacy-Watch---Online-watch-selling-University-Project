"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

export default function ShopLayout({ products, initialParams }) {
  const router = useRouter();
  
  const formattedCategory = initialParams.category 
    ? initialParams.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'All Watches';

  const [category, setCategory] = useState(formattedCategory);
  const [price, setPrice] = useState(initialParams.max_price || 50000);
  const [debouncedPrice, setDebouncedPrice] = useState(price);
  const [brands, setBrands] = useState(initialParams.brand ? initialParams.brand.split(',') : []);
  const [sort, setSort] = useState(initialParams.sort || 'newest');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPrice(price);
    }, 300);
    return () => clearTimeout(handler);
  }, [price]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category && category !== 'All Watches') params.set('category', category);
    if (debouncedPrice < 50000) params.set('max_price', debouncedPrice);
    if (brands.length > 0) params.set('brand', brands.join(','));
    if (initialParams.search) params.set('search', initialParams.search);
    if (sort !== 'newest') params.set('sort', sort);
    
    router.push(`/shop?${params.toString()}`, { scroll: false });
  }, [category, debouncedPrice, brands, sort, router, initialParams.search]);

  const toggleBrand = (b) => {
    setBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  };

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <span className="text-gold font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">Boutique</span>
          <h1 className="text-4xl md:text-6xl font-playfair font-black text-gray-900 capitalize leading-tight">
            {initialParams.search ? `Search: ${initialParams.search}` : category}
          </h1>
          <p className="text-gray-400 mt-4 font-medium italic">Discover {products.length} curated timepieces for your legacy.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-50 border border-gray-100 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:border-gold/30 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="best_selling">Best Selling</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="space-y-12 sticky top-32">
            <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 mb-8 border-b border-gray-100 pb-4">Categories</h4>
              <div className="space-y-4">
                {['All Watches', 'Men', 'Women', 'Smart Watch'].map((cat) => (
                  <label key={cat} className="flex items-center justify-between cursor-pointer group" onClick={() => setCategory(cat)}>
                    <span className={`text-sm font-medium transition-colors ${category === cat ? 'text-gold' : 'text-gray-500 group-hover:text-gold'}`}>{cat}</span>
                    <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${category === cat ? 'border-gold' : 'border-gray-200 group-hover:border-gold'}`}>
                      <div className={`w-2 h-2 bg-gold rounded-full transition-transform ${category === cat ? 'scale-100' : 'scale-0 group-hover:scale-100'}`}></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 mb-8 border-b border-gray-100 pb-4">Max Price</h4>
              <input 
                type="range" 
                className="w-full accent-gold" 
                min="0" 
                max="50000" 
                step="500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">
                <span>৳0</span>
                <span>৳{price >= 50000 ? '50,000+' : price}</span>
              </div>
            </div>

            <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 mb-8 border-b border-gray-100 pb-4">Prestige Brands</h4>
              <div className="space-y-4">
                {['Tudor', 'Naviforce', 'Curren', 'Poedagar', 'Casio', 'Skmei', 'Haylou', 'Valdus', 'Imiki'].map((brand) => (
                  <label key={brand} className="flex items-center justify-between cursor-pointer group" onClick={() => toggleBrand(brand)}>
                    <span className={`text-sm font-medium transition-colors ${brands.includes(brand) ? 'text-gold' : 'text-gray-500 group-hover:text-gold'}`}>{brand}</span>
                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${brands.includes(brand) ? 'border-gold bg-gold/10' : 'border-gray-200 group-hover:border-gold'}`}>
                      <div className={`w-2 h-2 bg-gold transition-transform ${brands.includes(brand) ? 'scale-100' : 'scale-0 group-hover:scale-100'}`}></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center bg-gray-50 rounded-[3rem] text-center p-12">
              <p className="text-gray-400 mb-8 font-medium italic">Our boutique is currently being restocked for this category.</p>
              <button onClick={() => router.push('/shop')} className="btn-primary">View All Watches</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
