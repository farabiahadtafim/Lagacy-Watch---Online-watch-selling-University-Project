const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const express = require('express');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET environment variable is not set!');
}
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1055497562496-8bfmf7ogfuplvt9ju550hkvrsqjs9a5i.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' });

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)'
    ).run(name, email, hash, phone || null);

    const token = jwt.sign({ id: result.lastInsertRowid, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.lastInsertRowid, name, email, role: 'user' } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    if (user.is_blocked) return res.status(403).json({ error: 'Your account has been blocked' });

    if (!user.password_hash) {
      return res.status(401).json({ error: 'This account was created with Google. Please use Google Login.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Google Login - Verify token and sign in user, with fallback to mock
router.post('/google', async (req, res) => {
  try {
    const { credential, email, name, googleId } = req.body;
    
    let userEmail, userName, userGoogleId;
    
    if (credential) {
      // Real Google login
      try {
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        userEmail = payload.email;
        userName = payload.name;
        userGoogleId = payload.sub;
      } catch (verifyErr) {
        console.error('Google token verification failed:', verifyErr);
        // Fallback to mock if verification fails
        if (email) {
          userEmail = email;
          userName = name || 'Google User';
          userGoogleId = googleId || 'mock_google_id';
        } else {
          throw verifyErr;
        }
      }
    } else if (email) {
      // Mock Google login
      userEmail = email;
      userName = name || 'Google User';
      userGoogleId = googleId || 'mock_google_id';
    } else {
      return res.status(400).json({ error: 'No Google credentials provided' });
    }
    
    // Check if user exists
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(userEmail);
    if (user && user.is_blocked) return res.status(403).json({ error: 'Your account has been blocked' });
    
    if (!user) {
      // Create new user if doesn't exist
      const result = db.prepare(
        'INSERT INTO users (name, email, password_hash, google_id) VALUES (?, ?, ?, ?)'
      ).run(userName, userEmail, null, userGoogleId);
      
      user = {
        id: result.lastInsertRowid,
        name: userName,
        email: userEmail,
        role: 'user'
      };
    } else {
      // If user exists but no google_id, update it
      if (!user.google_id) {
        db.prepare('UPDATE users SET google_id = ? WHERE id = ?').run(userGoogleId, user.id);
      }
      user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ error: 'Google login failed: ' + err.message });
  }
});

const authMiddleware = require('../middleware/auth');

router.get('/profile', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password_hash, ...safeUser } = user;
  res.json(safeUser);
});

router.put('/profile', authMiddleware, (req, res) => {
  try {
    const { name, phone, address } = req.body;
    db.prepare('UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?').run(name, phone, address, req.user.id);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    const { password_hash, ...safeUser } = user;
    res.json(safeUser);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user.password_hash) return res.status(400).json({ error: 'This account uses Google Login. You cannot change password.' });
    
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Incorrect current password' });
    
    const hash = await bcrypt.hash(newPassword, 10);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, req.user.id);
    res.json({ message: 'Password updated successfully' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

const admin = require('../middleware/admin');

// GET all users (admin)
router.get('/admin/all', authMiddleware, admin, (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  const safeUsers = users.map(({ password_hash, ...u }) => u);
  res.json(safeUsers);
});

// PUT update user role (admin)
router.put('/admin/:id/role', authMiddleware, admin, (req, res) => {
  const { role } = req.body;
  const validRoles = ['Administrator', 'Manager', 'Support Staff', 'Customer', 'user', 'admin'];
  if (!validRoles.includes(role)) return res.status(400).json({ error: 'Invalid role' });
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  res.json({ message: 'Role updated successfully' });
});

// PUT block/unblock user (admin)
router.put('/admin/:id/block', authMiddleware, admin, (req, res) => {
  const { is_blocked } = req.body;
  db.prepare('UPDATE users SET is_blocked = ? WHERE id = ?').run(is_blocked ? 1 : 0, req.params.id);
  res.json({ message: `User ${is_blocked ? 'blocked' : 'unblocked'} successfully` });
});

// DELETE user (admin)
router.delete('/admin/:id', authMiddleware, admin, (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: 'User deleted successfully' });
});

module.exports = router;
