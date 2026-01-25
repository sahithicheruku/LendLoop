# LendLoop — Community Item Lending Platform

LendLoop is a full-stack web application designed to help people share items within a local community. Users can list items they own, browse what others have shared, request to borrow items, approve or decline requests, and manage the complete borrowing lifecycle through a clean and intuitive interface.

🔗 **Live Demo:** https://lend-loop-bay.vercel.app

---

## 🚀 Features

### Core Workflows
- List items with title, description, and category
- Browse available items in the community
- Request to borrow items from other users
- Approve or decline borrowing requests
- Track items you have borrowed
- Mark items as returned when done
- Remove items from the platform

### Platform Highlights
- Status-based item lifecycle with enforced transitions  
  `AVAILABLE → REQUESTED → BORROWED → AVAILABLE`
- Server-side state validation to prevent invalid operations
- Optimistic UI updates for instant user feedback
- Clear separation between server and client components

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- React Server & Client Components
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes (RESTful design)
- Prisma ORM
- PostgreSQL (hosted on Neon)
- Server-side input and state validation

### Deployment
- Vercel (production hosting)
- Git & GitHub (version control)
- Automatic deployments from the main branch

---

## 📦 API Overview

### Items API
- `GET /api/items?status=AVAILABLE` — Fetch items filtered by status
- `POST /api/items` — Create a new item listing
- `PATCH /api/items/[id]` — Update item status via actions  
  **Supported actions:** `request`, `approve`, `return`, `cancel`
- `DELETE /api/items/[id]` — Remove an item from the platform

The backend enforces valid state transitions and prevents invalid updates.

---

## 🗄️ Data Model

### Item Schema
- `id` — Unique identifier (CUID)
- `title` — Item name
- `description` — Optional item details
- `category` — Item category for filtering
- `status` — Current state (`AVAILABLE | REQUESTED | BORROWED`)
- `isAvailable` — Boolean flag for quick availability checks
- `createdAt` — Creation timestamp
- `updatedAt` — Last modification timestamp

Relational data is modeled using Prisma, with schema migrations managed via Prisma CLI.

---

## 🔒 Backend Logic

- State transitions validated at the API layer
- Database operations protected against invalid updates
- Prisma transactions ensure atomic status changes
- Server Components handle data fetching; Client Components manage interactivity
- Structured error handling with clear responses

---

## 📈 What This Project Demonstrates

- End-to-end full-stack development using Next.js 14 (App Router)
- RESTful API design with proper HTTP methods
- Relational database modeling using Prisma and PostgreSQL
- Server-side rendering with client-side hydration
- Production deployment and environment configuration
- State management across server–client boundaries
- Type-safe development using TypeScript

---

## 🧪 Local Development

```bash
# Install dependencies
npm install

# Configure database connection
# Create a .env file with:
DATABASE_URL="your-postgresql-connection-string"
DIRECT_URL="your-postgresql-direct-url"

# Run database migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Start development server
npm run dev
