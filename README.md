# Legacy Watches - E-Commerce Platform

Welcome to the Legacy Watches repository! This project is a full-stack e-commerce web application built for a university project defense. It features a modern, responsive user interface and a robust backend API.

## Project Structure

This repository is split into two main directories:
- `frontend/`: The Next.js client application.
- `backend/`: The Node.js / Express backend server and API.
- `defense_package/`: Publication-quality assets including architecture diagrams, API docs, and the project report.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- `npm` (Node Package Manager)

### 1. Setting up the Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (it runs on port 5001 by default):
   ```bash
   npm run dev
   ```
   *Note: The database (`db.json`) will be automatically created and seeded with initial products and an admin user upon the first run.*

### 2. Setting up the Frontend

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 🔑 Admin Access
The backend automatically seeds an admin user for dashboard access:
- **Email:** `admin@legacywatches.com`
- **Password:** `admin123`

---

## 📚 Project Defense Materials
Please refer to the `defense_package/` directory for detailed documentation:
- [System Architecture & ERD](./defense_package/architecture_diagrams.md)
- [API Documentation](./defense_package/api_documentation.md)
- [Project Report](./defense_package/project_report.md)
- [Presentation Slides](./defense_package/presentation_slides.md)
- [Technical Specification](./defense_package/technical_specification.md)

---
*Built as a University Project submission.*
