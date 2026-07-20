# Legacy Watches - Project Report

## 1. Executive Summary
Legacy Watches is a comprehensive e-commerce platform designed for selling premium watches online. Built as a university project, it demonstrates a complete full-stack web development workflow, encompassing an elegant user interface, secure user authentication, product management, and a seamless checkout process.

## 2. Problem Statement & Objectives
Traditional watch retail lacks the convenience of browsing diverse catalogs from home. The objective of this project was to build a modern web application that allows users to:
- Browse and search for watches categorized by brand, gender, and type.
- Maintain a personal shopping cart and a "Watchlist" (favorites).
- Place orders securely and track order history.
- Provide administrators with a dashboard to monitor sales, products, and users.

## 3. Technology Stack
The platform utilizes a modern, decoupled architecture:
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** SQLite (File-based DB with custom JSON wrapper for rapid prototyping)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt for password hashing

## 4. Key Features Implemented

### User-Facing Features:
1. **Product Catalog & Filtering:** Dynamic fetching of products with support for category filters and search functionality.
2. **Flash Sales:** A dedicated section highlighting discounted items.
3. **Cart & Checkout:** Interactive cart management connected to the database to persist user selections.
4. **User Profiles:** Order history tracking and watchlist management.
5. **Reviews & Ratings:** Users can leave feedback on purchased items.

### Admin Features:
1. **Dashboard Analytics:** Visual summary of total revenue, active orders, and user count.
2. **Order Management:** Tracking recent orders and customer details.

## 5. Security & Best Practices
- **Password Hashing:** Utilizing `bcryptjs` to ensure passwords are never stored in plain text.
- **Protected Routes:** Express middleware verifies JWT tokens before granting access to sensitive endpoints (e.g., placing an order, viewing user profiles).
- **CORS Configuration:** Ensuring the backend only accepts requests from the authorized Next.js client origins.

## 6. Future Enhancements
- Integration of a real payment gateway (e.g., Stripe, SSLCommerz).
- Migration from SQLite/JSON to a robust relational database like PostgreSQL for production scaling.
- Implementing an email notification system for order confirmations.
