const express = require('express');
const router = express.Router();
const db = require('../database/db');
const auth = require('../middleware/auth');

// GET watchlist
router.get('/', auth, (req, res) => {
  const items = db.prepare(`
    SELECT w.id, w.added_at, p.id as product_id, p.title, p.price, p.original_price, p.main_image, p.discount_percent
    FROM watchlist w JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
    ORDER BY w.added_at DESC
  `).all(req.user.id);
  res.json(items);
});

// POST add to watchlist
router.post('/', auth, (req, res) => {
  const { product_id } = req.body;
  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(product_id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  try {
    db.prepare('INSERT INTO watchlist (user_id, product_id) VALUES (?, ?)').run(req.user.id, product_id);
    res.json({ message: 'Added to watchlist' });
  } catch (err) {
    res.status(400).json({ error: 'Already in watchlist' });
  }
});

// DELETE remove from watchlist
router.delete('/:product_id', auth, (req, res) => {
  db.prepare('DELETE FROM watchlist WHERE user_id = ? AND product_id = ?').run(req.user.id, req.params.product_id);
  res.json({ message: 'Removed from watchlist' });
});

// GET check if product is in watchlist
router.get('/check/:product_id', auth, (req, res) => {
  const item = db.prepare('SELECT id FROM watchlist WHERE user_id = ? AND product_id = ?').get(req.user.id, req.params.product_id);
  res.json({ inWatchlist: !!item });
});

module.exports = router;
