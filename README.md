# 🛒 PosgreStore — Full-Stack E-Commerce Product Store

A full-stack e-commerce web app built with the **PERN stack** (PostgreSQL, Express, React, Node.js). Started as a product-catalog CRUD app and extended into a complete shopping experience — search & filtering, a persistent shopping cart, and a checkout flow that creates real orders in the database.

> ⚠️ This is a portfolio/demo project. Checkout is a **mock flow** — no real payment provider is integrated, no real money moves.

---

## ✨ Features

- 🔍 **Search, filter & sort** products by name, category, price, and rating
- 🛍️ **Persistent shopping cart** (survives page refresh via `localStorage`) with quantity controls
- 💳 **Real payment integration** — [Razorpay](https://razorpay.com) checkout (test mode: cards, UPI, netbanking, wallets), a dynamic **UPI QR code** that generates for the exact order amount (scan with GPay/PhonePe/Paytm, no API keys needed), or Cash on Delivery
- 🧾 **Auto-generated invoices** — downloadable PDF bill after every order, plus a print option
- 🧑‍🤝‍🧑 **"You might also like"** related-products suggestions on every product page
- 🔒 **Admin-only store management** — adding, editing, and deleting products (and updating order status) requires the admin password. Regular visitors only see a normal, read-only storefront
- 🖼️ **Multi-photo galleries** — add extra photos per product, with a thumbnail switcher on the product detail page
- 📍 **Order tracking** — customers can look up any order by Order ID + email and see a live status stepper (Pending → Confirmed → Shipped → Out for Delivery → Delivered), plus a **password-protected** `/admin/orders` dashboard to move orders through those stages
- 📦 **Inventory-aware**: stock counts, "Out of Stock" and "Low Stock" badges, stock auto-decrements on purchase
- ⭐ **Star ratings** and category badges on every product
- 🧩 **Full CRUD** for products — add, edit, delete, with image, price, category, and stock
- 🎨 **13 switchable themes** (daisyUI), editorial hero banner with real photography
- 🛡️ **Rate limiting & bot protection** via [Arcjet](https://arcjet.com)
- 💅 Responsive, polished UI with loading skeletons and toast notifications

---

## 🛠️ Tech Stack

**Frontend:** React 18, React Router, Zustand (state + cart persistence), Tailwind CSS, daisyUI, Axios, Vite, lucide-react icons

**Backend:** Node.js, Express 5, PostgreSQL via [Neon](https://neon.tech) serverless driver, Arcjet (security/rate-limiting), Helmet, Morgan, CORS

---

## 📂 Project Structure

```
PERN STACK PRODUCT STORE/
├── backend/
│   ├── config/db.js              # Neon Postgres connection
│   ├── controllers/              # productController, orderController
│   ├── lib/arcjet.js             # rate limiting / bot protection config
│   ├── routess/                  # productRoutes, orderRoutes
│   ├── seeds/product.js          # sample data seeder
│   └── server.js                 # Express app entry point
├── frontend/frontend/
│   └── src/
│       ├── components/           # Navbar, ProductCard, AddProductModal, ThemeSelector...
│       ├── pages/                 # HomePage, ProductPage, CartPage, CheckoutPage
│       ├── store/                # useProductStore, useCartStore, useThemeStore (Zustand)
│       └── constants/            # categories, sort options, themes
├── .env.example
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A free [Neon](https://neon.tech) Postgres database
- A free [Arcjet](https://arcjet.com) API key

### 1. Clone & install

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd "PERN STACK PRODUCT STORE"
npm install
cd frontend/frontend
npm install
cd ../..
```

### 2. Configure environment variables

Copy `.env.example` to `.env` in the project root and fill in your own values:

```bash
cp .env.example .env
```

```env
PORT=3000
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
PGUSER=your_pg_user
PGPASSWORD=your_pg_password
PGHOST=your_pg_host
PGDATABASE=your_pg_database
ARCJET_KEY=ajkey_your_key_here
ARCJET_ENV=development
RAZORPAY_KEY_ID=rzp_test_your_key_here
RAZORPAY_KEY_SECRET=your_test_secret_here
ADMIN_PASSWORD=choose_a_strong_password
```

`ADMIN_PASSWORD` protects the `/admin/orders` dashboard — pick your own value, it's not shared anywhere else.

Also copy `frontend/frontend/.env.example` to `frontend/frontend/.env` and set:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
VITE_UPI_ID=yourname@upi
VITE_UPI_PAYEE_NAME=Your Store Name
```

`VITE_UPI_ID` is your real UPI ID (find it in GPay/PhonePe/Paytm under "My QR Code") — it powers the **Scan & Pay** option at checkout, which generates a QR code for the exact order total. No Razorpay account needed for this option; payments aren't auto-verified, so check your UPI app to confirm you've received one before marking an order as shipped.

> Get free Razorpay test-mode keys at https://dashboard.razorpay.com/app/keys — no KYC/business verification needed for test mode. Test card: `4111 1111 1111 1111`, any future expiry, any CVV.

### 3. Run the backend

```bash
npm run dev
```

This also auto-creates all required tables (`products`, `orders`, `order_items`) on first run.

### 4. (Optional) Seed sample products

```bash
npm run seed
```

### 5. Run the frontend (in a separate terminal)

```bash
cd frontend/frontend
npm run dev
```

Visit **http://localhost:5173**.

---

## 📡 API Reference

| Method | Endpoint             | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/products`       | List all products        |
| GET    | `/api/products/:id`   | Get a single product     |
| POST   | `/api/products`       | Create a product         |
| PUT    | `/api/products/:id`   | Update a product         |
| DELETE | `/api/products/:id`   | Delete a product         |
| GET    | `/api/orders`         | List all orders          |
| GET    | `/api/orders/:id`     | Get a single order       |
| GET    | `/api/orders/track/:id?email=` | Public order tracking (requires matching email) |
| PATCH  | `/api/orders/:id/status` | Update an order's status |
| POST   | `/api/orders`         | Place an order (checkout)|

---

## 🗺️ Roadmap / Ideas for Next Iteration

- User authentication (sign up / login) so orders and carts are tied to an account
- Admin dashboard with sales analytics
- Real payment integration (Stripe)
- Product reviews (not just a star rating)
- Server-side search & pagination for large catalogs

---

## 🌍 Deploying (so you can share a real link)

To get a link you can send friends on WhatsApp that works on any device, deploy the backend and frontend separately (both have generous free tiers):

**1. Backend → [Render](https://render.com)**
- New → Web Service → connect your GitHub repo
- Root directory: `PERN STACK PRODUCT STORE`
- Build command: `npm install`
- Start command: `npm start`
- Add all your `.env` variables in Render's Environment tab
- Deploy — you'll get a URL like `https://your-app.onrender.com`

**2. Frontend → [Vercel](https://vercel.com)**
- New Project → import the same repo
- Root directory: `PERN STACK PRODUCT STORE/frontend/frontend`
- Framework preset: Vite
- Add environment variables `VITE_RAZORPAY_KEY_ID` and `VITE_API_URL` (set `VITE_API_URL` to your Render backend URL from step 1, e.g. `https://your-app.onrender.com`)
- Deploy — you'll get a URL like `https://your-app.vercel.app`

That Vercel link is what you share — it'll work on any phone, laptop, or browser, anywhere.

---

## 📄 License

ISC — free to use for learning and portfolio purposes.
