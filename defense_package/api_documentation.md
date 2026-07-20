# Legacy Watches — Complete API Documentation

**Base URL:** `http://localhost:5001/api`
**Content-Type:** `application/json` (except file uploads: `multipart/form-data`)
**Authentication:** JWT Bearer Token

---

## Table of Contents

1. [Authentication Overview](#authentication-overview)
2. [Auth Routes (`/api/auth`)](#auth-routes-apiauth)
3. [Product Routes (`/api/products`)](#product-routes-apiproducts)
4. [Cart Routes (`/api/cart`)](#cart-routes-apicart)
5. [Watchlist Routes (`/api/watchlist`)](#watchlist-routes-apiwatchlist)
6. [Order Routes (`/api/orders`)](#order-routes-apiorders)
7. [Review Routes (`/api/reviews`)](#review-routes-apireviews)
8. [Health Check (`/api/health`)](#health-check-apihealth)
9. [Admin Routes (`/api/admin`)](#admin-routes-apiadmin)
10. [Database Architecture Note](#database-architecture-note)
11. [Endpoint Summary](#endpoint-summary)

---

## Authentication Overview

The API uses **JWT (JSON Web Token)** for authentication. Upon successful login or registration, the server returns a signed JWT token. This token must be included in the `Authorization` header for all protected routes.

**JWT Secret:** `legacy_watches_secret_2024`
**Token Expiry:** 7 days
**Header Format:** `Authorization: Bearer <token>`

### Middleware Stack

| Middleware | File | Purpose |
|-----------|------|---------|
| **CORS** | [`server.js`](backend/server.js:13) | Restricts origins to `localhost:3000` and `localhost:3001` |
| **auth** | [middleware/auth.js](backend/middleware/auth.js:4) | Verifies JWT token, attaches `req.user` |
| **admin** | [middleware/admin.js](backend/middleware/admin.js:1) | Checks `req.user.role === 'admin'` |

### Error Responses

| Status Code | Meaning |
|-------------|---------|
| `400` | Bad Request — Missing or invalid parameters |
| `401` | Unauthorized — No token provided |
| `403` | Forbidden — Invalid/expired token, or insufficient role |
| `404` | Not Found — Resource doesn't exist |
| `500` | Internal Server Error |

---

## Auth Routes (`/api/auth`)

Base: `http://localhost:5001/api/auth`

### POST /register

Register a new user account.

**URL:** `/api/auth/register`
**Method:** `POST`
**Auth Required:** No

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "01712345678"        // optional
}
```

**Validation:**
- `name`, `email`, `password` are required
- Email must be unique

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 8,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
- `400` — `{ "error": "Name, email and password are required" }`
- `400` — `{ "error": "Email already registered" }`

---

### POST /login

Authenticate an existing user.

**URL:** `/api/auth/login`
**Method:** `POST`
**Auth Required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
- `401` — `{ "error": "Invalid email or password" }`

---

### POST /google

Google OAuth 2.0 login with automatic account creation. Supports real Google token verification with a mock fallback.

**URL:** `/api/auth/google`
**Method:** `POST`
**Auth Required:** No

**Real Google Login Request:**
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."  // Google ID token
}
```

**Mock/Development Login Request:**
```json
{
  "email": "googleuser@gmail.com",
  "name": "Google User",
  "googleId": "mock_google_id"
}
```

**Behavior:**
1. If `credential` is provided, verifies the ID token with Google's OAuth2Client
2. If verification fails and `email` is provided, falls back to mock mode
3. If only `email` is provided (no credential), uses mock mode directly
4. Creates a new user account if email doesn't exist
5. Updates `google_id` on existing accounts if not already set

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 8,
    "name": "Google User",
    "email": "googleuser@gmail.com",
    "role": "user"
  }
}
```

**Error Responses:**
- `400` — `{ "error": "No Google credentials provided" }`
- `500` — `{ "error": "Google login failed: <message>" }`

---

## Product Routes (`/api/products`)

Base: `http://localhost:5001/api/products`

### GET /

List all products with optional filtering, search, and pagination.

**URL:** `/api/products`
**Method:** `GET`
**Auth Required:** No

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category (case-insensitive): `men`, `women`, `belts` |
| `brand` | string | Filter by brand (case-insensitive) |
| `flash_sale` | string | Set to `"1"` to show only flash sale products |
| `search` | string | Search in `title` and `description` (LIKE `%term%`) |
| `limit` | integer | Maximum results to return |
| `offset` | integer | Results offset for pagination |

**Example Request:**
```
GET /api/products?category=men&brand=Naviforce&limit=10&offset=0
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "title": "Naviforce 9099L Brown",
    "slug": "naviforce-9099l-brown",
    "price": 2500,
    "original_price": 3500,
    "category": "men",
    "brand": "Naviforce",
    "description": "Premium analog watch with leather strap...",
    "stock": 15,
    "is_flash_sale": 1,
    "discount_percent": 29,
    "main_image": "/product-images/products/naviforce-9099-l-brown/naviforce-9099-l-brown.webp",
    "images_json": "[\"/product-images/products/naviforce-9099-l-brown/naviforce-9099-l-brown_01.webp\",...]",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### GET /:slugOrId

Get a single product by slug or numeric ID. Tries slug match first, then falls back to ID.

**URL:** `/api/products/:slugOrId`
**Method:** `GET`
**Auth Required:** No

**Example Requests:**
```
GET /api/products/naviforce-9099l-brown
GET /api/products/1
```

**Success Response (200):**
```json
{
  "id": 1,
  "title": "Naviforce 9099L Brown",
  "slug": "naviforce-9099l-brown",
  "price": 2500,
  "original_price": 3500,
  "category": "men",
  "brand": "Naviforce",
  "description": "Premium analog watch with leather strap...",
  "stock": 15,
  "is_flash_sale": 1,
  "discount_percent": 29,
  "main_image": "/product-images/products/naviforce-9099-l-brown/naviforce-9099-l-brown.webp",
  "images_json": "[\"/product-images/products/naviforce-9099-l-brown/naviforce-9099-l-brown_01.webp\",...]",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404` — `{ "error": "Product not found" }`

---

### POST /

Create a new product. Admin only.

**URL:** `/api/products`
**Method:** `POST`
**Auth Required:** Yes (JWT + Admin role)
**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Product display name |
| `price` | number | Yes | Selling price in BDT |
| `original_price` | number | No | Original price for discount display |
| `category` | string | Yes | Product category |
| `brand` | string | No | Brand name |
| `description` | string | No | Product description |
| `stock` | integer | No | Available stock (default: 10) |
| `is_flash_sale` | string | No | Set to `"1"` for flash sale |
| `discount_percent` | integer | No | Discount percentage (default: 0) |
| `images` | file[] | No | Product images (max 10 files, 10MB each) |

**File Upload:**
- Destination: `Legacy watches Web Images/uploads/`
- Filename: `{timestamp}-{random}.{ext}`
- Size limit: 10MB per file

**Slug Generation:**
The slug is auto-generated from the title: lowercase, non-alphanumeric characters replaced with hyphens, leading/trailing hyphens removed, with a timestamp suffix appended.

**Success Response (200):**
```json
{
  "id": 44,
  "message": "Product created successfully"
}
```

**Error Responses:**
- `400` — `{ "error": "Title, price and category are required" }`
- `401` — `{ "error": "Access denied. No token provided." }`
- `403` — `{ "error": "Admin access required" }`

---

### PUT /:id

Update an existing product. Admin only. If no new images are uploaded, existing images are preserved.

**URL:** `/api/products/:id`
**Method:** `PUT`
**Auth Required:** Yes (JWT + Admin role)
**Content-Type:** `multipart/form-data`

**Form Fields:** Same as POST /

**Success Response (200):**
```json
{
  "message": "Product updated successfully"
}
```

**Error Responses:**
- `404` — `{ "error": "Product not found" }`
- `401` — `{ "error": "Access denied. No token provided." }`
- `403` — `{ "error": "Admin access required" }`

---

### DELETE /:id

Delete a product. Admin only.

**URL:** `/api/products/:id`
**Method:** `DELETE`
**Auth Required:** Yes (JWT + Admin role)

**Success Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

**Error Responses:**
- `404` — `{ "error": "Product not found" }`
- `401` — `{ "error": "Access denied. No token provided." }`
- `403` — `{ "error": "Admin access required" }`

---

## Cart Routes (`/api/cart`)

Base: `http://localhost:5001/api/cart`
**All cart endpoints require JWT authentication.**

### GET /

Get all cart items for the authenticated user, with product details joined.

**URL:** `/api/cart`
**Method:** `GET`
**Auth Required:** Yes

**Success Response (200):**
```json
[
  {
    "id": 1,
    "quantity": 2,
    "product_id": 1,
    "title": "Naviforce 9099L Brown",
    "price": 2500,
    "main_image": "/product-images/products/naviforce-9099-l-brown/naviforce-9099-l-brown.webp",
    "stock": 15
  }
]
```

**Note:** The response includes `id` (cart item ID), `product_id` (product reference), and `stock` (for frontend stock validation).

---

### POST /

Add a product to the cart. If the product already exists in the user's cart, the quantity is incremented.

**URL:** `/api/cart`
**Method:** `POST`
**Auth Required:** Yes

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 1               // optional, defaults to 1
}
```

**Success Response (200):**
```json
{
  "message": "Added to cart"
}
```

**Error Responses:**
- `404` — `{ "error": "Product not found" }`
- `401` — `{ "error": "Access denied. No token provided." }`

---

### PUT /:id

Update the quantity of a cart item. If quantity is set below 1, the item is removed instead.

**URL:** `/api/cart/:id`
**Method:** `PUT`
**Auth Required:** Yes

**Request Body:**
```json
{
  "quantity": 3
}
```

**Success Response (200):**
```json
{
  "message": "Cart updated"
}
```

**When quantity < 1:**
```json
{
  "message": "Item removed"
}
```

---

### DELETE /:id

Remove a specific item from the cart.

**URL:** `/api/cart/:id`
**Method:** `DELETE`
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "message": "Removed from cart"
}
```

---

### DELETE /

Clear all items from the authenticated user's cart.

**URL:** `/api/cart`
**Method:** `DELETE`
**Auth Required:** Yes

**Success Response (200):**
```json
{
  "message": "Cart cleared"
}
```

---

## Watchlist Routes (`/api/watchlist`)

Base: `http://localhost:5001/api/watchlist`
**All watchlist endpoints require JWT authentication.**

### GET /

Get all watchlist items for the authenticated user, with product details joined.

**URL:** `/api/watchlist`
**Method:** `GET`
**Auth Required:** Yes

**Success Response (200):**
```json
[
  {
    "id": 1,
    "added_at": "2025-06-15T10:30:00.000Z",
    "product_id": 3,
    "title": "Curren 8363 Silver Blue",
    "price": 2200,
    "original_price": 3000,
    "main_image": "/product-images/products/curren-8363-silver-blue/curren-8363-silver-blue.webp",
    "discount_percent": 27
  }
]
```

---

### POST /

Add a product to the watchlist. A uniqueness constraint prevents duplicate entries.

**URL:** `/api/watchlist`
**Method:** `POST`
**Auth Required:** Yes

**Request Body:**
```json
{
  "product_id": 3
}
```

**Success Response (200):**
```json
{
  "message": "Added to watchlist"
}
```

**Error Responses:**
- `404` — `{ "error": "Product not found" }`
- `400` — `{ "error": "Already in watchlist" }`

---

### DELETE /:product_id

Remove a product from the watchlist. Note: the parameter is `product_id`, not the watchlist entry ID.

**URL:** `/api/watchlist/:product_id`
**Method:** `DELETE`
**Auth Required:** Yes

**Example Request:**
```
DELETE /api/watchlist/3
```

**Success Response (200):**
```json
{
  "message": "Removed from watchlist"
}
```

---

### GET /check/:product_id

Check whether a specific product is in the authenticated user's watchlist.

**URL:** `/api/watchlist/check/:product_id`
**Method:** `GET`
**Auth Required:** Yes

**Example Request:**
```
GET /api/watchlist/check/3
```

**Success Response (200):**
```json
{
  "inWatchlist": true
}
```

---

## Order Routes (`/api/orders`)

Base: `http://localhost:5001/api/orders`
**All order endpoints require JWT authentication. Admin endpoints also require admin role.**

### POST /

Place a new order. This endpoint:
1. Validates shipping details
2. Retrieves the user's cart items
3. Validates stock availability for each item
4. Calculates the total amount
5. Creates the order record with status `pending`
6. Creates order item records for each cart item
7. Decrements product stock
8. Clears the user's cart
9. All database operations run within a transaction

**URL:** `/api/orders`
**Method:** `POST`
**Auth Required:** Yes

**Request Body:**
```json
{
  "shipping_name": "John Doe",
  "shipping_phone": "01712345678",
  "shipping_address": "123 Gulshan Avenue, Dhaka",
  "payment_method": "cod",
  "note": "Please deliver after 5pm"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `shipping_name` | string | **Yes** | Recipient's full name |
| `shipping_phone` | string | **Yes** | Contact phone number |
| `shipping_address` | string | **Yes** | Delivery address |
| `payment_method` | string | No | Defaults to `"cod"` (Cash on Delivery) |
| `note` | string | No | Optional delivery instructions |

**Success Response (200):**
```json
{
  "orderId": 1,
  "message": "Order placed successfully",
  "total": 5000
}
```

**Error Responses:**
- `400` — `{ "error": "Shipping details are required" }`
- `400` — `{ "error": "Cart is empty" }`
- `400` — `{ "error": "Insufficient stock for: <product title>" }`

---

### GET /my

Get all orders for the authenticated user, ordered by most recent first.

**URL:** `/api/orders/my`
**Method:** `GET`
**Auth Required:** Yes

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "total_amount": 5000,
    "shipping_name": "John Doe",
    "shipping_phone": "01712345678",
    "shipping_address": "123 Gulshan Avenue, Dhaka",
    "payment_method": "cod",
    "note": "Please deliver after 5pm",
    "status": "pending",
    "created_at": "2025-06-15T10:30:00.000Z",
    "items_json": "[{\"title\":\"Naviforce 9099L Brown\",\"quantity\":2,\"price\":2500,\"image\":\"...\"}]"
  }
]
```

**Order Statuses:** `pending` → `confirmed` → `processing` → `shipped` → `delivered` / `cancelled`

---

### GET /admin/all

Get all orders across all users (admin only). Includes user name and email for each order.

**URL:** `/api/orders/admin/all`
**Method:** `GET`
**Auth Required:** Yes (JWT + Admin role)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "total_amount": 5000,
    "shipping_name": "John Doe",
    "shipping_phone": "01712345678",
    "shipping_address": "123 Gulshan Avenue, Dhaka",
    "payment_method": "cod",
    "note": "Please deliver after 5pm",
    "status": "pending",
    "created_at": "2025-06-15T10:30:00.000Z",
    "items_json": "[{\"title\":\"Naviforce 9099L Brown\",\"quantity\":2,\"price\":2500}]"
  }
]
```

---

### PUT /:id/status

Update the status of an order (admin only). Only valid status transitions are accepted.

**URL:** `/api/orders/:id/status`
**Method:** `PUT`
**Auth Required:** Yes (JWT + Admin role)

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Status Values:**
| Status | Description |
|--------|-------------|
| `pending` | Order placed, awaiting confirmation |
| `confirmed` | Order confirmed by admin |
| `processing` | Order being prepared |
| `shipped` | Order dispatched |
| `delivered` | Order successfully delivered |
| `cancelled` | Order cancelled |

**Success Response (200):**
```json
{
  "message": "Order status updated"
}
```

**Error Responses:**
- `400` — `{ "error": "Invalid status" }`

---

## Review Routes (`/api/reviews`)

Base: `http://localhost:5001/api/reviews`

### GET /

Get all reviews, optionally filtered by product.

**URL:** `/api/reviews`
**Method:** `GET`
**Auth Required:** No

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `product_id` | integer | Filter reviews for a specific product |
| `limit` | integer | Maximum results to return |

**Example Request:**
```
GET /api/reviews?product_id=1&limit=5
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "user_name": "John Doe",
    "product_id": 1,
    "rating": 5,
    "comment": "Excellent watch! The leather strap is premium quality.",
    "created_at": "2025-06-15T10:30:00.000Z"
  }
]
```

---

### POST /

Submit a review for a product. Requires authentication. The user's name is automatically fetched from the database.

**URL:** `/api/reviews`
**Method:** `POST`
**Auth Required:** Yes

**Request Body:**
```json
{
  "product_id": 1,
  "rating": 5,
  "comment": "Excellent watch! The leather strap is premium quality."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | integer | No | Product being reviewed |
| `rating` | integer | No | Rating 1-5 (defaults to 5) |
| `comment` | string | **Yes** | Review text |

**Success Response (200):**
```json
{
  "message": "Review submitted successfully"
}
```

**Error Responses:**
- `400` — `{ "error": "Comment is required" }`

---

### POST /guest

Submit a review without authentication (guest users). Requires a name.

**URL:** `/api/reviews/guest`
**Method:** `POST`
**Auth Required:** No

**Request Body:**
```json
{
  "user_name": "Jane Smith",
  "product_id": 1,
  "rating": 4,
  "comment": "Good quality for the price."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_name` | string | **Yes** | Display name for the review |
| `product_id` | integer | No | Product being reviewed |
| `rating` | integer | No | Rating 1-5 (defaults to 5) |
| `comment` | string | **Yes** | Review text |

**Success Response (200):**
```json
{
  "message": "Review submitted"
}
```

**Error Responses:**
- `400` — `{ "error": "Name and comment required" }`

---

## Health Check (`/api/health`)

### GET /api/health

Simple health check endpoint to verify the server is running.

**URL:** `/api/health`
**Method:** `GET`
**Auth Required:** No

**Success Response (200):**
```json
{
  "status": "OK",
  "message": "Legacy Watches API running"
}
```

---

## Admin Routes (`/api/admin`)

These routes are defined inline in [`server.js`](backend/server.js:46-58) rather than in separate route modules. Both require JWT authentication and admin role.

### GET /api/admin/stats

Get dashboard statistics for the admin panel.

**URL:** `/api/admin/stats`
**Method:** `GET`
**Auth Required:** Yes (JWT + Admin role)

**Success Response (200):**
```json
{
  "totalProducts": 43,
  "totalOrders": 12,
  "totalUsers": 6,
  "totalRevenue": 45000,
  "recentOrders": [
    {
      "id": 12,
      "user_id": 2,
      "user_name": "John Doe",
      "total_amount": 5000,
      "shipping_name": "John Doe",
      "shipping_phone": "01712345678",
      "shipping_address": "123 Gulshan Avenue, Dhaka",
      "payment_method": "cod",
      "note": null,
      "status": "pending",
      "created_at": "2025-06-15T10:30:00.000Z"
    }
  ]
}
```

**Note:** `totalRevenue` excludes cancelled orders. `totalUsers` counts only users with `role = "user"` (excludes admin).

---

### GET /api/admin/users

Get a list of all registered users (admin only).

**URL:** `/api/admin/users`
**Method:** `GET`
**Auth Required:** Yes (JWT + Admin role)

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@legacywatches.com",
    "phone": null,
    "role": "admin",
    "created_at": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01712345678",
    "role": "user",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
]
```

**Note:** Password hashes and Google IDs are excluded from the response for security.

---

## Database Architecture Note

The database is implemented as a **custom JSON-based adapter** in [`db.js`](backend/database/db.js), not a traditional SQL database. Key characteristics:

- All data is stored in a single [`db.json`](backend/database/db.json) file with 6 collections (arrays)
- The adapter parses SQL-like query strings to determine the operation type
- It operates on in-memory JavaScript arrays and persists changes to disk
- The API mimics the `better-sqlite3` interface: `prepare()`, `get()`, `all()`, `run()`, `exec()`, `transaction()`
- While `sqlite3` and `better-sqlite3` are listed as dependencies in [`package.json`](backend/package.json), they are not actually used at runtime

**Collections:**
| Collection | Seeded Count | Purpose |
|------------|-------------|---------|
| `users` | 7 (1 admin + 6 demo) | User accounts |
| `products` | 43 | Product catalog |
| `orders` | 0 | Customer orders |
| `cart` | 0 | Shopping cart items |
| `watchlist` | 0 | Saved favorites |
| `reviews` | 10 | Product reviews |

---

## Endpoint Summary

| # | Method | Endpoint | Auth | Admin | Description |
|---|--------|----------|------|-------|-------------|
| 1 | `POST` | `/api/auth/register` | — | — | Register new user |
| 2 | `POST` | `/api/auth/login` | — | — | Login with email/password |
| 3 | `POST` | `/api/auth/google` | — | — | Google OAuth login |
| 4 | `GET` | `/api/products` | — | — | List products with filters |
| 5 | `GET` | `/api/products/:slugOrId` | — | — | Get single product |
| 6 | `POST` | `/api/products` | ✅ | ✅ | Create product |
| 7 | `PUT` | `/api/products/:id` | ✅ | ✅ | Update product |
| 8 | `DELETE` | `/api/products/:id` | ✅ | ✅ | Delete product |
| 9 | `GET` | `/api/cart` | ✅ | — | Get cart items |
| 10 | `POST` | `/api/cart` | ✅ | — | Add to cart |
| 11 | `PUT` | `/api/cart/:id` | ✅ | — | Update cart quantity |
| 12 | `DELETE` | `/api/cart/:id` | ✅ | — | Remove from cart |
| 13 | `DELETE` | `/api/cart` | ✅ | — | Clear cart |
| 14 | `GET` | `/api/watchlist` | ✅ | — | Get watchlist |
| 15 | `POST` | `/api/watchlist` | ✅ | — | Add to watchlist |
| 16 | `DELETE` | `/api/watchlist/:product_id` | ✅ | — | Remove from watchlist |
| 17 | `GET` | `/api/watchlist/check/:product_id` | ✅ | — | Check watchlist status |
| 18 | `POST` | `/api/orders` | ✅ | — | Place order |
| 19 | `GET` | `/api/orders/my` | ✅ | — | Get user's orders |
| 20 | `GET` | `/api/orders/admin/all` | ✅ | ✅ | Get all orders |
| 21 | `PUT` | `/api/orders/:id/status` | ✅ | ✅ | Update order status |
| 22 | `GET` | `/api/reviews` | — | — | Get reviews |
| 23 | `POST` | `/api/reviews` | ✅ | — | Submit review |
| 24 | `POST` | `/api/reviews/guest` | — | — | Submit guest review |
| 25 | `GET` | `/api/health` | — | — | Health check |
| 26 | `GET` | `/api/admin/stats` | ✅ | ✅ | Dashboard statistics |
| 27 | `GET` | `/api/admin/users` | ✅ | ✅ | List all users |

**Total: 27 endpoints** (25 in route modules + 2 inline admin routes)

---

*Documentation generated from source code analysis of [`backend/server.js`](backend/server.js), [`backend/routes/`](backend/routes/), and [`backend/middleware/`](backend/middleware/). All request/response examples reflect the actual implementation.*