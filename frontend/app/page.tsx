import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import WatchExplorer from '@/components/WatchExplorer';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, Clock, Award, MoveRight } from 'lucide-react';

async function getProducts(params = {}) {
  try {
    const res = await api.get('/products', { params });
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getProducts({ limit: 8 });
  const flashSaleProducts = await getProducts({ flash_sale: 1, limit: 4 });

  const categories = [
    { name: "Gentlemen's", href: "/shop/men", image: "/product-images/homepage/image_12.webp", count: "120+ Products" },
    { name: "Ladies' Choice", href: "/shop/women", image: "/product-images/homepage/image_06.webp", count: "80+ Products" },
    { name: "Luxury Straps", href: "/shop/belts", image: "/product-images/homepage/image_10.webp", count: "40+ Products" },
  ];

  const features = [
    { icon: Truck, title: "Elite Delivery", desc: "Premium handling nationwide" },
    { icon: ShieldCheck, title: "Pure Authenticity", desc: "Certified brand products" },
    { icon: Clock, title: "Prompt Service", desc: "Dispatch within 24 hours" },
    { icon: Award, title: "Lifetime Trust", desc: "Official brand warranty" },
  ];

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      
      <HeroBanner />

      {/* Section 2: Watch Explorer */}
      <WatchExplorer />

      {/* Trust Badges */}
      <section className="py-20 border-b border-gray-50 bg-gray-50/30">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                  <f.icon className="w-6 h-6 text-[#b38b2d]" strokeWidth={1.5} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 mb-2">{f.title}</h4>
                <p className="text-xs text-gray-400 max-w-[150px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="text-[#b38b2d] font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">Collections</span>
            <h2 className="text-4xl md:text-6xl font-playfair font-black text-gray-900">Curated Masterpieces</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {categories.map((cat, i) => (
              <Link key={i} href={cat.href} className="group relative aspect-[3/4] overflow-hidden rounded-[2.5rem]">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent flex flex-col justify-end p-10">
                  <span className="text-[#b38b2d] text-[10px] font-black uppercase tracking-widest mb-3">{cat.count}</span>
                  <h3 className="text-3xl font-playfair font-black text-white mb-6 transform transition-transform group-hover:-translate-y-2">{cat.name}</h3>
                  <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                    Explore Now <MoveRight className="w-4 h-4 text-[#b38b2d]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-padding bg-gray-50/50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <div className="max-w-xl text-center md:text-left">
              <span className="text-[#b38b2d] font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">Most Desired</span>
              <h2 className="text-4xl md:text-6xl font-playfair font-black text-gray-900 leading-tight">Legendary Timepieces</h2>
            </div>
            <Link href="/shop" className="btn-outline shrink-0">
              Browse Boutique <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Section */}
      <section className="section-padding overflow-hidden">
        <div className="container-custom">
          <div className="relative rounded-[3rem] overflow-hidden min-h-[500px] flex items-center">
            <img src="/product-images/homepage/image_03.webp" className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
            <div className="absolute inset-0 bg-gray-900/40 lg:bg-transparent lg:bg-gradient-to-r lg:from-gray-900 lg:to-transparent"></div>
            <div className="relative p-12 md:p-20 max-w-2xl text-white">
              <span className="text-[#b38b2d] font-black tracking-[0.4em] uppercase text-[10px] mb-6 block">Legacy Excellence</span>
              <h2 className="text-4xl md:text-6xl font-playfair font-black mb-8 leading-[1.1]">The Naviforce Chrono Collection</h2>
              <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-lg font-light">Exclusive distributor of Naviforce watches in Bangladesh. Genuine products with official warranty and elite after-sales support.</p>
              <Link href="/shop/men" className="btn-primary inline-flex">
                Shop the Series
              </Link>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </main>
  );
}
