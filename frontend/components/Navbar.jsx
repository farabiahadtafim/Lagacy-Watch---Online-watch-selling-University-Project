"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronRight, Settings, Package, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const MegaMenu = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('WATCHES');
  const scrollRef = useRef(null);
  
  const imagesBase = "/product-images/homepage/";
  const menuImagesBase = `${imagesBase}New folder/Menu Bar/`;
  const logoUrl = `${imagesBase}section 1/LEGACY LOGO.svg`;

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };
  
  const watchesData = [
    { name: 'TUDOR ROYAL', slug: 'tudor-royal-watch', image: `${menuImagesBase}TUDOR ROYAL WATCH.png`, cover: `${menuImagesBase}TUDOR ROYAL COVER.jpeg` },
    { name: 'BLACK BAY CERAMIC', slug: 'black-bay-ceramic-watch', image: `${menuImagesBase}BLACK BAY CERAMIC WATCH.png`, cover: `${menuImagesBase}BLACK BAY CERAMIC COVER 2.jpeg` },
    { name: 'TUDOR MONARCH', slug: 'tudor-monarch-watch', image: `${menuImagesBase}TUDOR MONARCH WATCH.png`, cover: `${menuImagesBase}TUDOR MONARCH COVER.jpeg` },
    { name: 'BLACK BAY 54 "BLUE"', slug: 'black-bay-54-blue-watch', image: `${menuImagesBase}BLACK BAY 54 BLUE' WATCH.png`, cover: `${menuImagesBase}BLACK BAY 54 BLUE' COVER.jpeg` },
    { name: 'BLACK BAY 58', slug: 'black-bay-58-cover', image: `${menuImagesBase}BLACK BAY 58 COVER.png`, cover: `${menuImagesBase}BLACK BAY 58 COVER.jpeg` },
    { name: 'BLACK BAY 58 GMT', slug: 'black-bay-58-gmt-watch', image: `${menuImagesBase}BLACK BAY 58 GMT WATCH.png`, cover: `${menuImagesBase}BLACK BAY 58 GMT COVER.jpeg` },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white animate-fade-in flex flex-col">
      {/* Top Bar inside Mega Menu - Pushed to edges */}
      <div className="w-full px-6 md:px-12 py-4 flex items-center justify-between border-b border-gray-100">
        {/* Left: Close & Favorites */}
        <div className="flex items-center gap-10 flex-1">
           <button onClick={onClose} className="flex flex-col items-center gap-1 group">
             <X className="w-4 h-4 text-gray-900 group-hover:text-red-600" />
             <span className="text-[9px] font-bold uppercase tracking-widest text-gray-900 group-hover:text-red-600">Close</span>
           </button>
           <button className="flex flex-col items-center gap-1 group">
             <Heart className="w-4 h-4 text-gray-900 group-hover:text-red-600" />
             <span className="text-[9px] font-bold uppercase tracking-widest text-gray-900 group-hover:text-red-600">Favorites</span>
           </button>
        </div>
        
        {/* Center: Logo */}
        <Link href="/" onClick={onClose} className="flex justify-center flex-1">
            <img src={encodeURI(logoUrl)} alt="LEGACY" className="h-10 md:h-12 w-auto" />
        </Link>

        {/* Right: Collections & Search */}
        <div className="flex items-center justify-end gap-10 flex-1">
           <div className="flex flex-col items-center gap-1 group cursor-pointer">
             <Menu className="w-4 h-4 text-gray-900 group-hover:text-red-600" />
             <span className="text-[9px] font-bold uppercase tracking-widest text-gray-900 group-hover:text-red-600">Collections</span>
           </div>
           <div className="flex flex-col items-center gap-1 group cursor-pointer">
             <Search className="w-4 h-4 text-gray-900 group-hover:text-red-600" />
             <span className="text-[9px] font-bold uppercase tracking-widest text-gray-900 group-hover:text-red-600">Search</span>
           </div>
        </div>
      </div>

      {/* Main Menu Content */}
      <div className="flex-1 overflow-y-auto pt-10">
        <div className="container-custom">
          {/* Tabs */}
          <div className="flex items-center gap-10 border-b border-gray-100 mb-8 overflow-x-auto pb-4 scrollbar-hide">
            {['WATCHES', 'INSIDE TUDOR', 'OUR WORLD', 'TUDOR CARE', 'COMPANY'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xl md:text-3xl font-black uppercase tracking-tight whitespace-nowrap transition-colors ${activeTab === tab ? 'text-red-600' : 'text-gray-900 hover:text-red-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sub-Categories */}
          <div className="flex flex-wrap gap-3 mb-12">
            {['New Watches', 'Black Bay', 'Sport Watches', 'Classic watches', 'Women\'s watches', 'Diving watches', 'Daring watches'].map((sub) => (
              <button key={sub} className="px-5 py-2 border border-gray-200 rounded-full text-[10px] font-medium tracking-wide hover:border-red-600 hover:text-red-600 transition-all">
                {sub}
              </button>
            ))}
          </div>

          {/* Product Scrolling Container */}
          <div className="relative pb-20">
            <div 
              ref={scrollRef}
              className="flex flex-nowrap gap-6 overflow-x-auto scrollbar-hide pr-20 scroll-smooth"
            >
              {/* Feature Card */}
              <div className="flex-none w-[500px] relative aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden group">
                <img src={`${imagesBase}New folder/Menu Bar/tudor-watch-pressroon-navigation.jpeg`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 text-white">
                  <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">NEW WATCHES</h3>
                  <Link href="/shop" onClick={onClose} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-red-600 transition-colors">
                    Discover More <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Scrollable Watch Cards */}
              {watchesData.map((watch, i) => (
                <Link key={i} href={`/product/${watch.slug}`} onClick={onClose} className="flex-none w-72 group flex flex-col h-full">
                  <div className="relative aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden mb-[-40%] z-0">
                    <img src={watch.cover} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 flex items-center gap-1 text-white text-[8px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-3 h-3 text-red-600" /> {watch.name}
                    </div>
                  </div>
                  <div className="relative z-10 flex flex-col items-center pointer-events-none transition-transform duration-500 group-hover:-translate-y-4">
                    <img src={watch.image} alt={watch.name} className="w-3/5 h-auto drop-shadow-2xl" />
                    <h4 className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 group-hover:text-red-600 transition-colors">
                      {watch.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>

            {/* Scroll Right Button Indicator */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20">
              <button 
                onClick={scrollRight}
                className="w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center text-gray-900 hover:text-red-600 transition-all hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-10 border-t border-gray-100 mb-20">
            <button className="bg-red-600 text-white px-8 py-4 flex items-center gap-3 group hover:bg-black transition-colors">
              <div className="clip-shield bg-white/20 p-1">
                <Menu className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">EXPLORE TUDOR COLLECTIONS</span>
            </button>
            
            <button className="bg-white border border-gray-200 text-gray-900 px-8 py-4 flex items-center gap-3 hover:border-red-600 hover:text-red-600 transition-all">
              <div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-current rounded-full" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">CONFIGURE</span>
            </button>

            <button className="bg-white border border-gray-200 text-gray-900 px-8 py-4 flex items-center gap-3 hover:border-red-600 hover:text-red-600 transition-all">
              <div className="flex gap-0.5">
                <div className="w-2 h-2 border border-current rounded-sm" />
                <div className="w-2 h-2 border border-current rounded-sm" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">COMPARE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  
  const router = useRouter();
  const { user, logout, cartCount } = useApp();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await api.get('/products', { params: { search: searchQuery, limit: 5 } });
        setSuggestions(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const logoUrl = "/product-images/homepage/section 1/LEGACY LOGO.svg";

  const navLinks = [
    { name: 'Men', href: '/shop/men' },
    { name: 'Women', href: '/shop/women' },
    { name: 'Smart Watch', href: '/shop/smart-watch' },
    { name: 'Flash Sale', href: '/flash-sale' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[90] transition-all duration-500 ${isScrolled ? 'glass py-3 shadow-lg' : 'bg-white/80 backdrop-blur-md py-5 border-b border-gray-100/50'}`}>
        <div className="container-custom flex items-center justify-between">
          
          {/* Left Section: Menu Toggle & Links */}
          <div className="flex items-center gap-8 flex-1">
            <button 
              className="text-gray-900 hover:scale-110 transition-transform"
              onClick={() => setIsMegaMenuOpen(true)}
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
            
            <div className="hidden xl:flex items-center gap-8 ml-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-800 hover:text-red-600 transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Center Section: LEGACY LOGO */}
          <div className="flex justify-center shrink-0">
            <Link href="/" className="flex items-center">
              <img 
                src={encodeURI(logoUrl)} 
                alt="LEGACY WATCHES" 
                className="h-10 md:h-12 w-auto transition-transform hover:scale-105"
              />
            </Link>
          </div>

          {/* Right Section: Icons */}
          <div className="flex items-center justify-end gap-6 flex-1">
            <div className="relative flex items-center" ref={searchRef}>
              <div className={`transition-all duration-300 overflow-hidden flex items-center ${isSearchOpen ? 'w-64 opacity-100 mr-2' : 'w-0 opacity-0'}`}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                      setIsSearchOpen(false);
                    }
                  }}
                  placeholder="Search watches..." 
                  className="w-full text-xs px-3 py-1.5 border-b border-gray-300 focus:border-red-600 focus:outline-none bg-transparent"
                />
              </div>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-800 hover:text-red-600 transition-colors"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>

              {/* Suggestions Dropdown */}
              {isSearchOpen && searchQuery.trim() && (
                <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  {isSearching ? (
                     <div className="p-4 text-center text-xs text-gray-400">Searching...</div>
                  ) : suggestions.length > 0 ? (
                     <div className="flex flex-col max-h-[60vh] overflow-y-auto">
                       {suggestions.map(p => (
                         <Link 
                           key={p.id} 
                           href={`/product/${p.slug || p.id}`}
                           onClick={() => { setIsSearchOpen(false); }}
                           className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                         >
                           <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                             <img src={p.main_image} alt={p.title} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-xs font-bold text-gray-900 truncate">{p.title}</p>
                             <p className="text-[10px] text-gray-500 font-medium">৳{p.price.toLocaleString()}</p>
                           </div>
                         </Link>
                       ))}
                       <button 
                         onClick={() => {
                           router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                           setIsSearchOpen(false);
                         }}
                         className="p-3 text-center text-xs font-bold text-gold hover:bg-gray-50 transition-colors uppercase tracking-widest bg-gray-50"
                       >
                         View All Results
                       </button>
                     </div>
                  ) : (
                     <div className="p-4 text-center text-xs text-gray-400">No products found</div>
                  )}
                </div>
              )}
            </div>
            
            <Link href="/watchlist" className="text-gray-800 hover:text-red-600 transition-colors hidden sm:block">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 text-gray-800 hover:text-red-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>
                
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl py-2 shadow-xl animate-fade-in z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <Link 
                      href="/profile" 
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                    {user.role?.toLowerCase() === 'admin' && (
                      <Link 
                        href="/admin" 
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="text-gray-800 hover:text-red-600 transition-colors"
              >
                <User className="w-5 h-5" strokeWidth={1.5} />
              </button>
            )}

            <Link href="/cart" className="text-gray-800 hover:text-red-600 transition-colors relative group">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mega Menu Overlay */}
      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
      
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
