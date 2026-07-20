"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Mail, Search, CheckCircle, MailOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages/admin/all');
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await api.put(`/messages/admin/${id}/status`, { read_status: newStatus });
      setMessages(messages.map(m => m.id === id ? { ...m, read_status: newStatus } : m));
      toast.success(newStatus === 1 ? 'Marked as read' : 'Marked as unread');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredMessages = messages.filter(m =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-gray-900">Loading messages...</div>;

  return (
    <div className="p-6 md:p-10 w-full max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Support Messages</h1>
          <p className="text-gray-400 text-sm mt-1">Customer inquiries and contact form submissions</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl flex items-center space-x-4 border border-gray-200">
          <div className="p-3 bg-gold/10 rounded-lg">
            <Mail className="w-6 h-6 text-gold" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Unread</p>
            <p className="text-2xl font-bold text-red-500">{messages.filter(m => m.read_status === 0).length}</p>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search by name, email or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:border-gold text-gray-900 placeholder-gray-400"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center p-10 text-gray-400 glass rounded-3xl">No messages found.</div>
        ) : (
          filteredMessages.map((msg) => (
            <div key={msg.id} className={`glass p-6 rounded-3xl transition-all border-l-4 ${msg.read_status === 1 ? 'border-l-gray-200 opacity-70' : 'border-l-gold'}`}>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{msg.subject || 'No Subject'}</h3>
                    {msg.read_status === 0 && (
                      <span className="bg-red-100 text-red-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-red-200">New</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
                    <span className="font-bold text-gold">{msg.name}</span>
                    <span>&bull;</span>
                    <span>{msg.email}</span>
                    <span>&bull;</span>
                    <span>{new Date(msg.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">{msg.message}</p>
                </div>

                <div className="flex md:flex-col items-center justify-center md:justify-start gap-2">
                  <button
                    onClick={() => toggleReadStatus(msg.id, msg.read_status)}
                    className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {msg.read_status === 1 ? (
                      <><Mail className="w-4 h-4 text-gray-400" /> <span className="text-gray-500">Mark Unread</span></>
                    ) : (
                      <><MailOpen className="w-4 h-4 text-gold" /> <span className="text-gold">Mark Read</span></>
                    )}
                  </button>
                  <button className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
