import React from 'react';
import Link from 'next/link';
import { Globe, Camera, Send, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-24 pb-12 border-t border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Info */}
          <div className="space-y-8">
            <Link href="/" className="text-2xl font-playfair font-black text-gray-900 tracking-tighter block">
              LEGACY<span className="text-gold">WATCHES</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Bangladesh's premier boutique for authentic luxury timepieces. We curate the world's most elegant watches with a heritage of uncompromising excellence since 2010.
            </p>
            <div className="flex gap-4">
              {[Globe, Camera, Send].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold/30 hover:shadow-lg transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 mb-10">Boutique</h4>
            <ul className="space-y-4">
              {['Men\'s Collection', 'Ladies\' Collection', 'Luxury Belts', 'Flash Sale'].map((item) => (
                <li key={item}>
                  <Link href="/shop" className="text-gray-500 hover:text-gold transition-colors text-xs font-bold uppercase tracking-widest">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 mb-10">Support</h4>
            <ul className="space-y-4">
              {['Order Tracking', 'Shipping Policy', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-gray-500 hover:text-gold transition-colors text-xs font-bold uppercase tracking-widest">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 mb-10">Concierge</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gold shrink-0" strokeWidth={1.5} />
                <p className="text-gray-500 text-xs leading-relaxed">Level 4, Block C, Bashundhara City Shopping Mall, Dhaka</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-gold shrink-0" strokeWidth={1.5} />
                <p className="text-gray-500 text-xs">+880 1700-000000</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-gold shrink-0" strokeWidth={1.5} />
                <p className="text-gray-500 text-xs">concierge@legacywatches.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            © 2026 Legacy Watches. Crafted with excellence.
          </p>
          <div className="flex gap-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Mastercard" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
