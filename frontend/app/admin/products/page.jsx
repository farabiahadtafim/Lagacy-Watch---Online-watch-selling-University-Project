"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Package, Plus, Search, Edit2, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Error deleting product');
    }
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-screen bg-gray-50 text-gray-900 flex items-center justify-center">Loading...</div>;

  return (
    <div className="p-6 md:p-10 w-full">
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your collection of premium timepieces</p>
        </div>
        <Link href="/admin/products/add" className="gold-gradient text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 hover:scale-[1.05] transition-transform w-full md:w-auto">
          <Plus className="w-5 h-5" />
          <span>Add New Product</span>
        </Link>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:border-gold text-gray-900 placeholder-gray-400"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="flex space-x-4 w-full md:w-auto">
          <select className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gold w-full">
            <option>All Categories</option>
            <option>Men</option>
            <option>Women</option>
            <option>Belts</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass rounded-3xl overflow-hidden custom-scrollbar overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-[0.2em] text-gray-400">
            <tr>
              <th className="p-6 font-bold">Product</th>
              <th className="p-6 font-bold">Category</th>
              <th className="p-6 font-bold">Price</th>
              <th className="p-6 font-bold">Stock</th>
              <th className="p-6 font-bold">Status</th>
              <th className="p-6 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center space-x-4">
                    <img src={p.main_image} className="w-12 h-16 object-cover rounded-lg shrink-0" alt="" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{p.title}</p>
                      <p className="text-[10px] text-gold uppercase font-bold tracking-widest">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-sm text-gray-500 capitalize">{p.category}</td>
                <td className="p-6 font-bold text-gold">৳{p.price.toLocaleString()}</td>
                <td className="p-6">
                  <span className={`text-xs font-bold ${p.stock < 5 ? 'text-red-500' : 'text-gray-500'}`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="p-6">
                  {p.is_flash_sale === 1 ? (
                    <span className="text-[10px] bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded font-bold uppercase">Flash Sale</span>
                  ) : (
                    <span className="text-[10px] bg-green-100 text-green-600 border border-green-200 px-2 py-0.5 rounded font-bold uppercase">Active</span>
                  )}
                </td>
                <td className="p-6 text-right space-x-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link href={`/product/${p.id}`} target="_blank" className="p-2 rounded-lg hover:bg-gold/10 text-gold transition-all inline-block">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
