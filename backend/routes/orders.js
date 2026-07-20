const express = require('express');
const router = express.Router();
const db = require('../database/db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// POST place order
router.post('/', auth, (req, res) => {
  const { shipping_name, shipping_phone, shipping_address, payment_method, note } = req.body;
  if (!shipping_name || !shipping_phone || !shipping_address)
    return res.status(400).json({ error: 'Shipping details are required' });

  // Get cart items
  const cartItems = db.prepare(`
    SELECT c.quantity, p.id as product_id, p.price, p.stock, p.title
    FROM cart c JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `).all(req.user.id);

  if (cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  // Check stock
  for (const item of cartItems) {
    if (item.stock < item.quantity) return res.status(400).json({ error: `Insufficient stock for: ${item.title}` });
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Create order
  const orderResult = db.prepare(`
    INSERT INTO orders (user_id, total_amount, shipping_name, shipping_phone, shipping_address, payment_method, note)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, total, shipping_name, shipping_phone, shipping_address, payment_method || 'cod', note || null);

  const orderId = orderResult.lastInsertRowid;

  // Create order items
  const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');

  const processOrder = db.transaction(() => {
    for (const item of cartItems) {
      insertItem.run(orderId, item.product_id, item.quantity, item.price);
    }
  });
  processOrder();

  // Clear cart
  db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user.id);

  res.json({ orderId, message: 'Order placed successfully', total });
});

// GET user orders
router.get('/my', auth, (req, res) => {
  const orders = db.prepare(`
    SELECT o.*, 
    (SELECT json_group_array(json_object('title', p.title, 'quantity', oi.quantity, 'price', oi.price, 'image', p.main_image))
     FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items_json
    FROM orders o WHERE o.user_id = ? ORDER BY o.created_at DESC
  `).all(req.user.id);
  res.json(orders);
});

// GET all orders (admin)
router.get('/admin/all', auth, admin, (req, res) => {
  const orders = db.prepare(`
    SELECT o.*, u.name as user_name, u.email as user_email,
    (SELECT json_group_array(json_object('title', p.title, 'quantity', oi.quantity, 'price', oi.price))
     FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items_json
    FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC
  `).all();
  res.json(orders);
});

// PUT update order status (admin)
router.put('/:id/status', auth, admin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  
  const orderId = req.params.id;
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  
  if (!order) return res.status(404).json({ error: 'Order not found' });
  
  // State machine logic
  if (order.status === 'pending' && (status === 'processing' || status === 'shipped' || status === 'delivered')) {
    // Deduct stock when moving from pending to processing/shipped/delivered
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);
    const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
    db.transaction(() => {
      for (const item of items) {
        updateStock.run(item.quantity, item.product_id);
      }
    })();
  }
  
  if (status === 'delivered' && order.status !== 'delivered') {
    // Dummy notification
    console.log(`[Notification] SMS/Email sent to customer for order #${orderId} (Delivered)`);
  }

  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);
  res.json({ message: 'Order status updated' });
});

module.exports = router;
