const express = require('express');
const router = express.Router();
const db = require('../database/db');
const auth = require('../middleware/auth');

// GET cart items
router.get('/', auth, (req, res) => {
  const items = db.prepare(`
    SELECT c.id, c.quantity, p.id as product_id, p.title, p.price, p.main_image, p.stock
    FROM cart c JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `).all(req.user.id);
  res.json(items);
});

// POST add to cart
router.post('/', auth, (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const existing = db.prepare('SELECT * FROM cart WHERE user_id = ? AND product_id = ?').get(req.user.id, product_id);
  if (existing) {
    db.prepare('UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?').run(quantity, req.user.id, product_id);
  } else {
    db.prepare('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)').run(req.user.id, product_id, quantity);
  }
  res.json({ message: 'Added to cart' });
});

// PUT update quantity
router.put('/:id', auth, (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) {
    db.prepare('DELETE FROM cart WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    return res.json({ message: 'Item removed' });
  }
  db.prepare('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?').run(quantity, req.params.id, req.user.id);
  res.json({ message: 'Cart updated' });
});

// DELETE remove from cart
router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM cart WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ message: 'Removed from cart' });
});

// DELETE clear cart
router.delete('/', auth, (req, res) => {
  db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user.id);
  res.json({ message: 'Cart cleared' });
});

module.exports = router;
