"use client";
import React, { useState } from 'react';
import { Settings, Save, Shield, Globe, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully (Mock)');
    }, 1000);
  };

  return (
    <div className="p-6 md:p-10 w-full max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-playfair font-bold text-gray-900">Store Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your online boutique</p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        {/* General Settings */}
        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
            <Globe className="w-6 h-6 text-gold" />
            <h2 className="text-xl font-bold text-gray-900">General Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Store Name</label>
              <input type="text" defaultValue="Legacy Watches" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Support Email</label>
              <input type="email" defaultValue="support@legacywatches.com" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Store Address</label>
              <textarea rows="2" defaultValue="123 Luxury Avenue, Horology District" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gold"></textarea>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
            <Shield className="w-6 h-6 text-gold" />
            <h2 className="text-xl font-bold text-gray-900">Security Preferences</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center space-x-4 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-gold rounded" />
              <div>
                <p className="font-bold text-gray-900">Enable Strict XSS Prevention</p>
                <p className="text-xs text-gray-400">Automatically sanitize inputs across all forms.</p>
              </div>
            </label>
            <label className="flex items-center space-x-4 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-gold rounded" />
              <div>
                <p className="font-bold text-gray-900">Enforce Two-Factor Auth (Admins)</p>
                <p className="text-xs text-gray-400">Require 2FA for 'Administrator' role logins.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="flex items-center space-x-3 border-b border-gray-200 pb-4">
            <Bell className="w-6 h-6 text-gold" />
            <h2 className="text-xl font-bold text-gray-900">Email Notifications</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center space-x-4 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-gold rounded" />
              <p className="text-gray-700">New Order Confirmations</p>
            </label>
            <label className="flex items-center space-x-4 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-gold rounded" />
              <p className="text-gray-700">Customer Support Messages</p>
            </label>
            <label className="flex items-center space-x-4 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-gold rounded" />
              <p className="text-gray-700">Daily Sales Summary</p>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button disabled={loading} type="submit" className="gold-gradient text-black font-bold py-3 px-8 rounded-xl flex items-center space-x-2 hover:opacity-90 transition-opacity">
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
