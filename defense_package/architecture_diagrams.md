# Legacy Watches — System Architecture & Design Diagrams

This document contains publication-quality diagrams representing the architecture, component structure, data flow, and database design of the Legacy Watches e-commerce platform.

---

## 1. High-Level System Architecture

The project follows a decoupled 3-tier architecture: a Next.js frontend, an Express.js REST API backend, and a JSON-based data layer.

```mermaid
graph TD
    subgraph "Client Layer"
        Browser["Web Browser"]
    end

    subgraph "Frontend Layer :3000"
        NextJS["Next.js 16 App Router"]
        React["React 19 Components"]
        Tailwind["Tailwind CSS 4"]
        ContextAPI["React Context API"]
        Axios["Axios HTTP Client"]
        GoogleOAuth["@react-oauth/google"]

        NextJS --> React
        React --> Tailwind
        React --> ContextAPI
        ContextAPI --> Axios
        NextJS --> GoogleOAuth
    end

    subgraph "Backend Layer :5001"
        Express["Express.js Server"]
        CORS["CORS Middleware"]
        StaticFiles["Static File Server"]
        JWTAuth["JWT Auth Middleware"]
        AdminMW["Admin Middleware"]
        Routes["6 Route Modules"]
        Multer["Multer File Uploads"]

        Express --> CORS
        Express --> StaticFiles
        Express --> JWTAuth
        JWTAuth --> AdminMW
        Express --> Routes
        Routes --> Multer
    end

    subgraph "Data Layer"
        DBAdapter["JSON Database Adapter"]
        DBFile["db.json"]
        ImageStore["Product Images /Legacy watches Web Images/"]

        DBAdapter --> DBFile
        StaticFiles --> ImageStore
    end

    Browser <-->|"HTTP/JSON"| NextJS
    Axios <-->|"REST API"| Express
    Routes --> DBAdapter
```

---

## 2. Frontend Component Tree

The Next.js App Router organizes pages into route groups. Each page is composed of reusable components.

```mermaid
graph TD
    RootLayout["RootLayout layout.tsx"]
    AppWrapper["AppWrapper GoogleOAuthProvider + AppProvider"]
    Toaster["react-hot-toast Toaster"]

    RootLayout --> AppWrapper

    AppWrapper --> HomePage["/ page.tsx"]
    AppWrapper --> AuthGroup["/(auth)"]
    AppWrapper --> UserGroup["/(user)"]
    AppWrapper --> AdminGroup["/admin"]

    HomePage --> HeroBanner["HeroBanner.jsx"]
    HomePage --> WatchExplorer["WatchExplorer.jsx"]
    HomePage --> ProductCard["ProductCard.jsx"]
    HomePage --> Footer["Footer.jsx"]

    AuthGroup --> LoginPage["/login/page.jsx"]
    AuthGroup --> RegisterPage["/register/page.jsx"]
    LoginPage --> AuthModal["AuthModal.jsx"]
    RegisterPage --> AuthModal

    UserGroup --> ShopPage["/shop/page.jsx"]
    UserGroup --> ProductDetail["/product/[id]/page.jsx"]
    UserGroup --> CartPage["/cart/page.jsx"]
    UserGroup --> CheckoutPage["/checkout/page.jsx"]
    UserGroup --> WatchlistPage["/watchlist/page.jsx"]
    UserGroup --> ProfilePage["/profile/page.jsx"]
    UserGroup --> ReviewsPage["/reviews/page.jsx"]
    UserGroup --> FlashSalePage["/flash-sale/page.jsx"]
    UserGroup --> AboutPage["/about-us/page.jsx"]
    UserGroup --> ContactPage["/contact-us/page.jsx"]
    UserGroup --> CategoryPage["/shop/[category]/page.jsx"]

    ShopPage --> Navbar["Navbar.jsx"]
    ProductDetail --> Navbar
    CartPage --> Navbar
    CheckoutPage --> Navbar
    WatchlistPage --> Navbar
    ProfilePage --> Navbar
    ReviewsPage --> Navbar
    FlashSalePage --> Navbar
    AboutPage --> InfoLayout["InfoLayout.jsx"]
    ContactPage --> InfoLayout
    CategoryPage --> ShopPage

    AdminGroup --> AdminDashboard["/admin/page.jsx"]
    AdminGroup --> AdminProducts["/admin/products/page.jsx"]
    AdminGroup --> AdminOrders["/admin/orders/page.jsx"]

    Navbar --> MegaMenu["MegaMenu Component"]
    Navbar --> AuthModal
```

