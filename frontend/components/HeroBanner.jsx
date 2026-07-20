"use client";
import React from 'react';
import Link from 'next/link';

const HeroBanner = () => {
  const videoUrl = "/product-images/homepage/section 1/TUDOR Watch Official Website - Swiss Luxury Watches since 1926.mp4";

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      >
        <source src={encodeURI(videoUrl)} type="video/mp4" />
      </video>

      {/* Overlay Content */}
      <div className="relative h-full w-full flex flex-col justify-center items-start px-12 md:px-24">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-12 uppercase tracking-tight">
            NEW LEGACY<br />
            WATCHES FOR<br />
            2026
          </h1>
          <Link 
            href="/shop" 
            className="inline-block bg-white text-gray-900 font-black py-4 px-10 rounded-full hover:bg-gold hover:text-white transition-all uppercase tracking-widest text-[12px]"
          >
            Discover More
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="w-[1px] h-16 bg-white/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white animate-[slide_2s_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
