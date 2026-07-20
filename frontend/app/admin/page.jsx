"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { LayoutDashboard, ShoppingBag, Users, DollarSign, Package, ChevronRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Admin stats error:', err);
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          router.push('/login');
        } else {
          setError('Could not load dashboard data. Please check that the backend is running.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [router]);

  if (loading) return <div className="h-screen bg-gray-50 text-gray-900 flex items-center justify-center">Loading Admin Panel...</div>;
  if (error) return <div className="h-screen bg-gray-50 text-gray-900 flex items-center justify-center flex-col gap-4"><p className="text-red-500 font-bold text-lg">⚠ {error}</p><p className="text-gray-400 text-sm">Make sure the backend server is running on port 5001.</p></div>;
  if (!stats) return null;

  const statCards = [
    { label: 'Total Revenue', value: `৳${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-gold', bg: 'bg-gold/10' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-6 md:p-10 w-full">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Overview of your luxury watch business</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900">Administrator</p>
            <p className="text-[10px] text-gold uppercase tracking-widest font-bold">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
            <Users className="w-5 h-5 text-gold" />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <div key={i} className="glass p-6 md:p-8 rounded-3xl relative overflow-hidden group">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-gray-400 text-xs md:text-sm uppercase tracking-widest font-bold mb-2">{stat.label}</p>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</h3>
            <ArrowUpRight className="absolute top-8 right-8 w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="glass rounded-3xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          <Link href="/admin/orders" className="text-gold text-xs font-bold uppercase tracking-widest hover:underline flex items-center">
            View All <ChevronRight className="w-4 h-4 ml-1 hidden sm:block" />
          </Link>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                <th className="pb-4 font-bold">Order ID</th>
                <th className="pb-4 font-bold">Customer</th>
                <th className="pb-4 font-bold">Amount</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-bold text-sm text-gray-900">#{order.id}</td>
                  <td className="py-4">
                    <p className="text-sm font-medium text-gray-700">{order.user_name}</p>
                  </td>
                  <td className="py-4 font-bold text-gold">৳{order.total_amount.toLocaleString()}</td>
                  <td className="py-4">
                    <span className="text-[10px] uppercase font-bold px-3 py-1 rounded bg-gray-100 border border-gray-200 text-gray-500 group-hover:text-gold group-hover:border-gold/30 transition-all">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
