# Placcera — Multi-Tenant College Placement Platform

[![Live Demo](https://img.shields.io/badge/Live-placerra.vercel.app-2563eb?style=for-the-badge)](https://placerra.vercel.app)
[![API Health](https://img.shields.io/badge/API-Render-46a758?style=for-the-badge)](https://placement-tracker-api-v3kn.onrender.com/health)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Express-5-339933?style=flat-square&logo=node.js)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

> **Placcera** is a multi-tenant SaaS platform where multiple colleges run isolated placement portals from a single deployment — like Slack workspaces for campus placement cells and students.

**Built by [Anurag Rai](https://github.com/raianurag18)** · B.Tech, BIT Mesra

---

## Live demo

| | Link |
|---|------|
| **Web app** | [https://placerra.vercel.app](https://placerra.vercel.app) |
| **Student login (BIT Mesra)** | [https://placerra.vercel.app/c/bitmesra/login](https://placerra.vercel.app/c/bitmesra/login) |
| **API health check** | [https://placement-tracker-api-v3kn.onrender.com/health](https://placement-tracker-api-v3kn.onrender.com/health) |

### Try it in 30 seconds

1. Open [placerra.vercel.app](https://placerra.vercel.app) and search **BIT** on the landing page, **or** go directly to the student portal link above.
2. Log in with the **demo student account** (seed data — not a real student):

   | Field | Value |
   |-------|--------|
   | Email | `student@bitmesra.edu` |
   | Password | `student123` |

3. Explore: **Dashboard** → **Placement stats** → **Jobs** → **Experiences** → **Resume builder**.

**Other demo colleges** (same student password if seeded): `bitsgoa`, `iitbombay`, `nittrichy` — use `/c/bitsgoa/login`, etc.

**Admin / placement-cell portal:** not published with open credentials (full CRUD on live data). Available on request or during interviews — screenshots below reflect admin capabilities.

> **Note:** The API runs on Render’s free tier and may take 30–60 seconds to wake after idle periods.

---

## What this project demonstrates

- **Route-based multi-tenancy** — tenant identity in the URL (`/c/:collegeSlug/...`), validated by `tenantResolver` before any business logic.
- **Defense in depth** — URL tenant check → JWT cross-college validation → every Mongoose query scoped by `institute`.
- **RBAC** — separate student and admin JWT flows; admin routes gated with `protect` + `isAdmin`.
- **Production-shaped backend** — boot-time env validation, centralized errors (`AppError` + `asyncHandler`), Zod on write routes, Helmet, rate limiting.
- **Full-stack product** — analytics, job board, application tracking, experience moderation, resume builder, PDF uploads.

### Request flow (production)

```text
Browser (Vercel — React SPA)
    → Render (Express 5 API)
        → tenantResolver → protect / isAdmin → validate(Zod) → controller
            → MongoDB Atlas (tenant-scoped documents)
```

---

## Features

### Student portal
- Placement analytics with Chart.js (company / branch breakdowns, highest packages)
- Interview experiences (round-by-round, tips, difficulty) from placed seniors
- Job board with one-click apply and eligibility filters
- Application tracker (Applied → Assessment → Interview → Selected/Rejected)
- Multi-step resume builder with print-ready preview
- Profile + PDF resume upload (Multer, 5MB, PDF-only)

### Admin portal
- Placement records CRUD with validated inputs
- Job posting management (CTC, deadlines, eligibility)
- Experience moderation (approve / reject before public visibility)
- Placement insights and application pipeline control

### Security & isolation
- Compound unique index `{ email, institute }` — same email across colleges = separate accounts
- Cross-tenant JWT from College A → 403 on College B routes
- Secrets in environment variables only (never committed)
- Separate `placerra_token` vs `admin_token` on the client

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router v7, Tailwind CSS, shadcn/ui (Radix), Chart.js, Framer Motion |
| Backend | Node.js 18+, Express 5, Mongoose 8 |
| Database | MongoDB Atlas |
| Auth | JWT (stateless), bcrypt |
| Validation | Zod v4 |
| Deploy | Vercel (SPA) + Render (API) |

---

## Screenshots

_Add 3–4 images here for recruiters (landing page, student dashboard, placement stats, admin panel). Suggested path: `docs/screenshots/`._

| Landing | Student dashboard | Placement stats | Admin |
|---------|-------------------|-----------------|-------|
| _screenshot_ | _screenshot_ | _screenshot_ | _screenshot_ |

---

## Project structure

```text
college_placement_project/
├── backend/                 # Express API (deploy root on Render)
│   ├── config/              # Boot-time env contract + CORS
│   ├── middleware/          # tenantResolver, auth, errorHandler, rateLimiter
│   ├── models/              # Institute, User, Placement, Job, Experience, …
│   ├── routes/              # Tenant-scoped route modules
│   ├── validators/          # Zod schemas
│   ├── utils/               # Seed scripts
│   └── index.js
├── web/                     # React SPA (deploy root on Vercel)
│   ├── src/
│   │   ├── api/             # tenantFetch, adminFetch, globalFetch
│   │   ├── Admin/           # Admin portal
│   │   ├── pages/           # Student pages
│   │   ├── Stats/           # Analytics pages
│   │   └── context/         # Auth + College context
│   └── vercel.json          # SPA rewrites for /c/:slug routes
└── render.yaml              # Optional Render blueprint (API only)
```

---

## API design

Tenant endpoints follow:

```text
/api/c/:collegeSlug/<resource>
```

**Middleware chain:** `tenantResolver` → `protect` → `isAdmin` (if needed) → `validate(schema)` → `asyncHandler(controller)`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/institutes/search?q=` | GET | Public | College search (landing) |
| `/api/institutes/:slug/public-stats` | GET | Public | Pre-login stats preview |
| `/api/c/:slug/auth/login` | POST | Public | Student login |
| `/api/c/:slug/admin/login` | POST | Public | Admin login |
| `/api/c/:slug/placements/stats` | GET | Student/Admin | Placement statistics |
| `/api/c/:slug/jobs` | GET/POST | Student / Admin (POST) | Job listings |
| `/api/c/:slug/applications/apply/:id` | POST | Student | Apply to job |
| `/api/c/:slug/experiences` | GET/POST | Student/Admin | Interview experiences |
| `/api/c/:slug/resume/my` | GET | Student | Structured resume |
| `/health` | GET | Public | API + DB health |

---

## Local development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Setup

```bash
git clone https://github.com/raianurag18/placement-tracker.git
cd placement-tracker

# Backend
cd backend
cp .env.example .env    # fill MONGO_URI, JWT_SECRET, CLIENT_URL
npm install
npm run dev             # nodemon — http://localhost:5000

# Optional: seed demo tenants + data
node migrate.js
node utils/seedTestTenants.js
```

```bash
# Frontend (new terminal)
cd web
cp .env.example .env.local
npm install
npm start               # http://localhost:3000
```

| Script | Purpose |
|--------|---------|
| `npm run dev` (backend) | Local API with nodemon |
| `npm start` (backend) | Production entry (`node index.js`) — used on Render |

---

## Deployment

Monorepo: **same GitHub repo**, two deploy targets.

| Service | Host | Root directory | Start / build |
|---------|------|----------------|---------------|
| API | Render | `backend` | `npm install` · `npm start` · health `/health` |
| SPA | Vercel | `web` | `npm run build` · output `build` |

### Backend (Render) — environment variables

| Variable | Example / notes |
|----------|-----------------|
| `MONGO_URI` | Atlas URI; path `/placement_tracker` is the **database name**, not the frontend folder |
| `JWT_SECRET` | Long random string (`openssl rand -hex 32`) |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://placerra.vercel.app` (no trailing slash) |

### Frontend (Vercel) — environment variables

| Variable | Example / notes |
|----------|-----------------|
| `REACT_APP_API_URL` | `https://placement-tracker-api-v3kn.onrender.com` (no trailing slash) |
| `CI` | `false` (CRA treats ESLint warnings as errors when `CI=true`) |

Set `REACT_APP_API_URL` **before** the first build; CRA inlines it at build time.

After changing `CLIENT_URL` on Render, trigger a **manual redeploy** so CORS picks up the new frontend origin.

**Limitations (demo tier):** Render free tier sleeps when idle; resume PDFs on Render disk are ephemeral (S3 would be the production upgrade).

---

## Database design

| Model | Purpose | Multi-tenant |
|-------|---------|:---:|
| Institute | College (name, slug, city, `isActive`) | Root |
| User | Students + admins (`email` + `institute` compound unique) | ✅ |
| Placement | Company, package, branch, year | ✅ |
| Job | Postings, CTC, deadline, eligibility | ✅ |
| Application | Job pipeline per student | ✅ |
| Experience | Interview breakdown + moderation | ✅ |
| Resume | Structured resume (per student) | Per-user |

---

## Key design decisions

| Decision | Rationale |
|----------|-----------|
| URL-based tenancy | No subdomain DNS; works on localhost; tamper-proof tenant id |
| Re-query user on each request | JWTs can’t be revoked before expiry |
| `{ email, institute }` unique index | Correct SaaS: same email in different colleges = different users |
| Separate student/admin tokens | Reduces privilege escalation risk |
| Zod `validate()` middleware | One line per route; strips unknown fields |
| Central `errorHandler` | Consistent JSON errors; no repetitive try/catch |
| Experience moderation | User content requires admin approval |

---

## Security & demo policy

- **Never commit** `.env`, Atlas passwords, or `JWT_SECRET`.
- **Public demo** uses a shared **student** account on **seed / synthetic data** — sufficient for recruiters to explore the product.
- **Admin credentials are not published** in this README; admin routes can delete or modify tenant data. Request a walkthrough for placement-cell features.
- Rotate demo passwords if the shared student account is abused.

---

## Author

**Anurag Rai**  
B.Tech, BIT Mesra  

- GitHub: [@raianurag18](https://github.com/raianurag18)
- Repository: [placement-tracker](https://github.com/raianurag18/placement-tracker)

---

*Portfolio project showcasing multi-tenant SaaS architecture, RBAC, and production-oriented Node.js patterns.*
