"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api, { authAPI, watchlistAPI } from '@/lib/api';
import { User, Package, Settings, LogOut, ChevronRight, Heart, MapPin, Lock, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useApp } from '@/lib/context';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user: appUser, logout, updateGlobalUser } = useApp();

  // Form states
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', address: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes, wishlistRes] = await Promise.all([
          authAPI.getProfile(),
          api.get('/orders/my'),
          watchlistAPI.get()
        ]);
        setUser(profileRes.data);
        setProfileForm({
          name: profileRes.data.name || '',
          phone: profileRes.data.phone || '',
          address: profileRes.data.address || ''
        });
        setOrders(ordersRes.data);
        setWishlist(wishlistRes.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    if (appUser) {
      fetchData();
    } else {
      router.push('/login');
    }
  }, [router, appUser]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.updateProfile(profileForm);
      setUser(res.data);
      // Optional: update context user if it holds name/etc
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    try {
      await authAPI.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password update failed');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-500 bg-yellow-500/10',
      confirmed: 'text-blue-500 bg-blue-500/10',
      processing: 'text-indigo-500 bg-indigo-500/10',
      shipped: 'text-purple-500 bg-purple-500/10',
      delivered: 'text-green-500 bg-green-500/10',
      cancelled: 'text-red-500 bg-red-500/10'
    };
    return colors[status] || 'text-gray-500 bg-gray-500/10';
  };

  const TABS = [
    { id: 'Dashboard', icon: Home },
    { id: 'Orders', icon: Package },
    { id: 'Wishlist', icon: Heart },
    { id: 'Address', icon: MapPin },
    { id: 'Account Details', icon: Settings },
    { id: 'Password Change', icon: Lock }
  ];

  if (loading) return <div className="h-screen bg-dark flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <main className="min-h-screen pt-24 bg-dark">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>//</span>
          <span className="text-white">Account</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="glass p-6 rounded-3xl sticky top-28">
              <div className="flex flex-col items-center text-center mb-8 pb-8 border-b border-white/5">
                <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-black" />
                </div>
                <h2 className="text-xl font-playfair font-bold text-white">{user?.name}</h2>
                <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
              </div>

              <div className="space-y-2">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${
                        isActive 
                          ? 'bg-gold text-black' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.id}</span>
                    </button>
                  );
                })}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all mt-6"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="glass rounded-3xl p-8 min-h-[600px]">
              
              {/* DASHBOARD TAB */}
              {activeTab === 'Dashboard' && (
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-playfair font-bold mb-6 pb-4 border-b border-white/10">Dashboard</h1>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Hello, <strong className="text-gold">{user?.name}</strong>. Welcome to your account.
                  </p>
                  <p className="text-gray-400 mt-4 leading-relaxed">
                    From your account dashboard, you can easily check & view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div onClick={() => setActiveTab('Orders')} className="p-6 border border-white/10 rounded-2xl cursor-pointer hover:border-gold transition-colors flex flex-col items-center justify-center text-center group">
                      <Package className="w-10 h-10 text-gray-500 group-hover:text-gold transition-colors mb-3" />
                      <h3 className="font-bold">Total Orders</h3>
                      <p className="text-2xl text-gold mt-2 font-playfair">{orders.length}</p>
                    </div>
                    <div onClick={() => setActiveTab('Wishlist')} className="p-6 border border-white/10 rounded-2xl cursor-pointer hover:border-gold transition-colors flex flex-col items-center justify-center text-center group">
                      <Heart className="w-10 h-10 text-gray-500 group-hover:text-gold transition-colors mb-3" />
                      <h3 className="font-bold">Wishlist Items</h3>
                      <p className="text-2xl text-gold mt-2 font-playfair">{wishlist.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'Orders' && (
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-playfair font-bold mb-6 pb-4 border-b border-white/10">Order History</h1>
                  
                  {orders.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center">
                      <p className="text-gray-400">You haven't placed any orders yet.</p>
                      <Link href="/shop" className="text-gold font-bold uppercase tracking-widest mt-4 hover:underline">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => {
                        const items = JSON.parse(order.items_json || '[]');
                        return (
                          <div key={order.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all">
                            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
                              <div>
                                <div className="flex items-center space-x-3 mb-1">
                                  <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Order #{order.id}</span>
                                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-400">Date: {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Total</p>
                                <p className="text-xl font-bold text-gold">৳{order.total_amount.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            <div className="p-6 space-y-4">
                              {items.map((item, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                  <img src={item.image} className="w-12 h-12 object-cover rounded-md" alt="" />
                                  <div className="flex-1">
                                    <h4 className="text-sm font-bold">{item.title}</h4>
                                    <p className="text-xs text-gray-400">৳{item.price.toLocaleString()} x {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* WISHLIST TAB */}
              {activeTab === 'Wishlist' && (
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-playfair font-bold mb-6 pb-4 border-b border-white/10">My Wishlist</h1>
                  {wishlist.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center">
                      <p className="text-gray-400">Your wishlist is empty.</p>
                      <Link href="/shop" className="text-gold font-bold uppercase tracking-widest mt-4 hover:underline">Browse Watches</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {wishlist.map(item => (
                        <Link href={`/shop/${item.slug}`} key={item.id} className="block group">
                          <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-gold/50 transition-all">
                            <div className="aspect-[4/5] bg-white relative">
                              <img src={item.main_image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-sm truncate">{item.title}</h3>
                              <p className="text-gold font-bold mt-1">৳{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ADDRESS TAB */}
              {activeTab === 'Address' && (
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-playfair font-bold mb-6 pb-4 border-b border-white/10">Address Book</h1>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-gold font-bold mb-4">Default Address</h3>
                    <div className="space-y-2 text-gray-300">
                      <p><strong className="text-white">{user?.name}</strong></p>
                      <p>{user?.phone || 'No phone added'}</p>
                      <p>{user?.email}</p>
                      <p className="mt-4 text-gray-400">{user?.address || 'No address added yet. Update in Account Details.'}</p>
                    </div>
                    <button onClick={() => setActiveTab('Account Details')} className="mt-6 text-sm font-bold uppercase tracking-widest text-gold hover:underline">
                      Edit Address
                    </button>
                  </div>
                </div>
              )}

              {/* ACCOUNT DETAILS TAB */}
              {activeTab === 'Account Details' && (
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-playfair font-bold mb-6 pb-4 border-b border-white/10">Account Details</h1>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                        <input 
                          type="text" 
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address (Read Only)</label>
                        <input 
                          type="email" 
                          value={user?.email || ''}
                          className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                        <input 
                          type="tel" 
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Shipping Address</label>
                        <textarea 
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors h-[50px] resize-none"
                        />
                      </div>
                    </div>
                    <button type="submit" className="bg-gold text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {/* PASSWORD CHANGE TAB */}
              {activeTab === 'Password Change' && (
                <div className="animate-fade-in">
                  <h1 className="text-2xl font-playfair font-bold mb-6 pb-4 border-b border-white/10">Change Password</h1>
                  <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Current Password</label>
                      <input 
                        type="password" 
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">New Password</label>
                      <input 
                        type="password" 
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                        required
                        minLength={6}
                      />
                    </div>
                    <button type="submit" className="bg-gold text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors">
                      Update Password
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ProfilePage;