---

## 3. Backend Route Architecture

The Express server loads 6 modular route files plus inline admin routes. Each route module handles a specific resource domain.

```mermaid
graph TD
    Server["server.js Express App :5001"]

    Server --> HealthCheck["GET /api/health"]
    Server --> AdminStats["GET /api/admin/stats"]
    Server --> AdminUsers["GET /api/admin/users"]

    Server --> AuthRoutes["/api/auth auth.js"]
    Server --> ProductRoutes["/api/products products.js"]
    Server --> CartRoutes["/api/cart cart.js"]
    Server --> WatchlistRoutes["/api/watchlist watchlist.js"]
    Server --> OrderRoutes["/api/orders orders.js"]
    Server --> ReviewRoutes["/api/reviews reviews.js"]

    AuthRoutes --> Register["POST /register"]
    AuthRoutes --> Login["POST /login"]
    AuthRoutes --> GoogleLogin["POST /google"]

    ProductRoutes --> ListProducts["GET /"]
    ProductRoutes --> GetProduct["GET /:slugOrId"]
    ProductRoutes --> CreateProduct["POST / 🔒Admin"]
    ProductRoutes --> UpdateProduct["PUT /:id 🔒Admin"]
    ProductRoutes --> DeleteProduct["DELETE /:id 🔒Admin"]

    CartRoutes --> GetCart["GET / 🔒"]
    CartRoutes --> AddToCart["POST / 🔒"]
    CartRoutes --> UpdateQty["PUT /:id 🔒"]
    CartRoutes --> RemoveItem["DELETE /:id 🔒"]
    CartRoutes --> ClearCart["DELETE / 🔒"]

    WatchlistRoutes --> GetWatchlist["GET / 🔒"]
    WatchlistRoutes --> AddWatchlist["POST / 🔒"]
    WatchlistRoutes --> RemoveWatchlist["DELETE /:product_id 🔒"]
    WatchlistRoutes --> CheckWatchlist["GET /check/:product_id 🔒"]

    OrderRoutes --> PlaceOrder["POST / 🔒"]
    OrderRoutes --> MyOrders["GET /my 🔒"]
    OrderRoutes --> AllOrders["GET /admin/all 🔒Admin"]
    OrderRoutes --> UpdateStatus["PUT /:id/status 🔒Admin"]

    ReviewRoutes --> GetReviews["GET /"]
    ReviewRoutes --> AddReview["POST / 🔒"]
    ReviewRoutes --> GuestReview["POST /guest"]
```

---

## 4. Data Flow: User Authentication

```mermaid
sequenceDiagram
    participant User as User Browser
    participant Page as Login Page
    participant API as Axios Client
    participant Backend as Express Server
    participant DB as JSON Database

    User->>Page: Enters email & password
    Page->>API: POST /api/auth/login
    API->>Backend: HTTP Request with credentials
    Backend->>DB: Query users by email
    DB-->>Backend: User record with hashed password
    Backend->>Backend: bcrypt.compare(password, hash)
    Backend->>Backend: jwt.sign({id, email, role})
    Backend-->>API: { token, user }
    API->>API: localStorage.setItem('token', token)
    API->>API: localStorage.setItem('user', JSON.stringify(user))
    API-->>Page: Response data
    Page->>Page: Context.login(token, userData)
    Page->>User: Redirect to homepage/admin
```

---

## 5. Data Flow: Order Placement

```mermaid
sequenceDiagram
    participant User as User
    participant Checkout as Checkout Page
    participant API as Axios Client
    participant Backend as Express Server
    participant DB as JSON Database

    User->>Checkout: Fills shipping form, clicks Place Order
    Checkout->>API: POST /api/orders { shipping_name, address, payment_method }
    API->>Backend: HTTP Request with JWT in Authorization header
    Backend->>Backend: auth middleware verifies JWT
    Backend->>DB: GET /cart (user's cart items)
    DB-->>Backend: Cart items with product details
    Backend->>Backend: Validate stock for each item
    Backend->>DB: INSERT INTO orders (user_id, total, shipping...)
    Backend->>DB: INSERT INTO order_items (for each item)
    Backend->>DB: UPDATE products SET stock = stock - qty
    Backend->>DB: DELETE FROM cart WHERE user_id = ?
    DB-->>Backend: Write success
    Backend-->>API: { message, orderId }
    API-->>Checkout: Response
    Checkout->>User: Toast success + redirect to /profile
```

