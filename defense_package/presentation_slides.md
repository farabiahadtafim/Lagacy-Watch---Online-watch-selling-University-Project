# Legacy Watches — Project Defense Presentation

**Presentation Duration:** 15–20 minutes
**Total Slides:** 18
**Suggested Format:** PowerPoint / Google Slides / Canva

---

## Slide 1: Title Slide

**Title:** Legacy Watches — A Premium E-Commerce Platform
**Subtitle:** Full-Stack Web Development Project
**Presenter Name:** [Your Name]
**Course:** [Course Name]
**Date:** June 2026

**Visual:** Full-screen background image of a luxury watch (use any product image from the project). Dark overlay with gold text.

---

## Slide 2: Agenda

**Title:** Presentation Outline

**Content:**
1. Project Overview & Motivation
2. Technology Stack
3. System Architecture
4. Database Design
5. Key Features Demonstration
6. Authentication & Security
7. Admin Dashboard
8. Challenges & Solutions
9. Future Enhancements
10. Q&A

**Visual:** Minimal list with gold bullet points on dark background.

---

## Slide 3: Project Overview

**Title:** What is Legacy Watches?

**Content:**
- A full-stack e-commerce platform for premium watch retail
- Built for the Bangladeshi market with local pricing (BDT)
- Serves 3 product categories: Men's Watches, Women's Watches, Luxury Straps
- Features products from 5 major brands: Naviforce, Curren, Poedagar, Casio, Skmei
- Includes complete user journey: Browse → Cart → Checkout → Order Tracking
- Admin dashboard for inventory and order management

**Visual:** 3-column layout with category icons (Men, Women, Belts). Gold accent headers.

**Speaker Notes:** "Legacy Watches is designed to solve the problem of limited watch retail accessibility in Bangladesh. It provides a luxury digital storefront where customers can browse 43 products across 5 brands..."

---

## Slide 4: Problem Statement & Motivation

**Title:** Why Legacy Watches?

**Content:**
| Problem | Solution |
|---------|----------|
| Limited physical store access | 24/7 online shopping |
| Narrow in-store selection | 43 products across 5 brands |
| No price comparison ability | Transparent pricing with discounts |
| No persistent shopping experience | User accounts with cart, watchlist, history |

**Visual:** Two-column comparison table. Red/Green color coding.

**Speaker Notes:** "Traditional watch retail in Bangladesh has four key pain points. Legacy Watches addresses each one systematically..."

---

## Slide 5: Technology Stack

**Title:** Technology Stack

**Content:**
```
┌─────────────────────────────────────────┐
│              FRONTEND                    │
│  Next.js 16  •  React 19  •  Tailwind 4 │
│  TypeScript  •  Axios  •  Swiper.js     │
│  Lucide Icons  •  react-hot-toast       │
├─────────────────────────────────────────┤
│              BACKEND                     │
│  Node.js  •  Express.js  •  JWT         │
│  bcryptjs  •  Multer  •  Google OAuth   │
├─────────────────────────────────────────┤
│              DATABASE                    │
│  Custom JSON Adapter (db.json)          │
│  SQL-like Query Interface               │
└─────────────────────────────────────────┘
```

**Visual:** Three-tier stack diagram with brand logos/icons.

**Speaker Notes:** "The frontend uses Next.js 16 with App Router for server-side rendering. The backend is Express.js with JWT authentication. The database is a custom JSON-based adapter..."

---

## Slide 6: System Architecture

**Title:** System Architecture

**Content:** (Show the architecture diagram from `architecture_diagrams.md` — Section 1)

```
Browser → Next.js Frontend (:3000) → Axios HTTP → Express Backend (:5001) → JSON Database
```

**Visual:** Architecture diagram showing the 3-tier separation. Use the Mermaid diagram from the architecture document.

**Speaker Notes:** "The system follows a decoupled 3-tier architecture. The frontend on port 3000, backend on port 5001, and a JSON file database. CORS is configured to allow only the frontend origins..."

---

## Slide 7: Database Design (ERD)

**Title:** Entity-Relationship Diagram

**Content:** (Show the ERD from `architecture_diagrams.md` — Section 6)

**Key Entities:**
- **Users** (7 seeded: 1 admin + 6 users)
- **Products** (43 seeded across 5 brands, 3 categories)
- **Orders** (with 6-stage status workflow)
- **Cart Items** (per-user, persistent)
- **Watchlist Items** (per-user favorites)
- **Reviews** (with ratings 1-5)

**Visual:** ERD diagram with relationship lines. Highlight the 6 collections.

**Speaker Notes:** "The database has 6 collections stored in a single JSON file. Relationships are maintained through foreign key references..."

---

## Slide 8: Frontend Component Architecture

**Title:** Frontend Structure

