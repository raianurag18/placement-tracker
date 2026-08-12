# Placcera — Project Context for Claude Code

> This file is automatically loaded by Claude Code on every session.
> It provides persistent project context so you don't need to re-explain the architecture.

---

## Project Identity

- **Project Name:** Placcera
- **Developer:** Anurag Rai (B.Tech ECE, BIT Mesra)
- **What It Is:** A production-grade, multi-tenant SaaS college placement management platform
- **Core Idea:** Each college gets its own isolated portal under one unified deployment (like Slack workspaces)

---

## Tech Stack

### Backend (`backend/`)
| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js + Express | Express 5 |
| Database | MongoDB + Mongoose | Mongoose 8 |
| Auth | JWT (jsonwebtoken) + bcryptjs | — |
| Validation | Zod | v4 |
| File Upload | Multer | v2 |
| Module System | CommonJS (`require`) | — |
| Dev Tool | nodemon | — |

### Frontend (`placement_tracker/`)
| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19 |
| Routing | React Router (react-router-dom) | v7 |
| Styling | Tailwind CSS + shadcn/ui (Radix) | Tailwind 3.4 |
| Charts | Chart.js + react-chartjs-2 | — |
| Animations | Framer Motion | — |
| Icons | Lucide React | — |
| State | React Context API | — |
| Build | CRA (react-scripts) | 5.0.1 |
| Proxy | `http://localhost:5000` | — |

---

## Architecture: Multi-Tenancy

### The Core Pattern
Every college is a **tenant** identified by a URL slug (e.g., `bitmesra`).

**Backend Routes:**
```
Global:  /api/institutes                      ← No tenant needed
Tenant:  /api/c/:collegeSlug/<resource>       ← Tenant-scoped
```

**Frontend Routes:**
```
Global:  /                    ← Landing page (college search)
         /get-started         ← College selection + registration
         /about               ← Info page
         /login-failure       ← Error fallback

Tenant:  /c/:collegeSlug/login              ← Student login
         /c/:collegeSlug/dashboard          ← Student dashboard
         /c/:collegeSlug/admin/login        ← Admin login
         /c/:collegeSlug/admin/dashboard    ← Admin panel
```

### 3-Layer Tenant Isolation (Defense-in-Depth)
```
Layer 1 — URL:   tenantResolver parses :collegeSlug → looks up Institute → attaches req.college
Layer 2 — Auth:  JWT's institute field must match req.college._id (cross-tenant = 403)
Layer 3 — DB:    Every Mongoose query scoped with { institute: req.college._id }
```

### Backend Middleware Pipeline
```
Request → tenantResolver → protect (JWT Auth) → isAdmin (if needed) → validate (Zod) → asyncHandler(Controller)
```

---

## File Structure

