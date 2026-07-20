const fs = require('fs');
const path = require('path');

const dbPath = 'c:/Users/Pathao Ltd/Documents/University Project/Legacy Watches Project 2/backend/database/db.json';
const smartWatchDir = 'c:/Users/Pathao Ltd/Documents/University Project/Legacy Watches Project 2/Legacy watches Web Images/products/Smart Watch';

let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// 1. Remove belts
const oldLen = db.products.length;
db.products = db.products.filter(p => p.category.toLowerCase() !== 'belts');
console.log('Removed', oldLen - db.products.length, 'belts products');

// 2. Max ID
let maxId = db.products.reduce((max, p) => Math.max(max, p.id), 0);

// 3. Process Smart Watch folders
const folders = fs.readdirSync(smartWatchDir);
let addedCount = 0;

folders.forEach(folderName => {
    const folderPath = path.join(smartWatchDir, folderName);
    if (fs.statSync(folderPath).isDirectory()) {
        const files = fs.readdirSync(folderPath).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
        
        if (files.length > 0) {
            maxId++;
            const brand = folderName.split(' ')[0];
            const slug = folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            
            const imagePaths = files.map(f => `/product-images/products/Smart Watch/${folderName}/${f}`);
            const main_image = imagePaths[0];
            
            const newProduct = {
                id: maxId,
                title: folderName,
                slug: slug,
                price: 3500 + Math.floor(Math.random() * 10) * 100, // 3500 to 4400
                original_price: 4500 + Math.floor(Math.random() * 10) * 100,
                category: 'Smart Watch',
                brand: brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase(),
                description: `${folderName} is a premium smart watch featuring a brilliant display, fitness tracking, and long battery life. Perfect for everyday wear with style and durability. Comes with 1 year replacement warranty.`,
                stock: 20 + Math.floor(Math.random() * 30),
                is_flash_sale: Math.random() > 0.7 ? 1 : 0,
                discount_percent: Math.random() > 0.7 ? 15 : 0,
                main_image: main_image,
                images_json: JSON.stringify(imagePaths)
            };
            
            db.products.push(newProduct);
            addedCount++;
            console.log('Added', folderName);
        }
    }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Total added:', addedCount);