---

## 6. Entity-Relationship Diagram (JSON Database Schema)

The database is stored in a single [`db.json`](backend/database/db.json) file with 6 collections (arrays). The relationships are maintained through foreign key references validated by the application layer.

```mermaid
erDiagram
    USERS ||--o{ ORDERS : "user_id FK"
    USERS ||--o{ CART_ITEMS : "user_id FK"
    USERS ||--o{ WATCHLIST_ITEMS : "user_id FK"
    USERS ||--o{ REVIEWS : "user_id FK"
    PRODUCTS ||--o{ CART_ITEMS : "product_id FK"
    PRODUCTS ||--o{ WATCHLIST_ITEMS : "product_id FK"
    PRODUCTS ||--o{ REVIEWS : "product_id FK"
    ORDERS ||--o{ ORDER_ITEMS : "order_id FK"
    PRODUCTS ||--o{ ORDER_ITEMS : "product_id FK"

    USERS {
        int id PK
        string name
        string email "Unique"
        string password "bcrypt hash"
        string phone
        string google_id "Nullable"
        string role "admin | user"
        string created_at "ISO datetime"
    }

    PRODUCTS {
        int id PK
        string title
        string slug "URL-friendly"
        int price "BDT"
        int original_price "BDT"
        int discount_percent
        string category "men | women | belts"
        string brand "Naviforce | Curren | Poedagar | Casio | Skmei"
        int stock
        string description
        int is_flash_sale "0 or 1"
        string main_image "Relative path"
        string images_json "JSON array of paths"
        string created_at "ISO datetime"
    }

    ORDERS {
        int id PK
        int user_id FK
        int total_amount "BDT"
        string shipping_name
        string shipping_phone
        string shipping_address
        string payment_method "cod | online"
        string status "pending | confirmed | processing | shipped | delivered | cancelled"
        string note
        string items_json "JSON array of order items"
        string created_at "ISO datetime"
    }

    CART_ITEMS {
        int id PK
        int user_id FK
        int product_id FK
        int quantity
    }

    WATCHLIST_ITEMS {
        int id PK
        int user_id FK
        int product_id FK
        string added_at "ISO datetime"
    }

    REVIEWS {
        int id PK
        int product_id FK "Nullable"
        int user_id FK "Nullable for guest reviews"
        string user_name
        int rating "1-5"
        string comment
        string created_at "ISO datetime"
    }
```

---

## 7. Frontend State Management Architecture

The application uses React Context API for global state management, supplemented by local component state and localStorage persistence.

```mermaid
graph TD
    subgraph "AppWrapper AppWrapper.jsx"
        GoogleOAuth["GoogleOAuthProvider"]
        AppProvider["AppProvider context.js"]
    end

    subgraph "AppContext State"
        User["user: Object | null"]
        Cart["cart: Array"]
        Watchlist["watchlist: Array"]
        Loading["loading: Boolean"]
    end

    subgraph "Context Actions"
        Login["login(token, user)"]
        Logout["logout()"]
        AddToCart["addToCart(product_id, qty)"]
        RemoveFromCart["removeFromCart(id)"]
        UpdateCartQty["updateCartQty(id, qty)"]
        ClearCart["clearCart()"]
        AddToWatchlist["addToWatchlist(product_id)"]
        RemoveFromWatchlist["removeFromWatchlist(product_id)"]
    end

    subgraph "Computed Values"
        CartCount["cartCount"]
        CartTotal["cartTotal"]
    end

    subgraph "Persistence"
        LocalStorageToken["localStorage: 'token'"]
        LocalStorageUser["localStorage: 'user'"]
    end

    AppProvider --> User
    AppProvider --> Cart
    AppProvider --> Watchlist
    AppProvider --> Loading

    Login --> LocalStorageToken
    Login --> LocalStorageUser
    Logout --> LocalStorageToken
    Logout --> LocalStorageUser

    AddToCart --> Cart
    RemoveFromCart --> Cart
    UpdateCartQty --> Cart
    ClearCart --> Cart
    AddToWatchlist --> Watchlist
    RemoveFromWatchlist --> Watchlist

    Cart --> CartCount
    Cart --> CartTotal
```

---

## 8. Page Route Map

