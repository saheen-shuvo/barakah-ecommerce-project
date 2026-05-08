# Barakah E-commerce Project

Barakah is a full-stack e-commerce project for Islamic wall décor products (wall clocks, canvas, wall art, and related items).

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, DaisyUI
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Media Upload:** Cloudinary (admin product image upload)
- **Tracking/Analytics:** Google Tag Manager + Meta Pixel events

## Repository Structure

```text
barakah-ecommerce-project/
├─ barakah-client/        # Next.js frontend
├─ barakah-server/        # Express API server
├─ package.json
└─ readme.md
```

## Implemented Features

### Customer-facing Storefront
- Homepage with category product sections
- Category + subcategory browsing
- Product search by name
- Product details with related products
- Add to cart / buy now

### Cart & Checkout
- Cart management (add/remove/increase/decrease quantity)
- Local cart persistence
- Checkout form with delivery information
- Order placement to backend API
- Payment method selection (`bkash`, `nagad`, `cod`) stored with order

### Authentication
- User registration and login
- Local auth state persistence
- Role-based admin protection (`barakahAdmin1234` role)

### Admin Panel
- Dashboard stats (products, orders, delivered revenue)
- Product CRUD (create, list with pagination, edit, delete)
- Order management and mark-as-delivered workflow

### Reviews
- Reviews fetched from backend and displayed on storefront carousel

## Important Scope Note (Payments)

There is **no online payment gateway integration** yet (no Stripe/PayPal/SSLCommerz API integration, no payment webhooks, no payment SDK flow).
Current checkout stores customer order data and selected payment method only.

## Backend API Overview

Base URL is set from client using `NEXT_PUBLIC_API_URL`.

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/orders`
- `GET /api/orders`
- `PATCH /api/orders/:id/deliver`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/reviews`

## Environment Variables

### Server (`barakah-server/.env`)

- `MONGODB_URI` (required)
- `DB_NAME` (optional, default: `Barakah`)
- `PORT` (optional, default: `8000`)

### Client (`barakah-client/.env.local`)

- `NEXT_PUBLIC_API_URL` (required)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (required for admin image upload)
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (required for admin image upload)

## Run Locally

### 1) Backend

```bash
cd barakah-server
npm install
npm run dev
```

Backend runs on `http://localhost:8000` by default.

### 2) Frontend

```bash
cd barakah-client
npm install
npm run dev
```

Frontend runs on `http://localhost:3000` by default.

## Build / Lint

From `barakah-client`:

```bash
npm run lint
npm run build
```

> Note: Build can fail in restricted environments if Google Fonts cannot be fetched.
