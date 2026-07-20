const express = require('express');
const router = express.Router();
const db = require('../database/db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Function to sanitize basic inputs (prevent basic XSS)
const sanitize = (str) => {
  if (!str) return str;
  return str.toString()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

// POST send message (public)
router.post('/', (req, res) => {
  try {
    let { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Basic sanitize inputs
    name = sanitize(name);
    email = sanitize(email);
    subject = sanitize(subject);
    message = sanitize(message);

    db.prepare('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)').run(name, email, subject, message);
    
    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all messages (admin)
router.get('/admin/all', auth, admin, (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update message read status (admin)
router.put('/admin/:id/status', auth, admin, (req, res) => {
  try {
    const { read_status } = req.body;
    db.prepare('UPDATE messages SET read_status = ? WHERE id = ?').run(read_status ? 1 : 0, req.params.id);
    res.json({ message: 'Message status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
