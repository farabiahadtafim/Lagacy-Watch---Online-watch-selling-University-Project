const fs = require('fs');
const path = require('path');

const dbPath = 'c:/Users/Pathao Ltd/Documents/University Project/Legacy Watches Project 2/backend/database/db.json';
let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const bengaliReviews = [
  "অসাধারণ একটি ঘড়ি! হাতে দিলে অনেক প্রিমিয়াম ফিল দেয়।",
  "ডেলিভারি খুব ফাস্ট ছিল, ঘড়ির কোয়ালিটি দাম অনুযায়ী সেরা।",
  "প্যাকেজিংটা অনেক সুন্দর ছিল। ঘড়িটা ঠিক যেমন ছবিতে দেখেছি তেমনই পেয়েছি।",
  "অরিজিনাল প্রোডাক্ট দেওয়ার জন্য ধন্যবাদ লেগ্যাসি വാচেসকে।",
  "খুবই ক্লাসি ডিজাইন। সবার পছন্দ হয়েছে।",
  "বেস্ট বাজেট ওয়াচ। আমি পুরোপুরি সন্তুষ্ট।",
  "এতো কম দামে এতো ভালো ঘড়ি পাবো আশা করিনি। 10/10",
  "সার্ভিস এবং ব্যবহার খুব ভালো লেগেছে। ঘড়িটাও জোস!"
];

const reviewerNames = [
  "Rafi Ahmed", "Sadia Islam", "Mehedi Hasan", "Nusrat Jahan", 
  "Arafat Rahman", "Tanvir H", "Tahmina Akter", "Samiul B"
];

// Clear existing reviews
db.reviews = [];

// Generate reviews for all products
db.products.forEach(product => {
  // Add 1 to 3 random reviews per product
  const numReviews = Math.floor(Math.random() * 3) + 1;
  
  for(let i=0; i<numReviews; i++) {
    const revText = bengaliReviews[Math.floor(Math.random() * bengaliReviews.length)];
    const revName = reviewerNames[Math.floor(Math.random() * reviewerNames.length)];
    const rating = Math.random() > 0.8 ? 4 : 5; // Mostly 5 stars, some 4
    
    // Random date within last 3 months
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    db.reviews.push({
      id: Date.now() + Math.floor(Math.random() * 10000) + i,
      product_id: product.id,
      user_name: revName,
      rating: rating,
      comment: revText,
      created_at: date.toISOString()
    });
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Added ' + db.reviews.length + ' reviews across ' + db.products.length + ' products.');
