# Placcera — Multi-Tenant College Placement Tracker

A production-grade SaaS platform where multiple colleges independently manage placement records, job postings, and student applications — all from a single deployment. Built with route-based multi-tenancy, role-based access control, and defense-in-depth security.

## Architecture Highlights

- **Multi-Tenant SaaS** — Each college gets an isolated portal via URL slugs (`/c/bitmesra/`, `/c/bitsgoa/`). A single codebase serves multiple institutions with complete data isolation.
- **Route-Based Tenancy** — Tenant identity derived from URL (tamper-proof), not request body or headers. The `tenantResolver` middleware validates and attaches the college context before any business logic runs.
- **Defense in Depth** — Three layers of tenant isolation: URL validation (tenantResolver), JWT cross-college check (authMiddleware), and query-level filtering (every DB query scoped by `institute`).
- **Role-Based Access Control** — Student and Admin roles with middleware-enforced authorization. Admin actions (CRUD placements, approve experiences, post jobs) are gated behind `protect` + `isAdmin` middleware chain.
- **Central Error Handling** — Custom `AppError` class + `asyncHandler` wrapper eliminates repetitive try/catch. Handles Mongoose validation errors, invalid ObjectIds, and duplicate keys automatically.
- **Input Validation** — Zod schemas on every write endpoint with a reusable `validate()` middleware factory. Strips unknown fields, coerces types, returns structured error responses.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router v7, Tailwind CSS, Radix UI, Chart.js, Framer Motion |
| Backend | Node.js, Express 5, MongoDB (Mongoose ODM) |
| Auth | JWT (stateless), bcrypt password hashing |
| Validation | Zod v4 |
| File Upload | Multer (PDF resume uploads) |
| UI Components | shadcn/ui (Radix + Tailwind primitives) |

## Features

### Student Portal
- **Placement Analytics** — View total offers, highest/average packages, company-wise and branch-wise breakdowns with interactive charts
- **Interview Experiences** — Read seniors' interview experiences with round-by-round details, tips, and difficulty ratings
- **Job Board** — Browse active job listings posted by the placement cell, apply with one click
- **Application Tracker** — Kanban-style board to track applications through stages (Applied → Assessment → Interview → Selected/Rejected)
- **Resume Builder** — Multi-section form (personal info, education, experience, projects, skills) with live preview and print-ready output
- **Profile Management** — Update phone, upload PDF resume (Multer with 5MB limit, PDF-only filter)

### Admin Portal
- **Placement Management** — Full CRUD for placement records with Zod-validated inputs
- **Job Postings** — Create, edit, delete job listings with eligibility criteria and deadlines
- **Experience Moderation** — Approve or reject student-submitted interview experiences before they go public
- **Placement Insights** — Analytics dashboard with branch-wise stats and aggregation pipelines

### Security & Data Isolation
- All data endpoints require authentication (no anonymous access to placement data)
- JWT includes `instituteId` — every API call is automatically tenant-aware
- Cross-college access check: a valid JWT from College A is rejected with 403 on College B's routes
- Compound unique index `{ email, institute }` — same email can exist in different colleges as separate accounts
- Credentials stored in environment variables, never hardcoded
- File uploads excluded from version control

## Project Structure

```
college_placement_project/
├── backend/
│   ├── config/            # Boot-time env contract + CORS origins
│   ├── controllers/        # Business logic (placementController)
│   ├── middleware/         # tenantResolver, authMiddleware, errorHandler
│   ├── models/            # Mongoose schemas (User, Job, Placement, Experience, etc.)
│   ├── routes/            # Express route definitions
│   ├── validators/        # Zod schemas + validate() factory
│   ├── utils/             # Seeders (admin, institutes, jobs, test tenants)
│   ├── data/              # Seed data (placements.json, experiences.json)
│   └── index.js           # Entry point, route mounting, middleware chain
│
├── placement_tracker/
│   ├── src/
│   │   ├── api/           # Service layer (tenantFetch, adminFetch, globalFetch)
│   │   ├── Admin/         # Admin portal pages + components
│   │   ├── Auth/          # Login, GetStarted pages
│   │   ├── Experience/    # Experience list + submit pages
│   │   ├── Stats/         # Placement analytics pages
│   │   ├── pages/         # Student portal pages
│   │   ├── components/    # Shared UI (Header, Sidebar, TenantLayout, etc.)
│   │   ├── context/       # AuthContext, CollegeContext
│   │   └── App.js         # Route definitions
│   └── public/            # Static assets, logos
│
└── .gitignore
```

## API Design

All tenant-specific endpoints follow the pattern:
```
/api/c/:collegeSlug/<resource>
```

