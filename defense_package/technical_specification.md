# Legacy Watches — Technical Specification Document

**Document Version:** 1.0
**Project:** Legacy Watches E-Commerce Platform
**Date:** June 2026
**Environment:** Development

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technical Requirements](#2-technical-requirements)
3. [Data Structures & Schemas](#3-data-structures--schemas)
4. [Backend Specification](#4-backend-specification)
5. [Frontend Specification](#5-frontend-specification)
6. [Component Specifications](#6-component-specifications)
7. [State Management Design](#7-state-management-design)
8. [Authentication & Authorization Flow](#8-authentication--authorization-flow)
9. [File Upload Specification](#9-file-upload-specification)
10. [Error Handling Strategy](#10-error-handling-strategy)
11. [Routing Specification](#11-routing-specification)
12. [Styling & Design Tokens](#12-styling--design-tokens)
13. [Performance Considerations](#13-performance-considerations)
14. [Known Limitations & Technical Debt](#14-known-limitations--technical-debt)
15. [Deployment Considerations](#15-deployment-considerations)

---

## 1. System Overview

### 1.1 Architecture Type

**Decoupled 3-Tier Web Application**

```
┌──────────────────────────────────────────────────┐
│  Tier 1: Presentation (Next.js 16, port 3000)     │
│  - Server-Side Rendered pages (App Router)         │
│  - Client-side interactive components              │
│  - React Context state management                   │
├──────────────────────────────────────────────────┤
│  Tier 2: Business Logic (Express.js, port 5001)   │
│  - RESTful JSON API                                │
│  - JWT authentication middleware                   │
│  - Role-based authorization (admin middleware)     │
│  - Multer file upload handling                     │
├──────────────────────────────────────────────────┤
│  Tier 3: Data (JSON File Adapter)                  │
│  - Custom SQL-like query parser                    │
│  - In-memory operations with disk persistence      │
│  - Single-file storage (db.json)                   │
└──────────────────────────────────────────────────┘
```

### 1.2 Communication Protocol

- **Frontend ↔ Backend:** HTTP/HTTPS with JSON payloads
- **Authentication:** JWT Bearer token in `Authorization` header
- **File Transfer:** `multipart/form-data` via Multer
- **CORS:** Whitelisted origins (`localhost:3000`, `localhost:3001`)

---

## 2. Technical Requirements

### 2.1 Runtime Environment

| Requirement | Specification |
|-------------|---------------|
| **Node.js** | v18.0.0 or higher |
| **npm** | v9.0.0 or higher |
| **Operating System** | Windows 10/11, macOS, Linux |
| **Browser Support** | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ |
| **Disk Space** | ~500 MB (including product images) |
| **Memory** | 512 MB minimum (1 GB recommended) |

### 2.2 Port Configuration

| Service | Default Port | Configurable Via |
|---------|-------------|------------------|
| Frontend (Next.js) | 3000 | `next.config.ts` or `-p` flag |
| Backend (Express) | 5001 | `PORT` environment variable |

### 2.3 Environment Variables

#### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5001` | Express server port |
| `JWT_SECRET` | `legacy_watches_secret_2024` | JWT signing secret |
| `GOOGLE_CLIENT_ID` | (hardcoded in `auth.js`) | Google OAuth 2.0 client ID |

#### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5001` | Backend API base URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | (hardcoded) | Google OAuth client ID |

---

## 3. Data Structures & Schemas

### 3.1 Database Architecture

**Type:** Custom JSON-based adapter ([`db.js`](backend/database/db.js:23))
**Storage File:** [`db.json`](backend/database/db.json) (single flat file)
**In-Memory:** Data is loaded into memory on server start, written to disk on every mutation

### 3.2 Users Collection

```typescript
interface User {
  id: number;                    // Auto-incrementing primary key
  name: string;                  // Full name (required)
  email: string;                 // Unique email (required)
  password_hash: string | null;  // bcrypt hash, null for Google OAuth users
  phone: string | null;          // Optional contact number
  google_id: string | null;      // Google OAuth sub identifier
  role: "admin" | "user";       // Default: "user"
  created_at: string;            // ISO 8601 datetime
}
```

**Seeded Records:** 7 (1 admin + 6 demo users)
**Admin Credentials:** `admin@legacywatches.com` / `admin123`

### 3.3 Products Collection

```typescript
interface Product {
  id: number;                    // Auto-incrementing primary key
  title: string;                 // Display name (required)
  slug: string;                  // URL-friendly identifier (auto-generated)
  price: number;                 // Current selling price in BDT
  original_price: number | null; // Original price for discount display
  category: string;              // "men", "women", or "belts"
  brand: string | null;          // Brand name
  description: string | null;    // Product description
  stock: number;                 // Available inventory (default: 10)
  is_flash_sale: 0 | 1;        // Flash sale flag (default: 0)
  discount_percent: number;      // Discount percentage (default: 0)
  main_image: string | null;     // Primary product image URL
  images_json: string;           // JSON-encoded array of image URLs
  created_at: string;            // ISO 8601 datetime
}
```

**Seeded Records:** 43
**Category Distribution:** Men (27), Women (13), Belts (3)
**Brand Distribution:** Naviforce (20), Curren (10), Poedagar (5), Casio (5), Skmei (3)

### 3.4 Orders Collection

```typescript
interface Order {
  id: number;                    // Auto-incrementing primary key
  user_id: number;              // FK → users.id
  total_amount: number;         // Calculated total in BDT
  shipping_name: string;        // Recipient name (required)
  shipping_phone: string;       // Contact phone (required)
  shipping_address: string;     // Delivery address (required)
  payment_method: string;       // Default: "cod"
  note: string | null;          // Optional delivery instructions
  status: OrderStatus;          // Default: "pending"
  created_at: string;           // ISO 8601 datetime
}

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
```

### 3.5 Order Items Collection

```typescript
interface OrderItem {
  id: number;          // Auto-incrementing primary key
  order_id: number;   // FK → orders.id
  product_id: number; // FK → products.id
  quantity: number;   // Quantity ordered
  price: number;      // Price at time of order (snapshot)
}
```

### 3.6 Cart Collection

```typescript
interface CartItem {
  id: number;          // Auto-incrementing primary key
  user_id: number;    // FK → users.id
  product_id: number; // FK → products.id
  quantity: number;   // Default: 1
}
```

### 3.7 Watchlist Collection

```typescript
interface WatchlistItem {
  id: number;          // Auto-incrementing primary key
  user_id: number;    // FK → users.id
  product_id: number; // FK → products.id
  added_at: string;   // ISO 8601 datetime
}
```

### 3.8 Reviews Collection

```typescript
interface Review {
  id: number;                    // Auto-incrementing primary key
  user_id: number | null;       // FK → users.id (null for guest reviews)
  user_name: string;            // Display name for the review
  product_id: number | null;    // FK → products.id
  rating: number;               // 1-5 star rating (default: 5)
  comment: string;              // Review text
  created_at: string;           // ISO 8601 datetime
}
```

**Seeded Records:** 10

---

## 4. Backend Specification

### 4.1 Server Entry Point

**File:** [`server.js`](backend/server.js)
**Port:** 5001 (configurable via `PORT` env var)

**Initialization Sequence:**
1. Initialize database adapter (creates collections if empty)
2. Configure CORS middleware
3. Configure JSON and URL-encoded body parsers
4. Mount static file servers for product images
5. Mount 6 route modules at `/api/*`
6. Define health check endpoint
7. Define inline admin stats and users endpoints
8. Auto-seed database if products table is empty
9. Start listening on configured port

### 4.2 Middleware Stack

```
Incoming Request
  │
  ├── cors() ───────────────── Origin validation
  ├── express.json() ────────── JSON body parsing
  ├── express.urlencoded() ──── Form data parsing
  ├── express.static() ──────── Static file serving (images)
  │
  └── Route Handler
       │
       ├── auth middleware ──── JWT verification (attaches req.user)
       │    │
       │    └── admin middleware ── Role check (req.user.role === 'admin')
       │
       └── Business Logic ───── Database operations
```

### 4.3 JWT Token Specification

| Property | Value |
|----------|-------|
| **Algorithm** | HS256 (HMAC with SHA-256) |
| **Secret** | `legacy_watches_secret_2024` (override via `JWT_SECRET` env) |
| **Expiry** | 7 days (`7d`) |
| **Payload** | `{ id: number, role: "admin" | "user" }` |
| **Transmission** | `Authorization: Bearer <token>` header |

### 4.4 Route Module Registry

| Mount Path | Route File | Endpoints | Protected |
|------------|-----------|-----------|-----------|
| `/api/auth` | [routes/auth.js](backend/routes/auth.js) | 3 | None |
| `/api/products` | [routes/products.js](backend/routes/products.js) | 5 | Write ops (admin) |
| `/api/cart` | [routes/cart.js](backend/routes/cart.js) | 5 | All |
| `/api/watchlist` | [routes/watchlist.js](backend/routes/watchlist.js) | 4 | All |
| `/api/orders` | [routes/orders.js](backend/routes/orders.js) | 4 | All (2 admin-only) |
| `/api/reviews` | [routes/reviews.js](backend/routes/reviews.js) | 3 | Write only |
| `/api/health` | Inline in server.js | 1 | None |
| `/api/admin/*` | Inline in server.js | 2 | Admin only |

### 4.5 Database Adapter API

The [`db.js`](backend/database/db.js) module exports a singleton object with the following interface:

```typescript
interface DatabaseAdapter {
  prepare(sql: string): Statement;
}

interface Statement {
  get(...params: any[]): any | undefined;
  all(...params: any[]): any[];
  run(...params: any[]): { lastInsertRowid: number; changes: number };
}

// Also available:
db.exec(sql: string): void;
db.transaction(fn: () => void): void;
```

**SQL Parsing Logic:**
- Parses the SQL string to extract: operation type (SELECT/INSERT/UPDATE/DELETE), table name, conditions, values
- `SELECT`: Filters array by WHERE conditions, returns array elements
- `INSERT`: Pushes new object with auto-incremented ID, returns `{ lastInsertRowid }`
- `UPDATE`: Finds matching elements, merges new values
- `DELETE`: Filters out matching elements
- `JOIN`: Simulated by matching foreign keys across arrays
- `COUNT(*)`, `SUM()`: Aggregation functions supported

---

## 5. Frontend Specification

### 5.1 Framework Configuration

**File:** [`next.config.ts`](frontend/next.config.ts) / [`next.config.mjs`](frontend/next.config.mjs)

```typescript
// Key configuration
{
  reactStrictMode: true,
  // Image domains configured for external sources
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' }
    ]
  }
}
```

### 5.2 Package Dependencies

**File:** [`package.json`](frontend/package.json)

| Package | Version | Category |
|---------|---------|----------|
| next | 16.2.4 | Framework |
| react | 19.2.4 | UI Library |
| react-dom | 19.2.4 | DOM Renderer |
| typescript | 5 | Type Checking |
| tailwindcss | 4 | CSS Framework |
| axios | latest | HTTP Client |
| lucide-react | latest | Icons |
| swiper | latest | Carousel |
| react-hot-toast | latest | Notifications |
| @react-oauth/google | latest | Google OAuth |

### 5.3 Page Architecture

**Total Pages:** 15
**Route Groups:** 3

```
app/
├── layout.tsx                    # Root layout (fonts, AppWrapper)
├── page.tsx                      # Homepage
├── (auth)/
│   ├── login/page.jsx            # Login page
│   └── register/page.jsx         # Register page
├── (user)/
│   ├── shop/
│   │   ├── page.jsx              # Shop listing
│   │   └── [category]/page.jsx   # Category-specific shop
│   ├── product/[id]/page.jsx     # Product detail
│   ├── cart/page.jsx             # Shopping cart
│   ├── checkout/page.jsx         # Checkout
│   ├── watchlist/page.jsx        # Watchlist
│   ├── profile/page.jsx          # User profile & orders
│   ├── reviews/page.jsx          # Reviews
│   ├── flash-sale/page.jsx       # Flash sale
│   ├── about-us/page.jsx         # About us
│   └── contact-us/page.jsx       # Contact us
└── admin/
    ├── page.jsx                  # Admin dashboard
    ├── products/page.jsx         # Product management
    └── orders/page.jsx           # Order management
```

### 5.4 Server vs. Client Components

| Page/Component | Rendering | Directive |
|----------------|-----------|-----------|
| `layout.tsx` | Server | (default) |
| `page.tsx` (Home) | Server | (default) |
| `shop/page.jsx` | Server | (default) |
| `shop/[category]/page.jsx` | Server | (default) |
| All `(user)/` pages | Client | `"use client"` |
| All `(auth)/` pages | Client | `"use client"` |
| All `/admin` pages | Client | `"use client"` |
| All components | Client | `"use client"` |

---

## 6. Component Specifications

### 6.1 Component Inventory

| Component | File | Type | Props |
|-----------|------|------|-------|
| **Navbar** | [`Navbar.jsx`](frontend/components/Navbar.jsx) | Client | None (uses Context) |
| **HeroBanner** | [`HeroBanner.jsx`](frontend/components/HeroBanner.jsx) | Client | None |
| **WatchExplorer** | [`WatchExplorer.jsx`](frontend/components/WatchExplorer.jsx) | Client | None |
| **ProductCard** | [`ProductCard.jsx`](frontend/components/ProductCard.jsx) | Client | `{ product: Product }` |
| **Footer** | [`Footer.jsx`](frontend/components/Footer.jsx) | Client | None |
| **AuthModal** | [`AuthModal.jsx`](frontend/components/AuthModal.jsx) | Client | `{ isOpen: boolean, onClose: () => void }` |
| **InfoLayout** | [`InfoLayout.jsx`](frontend/components/InfoLayout.jsx) | Client | `{ title: string, children: ReactNode }` |

### 6.2 Navbar.jsx

**Purpose:** Primary navigation with mega menu, auth controls, cart/watchlist badges.

**Internal State:**
- `scrolled: boolean` — Tracks scroll position for sticky header effect
- `mobileMenuOpen: boolean` — Mobile hamburger menu toggle
- `megaMenuOpen: boolean` — Desktop mega menu dropdown
- `authModalOpen: boolean` — Auth modal visibility

**Sub-Components:**
- `MegaMenu` — Watch brand/category navigation dropdown with horizontal scroll
- `AuthModal` — Login/Register modal overlay

**Key Behaviors:**
- Sticky header appears on scroll with backdrop blur
- Cart and watchlist count badges from Context
- User dropdown with profile link and logout
- Mobile responsive hamburger menu

### 6.3 HeroBanner.jsx

**Purpose:** Full-width hero section with video background or static image.

**Features:**
- Background video (autoplay, loop, muted)
- Gold accent overlay text
- Call-to-action button linking to `/shop`
- Responsive height adjustment

### 6.4 WatchExplorer.jsx

**Purpose:** Interactive product carousel showcasing featured watches.

**Dependencies:** Swiper.js (touch-enabled carousel)

**Features:**
- Auto-playing carousel with smooth transitions
- Navigation arrows and pagination dots
- Responsive breakpoints (1/2/3/4 slides per view)
- Each slide links to product detail page
- Hardcoded featured watch data (not API-driven)

### 6.5 ProductCard.jsx

**Purpose:** Reusable product display card used across homepage, shop, flash sale, and admin pages.

**Props:**
```typescript
interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    original_price: number | null;
    main_image: string | null;
    discount_percent: number;
    is_flash_sale: 0 | 1;
    stock: number;
  };
}
```

**Features:**
- Product image with hover zoom effect
- Discount badge (percentage off)
- Flash sale badge (red)
- Add to cart button (toast notification on success)
- Add to watchlist heart icon (filled when active)
- Quick view link to product detail

### 6.6 Footer.jsx

**Purpose:** Site-wide footer with links, brand info, and newsletter signup.

**Sections:**
- Brand description and logo
- Quick links (Shop, Flash Sale, About, Contact)
- Customer service links (Privacy, Terms — placeholder)
- Newsletter subscription form (UI only, no backend)
- Social media icon placeholders
- Copyright notice

### 6.7 AuthModal.jsx

**Purpose:** Modal overlay for login and registration with tab switching.

**Props:**
```typescript
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Modes:**
- `login` — Email/password form + Google OAuth button
- `register` — Name/email/password/phone form

**Google OAuth Integration:**
1. Client-side: `@react-oauth/google` `GoogleLogin` button
2. On success: Sends `credential` to `POST /api/auth/google`
3. Fallback: Mock login with email/name/googleId if verification fails

**Form Validation:**
- All fields required for registration
- Email format validation
- Password minimum length enforcement
- Loading states during API calls
- Error display from API responses

### 6.8 InfoLayout.jsx

**Purpose:** Reusable layout wrapper for informational pages (About Us, Contact Us).

**Props:**
```typescript
interface InfoLayoutProps {
  title: string;
  children: React.ReactNode;
}
```

**Features:**
- Centered content area with max-width constraint
- Gold accent title heading
- Consistent padding and spacing
- Breadcrumb-style navigation hint

---

## 7. State Management Design

### 7.1 Architecture

**Pattern:** React Context API with [`useReducer`](https://react.dev/reference/react/useReducer)-like pattern via multiple `useState` hooks.

**File:** [`context.js`](frontend/lib/context.js)

### 7.2 Context Shape

```typescript
interface AppContextType {
  // State
  user: User | null;
  token: string | null;
  cartCount: number;
  cartItems: CartItem[];
  watchlistCount: number;
  watchlistItems: WatchlistItem[];
  loading: boolean;

  // Auth Actions
  login: (token: string, userData: User) => void;
  logout: () => void;

  // Cart Actions
  addToCart: (product_id: number, quantity?: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateCartQty: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;

  // Watchlist Actions
  addToWatchlist: (product_id: number) => Promise<void>;
  removeFromWatchlist: (product_id: number) => Promise<void>;
  fetchWatchlist: () => Promise<void>;
}
```

### 7.3 State Persistence

| Data | Storage | Persistence |
|------|---------|-------------|
| JWT Token | `localStorage` | Survives page refresh |
| User Data | `localStorage` | Survives page refresh |
| Cart Items | Context (API-synced) | Volatile, re-fetched on mount |
| Watchlist Items | Context (API-synced) | Volatile, re-fetched on mount |

### 7.4 Initialization Flow

```
AppWrapper Mount
  │
  ├── Check localStorage for 'token'
  │    │
  │    ├── Token found → Set token in state
  │    │    ├── Check localStorage for 'user'
  │    │    ├── fetchCart() → update cartCount + cartItems
  │    │    └── fetchWatchlist() → update watchlistCount + watchlistItems
  │    │
  │    └── No token → State remains null/empty
  │
  └── Render children with populated context
```

### 7.5 Data Flow Pattern

```
User Action → Context Action → API Call → Backend → Database
                    │                                    │
                    │                                    ▼
                    │                          Response (success/error)
                    │                                    │
                    ▼                                    │
              Update Local State ◄───────────────────────┘
                    │
                    ▼
              React Re-render → UI Update
```

**Key Principle:** All state mutations go through the API first. Local state is only updated after a successful API response. This ensures the frontend always reflects the backend's ground truth.

---

## 8. Authentication & Authorization Flow

### 8.1 Registration Flow

```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  Register │     │  Backend   │     │  bcrypt   │     │   JWT    │
│   Form    │────▶│ POST /reg  │────▶│ hash(10)  │────▶│  sign()  │
└──────────┘     └───────────┘     └──────────┘     └──────────┘
                                                        │
                      ┌─────────────────────────────────┘
                      ▼
                ┌──────────┐     ┌──────────────┐
                │ Response │     │ localStorage  │
                │ {token,  │────▶│ .setItem()    │
                │  user}   │     └──────────────┘
                └──────────┘
```

### 8.2 Login Flow

```
┌──────────┐     ┌───────────┐     ┌──────────┐
│  Login   │     │  Backend   │     │ bcrypt   │
│  Form    │────▶│ POST /login│────▶│ compare()│
└──────────┘     └───────────┘     └──────────┘
                                        │
                              ┌─────────┴─────────┐
                              ▼                   ▼
                         Match (200)        No Match (401)
                         {token, user}      {error}
```

### 8.3 Google OAuth Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Google Login │     │  Google API  │     │   Backend    │
│   Button     │────▶│  User Consent│────▶│ POST /google │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                              ┌──────────────────┼──────────────────┐
                              ▼                  ▼                  ▼
                         Verify ID Token    Mock Fallback     Create/Find
                         (google-auth-lib)  (email + name)    User in DB
                              │                  │                  │
                              └──────────────────┴──────────────────┘
                                                 │
                                                 ▼
                                          JWT sign() → {token, user}
```

### 8.4 Protected Route Flow

```
Client Request with Authorization: Bearer <token>
  │
  ▼
auth middleware
  │
  ├── No token → 401 { error: "Access denied. No token provided." }
  │
  ├── Token present → jwt.verify(token, secret)
  │    │
  │    ├── Invalid/expired → 403 { error: "Invalid or expired token" }
  │    │
  │    └── Valid → req.user = decoded → next()
  │         │
  │         └── admin middleware (if required)
  │              │
  │              ├── req.user.role !== 'admin' → 403 { error: "Admin access required" }
  │              │
  │              └── req.user.role === 'admin' → next() → Route Handler
```

### 8.5 Security Considerations

| Measure | Implementation |
|---------|---------------|
| Password Hashing | bcryptjs with 10 salt rounds |
| Token Storage | localStorage (client-side only) |
| Token Transmission | Authorization header (not cookie) |
| Token Expiry | 7 days (no refresh mechanism) |
| CORS | Whitelisted origins only |
| Input Validation | Basic (required field checks, no sanitization) |
| Rate Limiting | Not implemented |
| HTTPS | Not enforced in development |

---

## 9. File Upload Specification

### 9.1 Multer Configuration

**File:** [routes/products.js](backend/routes/products.js:11-22)

```javascript
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../Legacy watches Web Images/uploads'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }  // 10 MB
});
```

### 9.2 Upload Specifications

| Property | Value |
|----------|-------|
| **Field name** | `images` |
| **Max files** | 10 |
| **Max file size** | 10 MB per file |
| **Destination** | `Legacy watches Web Images/uploads/` |
| **Filename format** | `{timestamp}-{random}.{ext}` |
| **Accepted formats** | Any (no file type filter) |
| **Serving URL** | `http://localhost:5001/uploads/{filename}` |

### 9.3 Static File Serving

**Product Images:**
- Source: `Legacy watches Web Images/products/`
- URL: `http://localhost:5001/product-images/products/{product-slug}/{filename}`
- CORS Headers: `Access-Control-Allow-Origin: *`, `Cross-Origin-Resource-Policy: cross-origin`

**Uploaded Images:**
- Source: `Legacy watches Web Images/uploads/`
- URL: `http://localhost:5001/uploads/{filename}`
- CORS Headers: Same as above

---

## 10. Error Handling Strategy

### 10.1 Backend Error Handling

**Pattern:** Try-catch blocks in every route handler.

```javascript
router.post('/endpoint', async (req, res) => {
  try {
    // Business logic
    res.json({ success: true });
  } catch (err) {
    console.error('Operation error:', err);
    res.status(500).json({ error: err.message });
  }
});
```

**Error Response Format:**
```json
{
  "error": "Human-readable error message"
}
```

### 10.2 Frontend Error Handling

**API Layer:** Axios interceptor in [`api.js`](frontend/lib/api.js) attaches the JWT token to every request.

**Component-Level:** Each async operation uses try-catch with toast notifications:

```javascript
const handleAction = async () => {
  try {
    const res = await api.post('/endpoint', data);
    toast.success(res.data.message);
    // Update state
  } catch (err) {
    toast.error(err.response?.data?.error || 'Something went wrong');
  }
};
```

**Error Display:** Errors are shown via `react-hot-toast` notifications. Form-level errors are displayed inline within forms.

### 10.3 HTTP Status Codes Used

| Code | Usage |
|------|-------|
| `200` | Successful GET, PUT, DELETE operations |
| `400` | Validation errors, missing fields, duplicate entries |
| `401` | Missing or invalid authentication token |
| `403` | Insufficient permissions (non-admin accessing admin route) |
| `404` | Resource not found (product, order, etc.) |
| `500` | Unexpected server errors |

---

## 11. Routing Specification

### 11.1 Next.js App Router Configuration

**Route Groups (logical separation, no URL impact):**
- `(auth)/` — `/login`, `/register`
- `(user)/` — All customer pages
- `/admin` — No route group, direct path

### 11.2 Route Map

| URL Pattern | File | Type | Auth Required |
|-------------|------|------|---------------|
| `/` | `page.tsx` | Server | No |
| `/login` | `(auth)/login/page.jsx` | Client | No |
| `/register` | `(auth)/register/page.jsx` | Client | No |
| `/shop` | `(user)/shop/page.jsx` | Server | No |
| `/shop/men` | `(user)/shop/[category]/page.jsx` | Server | No |
| `/shop/women` | `(user)/shop/[category]/page.jsx` | Server | No |
| `/shop/belts` | `(user)/shop/[category]/page.jsx` | Server | No |
| `/product/[id]` | `(user)/product/[id]/page.jsx` | Client | No |
| `/cart` | `(user)/cart/page.jsx` | Client | Yes (redirect) |
| `/checkout` | `(user)/checkout/page.jsx` | Client | Yes (redirect) |
| `/watchlist` | `(user)/watchlist/page.jsx` | Client | Yes (redirect) |
| `/profile` | `(user)/profile/page.jsx` | Client | Yes (redirect) |
| `/reviews` | `(user)/reviews/page.jsx` | Client | No |
| `/flash-sale` | `(user)/flash-sale/page.jsx` | Client | No |
| `/about-us` | `(user)/about-us/page.jsx` | Client | No |
| `/contact-us` | `(user)/contact-us/page.jsx` | Client | No |
| `/admin` | `admin/page.jsx` | Client | Yes (admin) |
| `/admin/products` | `admin/products/page.jsx` | Client | Yes (admin) |
| `/admin/orders` | `admin/orders/page.jsx` | Client | Yes (admin) |

### 11.3 Dynamic Route: `[category]`

The [`shop/[category]/page.jsx`](frontend/app/(user)/shop/[category]/page.jsx) is a dynamic route that delegates to `ShopPage` with a pre-set category filter. It accepts `params.category` (e.g., `men`, `women`, `belts`) and passes it to the products API query.

---

## 12. Styling & Design Tokens

### 12.1 Technology

**Framework:** Tailwind CSS 4
**File:** [`globals.css`](frontend/app/globals.css)

### 12.2 Design Tokens

#### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Gold (primary) | `#b38b2d` | Accents, buttons, links, headings |
| Dark | `#1a1a1a` | Text, backgrounds |
| White | `#ffffff` | Page backgrounds |
| Gray-50 | `#f9fafb` | Section backgrounds |
| Gray-100 | `#f3f4f6` | Card backgrounds |
| Red | `#ef4444` | Flash sale badges, errors |
| Green | `#22c55e` | Success states, stock indicators |

#### Typography

| Token | Font Family | Usage |
|-------|-------------|-------|
| Display | Playfair Display (serif) | Headings, hero text, brand |
| Body | Inter (sans-serif) | Body text, navigation, forms |

#### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| Section padding | `py-20` (5rem) | Major section spacing |
| Container max-width | `max-w-7xl` (80rem) | Content width constraint |
| Card gap | `gap-6` (1.5rem) | Grid spacing |

### 12.3 Custom CSS Classes

Defined in [`globals.css`](frontend/app/globals.css):

| Class | Description |
|-------|-------------|
| `.glass` | Semi-transparent background with backdrop blur (glass morphism) |
| `.btn-primary` | Gold gradient button with hover effects |
| `.section-padding` | Consistent vertical padding for sections |
| `.hide-scrollbar` | Hides scrollbar while preserving scroll functionality |

### 12.4 Keyframe Animations

| Animation | Duration | Effect |
|-----------|----------|--------|
| `fadeIn` | 0.6s | Opacity 0 → 1 with translateY |
| `slideUp` | 0.8s | Translate up with opacity |
| `slide` | 20s | Infinite horizontal scroll (brand logos) |

### 12.5 Responsive Breakpoints

| Breakpoint | Min Width | Layout |
|------------|-----------|--------|
| Default | 0px | Single column, stacked |
| `sm` | 640px | 2-column grid |
| `md` | 768px | 3-column grid, sidebar appears |
| `lg` | 1024px | 4-column grid, full navigation |
| `xl` | 1280px | Maximum content width |

---

## 13. Performance Considerations

### 13.1 Current State

| Aspect | Implementation | Optimization |
|--------|---------------|-------------|
| **Server-Side Rendering** | Homepage, Shop pages | Reduces client-side JS |
| **Client-Side Rendering** | All interactive pages | Enables dynamic behavior |
| **Image Optimization** | Not using Next.js `Image` | Plain `<img>` tags |
| **Code Splitting** | Automatic (Next.js) | Per-page bundles |
| **Caching** | None | API calls are not cached |
| **Database** | In-memory JSON | No indexing, full array scans |

### 13.2 Known Performance Bottlenecks

1. **JSON Database:** All queries involve full array scans (O(n) complexity). Not suitable for production scale.
2. **No Image Optimization:** Product images are served at full resolution without Next.js Image optimization.
3. **No API Caching:** Repeated API calls re-read and re-process the entire database.
4. **Client-Side Heavy:** Most pages are client-rendered, increasing initial JS bundle size.

### 13.3 Recommended Production Optimizations

1. Migrate to PostgreSQL with proper indexing
2. Use Next.js `<Image>` component for automatic optimization
3. Implement Redis caching for frequently accessed data
4. Add Incremental Static Regeneration (ISR) for product pages
5. Implement pagination on all list endpoints
6. Add CDN for product images

---

## 14. Known Limitations & Technical Debt

### 14.1 Critical Limitations

| Limitation | Impact | Remediation |
|------------|--------|-------------|
| **JSON Database** | No concurrent writes, no indexing, full-scan queries | Migrate to PostgreSQL |
| **No Payment Gateway** | Orders are COD-only, no real transactions | Integrate SSLCommerz/Stripe |
| **No Token Refresh** | Users must re-login after 7 days | Implement refresh token rotation |
| **No Input Sanitization** | Vulnerable to XSS and injection | Add express-validator / DOMPurify |
| **No Rate Limiting** | API endpoints have no rate protection | Add express-rate-limit |
| **No HTTPS** | Data transmitted in plaintext | Enforce HTTPS in production |
| **No Email System** | No order confirmations or notifications | Integrate Nodemailer/SendGrid |
| **No Password Reset** | Users cannot recover lost passwords | Implement reset flow |
| **Mock Google OAuth** | Fallback to mock mode bypasses real auth | Remove mock fallback in production |

### 14.2 Minor Technical Debt

| Item | Description |
|------|-------------|
| Hardcoded secrets | JWT secret and Google client ID are hardcoded, not env-only |
| No TypeScript in pages | All `.jsx` pages lack type safety; only `layout.tsx`, `api.js`, `context.js` use TS |
| Mixed config files | Both `next.config.ts` and `next.config.mjs` exist |
| Duplicate API calls | Some pages fetch data that's already in Context |
| Inline admin routes | Admin routes are defined in `server.js` instead of separate route files |
| Missing privacy/terms pages | Directories exist but `page.jsx` files are not created |
| No automated tests | Zero test coverage (no Jest, Cypress, or similar) |

### 14.3 Missing Features

| Feature | Status |
|---------|--------|
| Product search (full-text) | Not implemented (API supports `?search=` but UI doesn't use it) |
| Product reviews on detail page | Partially implemented |
| Newsletter subscription | UI only, no backend |
| Password reset | Not implemented |
| Email verification | Not implemented |
| Social media integration | Placeholder only |
| Privacy Policy page | Placeholder directory exists |
| Terms & Conditions page | Placeholder directory exists |

---

## 15. Deployment Considerations

### 15.1 Development Environment

```bash
# Start backend
cd backend
npm run dev
# → Express server on http://localhost:5001

# Start frontend
cd frontend
npm run dev
# → Next.js dev server on http://localhost:3000
```

### 15.2 Production Build

```bash
# Backend
cd backend
npm start
# Consider: PM2 for process management

# Frontend
cd frontend
npm run build
npm start
# → Optimized production build on port 3000
```

### 15.3 Recommended Production Architecture

```
                    ┌─────────────┐
                    │   CDN (CF)  │ ← Product images
                    └─────────────┘
                           │
┌──────────┐     ┌─────────────────┐     ┌──────────────┐
│  Client  │────▶│  Vercel/Netlify │────▶│  VPS (PM2)  │
│ Browser  │     │  (Next.js SSR)  │     │  (Express)  │
└──────────┘     └─────────────────┘     └──────────────┘
                                                │
                                         ┌──────────────┐
                                         │  PostgreSQL  │
                                         │  (Supabase)  │
                                         └──────────────┘
```

### 15.4 Environment Variables for Production

```bash
# Backend (.env)
PORT=5001
JWT_SECRET=<strong-random-secret>
GOOGLE_CLIENT_ID=<real-google-client-id>
NODE_ENV=production

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.legacywatches.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<real-google-client-id>
```

### 15.5 Pre-Deployment Checklist

- [ ] Migrate database from JSON to PostgreSQL
- [ ] Replace hardcoded secrets with environment variables
- [ ] Implement SSL/TLS (HTTPS)
- [ ] Add rate limiting middleware
- [ ] Add input validation and sanitization
- [ ] Remove mock Google OAuth fallback
- [ ] Implement real payment gateway
- [ ] Set up proper CORS for production domains
- [ ] Configure logging (Winston/Morgan)
- [ ] Set up monitoring (Sentry, PM2 metrics)
- [ ] Create production Dockerfile
- [ ] Write deployment documentation

---

*Technical specification generated from complete source code analysis of the Legacy Watches project. All schemas, interfaces, and behaviors reflect the actual implementation as of June 2026.*