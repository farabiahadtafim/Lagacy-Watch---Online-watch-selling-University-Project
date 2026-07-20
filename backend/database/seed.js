const db = require('./db');
const bcrypt = require('bcryptjs');

// ---- ADMIN USER ----
const adminExists = db.prepare("SELECT id FROM users WHERE email = 'admin@legacywatches.com'").get();
if (!adminExists) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)").run('Admin', 'admin@legacywatches.com', hash, 'admin');
  console.log('Admin created: admin@legacywatches.com / admin123');
}

// ---- PRODUCTS ----
const insertProduct = db.prepare(`
  INSERT OR IGNORE INTO products (title, slug, price, original_price, category, brand, description, stock, is_flash_sale, discount_percent, main_image, images_json)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const desc = (brand, model, type) => `${brand} ${model} is a premium quality ${type} watch featuring stainless steel case, mineral crystal glass, and water resistance up to 30 meters. Perfect for everyday wear with style and durability. Comes with 1 year replacement warranty.`;

const products = [
  // MEN'S WATCHES
  ['Naviforce NF9226 Chronograph Watch for Men - Black', 'naviforce-nf9226-black', 3200, 3800, 'men', 'Naviforce', desc('Naviforce','NF9226','chronograph'), 15, 0, 0, '/product-images/products/naviforce-9226-ch-black/naviforce-9226-ch-black.webp', JSON.stringify(['/product-images/products/naviforce-9226-ch-black/naviforce-9226-ch-black.webp', '/product-images/products/naviforce-9226-ch-black/naviforce-9226-ch-black_04.webp', '/product-images/products/naviforce-9226-ch-black/naviforce-9226-ch-black_05.webp'])],
  ['Naviforce NF9226 Chronograph Watch for Men - Silver', 'naviforce-nf9226-silver', 3200, 3800, 'men', 'Naviforce', desc('Naviforce','NF9226','chronograph silver'), 12, 1, 16, '/product-images/products/naviforce-9226-ch-sliver/naviforce-9226-ch-sliver.webp', JSON.stringify(['/product-images/products/naviforce-9226-ch-sliver/naviforce-9226-ch-sliver.webp'])],
  ['Naviforce NF9226 Chronograph - Silver Gold Black', 'naviforce-nf9226-silver-gold-black', 3400, 4000, 'men', 'Naviforce', desc('Naviforce','NF9226','premium chronograph'), 8, 0, 0, '/product-images/products/naviforce-9226-ch-sliver-gold-black/naviforce-9226-ch-sliver-gold-black.webp', JSON.stringify(['/product-images/products/naviforce-9226-ch-sliver-gold-black/naviforce-9226-ch-sliver-gold-black.webp'])],
  ['Naviforce NF9212 Chronograph Watch - Black', 'naviforce-nf9212-black', 2900, 3400, 'men', 'Naviforce', desc('Naviforce','NF9212','sport chronograph'), 20, 0, 0, '/product-images/products/naviforce-9212-ch-black/naviforce-9212-ch-black.webp', JSON.stringify(['/product-images/products/naviforce-9212-ch-black/naviforce-9212-ch-black.webp'])],
  ['Naviforce NF9212 Chronograph Watch - Blue', 'naviforce-nf9212-blue', 2900, 3400, 'men', 'Naviforce', desc('Naviforce','NF9212','sport chronograph blue'), 18, 1, 15, '/product-images/products/naviforce-9212-ch-blue/naviforce-9212-ch-blue.webp', JSON.stringify(['/product-images/products/naviforce-9212-ch-blue/naviforce-9212-ch-blue.webp'])],
  ['Naviforce NF9214 Chronograph - Black', 'naviforce-nf9214-black', 3100, 3600, 'men', 'Naviforce', desc('Naviforce','NF9214','dual time chronograph'), 10, 0, 0, '/product-images/products/naviforce-9214-ch-black/naviforce-9214-ch-black.webp', JSON.stringify(['/product-images/products/naviforce-9214-ch-black/naviforce-9214-ch-black.webp'])],
  ['Naviforce NF9214 Chronograph - Silver Blue', 'naviforce-nf9214-silver-blue', 3100, 3600, 'men', 'Naviforce', desc('Naviforce','NF9214','silver blue chronograph'), 14, 1, 14, '/product-images/products/naviforce-9214-ch-silver-blue/naviforce-9214-ch-silver-blue.webp', JSON.stringify(['/product-images/products/naviforce-9214-ch-silver-blue/naviforce-9214-ch-silver-blue.webp'])],
  ['Naviforce NF9218 Chronograph - Silver Gold', 'naviforce-nf9218-silver-gold', 3300, 3900, 'men', 'Naviforce', desc('Naviforce','NF9218','luxury gold chronograph'), 6, 0, 0, '/product-images/products/naviforce-9218-ch-silver-gold/naviforce-9218-ch-silver-gold.webp', JSON.stringify(['/product-images/products/naviforce-9218-ch-silver-gold/naviforce-9218-ch-silver-gold.webp'])],
  ['Naviforce NF9261 Leather Watch - Black', 'naviforce-nf9261-black', 2600, 3000, 'men', 'Naviforce', desc('Naviforce','NF9261','leather strap'), 25, 0, 0, '/product-images/products/naviforce-9261-black/naviforce-9261-black.webp', JSON.stringify(['/product-images/products/naviforce-9261-black/naviforce-9261-black.webp'])],
  ['Naviforce NF9261 Leather Watch - Brown', 'naviforce-nf9261-brown', 2600, 3000, 'men', 'Naviforce', desc('Naviforce','NF9261','brown leather'), 20, 1, 13, '/product-images/products/naviforce-9261-brown/naviforce-9261-brown.webp', JSON.stringify(['/product-images/products/naviforce-9261-brown/naviforce-9261-brown.webp'])],
  ['Naviforce NF9261 Leather Watch - Blue', 'naviforce-nf9261-blue', 2600, 3000, 'men', 'Naviforce', desc('Naviforce','NF9261','navy blue leather'), 15, 0, 0, '/product-images/products/naviforce-9261-blue/naviforce-9261-blue.webp', JSON.stringify(['/product-images/products/naviforce-9261-blue/naviforce-9261-blue.webp'])],
  ['Naviforce NF9261 Leather Watch - Green', 'naviforce-nf9261-green', 2600, 3100, 'men', 'Naviforce', desc('Naviforce','NF9261','forest green leather'), 12, 0, 0, '/product-images/products/naviforce-9261-green/naviforce-9261-green.webp', JSON.stringify(['/product-images/products/naviforce-9261-green/naviforce-9261-green.webp'])],
  ['Naviforce NF9229 Leather Watch - Brown', 'naviforce-nf9229-brown', 2400, 2900, 'men', 'Naviforce', desc('Naviforce','NF9229','classic brown leather'), 30, 1, 17, '/product-images/products/naviforce-9229-brown/naviforce-9229-brown.webp', JSON.stringify(['/product-images/products/naviforce-9229-brown/naviforce-9229-brown.webp'])],
  ['Naviforce NF9229 Leather Watch - Green', 'naviforce-nf9229-green', 2400, 2900, 'men', 'Naviforce', desc('Naviforce','NF9229','olive green leather'), 18, 0, 0, '/product-images/products/naviforce-9229-green/naviforce-9229-green.webp', JSON.stringify(['/product-images/products/naviforce-9229-green/naviforce-9229-green.webp'])],
  ['Naviforce NF8075 Steel Watch - Black', 'naviforce-nf8075-black', 2800, 3200, 'men', 'Naviforce', desc('Naviforce','NF8075','stainless steel'), 22, 0, 0, '/product-images/products/naviforce-8075-for-men-black/naviforce-8075-for-men-black.webp', JSON.stringify(['/product-images/products/naviforce-8075-for-men-black/naviforce-8075-for-men-black.webp'])],
  ['Naviforce NF8075 Steel Watch - Blue', 'naviforce-nf8075-blue', 2800, 3200, 'men', 'Naviforce', desc('Naviforce','NF8075','steel blue'), 16, 1, 12, '/product-images/products/naviforce-8075-for-men-blue/naviforce-8075-for-men-blue.webp', JSON.stringify(['/product-images/products/naviforce-8075-for-men-blue/naviforce-8075-for-men-blue.webp'])],
  ['Naviforce NF9197 Leather Watch - Silver Blue', 'naviforce-nf9197-silver-blue', 2700, 3200, 'men', 'Naviforce', desc('Naviforce','NF9197','premium leather'), 20, 0, 0, '/product-images/products/naviforce-9197-l-silver-blue/naviforce-9197-l-silver-blue.webp', JSON.stringify(['/product-images/products/naviforce-9197-l-silver-blue/naviforce-9197-l-silver-blue.webp'])],
  ['Naviforce NF9248 Leather - Silver Green', 'naviforce-nf9248-silver-green', 2500, 3000, 'men', 'Naviforce', desc('Naviforce','NF9248','fashion leather'), 14, 1, 17, '/product-images/products/naviforce-9248l-silver-green/naviforce-9248l-silver-green.webp', JSON.stringify(['/product-images/products/naviforce-9248l-silver-green/naviforce-9248l-silver-green.webp'])],

  // WOMEN'S WATCHES
  ['Naviforce NF5051 Ladies Watch - Rose Gold', 'naviforce-nf5051-rose', 2200, 2700, 'women', 'Naviforce', desc('Naviforce','NF5051','ladies rose gold'), 20, 0, 0, '/product-images/products/naviforce-5051-for-women-rose/naviforce-5051-for-women-rose.webp', JSON.stringify(['/product-images/products/naviforce-5051-for-women-rose/naviforce-5051-for-women-rose.webp'])],
  ['Naviforce NF5051 Ladies Watch - Gold', 'naviforce-nf5051-gold', 2200, 2700, 'women', 'Naviforce', desc('Naviforce','NF5051','ladies gold'), 18, 1, 18, '/product-images/products/naviforce-5051-for-women-gold/naviforce-5051-for-women-gold.webp', JSON.stringify(['/product-images/products/naviforce-5051-for-women-gold/naviforce-5051-for-women-gold.webp'])],
  ['Naviforce NF5051 Ladies Watch - Purple', 'naviforce-nf5051-purple', 2200, 2700, 'women', 'Naviforce', desc('Naviforce','NF5051','ladies purple'), 15, 0, 0, '/product-images/products/naviforce-5051-for-women-purple/naviforce-5051-for-women-purple.webp', JSON.stringify(['/product-images/products/naviforce-5051-for-women-purple/naviforce-5051-for-women-purple.webp'])],
  ['Naviforce NF5051 Ladies Watch - Blue', 'naviforce-nf5051-blue', 2200, 2700, 'women', 'Naviforce', desc('Naviforce','NF5051','ladies blue'), 12, 1, 15, '/product-images/products/naviforce-5051-for-women-blue/naviforce-5051-for-women-blue.webp', JSON.stringify(['/product-images/products/naviforce-5051-for-women-blue/naviforce-5051-for-women-blue.webp'])],
  ['Naviforce NF5068 Ladies Watch - Rose', 'naviforce-nf5068-rose', 2400, 2900, 'women', 'Naviforce', desc('Naviforce','NF5068','elegant ladies'), 20, 0, 0, '/product-images/products/naviforce-5068-for-women-rose/naviforce-5068-for-women-rose.webp', JSON.stringify(['/product-images/products/naviforce-5068-for-women-rose/naviforce-5068-for-women-rose.webp'])],
  ['Naviforce NF5068 Ladies Watch - Gold', 'naviforce-nf5068-gold', 2400, 2900, 'women', 'Naviforce', desc('Naviforce','NF5068','gold ladies'), 16, 1, 17, '/product-images/products/naviforce-5068-for-women-gold/naviforce-5068-for-women-gold.webp', JSON.stringify(['/product-images/products/naviforce-5068-for-women-gold/naviforce-5068-for-women-gold.webp'])],
  ['Naviforce NF5048 Ladies Watch - Rose White', 'naviforce-nf5048-rose-white', 2100, 2600, 'women', 'Naviforce', desc('Naviforce','NF5048','rose white ladies'), 22, 0, 0, '/product-images/products/naviforce-5048-rose-white-for-women/naviforce-5048-rose-white-for-women.webp', JSON.stringify(['/product-images/products/naviforce-5048-rose-white-for-women/naviforce-5048-rose-white-for-women.webp'])],
  ['Naviforce NF5049 Ladies Watch - Rose Gold Purple', 'naviforce-nf5049-rose-purple', 2300, 2800, 'women', 'Naviforce', desc('Naviforce','NF5049','rose gold purple ladies'), 14, 1, 18, '/product-images/products/naviforce-5049-rose-gold-purple-for-women/naviforce-5049-rose-gold-purple-for-women.webp', JSON.stringify(['/product-images/products/naviforce-5049-rose-gold-purple-for-women/naviforce-5049-rose-gold-purple-for-women.webp'])],
  ['Naviforce NF7115 Sport Watch Women - Pink', 'naviforce-nf7115-pink', 2600, 3100, 'women', 'Naviforce', desc('Naviforce','NF7115','sport silicone ladies'), 18, 0, 0, '/product-images/products/naviforce-7115-for-women-pink/naviforce-7115-for-women-pink.webp', JSON.stringify(['/product-images/products/naviforce-7115-for-women-pink/naviforce-7115-for-women-pink.webp'])],
  ['Naviforce NF7115 Sport Watch Women - Purple', 'naviforce-nf7115-purple', 2600, 3100, 'women', 'Naviforce', desc('Naviforce','NF7115','sport silicone purple ladies'), 14, 1, 16, '/product-images/products/naviforce-7115-for-women-purple/naviforce-7115-for-women-purple.webp', JSON.stringify(['/product-images/products/naviforce-7115-for-women-purple/naviforce-7115-for-women-purple.webp'])],

  // CURREN
  ['Curren 8442 Men\'s Watch - Black', 'curren-8442-black', 1800, 2200, 'men', 'Curren', desc('Curren','8442','sport quartz'), 25, 1, 18, '/product-images/products/curren-8442-black/curren-8442-black.webp', JSON.stringify(['/product-images/products/curren-8442-black/curren-8442-black.webp'])],
  ['Curren 8442 Men\'s Watch - Blue', 'curren-8442-blue', 1800, 2200, 'men', 'Curren', desc('Curren','8442','sport quartz blue'), 20, 0, 0, '/product-images/products/curren-8442-blue/curren-8442-blue.webp', JSON.stringify(['/product-images/products/curren-8442-blue/curren-8442-blue.webp'])],
  ['Curren 8402 Watch - Rose Gold Blue', 'curren-8402-rose-gold', 1900, 2400, 'men', 'Curren', desc('Curren','8402','rose gold fashion'), 18, 0, 0, '/product-images/products/curren-8402-rose-gold-blue/curren-8402-rose-gold-blue.webp', JSON.stringify(['/product-images/products/curren-8402-rose-gold-blue/curren-8402-rose-gold-blue.webp'])],
  ['Curren Women\'s Watch 9099 - Silver Sky Blue', 'curren-9099-silver-sky', 1700, 2100, 'women', 'Curren', desc('Curren','9099','ladies steel'), 22, 1, 19, '/product-images/products/curren-9099-for-women-silver-sky-blue/curren-9099-for-women-silver-sky-blue.webp', JSON.stringify(['/product-images/products/curren-9099-for-women-silver-sky-blue/curren-9099-for-women-silver-sky-blue.webp'])],

  // POEDAGAR
  ['Poedagar 910 Chronograph - Silver Gold Blue', 'poedagar-910-silver-gold-blue', 2500, 3000, 'men', 'Poedagar', desc('Poedagar','910','luxury chronograph'), 15, 1, 17, '/product-images/products/poedagar-910-ch-for-men-silver-gold-blue/poedagar-910-ch-for-men-silver-gold-blue.webp', JSON.stringify(['/product-images/products/poedagar-910-ch-for-men-silver-gold-blue/poedagar-910-ch-for-men-silver-gold-blue.webp'])],
  ['Poedagar 938 Watch - Silver Gold Black', 'poedagar-938-silver-gold-black', 2300, 2800, 'men', 'Poedagar', desc('Poedagar','938','premium steel'), 12, 0, 0, '/product-images/products/poedagar-938-for-men-silver-gold-black/poedagar-938-for-men-silver-gold-black.webp', JSON.stringify(['/product-images/products/poedagar-938-for-men-silver-gold-black/poedagar-938-for-men-silver-gold-black.webp'])],
  ['Poedagar 783 Ladies Watch - Rose', 'poedagar-783-rose', 1900, 2400, 'women', 'Poedagar', desc('Poedagar','783','rose ladies fashion'), 20, 1, 21, '/product-images/products/poedagar-783-for-women-rose/poedagar-783-for-women-rose.webp', JSON.stringify(['/product-images/products/poedagar-783-for-women-rose/poedagar-783-for-women-rose.webp'])],

  // CASIO
  ['Casio MTP-VD01D Men\'s Watch - Black', 'casio-mtp-vd01d-black', 2900, 3200, 'men', 'Casio', 'Casio MTP-VD01D is an elegant analog men\'s watch with stainless steel case and band. Features precise Japanese quartz movement, mineral glass crystal and 30m water resistance. Original Casio with 2 year warranty.', 20, 0, 0, '/product-images/products/casio-mtp-vd01d-1bvudf/casio-mtp-vd01d-1bvudf.webp', JSON.stringify(['/product-images/products/casio-mtp-vd01d-1bvudf/casio-mtp-vd01d-1bvudf.webp'])],
  ['Casio LTP-V007L Ladies Watch - Black', 'casio-ltp-v007l-black', 1800, 2100, 'women', 'Casio', 'Casio LTP-V007L ladies analog watch with elegant leather strap, precise quartz movement and water resistance. Classic Casio design with 2 year warranty.', 25, 0, 0, '/product-images/products/casio-ltp-v007l-1-budf/casio-ltp-v007l-1-budf.webp', JSON.stringify(['/product-images/products/casio-ltp-v007l-1-budf/casio-ltp-v007l-1-budf.webp'])],
  ['Casio F-91W Digital Watch', 'casio-f91w-digital', 1200, 1500, 'men', 'Casio', 'Casio F-91W is the world famous digital watch with LED backlight, stopwatch, daily alarm and 7 year battery life. Water resistant to 30m. A timeless classic.', 50, 1, 20, '/product-images/products/casio-f-91w-1dg-2/casio-f-91w-1dg-2.webp', JSON.stringify(['/product-images/products/casio-f-91w-1dg-2/casio-f-91w-1dg-2.webp'])],

  // SKMEI
  ['Skmei 9185 Sport Watch - Blue', 'skmei-9185-blue', 1500, 1900, 'men', 'Skmei', desc('Skmei','9185','sport digital'), 30, 1, 21, '/product-images/products/skmei-9185-blue/skmei-9185-blue.webp', JSON.stringify(['/product-images/products/skmei-9185-blue/skmei-9185-blue.webp'])],
  ['Skmei 9185 Sport Watch - Green', 'skmei-9185-green', 1500, 1900, 'men', 'Skmei', desc('Skmei','9185','sport digital green'), 25, 0, 0, '/product-images/products/skmei-9185-green/skmei-9185-green.webp', JSON.stringify(['/product-images/products/skmei-9185-green/skmei-9185-green.webp'])],

  // BELTS
  ['Naviforce 8023L Watch Belt - Black', 'naviforce-belt-8023-black', 450, 600, 'belts', 'Naviforce', 'Premium genuine leather watch strap for Naviforce and compatible watches. Soft, durable and comfortable on the wrist. Size: 22mm width. Available in black.', 50, 0, 0, '/product-images/products/naviforce-8023-l-black/naviforce-8023-l-black.webp', JSON.stringify(['/product-images/products/naviforce-8023-l-black/naviforce-8023-l-black.webp'])],
  ['Naviforce 8023L Watch Belt - Gray', 'naviforce-belt-8023-gray', 450, 600, 'belts', 'Naviforce', 'Premium genuine leather watch strap in gray. Compatible with 22mm lug width watches. Durable and elegant.', 40, 1, 25, '/product-images/products/naviforce-8023-l-gray/naviforce-8023-l-gray.webp', JSON.stringify(['/product-images/products/naviforce-8023-l-gray/naviforce-8023-l-gray.webp'])],
  ['Naviforce 8023L Watch Belt - Green', 'naviforce-belt-8023-green', 450, 600, 'belts', 'Naviforce', 'Premium genuine leather watch strap in green. Compatible with 22mm lug width watches.', 35, 0, 0, '/product-images/products/naviforce-8023-l-green/naviforce-8023-l-green.webp', JSON.stringify(['/product-images/products/naviforce-8023-l-green/naviforce-8023-l-green.webp'])],
];

const insertAll = db.transaction(() => {
  for (const p of products) {
    insertProduct.run(...p);
  }
});
insertAll();
console.log(`✅ Inserted ${products.length} products`);

// ---- REVIEWS ----
const reviews = [
  ['Rahim Uddin', 5, 'Excellent quality watch! Naviforce NF9226 is amazing. Got it delivered within 2 days. Very happy with the purchase!', null],
  ['Fatema Begum', 5, 'I bought the ladies rose gold watch for my sister. She absolutely loves it! The quality is top-notch and the packaging was beautiful.', null],
  ['Kamal Hossain', 4, 'Good watch for the price. Naviforce NF9261 leather strap is very comfortable. Highly recommended!', null],
  ['Nusrat Jahan', 5, 'Ordered the NF5051 women\'s watch. It looks exactly like the picture and even better in person. Fast delivery too!', null],
  ['Tanvir Ahmed', 5, 'Best online watch shop in Bangladesh! Got my Curren 8442 within 48 hours. The watch is genuine and works perfectly.', null],
  ['Sadia Islam', 4, 'Bought Casio F-91W. Original product with proper warranty card. Price is reasonable. Recommended!', null],
  ['Minhaz Rahman', 5, 'Naviforce NF9214 chronograph is my daily driver now. Looks premium and the build quality is excellent.', null],
  ['Sabrina Akter', 5, 'The packaging was very nice. Watch arrived safely. The NF5068 rose gold is gorgeous! Will order again.', null],
  ['Arif Billah', 4, 'Good customer service. Had a query about the product and they responded quickly on WhatsApp. Smooth experience overall.', null],
  ['Priya Sen', 5, 'Got the Poedagar 910 for my husband as a birthday gift. He was very impressed! Looks very premium in real life.', null],
];

const insertReview = db.prepare('INSERT OR IGNORE INTO reviews (user_name, rating, comment, product_id) VALUES (?, ?, ?, ?)');
const insertReviews = db.transaction(() => {
  for (const r of reviews) insertReview.run(...r);
});
insertReviews();
console.log(`✅ Inserted ${reviews.length} reviews`);