```
college_placement_project/
├── backend/
│   ├── index.js                    ← Express server entry, route mounting, CORS, MongoDB connect
│   ├── controllers/
│   │   └── placementController.js  ← Placement business logic (stats aggregation, CRUD)
│   ├── models/
│   │   ├── Institute.js            ← College/tenant config (name, slug, city, logo)
│   │   ├── User.js                 ← Student + Admin (compound index: email + institute)
│   │   ├── Placement.js            ← Placement records (company, package, branch)
│   │   ├── Job.js                  ← Job postings (CTC, deadline, eligibility)
│   │   ├── Application.js          ← Job applications (compound index: job + student)
│   │   ├── Experience.js           ← Interview experiences (multi-round, approval flow)
│   │   └── Resume.js               ← Structured resume data
│   ├── middleware/
│   │   ├── tenantResolver.js       ← Multi-tenant gateway (slug → req.college)
│   │   ├── authMiddleware.js       ← JWT decode, cross-tenant check, protect/isAdmin/adminProtect
│   │   └── errorHandler.js         ← Centralized error handling framework
│   ├── routes/
│   │   ├── auth.js                 ← Student login/register/me
│   │   ├── admin.js                ← Admin login + all admin CRUD operations
│   │   ├── placements.js           ← Placement stats + records
│   │   ├── experiences.js          ← Experience CRUD + approval
│   │   ├── jobs.js                 ← Job listings
│   │   ├── applications.js         ← Application pipeline (apply, status update)
│   │   ├── profile.js              ← Student profile + resume upload (Multer)
│   │   ├── resume.js               ← Resume builder data
│   │   └── institutes.js           ← Global institute search (no tenant)
│   ├── validators/
│   │   ├── index.js                ← Zod validate() middleware wrapper
│   │   ├── authValidator.js        ← Login/register schema
│   │   ├── placementValidator.js   ← Placement data schema
│   │   ├── experienceValidator.js  ← Experience submission schema
│   │   ├── jobValidator.js         ← Job posting schema
│   │   ├── applicationValidator.js ← Application action schema
│   │   └── profileValidator.js     ← Profile update schema
│   ├── utils/
│   │   ├── seedJobs.js             ← Job seed generator
│   │   └── seedTestTenants.js      ← Test tenant/user seed data
│   ├── data/
│   │   ├── placements.json         ← Seed placement records
│   │   └── experiences.json        ← Seed interview experiences
│   ├── migrate.js                  ← Single-tenant → multi-tenant migration
│   ├── seed.js                     ← DB seeding entry point
│   ├── test_integration.js         ← Integration tests
│   └── test_isolation.js           ← Tenant isolation tests
│
└── placement_tracker/
    └── src/
        ├── App.js                  ← Router tree (nested routes, layout-level guards)
        ├── index.js                ← React entry point
        ├── index.css               ← Global + Tailwind styles
        ├── context/
        │   ├── AuthContext.js      ← JWT auth state, login/logout, user object
        │   └── CollegeContext.js   ← Current college/tenant resolution
        ├── api/
        │   ├── client.js           ← Axios instance, interceptors, base URL
        │   ├── experienceApi.js    ← Interview experience API calls
        │   ├── jobsApi.js          ← Job + application API calls
        │   ├── placementApi.js     ← Placement stats API
        │   └── profileApi.js       ← Profile + resume upload API
        ├── components/
        │   ├── MainLayout.jsx      ← Student authenticated shell (sidebar + header)
        │   ├── TenantLayout.jsx    ← College slug resolver + provider
        │   ├── Header.jsx          ← Top navigation bar
        │   ├── Sidebar.jsx         ← Side navigation
        │   ├── Footer.jsx          ← Footer
        │   ├── PrivateRoute.jsx    ← Student auth guard
        │   ├── Logo.jsx            ← Brand logo
        │   ├── InstituteSearch.jsx ← College search/autocomplete
        │   ├── JobCard.jsx         ← Job listing card
        │   ├── Resume/             ← Resume builder step components
        │   │   ├── PersonalInfoStep.jsx
        │   │   ├── EducationStep.jsx
        │   │   ├── ExperienceStep.jsx
        │   │   ├── ProjectsStep.jsx
        │   │   └── SkillsStep.jsx
        │   └── ui/                 ← shadcn/ui primitives (badge, button, card, etc.)
        ├── Auth/
        │   ├── LoginPage.jsx       ← Student login form
        │   ├── GetStartedPage.jsx  ← College selection + registration
        │   └── LoginFailurePage.jsx← Error fallback
        ├── pages/
        │   ├── LandingPage.jsx     ← Public hero + college search
        │   ├── StudentDashboard.jsx← Student home
        │   ├── ProfilePage.jsx     ← Profile view/edit
        │   ├── JobsPage.jsx        ← Browse jobs
        │   ├── MyApplications.jsx  ← Application tracker
        │   ├── ResumeBuilder.jsx   ← Multi-step resume form
        │   ├── ResumePreview.jsx   ← Print-ready resume
        │   ├── ExperienceDetailPage.jsx ← Single experience view
        │   └── AboutPage.jsx       ← About page
        ├── Experience/
        │   ├── ExperiencesPage.jsx ← Browse experiences list
        │   └── SubmitExperience.jsx← Multi-round experience form
        ├── Stats/
        │   ├── PlacementStats.jsx  ← Main stats dashboard with charts
        │   ├── CompaniesPage.jsx   ← Companies list
        │   ├── CompanyPlacementsPage.jsx ← Per-company drill-down
        │   ├── BranchStatsPage.jsx ← Per-branch analytics
        │   ├── BranchPlacementsPage.jsx  ← Branch placements table
        │   └── HighestPackageBranchPage.jsx ← Top package by branch
        ├── Admin/
        │   ├── AdminLogin.jsx      ← Admin login form
        │   ├── AdminDashboard.jsx  ← Admin home
        │   ├── AdminPrivateRoute.jsx ← Admin auth guard
        │   └── components/
        │       ├── AdminLayout.jsx         ← Admin sidebar + shell
        │       ├── PlacementTable.jsx      ← CRUD placements
        │       ├── PlacementInsights.jsx   ← Admin analytics
        │       ├── AddPlacementForm.jsx    ← Create placement
        │       ├── EditPlacementForm.jsx   ← Edit placement
        │       ├── ExperienceModeration.jsx← Approve/reject experiences
        │       ├── AdminJobsPage.jsx       ← Admin job management
        │       ├── JobForm.jsx             ← Job create/edit form
        │       ├── AdminApplications.jsx   ← Application pipeline control
        │       └── PlacementManagement.jsx ← Placement management entry
        └── lib/
            └── utils.js            ← cn() helper (clsx + tailwind-merge)
```

