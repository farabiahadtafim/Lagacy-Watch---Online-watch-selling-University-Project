"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Search, ShoppingBag, Truck, Printer, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/admin/all');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  const printInvoice = (order) => {
    const items = JSON.parse(order.items_json || '[]');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #ccc; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; }
            .subtitle { color: #666; font-size: 14px; }
            .details { margin-top: 30px; display: flex; justify-content: space-between; }
            .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .table th, .table td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
            .table th { background: #f9f9f9; }
            .total { margin-top: 30px; text-align: right; font-size: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">LEGACY WATCHES</div>
              <div class="subtitle">Premium Timepieces</div>
            </div>
            <div style="text-align: right;">
              <div class="title">INVOICE</div>
              <div class="subtitle">Order #${order.id}</div>
              <div class="subtitle">Date: ${new Date(order.created_at).toLocaleDateString()}</div>
            </div>
          </div>
          
          <div class="details">
            <div>
              <strong>Billed To:</strong><br>
              ${order.user_name} (${order.user_email})<br>
              ${order.shipping_name}<br>
              ${order.shipping_phone}<br>
              ${order.shipping_address}
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.title}</td>
                  <td>${item.quantity}</td>
                  <td>৳${item.price.toLocaleString()}</td>
                  <td>৳${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            Total Amount: ৳${order.total_amount.toLocaleString()}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredOrders = orders.filter(o =>
    o.id.toString().includes(searchTerm) ||
    (o.user_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (loading) return <div className="p-10 text-gray-900">Loading orders...</div>;

  return (
    <div className="p-6 md:p-10 w-full flex flex-col xl:flex-row gap-8">
      <div className="flex-1">
        <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900">Orders Pipeline</h1>
            <p className="text-gray-400 text-sm mt-1">Manage order fulfillment and tracking</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-xl flex items-center space-x-4 border border-gray-200">
            <div className="p-3 bg-gold/10 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:border-gold text-gray-900 placeholder-gray-400"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="glass rounded-3xl overflow-hidden custom-scrollbar overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-[0.2em] text-gray-400">
              <tr>
                <th className="p-6 font-bold">Order ID</th>
                <th className="p-6 font-bold">Customer</th>
                <th className="p-6 font-bold">Date</th>
                <th className="p-6 font-bold">Total</th>
                <th className="p-6 font-bold">Status</th>
                <th className="p-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="p-6 font-bold text-gray-900">#{order.id}</td>
                  <td className="p-6">
                    <p className="text-sm font-bold text-gray-900">{order.user_name}</p>
                    <p className="text-xs text-gray-400">{order.user_email}</p>
                  </td>
                  <td className="p-6 text-sm text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-6 font-bold text-gold">৳{order.total_amount.toLocaleString()}</td>
                  <td className="p-6" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded font-bold uppercase border focus:outline-none ${getStatusColor(order.status)}`}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-6 text-right space-x-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); printInvoice(order); }}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all"
                      title="Print Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                      className="p-2 rounded-lg hover:bg-gold/10 text-gold transition-all"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Panel */}
      {selectedOrder && (
        <div className="w-full xl:w-96 shrink-0 space-y-6">
          <div className="glass p-6 rounded-3xl sticky top-8">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold font-playfair text-gray-900">Order Details</h2>
              <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase border ${getStatusColor(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Shipping Information</p>
                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                  <p className="font-bold text-sm text-gray-900">{selectedOrder.shipping_name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2"><Truck className="w-4 h-4" /> {selectedOrder.shipping_address}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.shipping_phone}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Items</p>
                <div className="space-y-3">
                  {JSON.parse(selectedOrder.items_json || '[]').map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-gold font-bold">৳{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400 uppercase tracking-widest text-xs font-bold">Total</p>
                  <p className="text-xl font-bold text-gold">৳{selectedOrder.total_amount.toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={() => printInvoice(selectedOrder)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
