"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Users, Search, Edit2, ShieldAlert, Trash2, Ban } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/admin/all');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/auth/admin/${userId}/role`, { role: newRole });
      toast.success('Role updated successfully');
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update role');
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    try {
      await api.put(`/auth/admin/${userId}/block`, { is_blocked: !isBlocked });
      toast.success(isBlocked ? 'User unblocked' : 'User blocked');
      setUsers(users.map(u => u.id === userId ? { ...u, is_blocked: !isBlocked } : u));
    } catch (err) {
      toast.error('Failed to update block status');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/auth/admin/${userId}`);
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roles = ['Administrator', 'Manager', 'Support Staff', 'Customer', 'user', 'admin'];

  if (loading) return <div className="p-10 text-gray-900">Loading users...</div>;

  return (
    <div className="p-6 md:p-10 w-full">
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">User Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage accounts and role-based permissions</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl flex items-center space-x-4 border border-gray-200">
          <div className="p-3 bg-gold/10 rounded-lg">
            <Users className="w-6 h-6 text-gold" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:border-gold text-gray-900 placeholder-gray-400"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass rounded-3xl overflow-hidden custom-scrollbar overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-[0.2em] text-gray-400">
            <tr>
              <th className="p-6 font-bold">User</th>
              <th className="p-6 font-bold">Contact</th>
              <th className="p-6 font-bold">Joined</th>
              <th className="p-6 font-bold">Role</th>
              <th className="p-6 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {user.name}
                        {user.is_blocked ? <span className="ml-2 text-xs text-red-500 font-normal border border-red-500 px-1 py-0.5 rounded">Blocked</span> : null}
                      </p>
                      {user.google_id && (
                        <p className="text-[10px] text-blue-500 font-bold uppercase mt-0.5">Google Auth</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <p className="text-sm text-gray-700">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">{user.phone || 'No phone'}</p>
                </td>
                <td className="p-6 text-sm text-gray-400">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </td>
                <td className="p-6">
                  <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase border 
                    ${['admin', 'Administrator'].includes(user.role) ? 'bg-purple-100 text-purple-600 border-purple-200' :
                      user.role === 'Manager' ? 'bg-blue-100 text-blue-600 border-blue-200' :
                        user.role === 'Support Staff' ? 'bg-yellow-100 text-yellow-600 border-yellow-200' :
                          'bg-green-100 text-green-600 border-green-200'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-6 text-right flex items-center justify-end space-x-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gold"
                  >
                    {roles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleBlockToggle(user.id, user.is_blocked)}
                    className={`p-2 rounded-lg transition-colors ${user.is_blocked ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
                    title={user.is_blocked ? 'Unblock User' : 'Block User'}
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