**Content:**
- **15 Pages** across 3 route groups
- **7 Reusable Components**
- **3 Library Modules** (API, Context, AppWrapper)
- **React Context API** for global state management
- **localStorage** for JWT token persistence

**Route Groups:**
| Group | Pages | Purpose |
|-------|-------|---------|
| `(auth)/` | Login, Register | Authentication |
| `(user)/` | 10 pages | Customer experience |
| `/admin` | 3 pages | Admin management |

**Visual:** Component tree diagram showing parent-child relationships.

**Speaker Notes:** "The frontend is organized into 3 route groups. Auth pages are isolated. User pages share Navbar and Footer. Admin pages use a dark theme with sidebar..."

---

## Slide 9: API Design

**Title:** RESTful API Design

**Content:**
- **27 Endpoints** across 6 route modules + 2 inline admin routes
- **Base URL:** `http://localhost:5001/api`
- **Authentication:** JWT Bearer Token
- **File Uploads:** Multer for product images
- **Static Files:** Product images served from Express

**Route Modules:**
| Module | Endpoints | Protected |
|--------|-----------|-----------|
| `/auth` | 3 | None |
| `/products` | 5 | Write operations |
| `/cart` | 5 | All |
| `/watchlist` | 4 | All |
| `/orders` | 4 | All |
| `/reviews` | 3 | Write only |

**Visual:** Clean table with endpoint counts and protection status.

**Speaker Notes:** "The API has 25 endpoints organized into 6 modular route files. Cart, watchlist, and orders require authentication. Product write operations require admin role..."

---

## Slide 10: Authentication Flow

**Title:** Authentication & Security

**Content:**
```
Registration:  Form → bcrypt hash → JWT token → localStorage
Login:         Form → verify hash → JWT token → localStorage
Google OAuth:  Google button → verify token → JWT token → localStorage
```

**Security Measures:**
- 🔐 bcryptjs with 10 salt rounds
- 🔑 JWT signed with secret key
- 🛡️ Auth middleware on protected routes
- 👑 Admin middleware for role-based access
- 🔒 CORS restricted to frontend origins
- ✅ Google ID token server-side verification

**Visual:** Flow diagram showing the 3 authentication paths converging to JWT token storage.

**Speaker Notes:** "Authentication supports three methods. All passwords are hashed with bcryptjs. JWT tokens are stored in localStorage and attached to every request via Axios interceptor..."

---

## Slide 11: Live Demo — User Journey

**Title:** Demonstration: Customer Experience

**Walkthrough:**
1. **Homepage** — Video hero, watch explorer carousel, categories
2. **Shop** — Product filtering by category, brand, price
3. **Product Detail** — Image gallery, reviews, add to cart
4. **Cart** — Quantity management, order summary
5. **Checkout** — Shipping form, order placement
6. **Profile** — Order history with status tracking

**Visual:** Screenshot grid showing 6 key pages.

**Speaker Notes:** "Now I'll demonstrate the complete customer journey. Starting from the homepage..."

---

## Slide 12: Live Demo — Flash Sale

**Title:** Demonstration: Flash Sale Feature

**Features:**
- Dedicated flash sale page with countdown timer
- Real-time clock (hours, minutes, seconds)
- Red-themed urgency design
- Products marked with `is_flash_sale = 1` in database
- Discount percentages displayed prominently

**Visual:** Screenshot of the flash sale page showing the countdown timer and product grid.

**Speaker Notes:** "The flash sale creates urgency with a real-time countdown timer. Products are filtered server-side..."

---

## Slide 13: Live Demo — Admin Dashboard

**Title:** Demonstration: Admin Panel

**Dashboard Features:**
- 4 Stat Cards: Revenue, Orders, Products, Users
- Recent Orders table with status badges
- Product Management: Search, filter, CRUD operations
- Order Fulfillment: Status updates (Confirm → Ship → Deliver → Cancel)

**Admin Credentials:**
- Email: `admin@legacywatches.com`
- Password: `admin123`

**Visual:** 3-panel screenshot showing Dashboard, Products, and Orders pages.

**Speaker Notes:** "The admin panel provides complete control over the store. Admins can manage inventory, track orders..."

---

## Slide 14: Responsive Design

**Title:** Mobile-First Responsive Design

**Content:**
- All 15 pages fully responsive
- Tailwind CSS breakpoints: sm, md, lg, xl
- Mobile: Single column stacked layouts
- Tablet: 2-column grids
- Desktop: 3-4 column grids with sidebars
- Glass morphism effects adapt to screen size
- Touch-friendly navigation and controls

**Visual:** Side-by-side screenshots showing the same page on mobile, tablet, and desktop.

**Speaker Notes:** "Every page is built mobile-first. The navigation collapses, grids reflow, and touch targets remain accessible..."

