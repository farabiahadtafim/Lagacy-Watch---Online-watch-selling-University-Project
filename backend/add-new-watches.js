const fs = require('fs');
const path = require('path');

const dbPath = 'c:/Users/Pathao Ltd/Documents/University Project/Legacy Watches Project 2/backend/database/db.json';
const productsDir = 'c:/Users/Pathao Ltd/Documents/University Project/Legacy Watches Project 2/Legacy watches Web Images/products';

let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// 2. Max ID
let maxId = db.products.reduce((max, p) => Math.max(max, p.id), 0);

// Get all folders
const folders = fs.readdirSync(productsDir);
let addedCount = 0;

// Existing slugs to avoid duplicates
const existingSlugs = new Set(db.products.map(p => p.slug));

folders.forEach(folderName => {
    const folderPath = path.join(productsDir, folderName);
    if (fs.statSync(folderPath).isDirectory() && folderName !== 'Smart Watch') {
        const slug = folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Skip if already exists or is a known old product that is already in DB with a different slug but similar name
        const isOld = db.products.some(p => p.title.toLowerCase() === folderName.toLowerCase() || p.slug.includes(slug) || slug.includes(p.slug));
        
        // Let's explicitly look for the new Tudor ones and any other new folder
        const isNewFolder = !['casio', 'curren', 'naviforce', 'poedagar', 'skmei'].some(b => folderName.toLowerCase().includes(b));

        if (isNewFolder && !existingSlugs.has(slug)) {
            const files = fs.readdirSync(folderPath).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
            
            if (files.length > 0) {
                maxId++;
                const brand = 'Tudor'; // Based on the names (Black Bay, Pelagos, 1926, etc)
                
                const imagePaths = files.map(f => `/product-images/products/${folderName}/${f}`);
                const main_image = imagePaths[0];
                
                const basePrice = 20000 + Math.floor(Math.random() * 300) * 100; // 20000 to 50000
                const originalPrice = basePrice + 2000 + Math.floor(Math.random() * 50) * 100;
                
                const category = folderName.toLowerCase().includes('clair') || folderName.toLowerCase().includes('rose') ? 'women' : 'men';

                const newProduct = {
                    id: maxId,
                    title: folderName,
                    slug: slug,
                    price: basePrice,
                    original_price: originalPrice,
                    category: category,
                    brand: brand,
                    description: `${folderName} is a premium luxury timepiece featuring exquisite craftsmanship and unparalleled precision. A true legacy watch.`,
                    stock: 5 + Math.floor(Math.random() * 10),
                    is_flash_sale: Math.random() > 0.8 ? 1 : 0,
                    discount_percent: Math.random() > 0.8 ? 10 : 0,
                    main_image: main_image,
                    images_json: JSON.stringify(imagePaths)
                };
                
                db.products.push(newProduct);
                existingSlugs.add(slug);
                addedCount++;
                console.log('Added', folderName);
            }
        }
    }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Total added:', addedCount);
