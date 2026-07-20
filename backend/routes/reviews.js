const express = require('express');
const router = express.Router();
const db = require('../database/db');
const auth = require('../middleware/auth');

// GET all reviews
router.get('/', (req, res) => {
  const { product_id, limit } = req.query;
  let query = 'SELECT * FROM reviews WHERE 1=1';
  const params = [];
  if (product_id) { query += ' AND product_id = ?'; params.push(product_id); }
  query += ' ORDER BY created_at DESC';
  if (limit) { query += ' LIMIT ?'; params.push(parseInt(limit)); }
  res.json(db.prepare(query).all(...params));
});

// POST add review
router.post('/', auth, (req, res) => {
  const { product_id, rating, comment } = req.body;
  const user = db.prepare('SELECT name FROM users WHERE id = ?').get(req.user.id);
  if (!comment) return res.status(400).json({ error: 'Comment is required' });
  db.prepare('INSERT INTO reviews (user_id, user_name, product_id, rating, comment) VALUES (?, ?, ?, ?, ?)')
    .run(req.user.id, user.name, product_id || null, parseInt(rating) || 5, comment);
  res.json({ message: 'Review submitted successfully' });
});

// POST guest review (no auth needed)
router.post('/guest', (req, res) => {
  const { user_name, product_id, rating, comment } = req.body;
  if (!user_name || !comment) return res.status(400).json({ error: 'Name and comment required' });
  db.prepare('INSERT INTO reviews (user_name, product_id, rating, comment) VALUES (?, ?, ?, ?)')
    .run(user_name, product_id || null, parseInt(rating) || 5, comment);
  res.json({ message: 'Review submitted' });
});

module.exports = router;