```
/                           → Homepage (Hero + WatchExplorer + Categories + Best Sellers)
/(auth)/login               → Login Page
/(auth)/register            → Register Page
/(user)/shop                → Shop (Product listing with filters)
/(user)/shop/[category]     → Category-specific shop (delegates to ShopPage)
/(user)/product/[id]        → Product Detail Page
/(user)/cart                → Shopping Cart
/(user)/checkout            → Checkout (Shipping form + Order review)
/(user)/watchlist           → Saved items (Watchlist)
/(user)/profile             → User Profile + Order History
/(user)/reviews             → All Customer Reviews
/(user)/flash-sale          → Flash Sale Products with countdown timer
/(user)/about-us            → About Us (InfoLayout)
/(user)/contact-us          → Contact Us with store info + message form (InfoLayout)
/admin                      → Admin Dashboard (Stats + Recent Orders)
/admin/products             → Admin Product Management (CRUD table)
/admin/orders               → Admin Order Fulfillment (Status management)
```

---

## 9. Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend Framework** | Next.js (App Router) | 16.2.4 |
| **UI Library** | React | 19.2.4 |
| **Styling** | Tailwind CSS | 4 |
| **Language** | TypeScript / JavaScript (JSX) | 5 |
| **HTTP Client** | Axios | Latest |
| **Icons** | Lucide React | Latest |
| **Carousel** | Swiper.js | Latest |
| **Notifications** | react-hot-toast | Latest |
| **Google Auth** | @react-oauth/google | Latest |
| **Backend Runtime** | Node.js | 18+ |
| **Backend Framework** | Express.js | Latest |
| **Authentication** | jsonwebtoken + bcryptjs | Latest |
| **File Upload** | Multer | Latest |
| **Database** | Custom JSON-based adapter | N/A |
| **Fonts** | Inter + Playfair Display (Google Fonts) | — |

---

## 10. Project Directory Structure

```
Legacy Watches Project 2/
├── backend/
│   ├── server.js                  # Express server entry point
│   ├── package.json               # Backend dependencies
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   └── admin.js              # Admin role check middleware
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── products.js           # Product CRUD routes
│   │   ├── cart.js               # Cart management routes
│   │   ├── watchlist.js          # Watchlist routes
│   │   ├── orders.js             # Order management routes
│   │   └── reviews.js            # Review routes
│   └── database/
│       ├── db.js                 # JSON database adapter
│       ├── db.json               # Data store (users, products, orders, etc.)
│       └── seed.js               # Database seeder
├── frontend/
│   ├── package.json              # Frontend dependencies
│   ├── next.config.mjs           # Next.js configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── app/
│   │   ├── layout.tsx            # Root layout (fonts, AppWrapper)
│   │   ├── page.tsx              # Homepage
│   │   ├── globals.css           # Global styles + Tailwind
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── login/page.jsx
│   │   │   └── register/page.jsx
│   │   ├── (user)/               # User-facing route group
│   │   │   ├── shop/page.jsx
│   │   │   ├── shop/[category]/page.jsx
│   │   │   ├── product/[id]/page.jsx
│   │   │   ├── cart/page.jsx
│   │   │   ├── checkout/page.jsx
│   │   │   ├── watchlist/page.jsx
│   │   │   ├── profile/page.jsx
│   │   │   ├── reviews/page.jsx
│   │   │   ├── flash-sale/page.jsx
│   │   │   ├── about-us/page.jsx
│   │   │   └── contact-us/page.jsx
│   │   └── admin/                # Admin route group
│   │       ├── page.jsx
│   │       ├── products/page.jsx
│   │       └── orders/page.jsx
│   ├── components/
│   │   ├── Navbar.jsx            # Navigation with MegaMenu
│   │   ├── HeroBanner.jsx        # Video hero section
│   │   ├── WatchExplorer.jsx     # Swiper watch carousel
│   │   ├── ProductCard.jsx       # Reusable product card
│   │   ├── Footer.jsx            # Site footer
│   │   ├── AuthModal.jsx         # Login/Register modal
│   │   └── InfoLayout.jsx        # Info page layout wrapper
│   └── lib/
│       ├── api.js                # Axios instance + API helpers
│       ├── context.js            # React Context (AppProvider)
│       └── AppWrapper.jsx        # GoogleOAuth + Context wrapper
├── Legacy watches Web Images/    # Product image assets
├── Fonts/                        # Custom font files
├── defense_package/              # Project defense documentation
│   ├── api_documentation.md
│   ├── architecture_diagrams.md
│   ├── project_report.md
│   ├── presentation_slides.md
│   └── technical_specification.md
└── README.md                     # Project setup guide