# Legacy Watches — REST API Documentation

**Base URL:** `http://localhost:5001/api`
**Content-Type:** `application/json`
**Authentication:** Bearer Token (JWT) in `Authorization` header for protected routes

---

## Table of Contents

1. [Authentication (`/auth`)](#1-authentication-auth)
2. [Products (`/products`)](#2-products-products)
3. [Cart (`/cart`)](#3-cart-cart)
4. [Watchlist (`/watchlist`)](#4-watchlist-watchlist)
5. [Orders (`/orders`)](#5-orders-orders)
6. [Reviews (`/reviews`)](#6-reviews-reviews)
7. [Admin Endpoints (inline in `server.js`)](#7-admin-endpoints)

---

## 1. Authentication (`/auth`)

### `POST /auth/register`

Register a new user account. Returns a JWT token and user object on success.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full name of the user |
| `email` | string | Yes | Unique email address |
| `password` | string | Yes | Password (hashed with bcryptjs) |
| `phone` | string | No | Phone number |

**Request:**
```json
{
  "name": "Rafsan Alam",
  "email": "rafsan@example.com",
  "password": "securepass123",
  "phone": "01712345678"
}
```

**Response `200 OK`:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 8,
    "name": "Rafsan Alam",
    "email": "rafsan@example.com",
    "role": "user"
  }
}
```

**Error `400`:**
```json
{ "error": "User already exists" }
```
```json
{ "error": "All fields are required" }
```

---

### `POST /auth/login`

Authenticate an existing user with email and password.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Registered email |
| `password` | string | Yes | Account password |

**Request:**
```json
{
  "email": "admin@legacywatches.com",
  "password": "admin123"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@legacywatches.com",
    "role": "admin"
  }
}
```

**Error `400`:**
```json
{ "error": "Invalid credentials" }
```

---

### `POST /auth/google`

Authenticate or register a user via Google OAuth. If the Google ID is not recognized, a mock user is created.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `credential` | string | Yes | Google ID token from `@react-oauth/google` |

**Request:**
```json
{
  "credential": "google-id-token-string"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 9,
    "name": "Google User",
    "email": "googleuser@gmail.com",
    "role": "user"
  }
}
```

**Note:** The backend has a mock fallback. If Google token verification fails, it creates a mock user with `google_id: 'mock-google-id'` and default credentials.

---

## 2. Products (`/products`)

### `GET /products`

Fetch all products with optional filtering, search, and pagination.

| Query Parameter | Type | Default | Description |
|-----------------|------|---------|-------------|
| `category` | string | — | Filter by category: `men`, `women`, `belts` |
| `brand` | string | — | Filter by brand: `Naviforce`, `Curren`, `Poedagar`, `Casio`, `Skmei` |
| `flash_sale` | number | — | Set to `1` to show only flash sale products |
| `search` | string | — | Search term matched against `title` |
| `limit` | number | — | Maximum number of results to return |
| `offset` | number | — | Number of results to skip (for pagination) |

**Example:**
```
GET /api/products?category=men&brand=Naviforce&limit=8
```

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "title": "Naviforce NF9226 Black",
    "slug": "naviforce-nf9226-black",
    "price": 3200,
    "original_price": 3800,
    "discount_percent": 16,
    "category": "men",
    "brand": "Naviforce",
    "stock": 25,
    "description": "Premium stainless steel...",
    "tags": "sports,waterproof,military",
    "is_flash_sale": 0,
    "main_image": "/products/naviforce-nf9226-black/naviforce-nf9226-black.webp",
    "images": "[\"image_01.webp\",\"image_02.webp\",\"image_03.jpg\"]",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### `GET /products/:slugOrId`

Fetch a single product by its slug or numeric ID.

**Example:**
```
GET /api/products/naviforce-nf9226-black
GET /api/products/1
```

**Response `200 OK`:**
```json
{
  "id": 1,
  "title": "Naviforce NF9226 Black",
  "slug": "naviforce-nf9226-black",
  "price": 3200,
  "original_price": 3800,
  "discount_percent": 16,
  "category": "men",
  "brand": "Naviforce",
  "stock": 25,
  "description": "Premium stainless steel watch with Japanese quartz movement...",
  "tags": "sports,waterproof,military",
  "is_flash_sale": 0,
  "main_image": "/products/naviforce-nf9226-black/naviforce-nf9226-black.webp",
  "images": "[\"image_01.webp\",\"image_02.webp\",\"image_03.jpg\"]",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

**Error `404`:**
```json
{ "error": "Product not found" }
```

---

### `POST /products` 🔒 Admin

Create a new product. Accepts `multipart/form-data` with image uploads via multer.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Product title |
| `price` | number | Yes | Selling price in BDT |
| `original_price` | number | Yes | Original price (MRP) |
| `discount_percent` | number | No | Discount percentage |
| `category` | string | Yes | `men`, `women`, or `belts` |
| `brand` | string | Yes | Brand name |
| `stock` | number | Yes | Available quantity |
| `description` | string | No | Product description |
| `tags` | string | No | Comma-separated tags |
| `is_flash_sale` | number | No | `1` for flash sale, `0` otherwise |
| `main_image` | file | Yes | Main product image |
| `images` | file[] | No | Additional product images |

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
Content-Type: multipart/form-data
```

---

### `PUT /products/:id` 🔒 Admin

Update an existing product by ID. Accepts `multipart/form-data`.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
Content-Type: multipart/form-data
```

---

### `DELETE /products/:id` 🔒 Admin

Delete a product by ID.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response `200 OK`:**
```json
{ "message": "Product deleted" }
```

---

## 3. Cart (`/cart`)

**All cart endpoints require authentication.** 🔒

### `GET /cart`

Fetch the current user's cart with product details joined in.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "product_id": 5,
    "quantity": 2,
    "title": "Curren 8391 Chronograph",
    "price": 4500,
    "main_image": "/products/curren-8391-chronograph/curren-8391-chronograph.webp"
  }
]
```

---

### `POST /cart`

Add an item to the cart. If the product already exists in the user's cart, the quantity is incremented (upsert behavior).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | number | Yes | ID of the product to add |
| `quantity` | number | No | Quantity (defaults to 1) |

**Request:**
```json
{
  "product_id": 5,
  "quantity": 2
}
```

**Response `200 OK`:**
```json
{ "message": "Added to cart" }
```

---

### `PUT /cart/:id`

Update the quantity of a cart item. If quantity is set to less than 1, the item is removed.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `quantity` | number | Yes | New quantity value |

**Request:**
```json
{
  "quantity": 3
}
```

**Response `200 OK`:**
```json
{ "message": "Cart updated" }
```

---

### `DELETE /cart/:id`

Remove a single item from the cart by cart item ID.

**Response `200 OK`:**
```json
{ "message": "Item removed" }
```

---

### `DELETE /cart`

Clear all items from the current user's cart.

**Response `200 OK`:**
```json
{ "message": "Cart cleared" }
```

---

## 4. Watchlist (`/watchlist`)

**All watchlist endpoints require authentication.** 🔒

### `GET /watchlist`

Fetch the current user's watchlist with product details joined.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "product_id": 12,
    "added_at": "2025-06-15T10:30:00.000Z",
    "title": "Casio G-Shock GA-2100",
    "price": 8500,
    "original_price": 9500,
    "discount_percent": 11,
    "main_image": "/products/casio-g-shock-ga2100/casio-g-shock-ga2100.webp",
    "brand": "Casio",
    "category": "men"
  }
]
```

---

### `POST /watchlist`

Add a product to the user's watchlist.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | number | Yes | ID of the product to watchlist |

**Request:**
```json
{
  "product_id": 12
}
```

**Response `200 OK`:**
```json
{ "message": "Added to watchlist" }
```

**Error `400`:**
```json
{ "error": "Product already in watchlist" }
```

---

### `DELETE /watchlist/:product_id`

Remove a product from the watchlist by product ID.

**Response `200 OK`:**
```json
{ "message": "Removed from watchlist" }
```

---

### `GET /watchlist/check/:product_id`

Check if a specific product is in the current user's watchlist.

**Response `200 OK` (in watchlist):**
```json
{ "inWatchlist": true }
```

**Response `200 OK` (not in watchlist):**
```json
{ "inWatchlist": false }
```

---

## 5. Orders (`/orders`)

**All order endpoints require authentication.** 🔒

### `POST /orders`

Place a new order. Validates stock availability, creates order + order items, reduces stock, and clears the user's cart.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `shipping_name` | string | Yes | Recipient's full name |
| `shipping_phone` | string | Yes | Contact phone number |
| `shipping_address` | string | Yes | Delivery address |
| `payment_method` | string | Yes | `cod` (Cash on Delivery) or `online` |
| `note` | string | No | Special delivery instructions |

**Request:**
```json
{
  "shipping_name": "Rafsan Alam",
  "shipping_phone": "01712345678",
  "shipping_address": "House 12, Road 5, Gulshan-1, Dhaka 1212",
  "payment_method": "cod",
  "note": "Please deliver after 5 PM"
}
```

**Response `200 OK`:**
```json
{
  "message": "Order placed successfully",
  "orderId": 1
}
```

**Error `400`:**
```json
{ "error": "Cart is empty" }
```
```json
{ "error": "Insufficient stock for <product name>" }
```

---

### `GET /orders/my`

Fetch the current user's order history. Each order includes `items_json` containing a serialized JSON array of order items.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "total_amount": 7700,
    "shipping_name": "Rafsan Alam",
    "shipping_phone": "01712345678",
    "shipping_address": "House 12, Road 5, Gulshan-1, Dhaka 1212",
    "payment_method": "cod",
    "status": "pending",
    "note": "Please deliver after 5 PM",
    "items_json": "[{\"title\":\"Naviforce NF9226\",\"price\":3200,\"quantity\":1,\"image\":\"/products/...\"},{\"title\":\"Curren 8391\",\"price\":4500,\"quantity\":1,\"image\":\"/products/...\"}]",
    "created_at": "2025-06-20T08:00:00.000Z"
  }
]
```

**Order Statuses:**
| Status | Description |
|--------|-------------|
| `pending` | Order placed, awaiting confirmation |
| `confirmed` | Order confirmed by admin |
| `processing` | Order being prepared |
| `shipped` | Order dispatched |
| `delivered` | Order delivered to customer |
| `cancelled` | Order cancelled |

---

### `GET /orders/admin/all` 🔒 Admin

Fetch all orders across all users with user information joined.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "user_name": "Rafsan Alam",
    "user_email": "rafsan@example.com",
    "total_amount": 7700,
    "shipping_name": "Rafsan Alam",
    "shipping_phone": "01712345678",
    "shipping_address": "House 12, Road 5, Gulshan-1, Dhaka 1212",
    "payment_method": "cod",
    "status": "pending",
    "note": "Please deliver after 5 PM",
    "items_json": "[...]",
    "created_at": "2025-06-20T08:00:00.000Z"
  }
]
```