---

## Slide 15: Design System

**Title:** Luxury Design Language

**Design Principles:**
- Inspired by TUDOR watches brand aesthetic
- Gold accent color (#b38b2d) throughout
- Playfair Display (serif) + Inter (sans-serif) typography
- Glass morphism with backdrop blur
- Generous whitespace and large typography
- Subtle hover animations and transitions

**Custom CSS Classes:**
- `.glass` — Semi-transparent with blur
- `.btn-primary` — Gold gradient button
- `.section-padding` — Consistent spacing
- Custom scrollbar hiding

**Visual:** Style guide showing color palette, typography samples, and component examples.

**Speaker Notes:** "The design language is deliberately luxury-oriented. Gold accents, glass effects, and premium typography..."

---

## Slide 16: Challenges & Solutions

**Title:** Technical Challenges Overcome

| Challenge | Solution |
|-----------|----------|
| JSON database — no SQL support | Custom SQL parser adapter in `db.js` |
| State synchronization (Context ↔ Backend) | API-first approach: update backend, then refresh state |
| Product image serving | Express static files from images directory |
| Mixed Server/Client Components | Strategic use of `"use client"` directive |
| Google OAuth integration | Client-side button + server-side verification with mock fallback |
| Category page routing | Dynamic route delegates to ShopPage with pre-set filter |

**Visual:** Two-column table with challenge icons on left, solution descriptions on right.

**Speaker Notes:** "The JSON database was the biggest challenge. We built a custom adapter that parses SQL strings..."

---

## Slide 17: Future Enhancements

**Title:** Roadmap for Production

**High Priority:**
- 💳 Real payment gateway integration (SSLCommerz/Stripe)
- 🗄️ PostgreSQL migration for production scaling
- 🔄 JWT token refresh mechanism
- 🛡️ Rate limiting and input sanitization

**Medium Priority:**
- 📧 Email notifications for orders
- 🔍 Full-text product search
- 📊 Advanced analytics dashboard

**Visual:** Timeline or roadmap graphic with 3 phases (Short-term, Medium-term, Long-term).

**Speaker Notes:** "For production deployment, the top priorities are payment integration and database migration..."

---

## Slide 18: Conclusion & Q&A

**Title:** Thank You

**Key Takeaways:**
- ✅ Complete full-stack e-commerce platform built from scratch
- ✅ 15 pages, 7 components, 27 API endpoints
- ✅ 43 products across 5 brands and 3 categories
- ✅ JWT authentication with Google OAuth
- ✅ Admin dashboard with analytics
- ✅ Responsive luxury design system

**Contact:** [Your Email]
**GitHub:** [Repository Link]

**Visual:** Full-screen luxury watch image with gold overlay. "Thank You" in Playfair Display. "Questions?" in Inter.

**Speaker Notes:** "To summarize: Legacy Watches is a complete full-stack e-commerce platform demonstrating proficiency in modern web development..."

---

## Presentation Tips

### Before the Defense:
1. **Start both servers** before the presentation: `cd backend && npm run dev` and `cd frontend && npm run dev`
2. **Pre-load the browser** with the homepage, shop, and admin dashboard in separate tabs
3. **Have admin credentials ready** for the admin demo
4. **Test the demo flow** at least twice before the actual defense
5. **Prepare fallback screenshots** in case of network issues

### During the Defense:
1. **Speak clearly and confidently** about your technical decisions
2. **Explain WHY** you chose each technology, not just WHAT you used
3. **Highlight the custom database adapter** — it shows deep understanding
4. **Be honest about limitations** — they show critical thinking
5. **Keep the demo smooth** — pre-load pages, avoid typing URLs live

### Common Defense Questions (Be Prepared):

**Q: Why did you use a JSON file instead of a real database?**
A: "For rapid prototyping and development. The custom adapter demonstrates understanding of database operations. For production, we'd migrate to PostgreSQL."

**Q: How does your authentication work?**
A: "JWT-based. Passwords are hashed with bcryptjs (10 salt rounds). The token is stored in localStorage and attached to every request via Axios interceptor. Server middleware verifies the token on protected routes."

**Q: How do you handle state management?**
A: "React Context API for global state (user, cart, watchlist). Each action calls the API first, then updates local state. localStorage persists the JWT token and user data."

**Q: What was the most challenging part?**
A: "Building the custom JSON database adapter that parses SQL strings and handles JOINs across arrays. Also, managing state synchronization between the frontend context and backend."

**Q: How would you deploy this to production?**
A: "Deploy the backend on a VPS with PM2, the frontend on Vercel, migrate to PostgreSQL, add a real payment gateway, implement HTTPS, and add rate limiting."

---

*This presentation outline is designed for a 15-20 minute defense. Adjust timing based on your specific requirements.*