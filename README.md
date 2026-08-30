# ⏱️ Legacy Watches — Luxury E-Commerce & Timepiece Platform

<div align="center">

[![GitHub Repo](https://img.shields.io/badge/📦_GitHub_Repo-farabiahadtafim-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/farabiahadtafim/Lagacy-Watch---Online-watch-selling-University-Project)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.22-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Better--SQLite3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

**A full-stack, enterprise-grade luxury watch showcase, e-commerce, and admin management web platform.**  
*Crafted for University Project Defense.*

</div>

---

## 🔗 Quick Links & Repository

| Destination | Link | Description |
| :--- | :--- | :--- |
| 📦 **GitHub Repository** | [**github.com/farabiahadtafim/Lagacy-Watch-...**](https://github.com/farabiahadtafim/Lagacy-Watch---Online-watch-selling-University-Project) | Complete full-stack source code |
| 📚 **Defense Package** | [**./defense_package**](./defense_package/) | High-level reports, diagrams & specs |
| 🎤 **Presentation Speech** | [**./Presentation**](./Presentation/) | Banglish speech script, slides & guides |

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [System Architecture](#-system-architecture)
5. [Directory Structure](#-directory-structure)
6. [Database Schema](#-database-schema)
7. [Installation & Setup Guide](#-installation--setup-guide)
8. [API Reference](#-api-reference)
9. [Admin Credentials](#-admin-credentials)
10. [Security & Authentication](#-security--authentication)
11. [Defense Materials](#-project-defense-materials)
12. [Author & Acknowledgements](#-author--acknowledgements)

---

## 📖 Project Overview

**Legacy Watches** is a modern, responsive luxury e-commerce web application engineered with **Next.js 16 (React 19)** on the frontend and **Node.js / Express** with **Better-SQLite3** on the backend.

The platform provides a high-end luxury shopping experience featuring premium brands (Naviforce, Poedagar, Skmei, Smartwatches), an interactive watch explorer, dynamic cart & watchlist, secure checkout, customer review system, and a comprehensive admin portal.

### 📊 Key Metrics

| Metric | Details |
|:---|:---|
| **Frontend Framework** | Next.js 16.2.4 (App Router) + React 19 + Tailwind CSS 4 |
| **Backend Framework** | Express.js 4.22 + Better-SQLite3 |
| **Authentication** | JWT (JSON Web Tokens) + Google OAuth 2.0 |
| **Catalog** | Men's, Women's, Smart Watches, Chronographs, Luxury Watches |
| **Database** | SQLite with auto-migration, auto-seeding (`db.json` & `db.js`) |
| **Admin Suite** | Real-time analytics, order tracking, product CRUD, user management, contact inbox |

---

## ✨ Key Features

### 🛍️ 1. Customer Shopping Experience
- **Hero & Featured Showcase**: Dynamic hero banners, category spotlights, and latest timepiece releases.
- **Interactive Watch Explorer**: Real-time filtering by category, price range, brand, and movement type.
- **Product Detail Pages (`/product/[id]`)**: Multi-angle image galleries, technical specifications, warranty info, related products, and user reviews.
- **Flash Sale Engine (`/flash-sale`)**: Discounted product section with countdown and promotional badges.
- **Cart & Watchlist Management**: Client-side context synchronised with backend API for persistent saved watches and cart items.
- **Streamlined Checkout (`/checkout`)**: Multi-step checkout with delivery address capture and invoice summary.

### ⭐ 2. Review & Social Proof System
- **Product Reviews & Ratings**: 5-star rating submission and display.
- **Bengali & English Reviews**: Pre-seeded authentic localized customer feedback.
- **Customer Photo & Feedback Showcase**: Dedicated review wall (`/reviews`).

### 🛠️ 3. Admin Control Suite (`/admin`)
- **Executive Dashboard**: Total revenue, total orders, registered user counts, and real-time revenue analytics.
- **Inventory Management (`/admin/products`)**: Add new timepieces with multi-image upload, edit pricing, manage stock status.
- **Order Management (`/admin/orders`)**: View orders, filter by status (Pending, Processing, Delivered, Cancelled), and update fulfillment stages.
- **User Management (`/admin/users`)**: Inspect customer list, registration dates, and role assignments.
- **Message Inbox (`/admin/messages`)**: View and respond to customer inquiries from the contact form.

---

## 🛠️ Technology Stack

```
Frontend:     Next.js 16 (App Router)  •  React 19  •  Tailwind CSS 4  •  Lucide Icons  •  Swiper.js
Backend:      Node.js  •  Express.js  •  Better-SQLite3 / SQLite3  •  Multer  •  Sharp
Auth & Sec:   JSON Web Tokens (JWT)  •  Bcrypt.js  •  Google Auth Library  •  CORS
Deployment:   Netlify (`netlify.toml`)  •  Vercel  •  PM2 / Node Server
```

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 16 CLIENT                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │   Home &     │  │ Product View │  │ Cart / Check │  │ Admin View │  │
│  │ Shop (`/`)   │  │ (`/product`) │  │   out Pages  │  │ (`/admin`) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  │
│         │                 │                 │                │         │
│  ┌──────┴─────────────────┴─────────────────┴────────────────┴──────┐  │
│  │               React Context & Axios API Client                   │  │
│  └────────────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ HTTP / REST API (JSON)
┌───────────────────────────────────┼────────────────────────────────────┐
│                       EXPRESS.JS BACKEND                               │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │  auth.js      │  │ products.js   │  │  orders.js   │  │cart.js   │  │
│  │  (JWT/Google) │  │  (Catalog)    │  │ (Fulfillment)│  │(Watchlist│  │
│  └──────┬────────┘  └───────┬───────┘  └──────┬───────┘  └────┬─────┘  │
│         │                   │                 │               │        │
│  ┌──────┴───────────────────┴─────────────────┴───────────────┴─────┐  │
│  │                     Better-SQLite3 Layer                         │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │
┌─────────────────────────────────────┼──────────────────────────────────┐
│                          SQLITE DATABASE                               │
│    users  •  products  •  orders  •  order_items  •  cart  •  reviews  │
│    watchlist  •  messages  •  auto-seeding engine                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
Legacy Watches Project 2/
├── 📄 README.md                        # Full project overview & documentation
├── 📄 netlify.toml                     # Netlify deployment configuration
├── 📄 start.bat                        # 1-Click Windows startup script
│
├── 📂 frontend/                        # Next.js 16 Client Application
│   ├── 📂 app/                         # App Router Pages
│   │   ├── 📂 (auth)/                  # Login & Registration Pages
│   │   ├── 📂 (user)/                  # Shop, About, Product, Cart, Checkout, Watchlist
│   │   ├── 📂 admin/                   # Admin Dashboard, Orders, Products, Messages, Users
│   │   ├── 📄 layout.tsx               # Root layout & context providers
│   │   └── 📄 page.tsx                 # Homepage
│   ├── 📂 components/                  # Navbar, Footer, ProductCard, AuthModal, WatchExplorer
│   ├── 📂 lib/                         # API client (`api.js`), Context & wrappers
│   ├── 📄 package.json                 # Frontend dependencies (React 19, Next 16, Tailwind 4)
│   └── 📄 next.config.ts / .mjs        # Next.js build configurations
│
├── 📂 backend/                         # Node.js & Express REST Backend
│   ├── 📂 database/                    # Database schema (`db.js`), JSON seed & migration
│   ├── 📂 middleware/                  # JWT auth & admin authorization guards
│   ├── 📂 routes/                      # Products, Auth, Cart, Orders, Reviews, Watchlist, Messages
│   ├── 📄 server.js                    # Express app entrypoint & static asset server
│   ├── 📄 package.json                 # Backend dependencies (better-sqlite3, multer, jwt)
│   └── 📄 .env.example                 # Environment configuration template
│
├── 📂 defense_package/                 # Publication-Ready University Defense Assets
│   ├── 📄 architecture_diagrams.md     # Detailed architecture & ERD diagrams
│   ├── 📄 api_documentation.md         # Full REST API endpoints & payload schemas
│   ├── 📄 technical_specification.md   # Non-functional requirements & data flow
│   ├── 📄 presentation_slides.md       # Slide deck text & structure
│   └── 📄 project_report.md            # Comprehensive academic project report
│
├── 📂 Presentation/                    # Presentation Scripts & Defense Materials
│   ├── 📄 Legacy_Watches_Banglish_Speech_Script.docx  # Full defense spoken script
│   └── 📄 api_documentation.md / project_report.md
│
├── 📂 "Legacy watches Web Images"/      # High-Resolution Watch Photography & Brand Assets
└── 📂 Fonts/                           # Typography & Brand Fonts
```

---

## 🗄️ Database Schema

The SQLite relational database maintains the following models:

```
users (id, name, email, password, phone, role, created_at)
  ├── orders (id, user_id, total_amount, shipping_address, payment_method, status, created_at)
  │     └── order_items (id, order_id, product_id, quantity, price)
  │
  ├── cart (id, user_id, product_id, quantity)
  ├── watchlist (id, user_id, product_id)
  └── reviews (id, user_id, product_id, rating, comment, user_name, created_at)

products (id, name, brand, category, price, discount_price, description, images, stock, specs)
messages (id, name, email, subject, message, created_at)
```

---

## 🚀 Installation & Setup Guide

### 1. Prerequisites
- **Node.js**: Version 18.x or higher
- **NPM**: Version 9.x or higher

### 2. Quick Start (Windows 1-Click)
Simply double-click [`start.bat`](./start.bat) to launch both the backend and frontend servers simultaneously in separate terminals.

### 3. Manual Setup

```bash
# Step 1: Clone repository
git clone https://github.com/farabiahadtafim/Lagacy-Watch---Online-watch-selling-University-Project.git
cd Lagacy-Watch---Online-watch-selling-University-Project

# Step 2: Set up Backend
cd backend
npm install
npm run dev

# Step 3: Set up Frontend (in a new terminal)
cd ../frontend
npm install
npm run dev
```

### 4. Access URLs
- **Web Storefront**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001/api/health](http://localhost:5001/api/health)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🔑 Admin Credentials

Upon initial launch, the SQLite database seeds an administrative account:

| Role | Email | Password |
|:---|:---|:---|
| **System Administrator** | `admin@legacywatches.com` | `admin123` |

---

## 🔌 API Reference

### Products API (`/api/products`)
- `GET /api/products` — Retrieve all watches (supports filtering by brand, category, price)
- `GET /api/products/:id` — Get detailed product specifications & images
- `POST /api/products` — (Admin) Add new watch with image uploads
- `PUT /api/products/:id` — (Admin) Update watch details & pricing
- `DELETE /api/products/:id` — (Admin) Delete watch

### Authentication API (`/api/auth`)
- `POST /api/auth/register` — Create new user account
- `POST /api/auth/login` — Login with email/password and receive JWT
- `POST /api/auth/google` — Authenticate via Google OAuth
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Orders & Cart API (`/api/orders`, `/api/cart`)
- `GET /api/cart` — Fetch user cart items
- `POST /api/cart` — Add item to cart
- `POST /api/orders` — Submit customer order
- `GET /api/orders` — Retrieve user order history (or all orders for Admin)
- `PUT /api/orders/:id/status` — (Admin) Update order fulfillment status

---

## 🔒 Security & Authentication

- **JWT Authentication**: Secure token-based session management stored in client state and validated on protected backend routes.
- **Password Hashing**: Bcrypt with salt rounds for secure password storage.
- **Protected Admin Routes**: Role-based access control (RBAC) middleware verifying `role === 'admin'`.
- **CORS & CSP Configuration**: Secure cross-origin header management for serving assets and API requests.

---

## 📚 Project Defense Materials

Full academic documentation is organized inside [`defense_package/`](./defense_package/):
- 📑 [System Architecture & ERD Diagram](./defense_package/architecture_diagrams.md)
- 📑 [Comprehensive API Documentation](./defense_package/api_documentation.md)
- 📑 [Full Project Report](./defense_package/project_report.md)
- 📑 [Technical Specification](./defense_package/technical_specification.md)
- 📑 [Presentation Slides](./defense_package/presentation_slides.md)
- 🎤 [Banglish Speech Script](./Presentation/Legacy_Watches_Banglish_Speech_Script.docx)

---

## 👨‍💻 Author & Acknowledgements

- **Developer**: Farabi Ahad Tafim
- **GitHub**: [@farabiahadtafim](https://github.com/farabiahadtafim)
- **Repository**: [Lagacy-Watch---Online-watch-selling-University-Project](https://github.com/farabiahadtafim/Lagacy-Watch---Online-watch-selling-University-Project)
- **Purpose**: Academic University Project Defense

---

<div align="center">

**⏱️ Legacy Watches — Precision, Elegance, Timeless Heritage.**  
*Crafted for Excellence.*

</div>
