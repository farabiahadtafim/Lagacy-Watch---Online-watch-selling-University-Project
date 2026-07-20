import axios from 'axios';

const isServer = typeof window === 'undefined';
const API_BASE = isServer ? 'http://localhost:5001/api' : '/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Auto-attach token and prevent GET caching
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('lw_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  // Bypass browser cache for dynamic GET requests
  if (config.method && config.method.toLowerCase() === 'get') {
    config.params = { ...config.params, _t: Date.now() };
  }
  return config;
});

export default api;

// ---- Auth ----
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data),
};

// ---- Products ----
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  create: (formData) => api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
};

// ---- Cart ----
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (product_id, quantity = 1) => api.post('/cart', { product_id, quantity }),
  update: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  remove: (id) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart'),
};

// ---- Watchlist ----
export const watchlistAPI = {
  get: () => api.get('/watchlist'),
  add: (product_id) => api.post('/watchlist', { product_id }),
  remove: (product_id) => api.delete(`/watchlist/${product_id}`),
  check: (product_id) => api.get(`/watchlist/check/${product_id}`),
};

// ---- Orders ----
export const ordersAPI = {
  place: (data) => api.post('/orders', data),
  getMy: () => api.get('/orders/my'),
  getAll: () => api.get('/orders/admin/all'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// ---- Reviews ----
export const reviewsAPI = {
  getAll: (params) => api.get('/reviews', { params }),
  post: (data) => api.post('/reviews', data),
  postGuest: (data) => api.post('/reviews/guest', data),
};

// ---- Admin ----
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
};

// Image URL helper
export const imgUrl = (path) => {
  if (!path) return '/placeholder-watch.jpg';
  if (path.startsWith('http')) return path;
  return path;
};
