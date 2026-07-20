const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

const initialData = {
  users: [],
  products: [],
  orders: [],
  order_items: [],
  cart: [],
  watchlist: [],
  reviews: [],
  messages: [],
  warranties: []
};

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
}

const getData = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const saveData = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

const db = {
  prepare: (query) => {
    return {
      get: (...params) => {
        const data = getData();
        const q = query.toLowerCase();
        
        if (q.includes('select * from users where email = ?')) {
          return data.users.find(u => u.email === params[0]);
        }
        if (q.includes('select * from products where slug = ?')) {
          return data.products.find(p => p.slug === params[0]) || data.products.find(p => p.id == params[0]);
        }
        if (q.includes('select * from products where id = ?')) {
          return data.products.find(p => p.id == params[0]);
        }
        if (q.includes('select count(*) as count from products')) {
          return { count: data.products.length };
        }
        if (q.includes('select count(*) as count from orders')) {
          return { count: data.orders.length };
        }
        if (q.includes('select count(*) as count from users')) {
          // count only non-admin users
          return { count: data.users.filter(u => u.role === 'user').length };
        }
        if (q.includes('select sum(total_amount) as total from orders')) {
          const total = data.orders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + (o.total_amount || 0), 0);
          return { total };
        }
        if (q.includes('select id from users where email = ?')) {
          const u = data.users.find(u => u.email === params[0]);
          return u ? { id: u.id } : null;
        }
        if (q.includes('select * from users where id = ?')) {
          return data.users.find(u => u.id == params[0]);
        }
        if (q.includes('select id from products where id = ?')) {
          const p = data.products.find(p => p.id == params[0]);
          return p ? { id: p.id } : null;
        }
        if (q.includes('select id from watchlist where user_id = ?')) {
          const item = data.watchlist.find(w => w.user_id == params[0] && w.product_id == params[1]);
          return item ? { id: item.id } : null;
        }
        if (q.includes('select name from users where id = ?')) {
          const u = data.users.find(u => u.id == params[0]);
          return u ? { name: u.name } : null;
        }
        if (q.includes('select * from orders where id = ?')) {
          return data.orders.find(o => o.id == params[0]) || null;
        }
        return null;
      },
      all: (...params) => {
        const data = getData();
        const q = query.toLowerCase();

        if (q.includes('select id, name, email, phone, role, created_at from users')) {
          return data.users
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map(({ id, name, email, phone, role, created_at }) => ({ id, name, email, phone, role, created_at }));
        }
        if (q.includes('select * from users')) {
          return data.users;
        }
        if (q.includes('select * from products')) {
          let res = [...data.products];
          if (q.includes('category) = lower(?)')) {
            const cat = params[0].toLowerCase();
            res = res.filter(p => p.category.toLowerCase() === cat);
          }
          if (q.includes('is_flash_sale = 1')) {
            res = res.filter(p => p.is_flash_sale == 1);
          }
          if (q.includes('title like ?')) {
             const term = params[0].replace(/%/g, '').toLowerCase();
             res = res.filter(p => p.title.toLowerCase().includes(term));
          }
          const minPriceMatch = q.match(/price >= ([\d.]+)/);
          if (minPriceMatch) {
             const minP = parseFloat(minPriceMatch[1]);
             res = res.filter(p => p.price >= minP);
          }
          const maxPriceMatch = q.match(/price <= ([\d.]+)/);
          if (maxPriceMatch) {
             const maxP = parseFloat(maxPriceMatch[1]);
             res = res.filter(p => p.price <= maxP);
          }
          if (q.includes('order by price asc')) {
             res.sort((a, b) => a.price - b.price);
          } else if (q.includes('order by price desc')) {
             res.sort((a, b) => b.price - a.price);
          } else if (q.includes('order by stock asc')) {
             res.sort((a, b) => a.stock - b.stock);
          } else if (q.includes('order by created_at desc')) {
             res.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
          } else {
             res.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
          }
          
          if (q.includes('limit ?')) {
             const limitIdx = q.indexOf('limit ?') > -1 ? params.length - 1 : -1;
             // Naive limit implementation. We know limit is pushed last or second to last.
             // Actually, limit is pushed last or offset is pushed last.
             // Let's just do a generic limit support based on params.
             if (params.length > 0 && typeof params[params.length - 1] === 'number') {
                 // limit could be params[params.length-1]
                 const limit = params[params.length - 1];
                 if (limit > 0) res = res.slice(0, limit);
             }
          }
          return res;
        }
        if (q.includes('select * from messages')) {
          return data.messages || [];
        }
        if (q.includes('select * from warranties')) {
          return data.warranties || [];
        }
        if (q.includes('select * from reviews')) {
          if (q.includes('product_id = ?')) {
            return data.reviews.filter(r => r.product_id == params[0]);
          }
          return data.reviews;
        }
        if (q.includes('select c.id, c.quantity') || q.includes('from cart c join products p')) {
          // Cart query
          return data.cart
            .filter(c => c.user_id == params[0])
            .map(c => {
              const p = data.products.find(prod => prod.id == c.product_id);
              return { ...c, ...p, product_id: p.id, id: c.id };
            });
        }
        if (q.includes('select w.id, w.added_at')) {
          // Watchlist query
          return data.watchlist
            .filter(w => w.user_id == params[0])
            .map(w => {
              const p = data.products.find(prod => prod.id == w.product_id);
              return { ...w, ...p, product_id: p.id, id: w.id };
            });
        }
        if (q.includes('select o.*, u.name as user_name')) {
          // Admin recent orders JOIN query
          const limit = (typeof params[0] === 'number') ? params[0] : 5;
          const sorted = [...data.orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, limit);
          return sorted.map(o => {
            const user = data.users.find(u => u.id == o.user_id);
            return { ...o, user_name: user ? user.name : 'Unknown' };
          });
        }
        if (q.includes('select o.*')) {
          // Orders query for a specific user
          return data.orders.filter(o => o.user_id == params[0]);
        }
        if (q.includes('select * from order_items')) {
          return data.order_items.filter(oi => oi.order_id == params[0]);
        }
        return [];
      },
      run: (...params) => {
        const data = getData();
        const q = query.toLowerCase();
        
        if (q.includes('insert into users')) {
          const newUser = { id: Date.now(), name: params[0], email: params[1], password_hash: params[2], phone: params[3] || null, google_id: params[4] || null, address: null, role: params[5] || 'user', is_blocked: 0, created_at: new Date().toISOString() };
          data.users.push(newUser);
          saveData(data);
          return { lastInsertRowid: newUser.id };
        }
        if (q.includes('update users set name = ?, phone = ?, address = ?')) {
          const user = data.users.find(u => u.id == params[3]);
          if (user) {
            user.name = params[0];
            user.phone = params[1];
            user.address = params[2];
            saveData(data);
          }
          return { changes: user ? 1 : 0 };
        }
        if (q.includes('update users set password_hash = ?')) {
          const user = data.users.find(u => u.id == params[1]);
          if (user) {
            user.password_hash = params[0];
            saveData(data);
          }
          return { changes: user ? 1 : 0 };
        }
        if (q.includes('insert or ignore into products') || q.includes('insert into products')) {
          const newProduct = { 
            id: data.products.length + 1,
            title: params[0], slug: params[1], price: params[2], original_price: params[3],
            category: params[4], brand: params[5], description: params[6], stock: params[7],
            is_flash_sale: params[8], discount_percent: params[9], main_image: params[10], images_json: params[11],
            sku: params[12] || '', movement: params[13] || '', glass_type: params[14] || '', water_resistance: params[15] || '', strap_material: params[16] || '',
            created_at: new Date().toISOString()
          };
          if (!data.products.find(p => p.slug === newProduct.slug)) {
            data.products.push(newProduct);
            saveData(data);
          }
          return { lastInsertRowid: newProduct.id };
        }
        if (q.includes('insert or ignore into reviews')) {
             data.reviews.push({ id: Date.now(), user_name: params[0], rating: params[1], comment: params[2], product_id: params[3], created_at: new Date().toISOString() });
             saveData(data);
             return { lastInsertRowid: Date.now() };
        }
        if (q.includes('insert into cart')) {
            const newItem = { id: Date.now(), user_id: params[0], product_id: params[1], quantity: params[2] };
            data.cart.push(newItem);
            saveData(data);
            return { lastInsertRowid: newItem.id };
        }
        if (q.includes('update cart set quantity')) {
            const item = data.cart.find(c => c.user_id == params[1] && c.product_id == params[2]);
            if (item) item.quantity += params[0];
            saveData(data);
            return { changes: 1 };
        }
        if (q.includes('insert into watchlist')) {
            data.watchlist.push({ id: Date.now(), user_id: params[0], product_id: params[1], added_at: new Date().toISOString() });
            saveData(data);
            return { lastInsertRowid: Date.now() };
        }
        if (q.includes('insert into orders')) {
            const newOrder = { id: Date.now(), user_id: params[0], total_amount: params[1], shipping_name: params[2], shipping_phone: params[3], shipping_address: params[4], payment_method: params[5], note: params[6], status: 'pending', created_at: new Date().toISOString() };
            data.orders.push(newOrder);
            saveData(data);
            return { lastInsertRowid: newOrder.id };
        }
        if (q.includes('insert into order_items')) {
            const newItem = { id: Date.now(), order_id: params[0], product_id: params[1], quantity: params[2], price: params[3] };
            data.order_items.push(newItem);
            saveData(data);
            return { lastInsertRowid: newItem.id };
        }
        if (q.includes('update products set stock')) {
            const p = data.products.find(prod => prod.id == params[1]);
            if (p) p.stock = Math.max(0, p.stock - params[0]);
            saveData(data);
            return { changes: p ? 1 : 0 };
        }
        if (q.includes('update products set title')) {
            const p = data.products.find(prod => prod.id == params[16]);
            if (p) {
                p.title = params[0]; p.price = params[1]; p.original_price = params[2];
                p.category = params[3]; p.brand = params[4]; p.description = params[5];
                p.stock = params[6]; p.is_flash_sale = params[7]; p.discount_percent = params[8];
                p.main_image = params[9]; p.images_json = params[10]; p.sku = params[11];
                p.movement = params[12]; p.glass_type = params[13]; p.water_resistance = params[14];
                p.strap_material = params[15];
                saveData(data);
            }
            return { changes: p ? 1 : 0 };
        }
        if (q.includes('delete from products where id = ?')) {
            const initialLen = data.products.length;
            data.products = data.products.filter(prod => prod.id != params[0]);
            if (data.products.length !== initialLen) saveData(data);
            return { changes: initialLen !== data.products.length ? 1 : 0 };
        }
        if (q.includes('delete from cart where user_id = ?')) {
            data.cart = data.cart.filter(c => c.user_id != params[0]);
            saveData(data);
            return { changes: 1 };
        }
        if (q.includes('delete from cart where id = ?')) {
            data.cart = data.cart.filter(c => c.id != params[0]);
            saveData(data);
            return { changes: 1 };
        }
        if (q.includes('update users set google_id = ? where id = ?')) {
            const user = data.users.find(u => u.id == params[1]);
            if (user) {
                user.google_id = params[0];
                saveData(data);
            }
            return { changes: user ? 1 : 0 };
        }
        if (q.includes('update users set role = ? where id = ?')) {
            const user = data.users.find(u => u.id == params[1]);
            if (user) {
                user.role = params[0];
                saveData(data);
            }
            return { changes: user ? 1 : 0 };
        }
        if (q.includes('update users set is_blocked = ? where id = ?')) {
            const user = data.users.find(u => u.id == params[1]);
            if (user) {
                user.is_blocked = params[0];
                saveData(data);
            }
            return { changes: user ? 1 : 0 };
        }
        if (q.includes('delete from users where id = ?')) {
            const initialLen = data.users.length;
            data.users = data.users.filter(u => u.id != params[0]);
            if (data.users.length !== initialLen) saveData(data);
            return { changes: initialLen !== data.users.length ? 1 : 0 };
        }
        if (q.includes('insert into messages')) {
            const newMessage = { id: Date.now(), name: params[0], email: params[1], subject: params[2], message: params[3], read_status: 0, created_at: new Date().toISOString() };
            if (!data.messages) data.messages = [];
            data.messages.push(newMessage);
            saveData(data);
            return { lastInsertRowid: newMessage.id };
        }
        if (q.includes('update messages set read_status')) {
            const msg = data.messages.find(m => m.id == params[1]);
            if (msg) {
                msg.read_status = params[0];
                saveData(data);
            }
            return { changes: msg ? 1 : 0 };
        }
        if (q.includes('update orders set status = ? where id = ?')) {
            const order = data.orders.find(o => o.id == params[1]);
            if (order) {
                order.status = params[0];
                saveData(data);
            }
            return { changes: order ? 1 : 0 };
        }
        return { changes: 1, lastInsertRowid: Date.now() };
      }
    };
  },
  exec: () => {},
  transaction: (fn) => (...args) => fn(...args),
  pragma: () => {}
};

module.exports = db;
