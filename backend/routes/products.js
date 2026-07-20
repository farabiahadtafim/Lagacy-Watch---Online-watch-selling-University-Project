const express = require('express');
const router = express.Router();
const db = require('../database/db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Multer storage for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../Legacy watches Web Images/uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET all products with filters
router.get('/', (req, res) => {
  const { category, brand, flash_sale, search, limit, offset, min_price, max_price, sort } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category && category.toLowerCase() !== 'all watches' && category.toLowerCase() !== 'all-watches') { 
    query += ' AND LOWER(category) = LOWER(?)'; 
    params.push(category.toLowerCase().replace(/-/g, ' ')); 
  }
  if (brand) { 
    // Handle multiple brands if comma separated
    const brands = brand.split(',').map(b => b.trim());
    query += ` AND LOWER(brand) IN (${brands.map(() => '?').join(',')})`; 
    params.push(...brands.map(b => b.toLowerCase())); 
  }
  if (flash_sale === '1') { query += ' AND is_flash_sale = 1'; }
  if (search) { query += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  if (min_price) { query += ` AND price >= ${parseFloat(min_price)}`; }
  if (max_price) { query += ` AND price <= ${parseFloat(max_price)}`; }

  if (sort === 'price_asc') {
    query += ' ORDER BY price ASC';
  } else if (sort === 'price_desc') {
    query += ' ORDER BY price DESC';
  } else if (sort === 'best_selling') {
    // Assuming we don't have a sales column, fallback to created_at or mock it
    query += ' ORDER BY stock ASC'; // Just as a mock for best selling
  } else {
    query += ' ORDER BY created_at DESC';
  }

  if (limit) { query += ' LIMIT ?'; params.push(parseInt(limit)); }
  if (offset) { query += ' OFFSET ?'; params.push(parseInt(offset)); }

  const products = db.prepare(query).all(...params);
  res.json(products);
});

// GET single product by slug or id
router.get('/:slugOrId', (req, res) => {
  const { slugOrId } = req.params;
  let product = db.prepare('SELECT * FROM products WHERE slug = ?').get(slugOrId);
  if (!product) product = db.prepare('SELECT * FROM products WHERE id = ?').get(slugOrId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST create product (admin only)
router.post('/', auth, admin, upload.array('images', 10), async (req, res) => {
  try {
    const { title, price, original_price, category, brand, description, stock, is_flash_sale, discount_percent, sku, movement, glass_type, water_resistance, strap_material } = req.body;
    if (!title || price === undefined || !category) return res.status(400).json({ error: 'Title, price and category are required' });
    
    // Strict Input Validation
    const parsedPrice = parseFloat(price);
    const parsedOrigPrice = parseFloat(original_price) || null;
    if (parsedPrice < 0) return res.status(400).json({ error: 'Price cannot be negative' });
    if (parsedOrigPrice !== null && parsedOrigPrice < 0) return res.status(400).json({ error: 'Original price cannot be negative' });

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const files = req.files || [];
    
    // Image Optimization: WebP format
    const processedImages = [];
    for (const file of files) {
      const webpFilename = file.filename.split('.')[0] + '.webp';
      const outputPath = path.join(file.destination, webpFilename);
      await sharp(file.path)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      processedImages.push(`/uploads/${webpFilename}`);
      fs.unlinkSync(file.path); // remove original
    }

    const mainImage = processedImages.length > 0 ? processedImages[0] : null;

    const result = db.prepare(`
      INSERT INTO products (title, slug, price, original_price, category, brand, description, stock, is_flash_sale, discount_percent, main_image, images_json, sku, movement, glass_type, water_resistance, strap_material)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, slug, parsedPrice, parsedOrigPrice, category, brand || null, description || null,
      parseInt(stock) || 10, is_flash_sale === '1' ? 1 : 0, parseInt(discount_percent) || 0, mainImage, JSON.stringify(processedImages), sku || '', movement || '', glass_type || '', water_resistance || '', strap_material || '');

    res.json({ id: result.lastInsertRowid, message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update product (admin only)
router.put('/:id', auth, admin, upload.array('images', 10), async (req, res) => {
  try {
    const { title, price, original_price, category, brand, description, stock, is_flash_sale, discount_percent, sku, movement, glass_type, water_resistance, strap_material } = req.body;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    // Strict Input Validation
    const parsedPrice = parseFloat(price);
    const parsedOrigPrice = parseFloat(original_price) || null;
    if (parsedPrice < 0) return res.status(400).json({ error: 'Price cannot be negative' });
    if (parsedOrigPrice !== null && parsedOrigPrice < 0) return res.status(400).json({ error: 'Original price cannot be negative' });

    const files = req.files || [];
    let mainImage = existing.main_image;
    let images = JSON.parse(existing.images_json || '[]');
    
    if (files.length > 0) {
      const processedImages = [];
      for (const file of files) {
        const webpFilename = file.filename.split('.')[0] + '.webp';
        const outputPath = path.join(file.destination, webpFilename);
        await sharp(file.path)
          .resize({ width: 800, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outputPath);
        processedImages.push(`/uploads/${webpFilename}`);
        fs.unlinkSync(file.path);
      }
      mainImage = processedImages[0];
      images = processedImages;
    }

    db.prepare(`
      UPDATE products SET title=?, price=?, original_price=?, category=?, brand=?, description=?, stock=?, is_flash_sale=?, discount_percent=?, main_image=?, images_json=?, sku=?, movement=?, glass_type=?, water_resistance=?, strap_material=?
      WHERE id=?
    `).run(title, parsedPrice, parsedOrigPrice, category, brand, description,
      parseInt(stock), is_flash_sale === '1' ? 1 : 0, parseInt(discount_percent) || 0, mainImage, JSON.stringify(images), sku || '', movement || '', glass_type || '', water_resistance || '', strap_material || '', req.params.id);

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product (admin only)
router.delete('/:id', auth, admin, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ message: 'Product deleted successfully' });
});

module.exports = router;
