require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize DB (creates tables if not exist)
require('./database/db');

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve product images from both directories
const imagesBasePath = path.join(__dirname, '../Legacy watches Web Images');
app.use('/product-images', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(imagesBasePath));
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(imagesBasePath, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/watchlist', require('./routes/watchlist'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/messages', require('./routes/messages'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Legacy Watches API running' }));

// Admin stats
const authMiddleware = require('./middleware/auth');
const adminMiddleware = require('./middleware/admin');
const db = require('./database/db');

app.get('/api/admin/stats', authMiddleware, adminMiddleware, (req, res) => {
  const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "user"').get().count;
  const totalRevenue = db.prepare('SELECT SUM(total_amount) as total FROM orders WHERE status != "cancelled"').get().total || 0;
  const recentOrders = db.prepare('SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 5').all();
  res.json({ totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders });
});

app.get('/api/admin/users', authMiddleware, adminMiddleware, (req, res) => {
  const users = db.prepare('SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Legacy Watches API running on port ${PORT}`);
  console.log(`📦 Products API: /api/products`);
  console.log(`🔐 Auth API: /api/auth`);

  // Auto-seed if DB is empty
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (productCount === 0) {
    console.log('\n🌱 Seeding database with products...');
    try {
      require('./database/seed');
      console.log('✅ Database seeded successfully!');
    } catch (e) {
      console.log('⚠️ Seeding error:', e.message);
    }
  } else {
    console.log(`\n✅ Database has ${productCount} products ready.`);
  }
});