---

### `PUT /orders/:id/status` 🔒 Admin

Update the status of an order.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | Yes | One of: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled` |

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request:**
```json
{
  "status": "shipped"
}
```

**Response `200 OK`:**
```json
{ "message": "Order status updated" }
```

---

## 6. Reviews (`/reviews`)

### `GET /reviews`

Fetch all reviews, optionally filtered by product.

| Query Parameter | Type | Description |
|-----------------|------|-------------|
| `product_id` | number | Filter reviews for a specific product |

**Example:**
```
GET /api/reviews?product_id=1
```

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "product_id": 1,
    "user_name": "Karim Ahmed",
    "rating": 5,
    "comment": "Excellent build quality. The watch exceeded my expectations.",
    "created_at": "2025-05-10T00:00:00.000Z"
  }
]
```

---

### `POST /reviews` 🔒

Submit a review for a product. Requires authentication.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | number | Yes | ID of the product being reviewed |
| `rating` | number | Yes | Rating from 1 to 5 |
| `comment` | string | Yes | Review text content |

**Request:**
```json
{
  "product_id": 1,
  "rating": 5,
  "comment": "Outstanding craftsmanship. Highly recommended."
}
```

**Response `200 OK`:**
```json
{ "message": "Review added" }
```

---

### `POST /reviews/guest`

