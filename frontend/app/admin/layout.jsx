"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout: contextLogout } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Auth guard: check if user is admin
  useEffect(() => {
    if (loading) return;
    const allowedRoles = ['admin', 'administrator', 'manager'];
    if (!user || !user.role || !allowedRoles.includes(user.role.toLowerCase())) {
      router.push('/');
    } else {
      setAuthChecked(true);
    }
  }, [user, loading, router]);
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (loading || !authChecked) {
    return <div className="h-screen bg-gray-50 text-gray-900 flex items-center justify-center">Loading Admin Panel...</div>;
  }

  const NAV_ITEMS = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products Management', href: '/admin/products', icon: Package },
    { name: 'Order Management', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Users Management', href: '/admin/users', icon: Users },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Warranty & Claims', href: '/admin/warranty', icon: ShieldCheck },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    contextLogout();
    router.push('/');
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-12">
        <Link href="/" className="text-xl font-playfair font-bold text-gold tracking-widest">
          LEGACY<span className="text-gray-900">ADMIN</span>
        </Link>
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-gold text-black font-bold shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      {user && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 mb-4">
            <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm border border-gold/30">
              {user.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={handleLogout}
        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 transition-all w-full"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-bold">Sign Out</span>
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white z-20 shadow-sm">
        <Link href="/" className="text-lg font-playfair font-bold text-gold tracking-widest">
          LEGACY<span className="text-gray-900">ADMIN</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 p-6 flex flex-col 
        transform transition-transform duration-300 ease-in-out shadow-sm
        md:relative md:translate-x-0 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden md:h-screen md:overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