**Middleware chain**: `tenantResolver` → `protect` → `isAdmin` → `validate(schema)` → `asyncHandler(controller)`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/institutes/search?q=` | GET | Public | College search (landing page) |
| `/api/c/:slug/auth/login` | POST | Public | Student login |
| `/api/c/:slug/admin/login` | POST | Public | Admin login |
| `/api/c/:slug/placements/stats` | GET | Student/Admin | Placement statistics |
| `/api/c/:slug/jobs` | GET/POST | Student/Admin | Job listings (POST = Admin only) |
| `/api/c/:slug/applications/apply/:id` | POST | Student | Apply to a job |
| `/api/c/:slug/experiences` | GET/POST | Student/Admin | Interview experiences |
| `/api/c/:slug/resume/my` | GET | Student | Get structured resume |

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Setup

```bash
# Clone the repository
git clone https://github.com/raianurag18/placement-tracker.git
cd college_placement_project

# Backend setup
cd backend
npm install
```

Create `backend/.env` (see `backend/.env.example`):
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
CLIENT_URL=http://localhost:3000
PORT=5000
```

```bash
# Run seed data (optional)
node seed.js
node utils/seedTestTenants.js

# Start backend (nodemon)
npm run dev
```

```bash
# Frontend setup
cd ../placement_tracker
cp .env.example .env.local
npm install
npm start
```

App runs at `http://localhost:3000`, API at `http://localhost:5000`.

Use `npm run dev` in `backend/` for nodemon during local work. `npm start` is the production entry (`node index.js`).

## Deploy (Vercel + Render + MongoDB Atlas)

This split keeps the React SPA on a CDN and the API next to MongoDB. Do not point the frontend `proxy` field at production — CRA's proxy is local-only.

### 1. MongoDB Atlas
1. Create a free cluster and a database user.
2. Allow network access from Render (`0.0.0.0/0` is typical for a student demo; tighten later).
3. Copy the connection string (`MONGO_URI`).

### 2. Backend on Render
1. New Web Service from this GitHub repo, **root directory `backend`**.
2. Build: `npm install` · Start: `npm start`.
3. Health check path: `/health`.
4. Environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI` — Atlas URI
   - `JWT_SECRET` — long random string (`openssl rand -hex 32`)
   - `CLIENT_URL` — your Vercel origin, e.g. `https://your-app.vercel.app` (comma-separate preview URLs if needed)
5. Optional: apply `render.yaml` in the repo root as a Render Blueprint.
6. After first deploy, copy the API URL (e.g. `https://placerra-api.onrender.com`).

Resume PDFs are stored on the API disk. Render's free disk is ephemeral — files vanish on restart. That is acceptable for a demo; S3 is the later upgrade.

### 3. Frontend on Vercel
1. Import the same repo. Set **Root Directory** to `placement_tracker`.
2. Build: `npm run build` · Output: `build` (CRA default).
3. Environment variable (must be set **before** the build):
   - `REACT_APP_API_URL` = Render API origin, **no trailing slash** (`https://placerra-api.onrender.com`)
4. `vercel.json` already rewrites all paths to `index.html` so `/c/bitmesra/dashboard` works on refresh.

### 4. Smoke test
- Open the Vercel URL → college search works (hits `/api/institutes/search`).
- Open `https://your-api.onrender.com/health` → `{ "status": "ok" }`.
- Log in as student and admin on a seeded tenant.
- Confirm a hard refresh on a nested route does not 404.

### Local vs production env files
| File | Purpose |
|------|---------|
| `backend/.env.example` | Copy to `backend/.env` |
| `placement_tracker/.env.example` | Copy to `placement_tracker/.env.local` |

## Database Design

| Model | Purpose | Multi-Tenant |
|-------|---------|:---:|
| Institute | College entity (name, slug, city, logo, isActive) | Root entity |
| User | Students + Admins (compound index: email + institute) | ✅ |
| Placement | Placement records (company, package, branch, year) | ✅ |
| Job | Job postings by admin (company, CTC, deadline, eligibility) | ✅ |
| Application | Student job applications with status pipeline | ✅ |
| Experience | Interview experiences with rounds, tips, moderation | ✅ |
| Resume | Structured resume data (one per student, upsert pattern) | Per-user |

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| URL-based tenancy over subdomain | Simpler DNS, works on localhost, stateless |
| Re-query DB on every request instead of trusting JWT | JWTs can't be revoked; ensures deleted/demoted users are caught immediately |
| Compound unique index `{email, institute}` | Correct SaaS behavior — same email in different colleges = different accounts |
| Separate admin/student JWT tokens | Prevents privilege escalation; stored in different localStorage keys |
| Zod validation middleware factory | Single `validate(schema)` line adds validation to any route (DRY) |
| Central error handler | Eliminates repetitive try/catch; consistent error response format |
| Experience moderation pipeline | Student-submitted content requires admin approval before public visibility |

## Author

**Anurag Rai**
B.Tech CSE, BIT Mesra (7th Semester)

---

*Built as a major project demonstrating SaaS architecture, multi-tenancy, RBAC, and production-grade backend patterns.*
