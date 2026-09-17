# ShortLink Hub — Branded Short-Link & Bio-Link Hub
### Bitly + Linktree Hybrid (MERN Stack)

ShortLink Hub is a high-performance URL shortening engine featuring custom vanity slugs, high-speed asynchronous click telemetry, MongoDB aggregation analytics, paired JWT authentication with refresh token rotation, and a customizable "Link-in-Bio" creator profile manager.

---

## 🌟 Key Features

1. **High-Speed Redirection Engine (`/r/:shortCode`)**:
   - Indexed lookups returning an immediate **HTTP 302 Found** redirect.
   - Non-blocking asynchronous click telemetry logging (`setImmediate`), ensuring zero redirect latency.
   - Privacy-preserving salted SHA-256 IP hashing (`ipHash`) — no raw IPs stored.
   - Server-side device detection (`mobile`, `desktop`, `tablet`) via `ua-parser-js`.

2. **Click Analytics & Aggregation Pipelines**:
   - MongoDB aggregation pipelines for daily clicks time-series, top traffic referrers, and device distributions.
   - Visualized with interactive Recharts area charts, horizontal bar charts, and donut charts.

3. **Dual-Token Auth & Session Security**:
   - Short-lived Access Token (15m) + Long-lived Refresh Token (7d) stored in an `httpOnly, sameSite: lax` cookie.
   - Refresh token rotation on every exchange.
   - `refreshTokenVersion` tracking on the User model for instant session invalidation on password reset.
   - Simulated email verification & password reset tokens logged cleanly to the server terminal.

4. **"Link-in-Bio" Hub Customizer & Public Page**:
   - Visual profile builder with live interactive mobile preview.
   - Multipart avatar image upload with Multer memory storage and Cloudinary streaming (with automatic cleanup of old assets).
   - Theme customizer: **Minimal Light**, **Dark Slate**, and **Vibrant Gradient**.
   - Dynamic reorderable social buttons and creator's branded short links.
   - Mobile-responsive public creator profile at `/bio/:username`.

5. **Rate Limiting & Security Headers**:
   - Rate limiting tuned per endpoint (`express-rate-limit` for link creation, public redirects, and auth).
   - Helmet security headers and strict CORS configuration.

---

## 📐 Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB & Mongoose |
| **Authentication** | JWT (Dual-token pattern), bcrypt |
| **Telemetry & Redirection** | Nanoid (unambiguous alphabet), ua-parser-js, crypto (HMAC-SHA256) |
| **Image Storage** | Multer + Cloudinary SDK (with local Data URI fallback) |
| **Frontend** | React, Vite, React Router v6, TanStack Query v5 |
| **Charts** | Recharts |
| **Icons & QR** | Lucide React, qrcode.react, qrcode (server) |
| **UI Components** | Accessible primitive set (Card, Button, Input, Modal) styled with modern Glassmorphism CSS |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas connection string.

### 2. Environment Variables & Database Setup
1. Duplicate `.env.example` in both the `server/` and `client/` directories and rename them to `.env`.
2. **Database:** In `server/.env`, set `MONGO_URI` to your MongoDB connection string (e.g., `mongodb://127.0.0.1:27017/shortlink-hub` for local, or your Atlas URL).
3. **Cloudinary (Optional):** Add your Cloudinary credentials for avatar uploads. If left blank, the app gracefully falls back to local Data URI avatars.
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. **JWT & Security:** Change the JWT secret keys and IP hashing salts to secure random strings.

### 3. Backend Setup
```bash
cd server
npm install
npm run seed   # Populates demo users, sample short links, and 300+ telemetry events
npm run dev    # Starts backend API on http://localhost:5000 (watches for changes)
```

### 4. Frontend Setup
```bash
cd client
npm install
npm run dev    # Starts Vite dev server on http://localhost:5173
```

---

## 🔒 Assumptions & Limitations
- **Email Verification & Reset:** Real email delivery (e.g., via SendGrid or AWS SES) is bypassed in this implementation. Tokens are securely generated but printed to the server terminal instead of being emailed, allowing for end-to-end testing without external email providers.
- **Image Storage:** Avatar uploads use Cloudinary. If Cloudinary credentials are missing, the backend defaults to returning high-quality base64 Data URIs to ensure the app remains 100% functional immediately after cloning.
- **Rate Limiting:** IP-based rate limiting assumes typical reverse-proxy setups (like Nginx/Render). In production environments where load balancers mask client IPs, `app.set('trust proxy', 1)` must be appropriately configured in `app.js`.

---

## 🔑 Pre-Seeded Demo Accounts

The database seed script (`npm run seed`) populates two complete creator profiles:

1. **Alex Rivera (Tech / Creator)**
   - **Email:** `alex@example.com`
   - **Password:** `Password123!`
   - **Username:** `alexrivera`
   - **Public Bio Page:** [http://localhost:5173/bio/alexrivera](http://localhost:5173/bio/alexrivera)

2. **Sarah Chen (UI/UX Designer)**
   - **Email:** `sarah@example.com`
   - **Password:** `Password123!`
   - **Username:** `sarahdesigns`
   - **Public Bio Page:** [http://localhost:5173/bio/sarahdesigns](http://localhost:5173/bio/sarahdesigns)

*(Note: The Login screen includes convenient 1-click fill buttons for both accounts)*

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` — Register user & output simulated verification token
- `POST /api/auth/verify-email` — Verify token & authenticate
- `POST /api/auth/login` — Sign in & receive access token + refresh cookie
- `POST /api/auth/refresh` — Rotate refresh token & issue new access token
- `POST /api/auth/logout` — Invalidate refresh cookie
- `POST /api/auth/forgot-password` — Generate simulated password reset token
- `POST /api/auth/reset-password` — Set new password & increment token version

### Short Links
- `POST /api/links` — Create short link with auto-slug or custom vanity alias (Rate limited)
- `GET /api/links` — List user's links with search & pagination
- `DELETE /api/links/:id` — Delete link and its click telemetry
- `GET /api/links/:id/qr` — Generate high-resolution scannable QR code

### Redirection
- `GET /r/:shortCode` — Public redirect returning HTTP 302 and asynchronous click logging

### Telemetry & Analytics
- `GET /api/analytics/overview` — Aggregated analytics across all user links
- `GET /api/analytics/link/:id` — Detailed time-series, referrers, and device breakdown

### Bio Hub
- `GET /api/bio` — Get authenticated user's bio configuration
- `PUT /api/bio` — Update bio details, theme, and social links
- `POST /api/bio/avatar` — Multipart avatar upload to Cloudinary
- `GET /api/bio/:username` — Public creator profile data (no auth required)

---

## 🎨 UI Primitives & Design Notes
Per Section 2 of the project brief, UI components are crafted using an accessible primitive set with curated glassmorphism tokens, backdrop blur filters, responsive typography, and micro-animations in `src/components/ui/index.jsx` and `src/index.css`.
