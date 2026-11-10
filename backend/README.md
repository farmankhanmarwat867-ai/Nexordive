# NexorDive Backend API (Express + TypeScript + MongoDB)

Production-ready MERN backend powering authentication, Leads CRM, CMS site content, and media uploads for NexorDive.

## Architecture

```text
backend/
├── src/
│   ├── config/          # Zod-validated env config & Mongoose connection lifecycle
│   ├── constants/       # Shared domain enums & security/upload limits
│   ├── controllers/     # Thin HTTP request/response handlers
│   ├── middlewares/     # JWT auth, Zod validation, rate limits, sanitization, multer, errors
│   ├── models/          # Mongoose schemas (AdminUser, Lead, SiteContent, MediaAsset)
│   ├── routes/          # /api/v1 route modules
│   ├── seed/            # Idempotent initial admin + default CMS seeder
│   ├── services/        # Business logic (auth, leads, content, media, optional mail)
│   ├── tests/           # Security, validation, and Supertest route tests
│   ├── utils/           # ApiError, ApiResponse, JWT, cookies, default CMS seed
│   ├── validators/      # Zod schemas for request payloads and query params
│   ├── app.ts           # Express app factory
│   └── server.ts        # Process startup & graceful shutdown
└── uploads/             # Uploaded media files (served at /uploads)
```

## Quick Start

1. Copy `.env.example` to `.env` and fill in `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` (minimum 16 chars; 32+ recommended).
2. Install dependencies:
   ```bash
   npm install
   ```
3. *(Optional)* Seed initial admin & default CMS document:
   ```bash
   npm run seed
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Verify types, tests, and production build:
   ```bash
   npm run lint
   npm test
   npm run build
   ```

## API Endpoints (`/api/v1`)

### Health
- `GET /health` — Server uptime and MongoDB connection health

### Auth (`/auth`)
- `GET /auth/status` — Check whether an admin account is initialized
- `POST /auth/setup` — First-time manager setup (blocked once an admin exists)
- `POST /auth/login` — Email + password sign-in (`httpOnly` cookies + `accessToken`, 5-attempt lockout)
- `POST /auth/refresh` — Rotate refresh & access tokens
- `POST /auth/logout` — Revoke active refresh token & clear cookies *(Auth)*
- `GET /auth/me` — Fetch current manager profile *(Auth)*
- `PATCH /auth/email` — Update manager login email with current password verification *(Auth)*
- `PATCH /auth/password` — Change password, rotate `tokenVersion`, and invalidate old sessions *(Auth)*

### Leads CRM (`/leads`)
- `POST /leads` — Public inquiry submission (rate-limited + honeypot spam protection + optional SMTP alert)
- `GET /leads` — Search, filter, paginate, and aggregate status counts *(Auth)*
- `GET /leads/export` — Formula-injection-safe CSV export *(Auth)*
- `GET /leads/:id` — Single lead details *(Auth)*
- `PATCH /leads/:id` — Update lead status, notes, or preferred timeline *(Auth)*
- `DELETE /leads/:id` — Delete lead *(Auth)*

### CMS Site Content (`/content`)
- `GET /content` — Public site content read (auto-seeds defaults if empty)
- `PUT /content` — Replace/publish full site content *(Auth)*
- `PATCH /content/sections/:section` — Update a single CMS section *(Auth)*
- `PATCH /content/settings` — Update global contact, SEO, and CEO leader settings *(Auth)*
- `POST /content/reset` — Reset CMS content to defaults *(Auth)*

### Media (`/media`)
- `GET /media` — List uploaded media assets *(Auth)*
- `POST /media/upload` — Upload JPEG/PNG/WebP/SVG image up to 5MB (`multipart/form-data`, field `file`) *(Auth)*
- `DELETE /media/:id` — Delete media asset & stored file *(Auth)*