---

## Database Models — Key Relationships

```
Institute (tenant root)
├── User (student/admin) ← compound index: {email, institute}
├── Placement            ← company, package, branch records
├── Job                  ← postings with CTC, deadline, eligibility
│   └── Application      ← compound index: {job, student} (no duplicates)
├── Experience           ← interview breakdowns with approval flow
└── Resume               ← structured resume builder data
```

### Key Indexes
- `User`: `{"email": 1, "institute": 1}` — Same email can exist in different colleges
- `Application`: `{"job": 1, "student": 1}` — Prevents duplicate applications
- `Institute`: `{"slug": 1}` — Unique slug per college

---

## Auth Architecture

### Dual Token System
| Token | Who | Cookie Name | Generated By | Checked By |
|---|---|---|---|---|
| Student JWT | Students | `placerra_token` | `/api/c/:slug/auth/login` | `protect` middleware |
| Admin JWT | Admins | `admin_token` | `/api/c/:slug/admin/login` | `adminProtect` middleware |

### Auth Flow
1. Login form sends credentials to tenant-scoped endpoint
2. Backend verifies bcrypt hash (10 salt rounds)
3. JWT generated with `{ id, institute }` payload
4. Frontend stores token and user data
5. Every subsequent API call includes the token
6. `protect`/`adminProtect` decodes JWT, re-queries DB, validates tenant match

---

## Coding Conventions

### Backend
- CommonJS modules (`require`/`module.exports`)
- Controller functions wrapped in `asyncHandler` to forward errors
- All write routes validated with Zod schemas via `validate()` middleware
- Errors thrown as custom errors, caught by centralized `errorHandler`
- Route mounting in `index.js`: global routes first, then tenant routes with `tenantResolver`

### Frontend
- Functional components with hooks (no class components)
- React Context for global state (Auth + College)
- API layer in `src/api/` wraps all Axios calls
- shadcn/ui components in `src/components/ui/`
- Tailwind CSS for all styling (no CSS modules)
- React Router v7 with nested layout routes

### Naming
- Models: PascalCase singular (`User.js`, `Job.js`)
- Routes: lowercase plural (`auth.js`, `jobs.js`, `applications.js`)
- Components: PascalCase (`LoginPage.jsx`, `JobCard.jsx`)
- API files: camelCase (`jobsApi.js`, `profileApi.js`)

---

## Known Limitations
- **No Redis caching** — DB hit on every auth check
- **Local file storage** — Multer saves to `uploads/` (not S3/Cloudinary)
- **No rate limiting** — No `express-rate-limit` protection
- **No refresh tokens** — JWT expiry = forced re-login

---

## How to Run

### Backend
```bash
cd backend
npm start          # Starts with nodemon on port 5000
```
Requires `.env` with: `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`

### Frontend
```bash
cd placement_tracker
npm start          # CRA dev server on port 3000, proxies API to :5000
```