Submit a review without authentication (guest review). The user name is provided in the request.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | number | Yes | ID of the product being reviewed |
| `user_name` | string | Yes | Display name for the review |
| `rating` | number | Yes | Rating from 1 to 5 |
| `comment` | string | Yes | Review text content |

**Request:**
```json
{
  "product_id": 1,
  "user_name": "Guest Shopper",
  "rating": 4,
  "comment": "Great value for money."
}
```

**Response `200 OK`:**
```json
{ "message": "Review added" }
```

---

## 7. Admin Endpoints

These endpoints are defined directly in [`server.js`](backend/server.js:38) and require admin authentication.

### `GET /api/admin/stats` 🔒 Admin

Retrieve aggregate statistics for the admin dashboard.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response `200 OK`:**
```json
{
  "totalProducts": 43,
  "totalOrders": 12,
  "totalUsers": 7,
  "totalRevenue": 154800,
  "recentOrders": [
    {
      "id": 12,
      "user_name": "Rafsan Alam",
      "total_amount": 7700,
      "status": "pending",
      "payment_method": "cod",
      "created_at": "2025-06-20T08:00:00.000Z"
    }
  ]
}
```

---

### `GET /api/admin/users` 🔒 Admin

Fetch a list of all registered users (excluding password hashes).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@legacywatches.com",
    "phone": "01700000000",
    "role": "admin",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
]
```

---

## Global Error Handling

All endpoints may return the following generic errors:

**`401 Unauthorized`:**
```json
{ "error": "Access denied. No token provided." }
```
```json
{ "error": "Invalid token." }
```

**`403 Forbidden`:**
```json
{ "error": "Access denied. Admin only." }
```

**`500 Internal Server Error`:**
```json
{ "error": "Server error" }
```

---

## Image URLs

Product images are served statically from the `Legacy watches Web Images` directory. The `main_image` field contains a relative path like:

```
/products/naviforce-nf9226-black/naviforce-nf9226-black.webp
```

The complete URL is constructed as:
```
http://localhost:5001/product-images/naviforce-nf9226-black/naviforce-nf9226-black.webp
```

The frontend constructs image URLs via the [`imgUrl()`](frontend/lib/api.js:76) helper function in [`api.js`](frontend/lib/api.js:76).

---

## Rate Limiting & CORS

- **CORS Origins:** `http://localhost:3000` and `http://localhost:3001`
- **Credentials:** Enabled (cookies/auth headers allowed)
- No rate limiting is currently implemented.

---

## Authentication Flow

```
1. User registers or logs in → receives JWT token
2. Frontend stores token in localStorage (key: 'token')
3. Axios interceptor in api.js attaches token to all requests
4. Backend auth middleware verifies token on protected routes
5. Token payload: { id, email, role }
```

**JWT Secret:** `legacy_watches_secret_2024` (configured in [`auth.js`](backend/middleware/auth.js:4))

**Token Expiry:** None set (tokens do not expire)

---

## Database Architecture Note

The backend uses a custom JSON-based database adapter ([`db.js`](backend/database/db.js:23)) that:

1. Parses SQL-like query strings to determine the operation type
2. Operates on in-memory JavaScript arrays loaded from [`db.json`](backend/database/db.json)
3. Persists changes back to the JSON file after write operations
4. Mimics the SQLite API (`prepare`, `get`, `all`, `run`, `exec`, `transaction`)

This is a **prototype database** — not a real SQLite instance. The `sqlite3` and `better-sqlite3` packages in `package.json` are unused. All data is stored in a single JSON file.
