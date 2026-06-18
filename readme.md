# Barakah Islamic E-Commerce Platform

A full-stack MERN e-commerce application specializing in Islamic wall decor products (wall clocks, canvas, wall art, and related items). Built with modern web technologies and integrated with courier logistics, real-time notifications, and advanced analytics.

**Live:** [https://barakahislamic.me](https://barakahislamic.me)

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **UI Library:** React
- **Styling:** Tailwind CSS, DaisyUI
- **Analytics & Tracking:** Google Tag Manager (GTM), Meta Pixel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Media Storage:** Cloudinary (admin product image uploads)
- **Courier Integration:** Steadfast API

---

## 📁 Project Structure

```
barakah-ecommerce-project/
├─ barakah-client/          # Next.js frontend (Vercel-deployed)
├─ barakah-server/          # Express API server (VPS-deployed)
├─ package.json
└─ README.md
```

---

## ✨ Features

### 👤 Customer-Facing Storefront

- **Homepage:** Dynamic category sections with featured products
- **Product Browsing:** Category and subcategory navigation
- **Search:** Real-time product search by name
- **Product Details:** Comprehensive product pages with related products
- **Cart Management:** Add/remove/update quantities with local persistence
- **Checkout Form:** Delivery address collection and order placement
- **Payment Methods:** Support for `bkash`, `nagad`, and COD (Cash on Delivery)
- **Reviews Carousel:** Customer reviews displayed on product pages

### 🔐 Authentication

- User registration and secure login
- Local state persistence for authentication
- Role-based access control
- Admin dashboard protection with credentials

### 📦 Admin Dashboard

#### Order Management
- **Dashboard Stats:** Real-time overview of products, orders, and revenue
- **Order List:** View all orders with status tracking
- **Order Filtering:** Filter and search orders by customer info
- **Status Updates:** Mark orders as delivered
- **Courier Integration:** One-click "Send to Steadfast" button to dispatch orders to courier
- **Real-Time Notifications:** Instant alerts for admin and moderators when new orders arrive

#### Analytics & Reporting
- **Revenue Filtering:** Filter revenue by custom date range or predefined timeframes
- **Analytics Cards:** Breakdown by delivered, cancelled, and total revenue
- **Date-Based Analytics:** `getOrdersByDate` and `getDeliveredAnalytics` endpoints with precise filtering
- **CSV Export:** Download complete order reports including:
  - All orders with customer details
  - Order status (delivered/cancelled/pending)
  - Revenue per order and aggregated totals
  - Date-based breakdown
  - Excel-compatible UTF-8 BOM formatting

#### Product Management
- **Create Products:** Add new products with images (via Cloudinary)
- **Edit Products:** Update product details and inventory
- **Delete Products:** Remove products from catalog
- **Pagination:** Efficient product list browsing

### 📊 Analytics & Marketing

- **Google Tag Manager (GTM):** Full event tracking implementation
- **Meta Pixel:** Conversion and user behavior tracking
- **Event Tracking:**
  - Product views
  - Add to cart events
  - Purchase/order completion
  - Custom conversion funnels
- **Performance Analytics:** Track marketing campaigns and user journey

---

## 🔧 Backend API Overview

### Base URL
Set via `NEXT_PUBLIC_API_URL` environment variable in client

### Product Endpoints
```
GET    /api/products              # Fetch all products
GET    /api/products/:id          # Fetch product by ID
POST   /api/products              # Create product (admin)
PATCH  /api/products/:id          # Update product (admin)
DELETE /api/products/:id          # Delete product (admin)
```

### Order Endpoints
```
GET    /api/orders                # Fetch all orders (admin)
POST   /api/orders                # Create new order
PATCH  /api/orders/:id/deliver    # Mark order as delivered
POST   /api/orders/:id/steadfast  # Send order to Steadfast courier
GET    /api/orders/analytics      # Fetch order analytics (with date filtering)
```

### Analytics Endpoints
```
GET    /api/orders/analytics/byDate          # Orders filtered by date
GET    /api/orders/analytics/delivered       # Delivered orders analytics
POST   /api/orders/export/csv                # Export orders as CSV
```

### Authentication Endpoints
```
POST   /api/auth/register         # User registration
POST   /api/auth/login            # User login
```

### Reviews Endpoints
```
GET    /api/reviews               # Fetch all reviews
```

---

## 🚀 Key Features in Detail

### Steadfast Courier Integration

**One-Click Order Dispatch:**
- Admin clicks "Send to Steadfast" button in order details
- System automatically formats order data per Steadfast API requirements
- Order details are transmitted (customer info, address, products, COD amount)
- System receives tracking number and updates order status
- Order marked as "sent to courier" in dashboard

**Automatic Updates:**
- Order status synchronized with courier
- Admin notified of successful dispatch

### Real-Time Order Notifications

- **Instant Alerts:** Admin and moderator roles receive notifications when new orders are placed
- **Notification System:** Integrated notification middleware
- **Alert Details:** Customer name, order ID, total amount, and payment method

### Advanced Analytics Dashboard

**Date Range Filtering:**
- Select custom date ranges for revenue analysis
- Predefined timeframes (Today, This Week, This Month, Last 30 Days)
- Real-time recalculation of metrics

**Revenue Breakdown:**
- Delivered revenue (completed orders)
- Cancelled revenue (cancelled orders)
- Total orders revenue (all orders)
- Order count per status

**CSV Export Feature:**
- Download complete order history with analytics
- Includes customer details, order status, amounts, and dates
- Excel-compatible formatting with UTF-8 BOM
- Useful for accounting, customer service, and business analysis

---

## 📱 Deployment Architecture

### Frontend
- **Platform:** Vercel
- **Framework:** Next.js
- **Auto-deploy:** From GitHub on push to main branch
- **Environment:** Production-optimized build

### Backend
- **Platform:** VPS (Virtual Private Server)
- **Server:** Node.js + Express
- **Database:** MongoDB (cloud or self-hosted)
- **Courier API Integration:** Steadfast (requires IP whitelisting)

### Production Considerations
- **API Resilience:** Handling shared hosting resource constraints
- **IP Whitelisting:** Coordinated with courier provider for API access
- **Environment Variables:** Secure config for database, API keys, and Cloudinary credentials

---

## 🔐 Security & Best Practices

- **Role-Based Access Control:** Admin-only features protected by authentication
- **Environment Variables:** Sensitive data stored in `.env.local` and server config
- **Image Optimization:** Cloudinary-hosted images with responsive serving
- **Local State Management:** Cart persistence without exposing sensitive data
- **API Security:** CORS configuration and request validation

---

## 📈 Performance Metrics

- **Frontend:** Optimized Next.js builds with image optimization
- **Database:** Indexed MongoDB queries for fast product and order retrieval
- **Analytics:** Lightweight GTM and Meta Pixel implementations
- **CSV Generation:** Efficient server-side export without blocking main thread

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- npm or yarn

### Client Setup
```bash
cd barakah-client
npm install
npm run dev
```

### Server Setup
```bash
cd barakah-server
npm install
npm start
# or for development
npm run dev
```

### Environment Variables

**Client (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXXXX
```

**Server (.env):**
```
MONGODB_URI=mongodb://...
PORT=5000
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STEADFAST_API_KEY=your_steadfast_key
STEADFAST_API_URL=https://api.steadfast.com.bd
```

---

## 📊 Use Cases

### For Business Owners
- **Real-time order tracking:** Know when orders arrive and dispatch status
- **Revenue analysis:** Track performance by date, time period, and order status
- **Customer management:** Quick CSV export for customer analytics
- **Marketing integration:** GTM and Meta Pixel for conversion optimization

### For Customers
- **Seamless shopping:** Browse, search, and purchase Islamic decor products
- **Flexible checkout:** Multiple payment method options
- **Product trust:** View customer reviews before purchase
- **Quick ordering:** Add to cart and checkout in minutes

---

## 🎯 Future Enhancements

- Online payment gateway integration (SSLCommerz/Stripe/PayPal)
- Advanced inventory management and stock alerts
- Customer account dashboard with order history
- Email and SMS notifications for order updates
- Multi-vendor support
- AI-powered product recommendations
- Mobile app (React Native)

---

## 🐛 Known Limitations & Notes

- **Payment Gateway:** Currently supports COD, bKash manual, and Nagad manual payments. No real-time online payment processing yet.
- **Shared Hosting:** Backend currently optimized for shared hosting with resource monitoring
- **Courier Integration:** Steadfast API requires server IP whitelisting (coordinate with provider)

---

## 📝 Project Structure Details

### Key Directories (Frontend)
```
barakah-client/
├─ app/                    # Next.js App Router pages
├─ components/             # Reusable React components
├─ hooks/                  # Custom React hooks (useCart, useAuth, etc.)
├─ pages/                  # API routes (if used)
├─ public/                 # Static assets
├─ styles/                 # Global Tailwind configuration
└─ lib/                    # Utility functions and API client
```

### Key Directories (Backend)
```
barakah-server/
├─ models/                 # MongoDB schemas (Product, Order, User, Review)
├─ routes/                 # API route handlers
├─ controllers/            # Business logic
│  ├─ orderController.js   # Order CRUD + Steadfast integration
│  ├─ analyticsController.js  # Revenue filtering, date-based analytics
│  └─ exportController.js   # CSV generation
├─ middleware/             # Auth, notifications, validation
├─ config/                 # Database, Cloudinary, Steadfast config
└─ server.js              # Express app initialization
```

---

## 👨‍💻 Author

**Saheen** - Full-Stack MERN Developer  
📍 Dhaka, Bangladesh  
🎓 BSc Software Engineering, Daffodil International University  
🌍 Erasmus+ Scholar (Varna University of Management, Bulgaria)

---

## 📄 License

This project is proprietary and currently not open source.

---

## 📞 Support & Contact

For questions, feature requests, or support regarding Barakah Islamic, please reach out via:
- **Email:** saheenshuvo182@gmail.com
- **Website:** https://www.saheenalamshuvo.me
---

**Last Updated:** June 2026  
**Version:** 1.0.0 (Production)
