"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

const WatchExplorer = () => {
  const imagesBase = "/product-images/homepage/Section 2/";
  
  const watches = [
    { name: 'TUDOR Monarch', watch: 'TUDOR MONARCH WATCH.png', cover: 'TUDOR MONARCH COVER.jpeg' },
    { name: 'TUDOR ROYAL', watch: 'TUDOR ROYAL Watch.png', cover: 'TUDOR ROYAL COVER.jpeg' },
    { name: 'BLACK BAY', watch: 'BLACK BAY Watch.png', cover: 'BLACK BAY Cover.jpeg' },
    { name: 'BLACK BAY 54 "BLUE"', watch: "BLACK BAY 54 BLUE' WATCH.png", cover: "BLACK BAY 54 BLUE' COVER.jpeg" },
    { name: 'BLACK BAY CERAMIC', watch: 'BLACK BAY CERAMIC WATCH.png', cover: 'BLACK BAY CERAMIC COVER 2.jpeg' },
    { name: 'BLACK BAY 58', watch: 'BLACK BAY 58 COVER.png', cover: 'BLACK BAY 58 COVER.jpeg' },
    { name: 'BLACK BAY 68', watch: 'BLACK BAY 68 Watch.png', cover: 'BLACK BAY 68 Cover.jpeg' },
    { name: 'BLACK BAY One', watch: 'BLACK BAY One Watch.png', cover: 'BLACK BAY One Cover.jpeg' },
    { name: 'BLACK BAY CHRONO', watch: 'BLACK BAY CHRONO Watch.png', cover: 'BLACK BAY CHRONO Cover.jpeg' },
    { name: 'Pelagos FXD', watch: 'Pelagos FXD Watch.png', cover: 'Pelagos FXD Cover.jpeg' },
    { name: 'Pelagos', watch: 'Pelagos Watch.png', cover: 'Pelagos Cover.jpeg' },
    { name: 'Clair De Rose', watch: 'Clair-De-Rose-Watch.png', cover: 'Clair De Rose Cover.jpeg' },
    { name: '1926', watch: '1926 Watch.png', cover: '1926 Cover.jfif' },
    { name: 'BLACK BAY GMT', watch: 'BLACK BAY GMT Watch.png', cover: 'BLACK BAY GMT Cover.jpeg' },
    { name: 'BLACK BAY PRO', watch: 'BLACK BAY PRO Watch.png', cover: 'BLACK BAY PRO Cover.jpeg' },
    { name: 'BLACK BAY Bronze', watch: 'BLACK BAY Bronze Watch.png', cover: 'BLACK BAY Bronze Cover.jpeg' },
    { name: 'Ranger', watch: 'Ranger Watch.png', cover: 'Ranger Cover.jpeg' },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container-custom mb-12">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-red-600 font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">The Collections</span>
            <h2 className="text-4xl md:text-5xl font-playfair font-black text-gray-900 leading-tight">Explore the World of TUDOR</h2>
          </div>
          <div className="hidden md:flex gap-4 mb-2">
            <div className="swiper-button-prev-custom cursor-pointer w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-all">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </div>
            <div className="swiper-button-next-custom cursor-pointer w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-all">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-24">
        <Swiper
          modules={[Navigation, Pagination, FreeMode]}
          spaceBetween={30}
          slidesPerView={1.2}
          freeMode={true}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
            1440: { slidesPerView: 4.2 },
          }}
          className="watch-swiper !overflow-visible"
        >
          {watches.map((item, index) => (
            <SwiperSlide key={index}>
              <Link href="/shop" className="group flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-[-40%] z-0 bg-gray-50">
                  <img 
                    src={encodeURI(imagesBase + item.cover)} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                  
                  {/* Hover Tag */}
                  <div className="absolute top-6 left-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="w-8 h-[1px] bg-red-600"></div>
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                  </div>
                </div>

                {/* Overlapping Watch Image */}
                <div className="relative z-10 flex flex-col items-center transform transition-transform duration-500 group-hover:-translate-y-6">
                  <img 
                    src={encodeURI(imagesBase + item.watch)} 
                    alt={item.name} 
                    className="w-4/5 h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)]"
                  />
                  <h3 className="mt-8 text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 group-hover:text-red-600 transition-colors">
                    {item.name}
                  </h3>
                  <div className="w-0 group-hover:w-12 h-[2px] bg-red-600 mt-2 transition-all duration-500"></div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="container-custom mt-20">
        <div className="flex flex-wrap gap-4">
          <button className="bg-red-600 text-white px-10 py-5 flex items-center gap-4 group hover:bg-black transition-all rounded-sm">
            <div className="clip-shield bg-white/20 p-1.5">
              <ChevronRight className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">EXPLORE TUDOR COLLECTIONS</span>
          </button>
          
          <button className="bg-white border border-gray-200 text-gray-900 px-10 py-5 flex items-center gap-4 hover:border-red-600 hover:text-red-600 transition-all rounded-sm">
             <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-current rounded-full" />
              </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">CONFIGURE</span>
          </button>

          <button className="bg-white border border-gray-200 text-gray-900 px-10 py-5 flex items-center gap-4 hover:border-red-600 hover:text-red-600 transition-all rounded-sm">
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 border-2 border-current rounded-sm" />
              <div className="w-2.5 h-2.5 border-2 border-current rounded-sm" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">COMPARE</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default WatchExplorer;
