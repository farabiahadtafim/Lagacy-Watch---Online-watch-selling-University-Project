# Architecture Diagrams

This document contains publication-ready diagrams representing the architecture and design of the Legacy Watches e-commerce platform. These can be used in presentations, reports, and documentation.

## 1. High-Level System Architecture

The project follows a standard 3-tier architecture, utilizing a decoupled frontend and backend for scalability and maintainability.

```mermaid
graph TD
    Client[Web Browser / User] -->|HTTP / REST API| Frontend[Next.js Frontend App]
    
    subgraph Frontend Layer
        Frontend --> |State Management| Context[React Context API]
        Frontend --> |UI Components| Tailwind[Tailwind CSS Components]
        Frontend --> |API Calls| Axios[Axios Client]
    end

    Axios -->|JSON over HTTP| Backend[Express.js Backend API]
    
    subgraph Backend Layer
        Backend --> |Routing| Routes[Express Routes]
        Routes --> |Validation & Business Logic| Controllers[Controllers / Middleware]
        Controllers --> |Database Queries| DBAdapter[SQLite Adapter]
    end

    DBAdapter -->|Read / Write| Database[(SQLite Database)]
```

## 2. Component Diagram

A closer look at the specific modules and routes that make up the system.

```mermaid
graph LR
    subgraph "Next.js Frontend (App Router)"
        Home[Page: /]
        Shop[Page: /shop]
        Product[Page: /products/:slug]
        UserDash[Page: /profile, /orders]
        AdminDash[Page: /admin/*]
        Cart[Page: /cart]
    end

    subgraph "Express Backend Routes"
        AuthAPI[/api/auth]
        ProductAPI[/api/products]
        CartAPI[/api/cart]
        OrderAPI[/api/orders]
        ReviewAPI[/api/reviews]
        AdminAPI[/api/admin]
    end

    Home --> ProductAPI
    Shop --> ProductAPI
    Product --> ProductAPI
    Product --> ReviewAPI
    UserDash --> AuthAPI
    UserDash --> OrderAPI
    AdminDash --> AdminAPI
    Cart --> CartAPI
```

## 3. Entity-Relationship Diagram (ERD)

The database schema, implemented via a local JSON/SQLite adapter, consists of the following core entities and their relationships.

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--o{ CART_ITEMS : adds
    USERS ||--o{ WATCHLIST_ITEMS : saves
    USERS ||--o{ REVIEWS : writes
    PRODUCTS ||--o{ REVIEWS : receives
    PRODUCTS ||--o{ CART_ITEMS : contained_in
    PRODUCTS ||--o{ WATCHLIST_ITEMS : watched_in

    USERS {
        int id PK
        string name
        string email
        string password_hash
        string phone
        string google_id
        string role
        datetime created_at
    }

    PRODUCTS {
        int id PK
        string title
        string slug
        float price
        float original_price
        string category
        string brand
        int stock
        boolean is_flash_sale
        float discount_percent
        string main_image
    }

    ORDERS {
        int id PK
        int user_id FK
        float total_amount
        string shipping_name
        string shipping_address
        string status
        datetime created_at
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
        datetime added_at
    }

    REVIEWS {
        int id PK
        int product_id FK
        string user_name
        int rating
        string comment
        datetime created_at
    }
```
