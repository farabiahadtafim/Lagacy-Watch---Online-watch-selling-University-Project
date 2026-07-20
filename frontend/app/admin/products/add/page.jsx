"use client";
import React, { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ChevronLeft, Upload, Save } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    sku: '',
    category: 'Men',
    price: '',
    original_price: '',
    stock: '',
    is_flash_sale: '0',
    discount_percent: '',
    movement: 'Automatic',
    glass_type: 'Sapphire Crystal',
    water_resistance: '50m',
    strap_material: 'Stainless Steel',
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(formData.price) < 0) return toast.error("Price cannot be negative");
    if (formData.original_price && parseFloat(formData.original_price) < 0) return toast.error("Original price cannot be negative");

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, val);
      });
      images.forEach(img => {
        data.append('images', img);
      });

      await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Product created successfully');
      router.push('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 w-full max-w-5xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/products" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-400 text-sm mt-1">Fill out the details to list a new timepiece</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-8 rounded-3xl space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Product Title</label>
                  <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold" placeholder="e.g. Seiko Presage Cocktail Time" />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold custom-scrollbar" placeholder="Detailed product description..."></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Brand</label>
                    <input name="brand" value={formData.brand} onChange={handleChange} type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold" placeholder="e.g. Seiko" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold">
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Smartwatch">Smartwatch</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4">Watch Attributes</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Movement</label>
                  <select name="movement" value={formData.movement} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold">
                    <option value="Automatic">Automatic</option>
                    <option value="Quartz">Quartz</option>
                    <option value="Mechanical">Mechanical (Hand-wind)</option>
                    <option value="Solar">Solar</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Glass Type</label>
                  <select name="glass_type" value={formData.glass_type} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold">
                    <option value="Sapphire Crystal">Sapphire Crystal</option>
                    <option value="Mineral">Mineral</option>
                    <option value="Hardlex">Hardlex</option>
                    <option value="Acrylic">Acrylic</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Water Resistance</label>
                  <input name="water_resistance" value={formData.water_resistance} onChange={handleChange} type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold" placeholder="e.g. 50m / 5 ATM" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Strap Material</label>
                  <input name="strap_material" value={formData.strap_material} onChange={handleChange} type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold" placeholder="e.g. Genuine Leather" />
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4">Media</h2>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Product Images</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gold/50 transition-colors cursor-pointer relative">
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">Click or drag images to upload</p>
                  <p className="text-xs text-gray-400 mt-2">Images will be automatically optimized to tiny-webp format</p>
                </div>

                {previewImages.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-6">
                    {previewImages.map((src, i) => (
                      <div key={i} className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                        <img src={src} className="w-full h-full object-cover" alt="preview" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="glass p-8 rounded-3xl space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4">Pricing & Inventory</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Regular Price (৳)</label>
                  <input required name="price" type="number" min="0" value={formData.price} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Sale Price (৳)</label>
                  <input name="original_price" type="number" min="0" value={formData.original_price} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold" placeholder="Optional" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Stock Quantity</label>
                  <input required name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold" placeholder="10" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">SKU</label>
                  <input name="sku" type="text" value={formData.sku} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold" placeholder="e.g. SK-1002" />
                </div>
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full gold-gradient text-black font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity">
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Publish Product</span>
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
