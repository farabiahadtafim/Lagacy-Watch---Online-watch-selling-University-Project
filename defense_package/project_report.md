# Legacy Watches — Comprehensive Project Report

**University Project Defense Submission**
**Course:** Web Development / Full-Stack Engineering
**Date:** June 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement & Motivation](#2-problem-statement--motivation)
3. [Project Objectives](#3-project-objectives)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Database Design](#6-database-design)
7. [Frontend Implementation](#7-frontend-implementation)
8. [Backend Implementation](#8-backend-implementation)
9. [Authentication & Security](#9-authentication--security)
10. [Key Features Walkthrough](#10-key-features-walkthrough)
11. [Design System & UI/UX](#11-design-system--uiux)
12. [Testing & Quality Assurance](#12-testing--quality-assurance)
13. [Challenges & Solutions](#13-challenges--solutions)
14. [Future Enhancements](#14-future-enhancements)
15. [Conclusion](#15-conclusion)

---

## 1. Executive Summary

Legacy Watches is a full-stack e-commerce web application built for the premium watch retail market in Bangladesh. The platform provides a sophisticated, luxury-oriented shopping experience where customers can browse, search, and purchase watches from five major brands — Naviforce, Curren, Poedagar, Casio, and Skmei — across three product categories: Men's Watches, Women's Watches, and Luxury Straps (Belts).

The application was developed using a modern, decoupled architecture: a **Next.js 16 frontend** with App Router and Tailwind CSS 4 for the user interface, and an **Express.js backend** serving a RESTful API with JWT-based authentication. The system supports 43 seeded products, user registration and authentication (including Google OAuth), a full shopping cart and checkout workflow, watchlist management, order tracking, admin dashboard analytics, and a flash sale mechanism.

The project demonstrates proficiency in full-stack JavaScript development, RESTful API design, state management with React Context, responsive UI design, and secure authentication practices.

---

## 2. Problem Statement & Motivation

### 2.1 The Problem

The traditional watch retail experience in Bangladesh suffers from several limitations:

- **Limited Accessibility:** Physical stores restrict customers to geographic proximity and operating hours.
- **Narrow Selection:** Brick-and-mortar retailers can only stock a fraction of available models due to shelf-space constraints.
- **Price Opacity:** Customers often lack the ability to compare prices across brands and models efficiently.
- **No Persistent Shopping Experience:** Without digital accounts, customers cannot save items for later, track order history, or receive personalized recommendations.

### 2.2 The Opportunity

The Bangladeshi e-commerce market has grown exponentially, yet the premium watch segment remains underserved online. Legacy Watches addresses this gap by providing:

- A curated, luxury-brand-appropriate digital storefront
- Transparent pricing with discount visibility
- Persistent user accounts with cart, watchlist, and order history
- Administrative tools for inventory and order management

### 2.3 Academic Motivation

This project was undertaken to demonstrate mastery of:

- Full-stack web application architecture and development
- RESTful API design and implementation
- State management patterns in React
- Authentication and authorization workflows
- Responsive, accessible UI/UX design
- Database design and data modeling

---

## 3. Project Objectives

### Primary Objectives

| Objective | Status |
|-----------|--------|
| Build a responsive e-commerce website for watch retail | ✅ Complete |
| Implement user registration, login, and Google OAuth | ✅ Complete |
| Create a product catalog with filtering, search, and pagination | ✅ Complete |
| Develop a shopping cart with persistent storage | ✅ Complete |
| Implement a checkout and order placement workflow | ✅ Complete |
| Build a watchlist (favorites) feature | ✅ Complete |
| Create an admin dashboard with analytics | ✅ Complete |
| Implement flash sale functionality with countdown timer | ✅ Complete |
| Design a luxury aesthetic appropriate for premium watches | ✅ Complete |

### Secondary Objectives

| Objective | Status |
|-----------|--------|
| Google OAuth social login integration | ✅ Complete |
| Customer reviews and ratings system | ✅ Complete |
| Order status tracking (6-stage workflow) | ✅ Complete |
| Product image gallery with thumbnails | ✅ Complete |
| Category-specific shop pages | ✅ Complete |
| About Us and Contact Us informational pages | ✅ Complete |
| Mobile-responsive design across all pages | ✅ Complete |

---

## 4. Technology Stack

### 4.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.2.4 | React framework with App Router for server-side rendering and routing |
| **React** | 19.2.4 | UI component library |
| **TypeScript** | 5 | Type-safe development (layout, config, API layer) |
| **Tailwind CSS** | 4 | Utility-first CSS framework with custom theme |
| **Axios** | Latest | Promise-based HTTP client for API communication |
| **Lucide React** | Latest | Icon library (900+ SVG icons) |
| **Swiper.js** | Latest | Touch-enabled carousel for watch explorer |
| **react-hot-toast** | Latest | Toast notification system |
| **@react-oauth/google** | Latest | Google OAuth 2.0 client-side integration |

### 4.2 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express.js** | Latest | Web framework for REST API |
| **jsonwebtoken** | Latest | JWT creation and verification |
| **bcryptjs** | Latest | Password hashing (10 salt rounds) |
| **multer** | Latest | Multipart/form-data file upload handling |
| **cors** | Latest | Cross-Origin Resource Sharing middleware |
| **google-auth-library** | Latest | Google ID token verification |

### 4.3 Database

| Component | Description |
|-----------|-------------|
| **Custom JSON Adapter** | In-memory JSON database with SQL-like query interface |
| **db.json** | Single-file persistent storage (783 lines, 43 products, 7 users, 10 reviews) |

### 4.4 Development Tools

| Tool | Purpose |
|------|---------|
| **nodemon** | Auto-restart backend on file changes |
| **ESLint** | Code quality and linting |
| **PostCSS** | CSS processing for Tailwind |

---

## 5. System Architecture

### 5.1 Architectural Pattern

The project follows a **decoupled 3-tier architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  Next.js 16 (App Router) + React 19 + Tailwind CSS 4        │
│  Port: 3000                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │  Server  │ │  Client  │ │  React   │ │  Axios HTTP   │  │
│  │Components│ │Components│ │ Context  │ │    Client     │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/JSON (REST)
                           │ CORS: localhost:3000, :3001
┌──────────────────────────┴──────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                      │
│  Express.js + Node.js                                        │
│  Port: 5001                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │   JWT    │ │  Admin   │ │  Multer  │ │  6 Route      │  │
│  │Middleware │ │Middleware │ │ Uploads  │ │  Modules      │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Static File Server (Product Images)         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Custom JSON Database Adapter (db.js)          │   │
│  │  Parses SQL strings → operates on JSON arrays         │   │
│  │  Supports: prepare(), get(), all(), run(), exec()     │   │
│  └──────────────────────────┬───────────────────────────┘   │
│                             │                                │
│  ┌──────────────────────────┴───────────────────────────┐   │
│  │                    db.json (Flat File)                 │   │
│  │  6 Collections: users, products, orders, cart,        │   │
│  │  watchlist, reviews                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Communication Flow

1. **Browser** sends HTTP requests to the Next.js frontend (port 3000)
2. **Client components** make API calls via Axios to the Express backend (port 5001)
3. **Express middleware** authenticates requests using JWT tokens
4. **Route handlers** process business logic and query the JSON database
5. **JSON database adapter** reads/writes to [`db.json`](backend/database/db.json)
6. **Static files** (product images) are served directly by Express from the `Legacy watches Web Images` directory

### 5.3 Route Groups

The Next.js App Router uses three route groups for logical separation:

- **`(auth)/`** — Login and Register pages (no Navbar/Footer)
- **`(user)/`** — All customer-facing pages (with Navbar/Footer)
- **`/admin`** — Admin dashboard pages (dark theme, sidebar navigation)

---

## 6. Database Design

### 6.1 Database Architecture

The database is implemented as a **custom JSON-based adapter** in [`db.js`](backend/database/db.js:23). This was a deliberate design choice for rapid prototyping:

- All data is stored in a single [`db.json`](backend/database/db.json) file
- The adapter parses SQL-like query strings to determine the operation type
- It operates on in-memory JavaScript arrays and persists changes to disk
- The API mimics the `better-sqlite3` interface (`prepare`, `get`, `all`, `run`, `exec`, `transaction`)

**Note:** While the `package.json` lists `sqlite3` and `better-sqlite3` as dependencies, they are not actually used. The system uses a pure JSON file database.

### 6.2 Entity Schema

#### Users Collection

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | integer | PK, Auto-increment | Unique user identifier |
| `name` | string | Required | Full name |
| `email` | string | Required, Unique | Email address for login |
| `password` | string | Required | bcrypt hash (10 salt rounds) |
| `phone` | string | Optional | Contact phone number |
| `google_id` | string | Optional, Unique | Google OAuth identifier |
| `role` | string | Default: "user" | "admin" or "user" |
| `created_at` | string | Auto-set | ISO 8601 datetime |

**Seeded Users:**
- **Admin:** `admin@legacywatches.com` / `admin123` (role: admin)
- **6 demo users** with role: user

#### Products Collection

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | PK, Auto-increment |
| `title` | string | Product display name |
| `slug` | string | URL-friendly identifier |
| `price` | integer | Current selling price (BDT) |
| `original_price` | integer | Original MRP (BDT) |
| `discount_percent` | integer | Calculated discount percentage |
| `category` | string | "men", "women", or "belts" |
| `brand` | string | Brand name |
| `stock` | integer | Available inventory count |
| `description` | string | Rich text product description |
| `is_flash_sale` | integer | 0 (no) or 1 (yes) |
| `main_image` | string | Relative path to main image |
| `images_json` | string | JSON array of additional image paths |
| `created_at` | string | ISO 8601 datetime |

**Product Distribution:**
| Category | Count | Brands |
|----------|-------|--------|
| Men | 27 | Naviforce, Curren, Poedagar, Casio, Skmei |
| Women | 13 | Naviforce, Curren, Casio, Skmei, Valdus |
| Belts | 3 | Naviforce, Curren |
| Flash Sale | 4 | Naviforce, Curren, Casio, Skmei |

#### Orders Collection

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | PK, Auto-increment |
| `user_id` | integer | FK to users.id |
| `total_amount` | integer | Grand total in BDT |
| `shipping_name` | string | Recipient name |
| `shipping_phone` | string | Contact number |
| `shipping_address` | string | Delivery address |
| `payment_method` | string | "cod" or "online" |
| `status` | string | Order status (see below) |
| `note` | string | Optional delivery instructions |
| `items_json` | string | JSON array of order items |
| `created_at` | string | ISO 8601 datetime |

**Order Status Workflow:**
```
pending → confirmed → processing → shipped → delivered
                                           ↘ cancelled
```

#### Cart Items Collection

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | PK, Auto-increment |
| `user_id` | integer | FK to users.id |
| `product_id` | integer | FK to products.id |
| `quantity` | integer | Quantity in cart |

#### Watchlist Items Collection

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | PK, Auto-increment |
| `user_id` | integer | FK to users.id |
| `product_id` | integer | FK to products.id |
| `added_at` | string | ISO 8601 datetime |

#### Reviews Collection

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | PK, Auto-increment |
| `product_id` | integer | FK to products.id (nullable) |
| `user_id` | integer | FK to users.id (nullable for guest) |
| `user_name` | string | Reviewer display name |
| `rating` | integer | Rating 1-5 |
| `comment` | string | Review text |
| `created_at` | string | ISO 8601 datetime |

### 6.3 Entity Relationships

```
USERS ──1:N──→ ORDERS          (user_id FK)
USERS ──1:N──→ CART_ITEMS      (user_id FK)
USERS ──1:N──→ WATCHLIST_ITEMS (user_id FK)
USERS ──1:N──→ REVIEWS         (user_id FK, nullable)

PRODUCTS ──1:N──→ CART_ITEMS      (product_id FK)
PRODUCTS ──1:N──→ WATCHLIST_ITEMS (product_id FK)
PRODUCTS ──1:N──→ REVIEWS         (product_id FK, nullable)

ORDERS ──1:N──→ ORDER_ITEMS    (stored as JSON in items_json)
PRODUCTS ──1:N──→ ORDER_ITEMS  (product_id within items_json)
```

---

## 7. Frontend Implementation

### 7.1 Page Architecture

The application uses Next.js 16 App Router with the following route structure:

```
app/
├── layout.tsx                    # Root layout (fonts, AppWrapper, Toaster)
├── page.tsx                      # Homepage (Server Component)
├── globals.css                   # Global styles + Tailwind theme
├── (auth)/                       # Auth route group (no Navbar/Footer)
│   ├── login/page.jsx            # Login with email/password
│   └── register/page.jsx         # Registration form
├── (user)/                       # User route group (with Navbar/Footer)
│   ├── shop/page.jsx             # Product catalog with filters
│   ├── shop/[category]/page.jsx  # Category-specific shop
│   ├── product/[id]/page.jsx     # Product detail + reviews
│   ├── cart/page.jsx             # Shopping cart
│   ├── checkout/page.jsx         # Shipping form + order review
│   ├── watchlist/page.jsx        # Saved items
│   ├── profile/page.jsx          # User profile + order history
│   ├── reviews/page.jsx          # All customer reviews
│   ├── flash-sale/page.jsx       # Flash sale with countdown
│   ├── about-us/page.jsx         # About page
│   └── contact-us/page.jsx       # Contact page with form
└── admin/                        # Admin route group
    ├── page.jsx                  # Dashboard with stats
    ├── products/page.jsx         # Product management table
    └── orders/page.jsx           # Order fulfillment
```

### 7.2 Component Architecture

#### Reusable Components

| Component | File | Type | Description |
|-----------|------|------|-------------|
| **Navbar** | [`Navbar.jsx`](frontend/components/Navbar.jsx:10) | Client | Fixed navigation with glass effect, MegaMenu, user dropdown, cart badge |
| **HeroBanner** | [`HeroBanner.jsx`](frontend/components/HeroBanner.jsx:5) | Client | Full-screen video hero with CTA |
| **WatchExplorer** | [`WatchExplorer.jsx`](frontend/components/WatchExplorer.jsx:14) | Client | Swiper carousel with 17 TUDOR watch models |
| **ProductCard** | [`ProductCard.jsx`](frontend/components/ProductCard.jsx:8) | Client | Product card with hover effects, quick actions |
| **Footer** | [`Footer.jsx`](frontend/components/Footer.jsx:5) | Client | 4-column footer with links, social, payment icons |
| **AuthModal** | [`AuthModal.jsx`](frontend/components/AuthModal.jsx:11) | Client | Login/Register modal with Google OAuth |
| **InfoLayout** | [`InfoLayout.jsx`](frontend/components/InfoLayout.jsx:5) | Client | Layout wrapper for info pages (About, Contact) |

#### Library Modules

| Module | File | Description |
|--------|------|-------------|
| **api.js** | [`api.js`](frontend/lib/api.js:21) | Axios instance with JWT interceptor, API helper objects, imgUrl utility |
| **context.js** | [`context.js`](frontend/lib/context.js:7) | React Context providing global state: user, cart, watchlist, loading |
| **AppWrapper.jsx** | [`AppWrapper.jsx`](frontend/lib/AppWrapper.jsx:7) | GoogleOAuthProvider + AppProvider wrapper |

### 7.3 State Management

The application uses **React Context API** for global state management:

```javascript
// Context provides:
{
  user,           // Current user object (null if logged out)
  cart,           // Cart items array
  watchlist,      // Watchlist items array
  loading,        // Loading state
  cartCount,      // Computed: total items in cart
  cartTotal,      // Computed: total price
  
  // Actions:
  login(token, userData),
  logout(),
  addToCart(product_id, quantity),
  removeFromCart(id),
  updateCartQty(id, quantity),
  clearCart(),
  addToWatchlist(product_id),
  removeFromWatchlist(product_id)
}
```

**Persistence Strategy:**
- JWT token stored in `localStorage` under key `token`
- User data stored in `localStorage` under key `user`
- Axios interceptor automatically attaches the token to all requests
- On app load, the context checks for existing token and restores session

### 7.4 API Integration

The [`api.js`](frontend/lib/api.js) module exports structured API helper objects:

```javascript
authAPI:     { login, register, googleLogin }
productsAPI: { list, getById, getBySlug }
cartAPI:     { get, add, update, remove, clear }
watchlistAPI:{ get, add, remove, check }
ordersAPI:   { place, getMy, getAll, updateStatus }
reviewsAPI:  { list, add, addGuest }
adminAPI:    { getStats, getUsers }
```

Each helper is a thin wrapper around the Axios instance, which has `baseURL: 'http://localhost:5001/api'` and automatically attaches the JWT token.

---

## 8. Backend Implementation

### 8.1 Server Architecture

The Express server ([`server.js`](backend/server.js)) is structured as follows:

```javascript
// Core Setup
const app = express();
app.use(cors({ origin: ['localhost:3000', 'localhost:3001'], credentials: true }));
app.use(express.json());
app.use('/product-images', express.static(imagesPath));

// Health Check
app.get('/api/health', (req, res) => { ... });

// Route Modules
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/watchlist', require('./routes/watchlist'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));

// Admin Endpoints (inline)
app.get('/api/admin/stats', [auth, admin], ...);
app.get('/api/admin/users', [auth, admin], ...);

// Auto-seed on startup
app.listen(PORT, () => { seedIfEmpty(); });
```

### 8.2 Route Modules

| Route File | Endpoints | Auth Required | Admin Only |
|------------|-----------|---------------|------------|
| [`auth.js`](backend/routes/auth.js) | POST register, POST login, POST google | No | No |
| [`products.js`](backend/routes/products.js) | GET /, GET /:slug, POST /, PUT /:id, DELETE /:id | POST/PUT/DELETE | POST/PUT/DELETE |
| [`cart.js`](backend/routes/cart.js) | GET /, POST /, PUT /:id, DELETE /:id, DELETE / | Yes | No |
| [`watchlist.js`](backend/routes/watchlist.js) | GET /, POST /, DELETE /:product_id, GET /check/:product_id | Yes | No |
| [`orders.js`](backend/routes/orders.js) | POST /, GET /my, GET /admin/all, PUT /:id/status | Yes (all) | admin/all + status |
| [`reviews.js`](backend/routes/reviews.js) | GET /, POST /, POST /guest | POST only | No |

### 8.3 Middleware Stack

#### JWT Authentication Middleware ([`auth.js`](backend/middleware/auth.js))

```javascript
// 1. Extracts Bearer token from Authorization header
// 2. Verifies token with secret: 'legacy_watches_secret_2024'
// 3. Attaches decoded user { id, email, role } to req.user
// 4. Returns 401 if token is missing or invalid
```

#### Admin Middleware ([`admin.js`](backend/middleware/admin.js))

```javascript
// 1. Checks req.user.role === 'admin'
// 2. Returns 403 if user is not admin
// 3. Calls next() if admin
```

### 8.4 Database Seeding

The [`seed.js`](backend/database/seed.js) module is automatically invoked on server startup if the database is empty:

1. Creates admin user: `admin@legacywatches.com` / `admin123`
2. Seeds 43 products across 5 brands and 3 categories
3. Seeds 10 initial reviews (all with `product_id: null`)

---

## 9. Authentication & Security

### 9.1 Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     REGISTRATION FLOW                        │
│                                                              │
│  User → Register Form → POST /api/auth/register              │
│  → bcrypt.hash(password, 10) → Store in JSON DB              │
│  → jwt.sign({id, email, role}) → Return { token, user }      │
│  → Frontend stores token in localStorage                     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                       LOGIN FLOW                             │
│                                                              │
│  User → Login Form → POST /api/auth/login                    │
│  → Find user by email in JSON DB                             │
│  → bcrypt.compare(password, hash) → Verify                   │
│  → jwt.sign({id, email, role}) → Return { token, user }      │
│  → Frontend stores token in localStorage                     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   GOOGLE OAUTH FLOW                          │
│                                                              │
│  User → Google Login Button → Google OAuth Consent           │
│  → @react-oauth/google returns credential token              │
│  → POST /api/auth/google { credential }                      │
│  → Verify with google-auth-library (or mock fallback)        │
│  → Find or create user → Return JWT token                    │
│  → Frontend stores token in localStorage                     │
└──────────────────────────────────────────────────────────────┘
```

### 9.2 Security Measures

| Measure | Implementation |
|---------|---------------|
| **Password Hashing** | bcryptjs with 10 salt rounds |
| **JWT Tokens** | Signed with secret key, no expiry |
| **Protected Routes** | auth middleware verifies JWT on every request |
| **Role-Based Access** | admin middleware checks role for admin-only endpoints |
| **CORS** | Restricted to localhost:3000 and localhost:3001 |
| **Input Validation** | Basic validation on all endpoints (required fields, formats) |
| **Google Token Verification** | Server-side verification of Google ID tokens |

### 9.3 Known Security Limitations (Academic Context)

- JWT tokens do not expire (no refresh token mechanism)
- No rate limiting on login attempts
- No input sanitization beyond basic validation
- No HTTPS (development environment)
- Google OAuth has a mock fallback for development

---

## 10. Key Features Walkthrough

### 10.1 Homepage

The homepage ([`page.tsx`](frontend/app/page.tsx:20)) is a **Server Component** that fetches data at build/request time:

1. **Hero Banner** — Full-screen auto-playing muted video loop with "NEW LEGACY WATCHES FOR 2026" heading
2. **Watch Explorer** — Swiper.js carousel featuring 17 TUDOR watch models with cover images and overlapping watch renders
3. **Trust Badges** — Three feature cards: Boutique Delivery, Certified Warranty, Elite Exchange
4. **Category Cards** — Three large cards: Gentlemen's (men), Ladies' Choice (women), Luxury Straps (belts)
5. **Best Sellers** — Grid of 8 featured products using ProductCard component
6. **Editorial Section** — Lifestyle section with TUDOR branding

### 10.2 Shop & Product Filtering

The shop page ([`shop/page.jsx`](frontend/app/(user)/shop/page.jsx:16)) provides:

- **Sidebar Filters:**
  - Category radio buttons (Men, Women, Belts)
  - Price range slider
  - Brand checkboxes (Naviforce, Curren, Poedagar, Casio, Skmei)
- **Sort Dropdown:** Newest First, Price Low-High, Price High-Low, Best Selling
- **Product Grid:** 3-column responsive layout
- **Empty State:** Friendly message when no products match filters

The category page ([`shop/[category]/page.jsx`](frontend/app/(user)/shop/[category]/page.jsx:1)) delegates to the same ShopPage component with a pre-set category filter.

### 10.3 Product Detail Page

The product detail page ([`product/[id]/page.jsx`](frontend/app/(user)/product/[id]/page.jsx:10)) features:

- **Image Gallery:** Main image with thumbnail strip navigation
- **Product Info:** Title, brand, price (current + original with discount), description
- **Quantity Selector:** Increment/decrement controls
- **Add to Cart:** Prominent CTA button
- **Benefits Section:** Boutique Delivery, Certified Warranty, Elite Exchange
- **Reviews Grid:** Customer reviews with star ratings, avatars, and dates
- **Flash Sale Badge:** Red badge for flash sale products

### 10.4 Shopping Cart

The cart page ([`cart/page.jsx`](frontend/app/(user)/cart/page.jsx:10)) provides:

- **Item List:** Product image, title, unit price, quantity controls (increment/decrement), remove button
- **Order Summary:** Subtotal, free shipping indicator, grand total
- **Proceed to Checkout:** CTA button linking to checkout
- **Empty State:** Friendly message with "Start Shopping" link

### 10.5 Checkout

The checkout page ([`checkout/page.jsx`](frontend/app/(user)/checkout/page.jsx:10)) implements:

- **Shipping Form:** Full name, phone number, complete address, optional order note
- **Pre-filled Data:** Auto-populates name and phone from saved user data
- **Payment Method:** Cash on Delivery (selected), Online Payment (disabled, "Coming Soon")
- **Order Review:** Sidebar with all items, quantities, subtotal, shipping, grand total
- **Place Order:** CTA button showing total amount
- **Post-Order:** Redirects to profile with order_id parameter

### 10.6 Watchlist

The watchlist page ([`watchlist/page.jsx`](frontend/app/(user)/watchlist/page.jsx:10)) shows:

- **Product Grid:** 4-column responsive layout of saved items
- **Quick Actions:** Add to Cart button, Remove from Watchlist button
- **Hover Effects:** Image zoom on hover, gold border highlight
- **Price Display:** Current price with original price strikethrough for discounted items

### 10.7 User Profile & Order History

The profile page ([`profile/page.jsx`](frontend/app/(user)/profile/page.jsx:11)) provides:

- **Sidebar:** User avatar, name, email, navigation (My Orders, Account Info, Settings, Logout)
- **Order History:** Cards showing order ID, status badge, date, total amount
- **Order Items:** Thumbnails, titles, prices, quantities for each order
- **Status Badges:** Color-coded badges (yellow=pending, blue=confirmed, purple=shipped, green=delivered, red=cancelled)
- **Payment Method:** Displayed in order footer
- **Auth Guard:** Redirects to login if not authenticated

### 10.8 Flash Sale

The flash sale page ([`flash-sale/page.jsx`](frontend/app/(user)/flash-sale/page.jsx:9)) features:

- **Countdown Timer:** Hours, Minutes, Seconds display with real-time updates
- **Red-themed Header:** "Limited Time Offer" badge, "Flash Sale" heading
- **Product Grid:** 4-column layout of flash sale products
- **Timer Expiry:** Timer stops at 00:00:00

### 10.9 Admin Dashboard

The admin dashboard ([`admin/page.jsx`](frontend/app/admin/page.jsx:8)) provides:

- **Dark Theme Sidebar:** Navigation with Dashboard, Products, Orders links
- **4 Stat Cards:** Total Revenue (BDT), Total Orders, Total Products, Total Users
- **Recent Orders Table:** Order ID, customer, amount, status badge, date
- **Auth Guard:** Redirects non-admin users

### 10.10 Admin Product Management

The products management page ([`admin/products/page.jsx`](frontend/app/admin/products/page.jsx:8)) provides:

- **Search:** Filter by product name or brand
- **Category Filter:** Dropdown for Men/Women/Belts
- **Data Table:** Product image, title, brand, category, price, stock, status (Active/Flash Sale)
- **Actions:** Edit, Delete (with confirmation), View (external link)
- **Low Stock Warning:** Red text for stock < 5

### 10.11 Admin Order Fulfillment

The orders management page ([`admin/orders/page.jsx`](frontend/app/admin/orders/page.jsx:8)) provides:

- **Data Table:** Order ID, customer name/email, amount, status badge, date
- **Status Actions:** Confirm, Ship, Deliver, Cancel — each with color-coded icon buttons
- **Real-time Updates:** Status changes reflected immediately via toast notification

### 10.12 Auth Modal

The auth modal ([`AuthModal.jsx`](frontend/components/AuthModal.jsx:11)) is a reusable overlay component:

- **Toggle:** Switch between Login and Register forms
- **Login Form:** Email, password, submit button
- **Register Form:** Name, email, password, phone, submit button
- **Google OAuth:** Google login button (real + mock fallback)
- **Password Toggle:** Show/hide password visibility
- **Error Handling:** Display API error messages

### 10.13 Navigation & MegaMenu

The navbar ([`Navbar.jsx`](frontend/components/Navbar.jsx:172)) features:

- **Glass Effect:** Semi-transparent background with backdrop blur
- **Scroll Detection:** Background becomes solid on scroll
- **MegaMenu:** Full-width dropdown with tabs (WATCHES, INSIDE TUDOR, OUR WORLD, TUDOR CARE, COMPANY)
- **Watch Cards:** Horizontally scrollable watch cards with images
- **Action Buttons:** Explore, Configure, Compare
- **User Dropdown:** Profile, Orders, Admin (if admin), Logout
- **Cart Icon:** Badge showing item count
- **Auth Modal Trigger:** Opens login/register modal

---

## 11. Design System & UI/UX

### 11.1 Visual Identity

The design draws inspiration from the TUDOR watches brand, adapting its luxury aesthetic:

- **Color Palette:**
  - Primary Gold: `#b38b2d` (accent, CTAs, highlights)
  - Gold Light: `#d4af37` (gradients, hover states)
  - Dark Background: `#050508` (dark sections)
  - Dark Lighter: `#0a0a0f` (cards, surfaces)
  - White: For text and light-mode sections

- **Typography:**
  - **Playfair Display:** Headings, brand text, luxury elements (serif)
  - **Inter:** Body text, navigation, UI elements (sans-serif)

- **Design Language:**
  - Glass morphism effects (`backdrop-blur` + semi-transparent backgrounds)
  - Gold gradient buttons and accents
  - Large, bold typography with generous whitespace
  - Rounded corners (2xl, 3xl) for cards and containers
  - Subtle hover animations and transitions

### 11.2 Custom CSS Classes

Defined in [`globals.css`](frontend/app/globals.css):

```css
.container-custom    → Max-width container with padding
.glass               → Glass morphism effect (bg-white/5 + backdrop-blur-xl)
.glass-dark          → Darker glass variant
.btn-primary         → Gold gradient button with hover scale
.btn-outline         → Outlined button with gold border
.section-padding     → Consistent vertical section spacing
```

### 11.3 Animations

| Animation | Keyframes | Usage |
|-----------|-----------|-------|
| `fadeIn` | opacity 0→1, translateY 20px→0 | Page sections on load |
| `slideUp` | opacity 0→1, translateY 40px→0 | Hero content |
| `slide` | translateX infinite scroll | Marquee/text scroll effects |

### 11.4 Responsive Design

The application uses Tailwind's responsive breakpoints:

- **Mobile:** Single column, stacked layouts
- **Tablet (md):** 2-column grids
- **Desktop (lg):** 3-4 column grids, sidebar layouts
- **Wide (xl):** 4-column product grids

All pages are fully responsive, including the admin dashboard, navigation, and product galleries.

---

## 12. Testing & Quality Assurance

### 12.1 Manual Testing Coverage

| Feature Area | Test Cases |
|-------------|------------|
| User Registration | Valid/invalid inputs, duplicate email, success flow |
| User Login | Valid/invalid credentials, admin vs user redirect |
| Google OAuth | Token flow, mock fallback, new user creation |
| Product Browsing | Category filters, brand filters, search, pagination |
| Cart Operations | Add, update quantity, remove, clear, empty cart state |
| Checkout | Form validation, order placement, stock reduction |
| Watchlist | Add, remove, check status, empty state |
| Order Tracking | Status progression, admin status updates |
| Admin Dashboard | Stats accuracy, access control |
| Responsive Design | All pages at mobile, tablet, desktop breakpoints |

### 12.2 Error Handling

- **API Errors:** Caught in try/catch blocks, displayed via react-hot-toast
- **Auth Errors:** 401 responses redirect to login page
- **Admin Access:** 403 responses handled gracefully
- **Empty States:** Friendly messages with CTA buttons for empty cart, watchlist, orders, and search results
- **Loading States:** Spinner/loading text shown during data fetching
- **Network Errors:** Console-logged with user-friendly toast messages

---

## 13. Challenges & Solutions

### 13.1 Challenge: JSON Database Limitations

**Problem:** Using a flat JSON file as a database meant no native SQL query support, no transactions, and no referential integrity.

**Solution:** Built a custom database adapter ([`db.js`](backend/database/db.js)) that:
- Parses SQL-like query strings to determine operation type (SELECT, INSERT, UPDATE, DELETE)
- Manually implements JOINs by iterating and matching arrays
- Provides transaction support via copy-on-write pattern
- Mimics the `better-sqlite3` API for developer familiarity

### 13.2 Challenge: State Synchronization

**Problem:** Cart and watchlist state needed to stay synchronized between the React Context and the backend database.

**Solution:** Every context action (addToCart, removeFromCart, etc.) makes an API call first, then updates local state on success. The context fetches cart and watchlist data on initial load, ensuring the UI reflects the server state.

### 13.3 Challenge: Image Handling

**Problem:** Product images are stored in a separate directory (`Legacy watches Web Images`) with nested folder structures and inconsistent naming.

**Solution:**
- Express serves static files from the images directory at `/product-images`
- Product records store relative paths
- Frontend uses the [`imgUrl()`](frontend/lib/api.js:76) helper to construct full URLs
- Images are served with proper CORS headers

### 13.4 Challenge: Mixed Server/Client Components

**Problem:** Next.js App Router requires careful separation of Server and Client Components. The homepage uses Server Components for data fetching, while interactive pages use Client Components.

**Solution:**
- Homepage ([`page.tsx`](frontend/app/page.tsx:20)): Server Component that fetches data via async functions
- Shop page ([`shop/page.jsx`](frontend/app/(user)/shop/page.jsx:16)): Server Component with async searchParams
- Interactive pages: Client Components with useEffect/useState for data fetching
- `"use client"` directive used only where browser APIs (useState, useEffect, localStorage) are needed

### 13.5 Challenge: Google OAuth Integration

**Problem:** Google OAuth requires both client-side and server-side verification, with proper handling of the ID token.

**Solution:**
- Client-side: `@react-oauth/google` provides the Google login button and credential response
- Server-side: `google-auth-library` verifies the ID token (with mock fallback for development)
- New users are auto-created with a `google_id` field
- Existing users are matched by `google_id` or email

---

## 14. Future Enhancements

### 14.1 High Priority

| Enhancement | Description |
|-------------|-------------|
| **Real Payment Gateway** | Integrate SSLCommerz or Stripe for online payments instead of COD-only |
| **PostgreSQL Migration** | Replace JSON database with a proper relational database for production |
| **JWT Token Expiry** | Implement token refresh mechanism with proper expiry |
| **Rate Limiting** | Add rate limiting on auth endpoints to prevent brute force attacks |
| **Input Sanitization** | Add comprehensive input validation and sanitization |

### 14.2 Medium Priority

| Enhancement | Description |
|-------------|-------------|
| **Email Notifications** | Send order confirmation, shipping updates, and promotional emails |
| **Product Search** | Implement full-text search across product titles and descriptions |
| **Wishlist Sharing** | Allow users to share their watchlist via link |
| **Product Comparison** | Side-by-side comparison of watch specifications |
| **Pagination** | Implement server-side pagination for large product catalogs |

### 14.3 Low Priority

| Enhancement | Description |
|-------------|-------------|
| **Dark/Light Mode Toggle** | User-preference-based theme switching |
| **Multi-language Support** | Bangla and English language options |
| **Product Recommendations** | "You might also like" based on browsing history |
| **Analytics Dashboard** | Sales trends, popular products, user demographics |
| **PWA Support** | Progressive Web App for mobile installation |

---

## 15. Conclusion

Legacy Watches successfully demonstrates the design and implementation of a full-stack e-commerce platform. The project achieves all primary objectives:

- ✅ A responsive, luxury-oriented user interface built with Next.js and Tailwind CSS
- ✅ A RESTful API backend with JWT authentication and role-based access control
- ✅ Complete shopping workflow: browse → cart → checkout → order tracking
- ✅ Admin dashboard with analytics, product management, and order fulfillment
- ✅ Social login via Google OAuth
- ✅ Flash sale mechanism with real-time countdown
- ✅ Customer reviews and ratings system

The project showcases proficiency in modern web development technologies and architectural patterns. It serves as a solid foundation that can be extended with payment gateway integration, a production-grade database, and additional features for a real-world deployment.

---

## Appendix A: Seeded Data Summary

### Users

| ID | Name | Email | Role |
|----|------|-------|------|
| 1 | Admin | admin@legacywatches.com | admin |
| 2 | Rafsan Alam | rafsan@example.com | user |
| 3 | Nusrat Jahan | nusrat@example.com | user |
| 4 | Karim Ahmed | karim@example.com | user |
| 5 | Sadia Islam | sadia@example.com | user |
| 6 | Tanvir Hasan | tanvir@example.com | user |
| 7 | Farzana Akter | farzana@example.com | user |

### Products by Brand

| Brand | Count | Price Range (BDT) |
|-------|-------|-------------------|
| Naviforce | 20 | 1,800 – 4,500 |
| Curren | 10 | 2,200 – 5,800 |
| Poedagar | 5 | 1,500 – 3,200 |
| Casio | 5 | 3,500 – 12,500 |
| Skmei | 3 | 1,200 – 2,800 |

### Products by Category

| Category | Count | Flash Sale Count |
|----------|-------|-----------------|
| Men | 27 | 2 |
| Women | 13 | 1 |
| Belts | 3 | 1 |

## Appendix B: API Endpoint Summary

| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| POST | `/api/auth/register` | No | No | Register new user |
| POST | `/api/auth/login` | No | No | Login user |
| POST | `/api/auth/google` | No | No | Google OAuth login |
| GET | `/api/products` | No | No | List products (with filters) |
| GET | `/api/products/:slugOrId` | No | No | Get single product |
| POST | `/api/products` | Yes | Yes | Create product |
| PUT | `/api/products/:id` | Yes | Yes | Update product |
| DELETE | `/api/products/:id` | Yes | Yes | Delete product |
| GET | `/api/cart` | Yes | No | Get user's cart |
| POST | `/api/cart` | Yes | No | Add to cart |
| PUT | `/api/cart/:id` | Yes | No | Update cart quantity |
| DELETE | `/api/cart/:id` | Yes | No | Remove cart item |
| DELETE | `/api/cart` | Yes | No | Clear cart |
| GET | `/api/watchlist` | Yes | No | Get watchlist |
| POST | `/api/watchlist` | Yes | No | Add to watchlist |
| DELETE | `/api/watchlist/:product_id` | Yes | No | Remove from watchlist |
| GET | `/api/watchlist/check/:product_id` | Yes | No | Check if in watchlist |
| POST | `/api/orders` | Yes | No | Place order |
| GET | `/api/orders/my` | Yes | No | User's orders |
| GET | `/api/orders/admin/all` | Yes | Yes | All orders |
| PUT | `/api/orders/:id/status` | Yes | Yes | Update order status |
| GET | `/api/reviews` | No | No | List reviews |
| POST | `/api/reviews` | Yes | No | Add review |
| POST | `/api/reviews/guest` | No | No | Add guest review |
| GET | `/api/admin/stats` | Yes | Yes | Dashboard stats |
| GET | `/api/admin/users` | Yes | Yes | All users |
| GET | `/api/health` | No | No | Health check |

---

*This report was prepared for the Legacy Watches university project defense. All technical details are verified against the actual codebase as of June 2026.*