---
description: What this project is all about
---

# Placcera — Complete Project Briefing

## Executive Summary
* **Developer:** Anurag Rai (B.Tech ECE, BIT Mesra)
* **Target Role:** Software Development Engineer (SDE)
* **Core Problem:** Educational placement management is traditionally fragmented across disconnected spreadsheets and chat groups, lacking centralized metrics, verified interview archives, and multi-tenant scaling.
* **Solution:** **Placcera** is a production-grade, multi-tenant SaaS placement platform. It hosts completely isolated college portals under a single unified deployment, introducing structural security patterns, role-based access control (RBAC), and automated data pipelines.

---

## Architecture & System Design

### 1. Route-Based Multi-Tenancy
Placcera enforces workspace isolation at the infrastructure level using custom middleware, mirroring the architecture of enterprise platforms like Slack.
* **Frontend Routing:** `/c/:collegeSlug/dashboard` (e.g., `/c/bitmesra/dashboard`)
* **API Endpoints:** `/api/c/:collegeSlug/placements/stats`

### 2. 3-Layer Defense-in-Depth Isolation
Data separation does not rely on a single gateway. Three decoupled layers validate every transactional boundary:
1. **HTTP/URL Layer (`tenantResolver` Middleware):** Parses the `:collegeSlug`, cross-references the database to confirm the tenant exists and is active, and mounts the metadata object directly onto the request (`req.college`).
2. **Authentication Layer (`authMiddleware`):** Extracts and decodes the JWT. It explicitly validates that the user’s associated institute ID matches the resolved tenant ID (`req.college._id`). If a valid token from Tenant A attempts to request resources from Tenant B, it drops immediately with a `403 Forbidden` error.
3. **Database Layer (Query Scoping):** Every Mongoose query programmatically injects the tenant scoping constraint: `{ institute: req.college._id }`.

### 3. The Middleware Processing Pipeline
Every incoming protected request traverses a strict, sequential pipeline:
Request -> tenantResolver -> protect (JWT Auth) -> isAdmin (If Req.) -> validate (Zod) -> asyncHandler(Controller)

---

## Database Architecture & Models
The MongoDB database uses Mongoose with strict indexing strategies to maximize search efficiency and guarantee cross-tenant schema validity.

* **Institute:** Configuration profiles per college (`name`, unique web `slug`, `city`, `logo`).
* **User:** Multi-role records (`student`, `admin`). Includes a **compound unique index** `{"email": 1, "institute": 1}`. This architectural choice permits identical email addresses to coexist globally across separate colleges without colliding.
* **Placement:** Metrics repository containing individual placement records, packages (LPA), companies, and student branches.
* **Job:** Postings featuring explicit tracking for CTC packages, registration deadlines, and eligibility bounds.
* **Application:** Tracks job pipelines via a compound unique index `{"job": 1, "student": 1}` to eliminate duplicate submittals.
* **Experience:** Comprehensive multi-round breakdown of interviews, technical questions, and candidate advice.
* **Resume:** Structured, multi-step resume builder schematics.

---

## Key Feature Implementation

### Dual-State Landing Page
* **Unauthenticated State:** A global tenant index with predictive search components to guide users to their respective college portal.
* **Tenant Portal State:** Public dashboard presenting a rich Bento grid containing live metrics (placed counts, top CTC, active companies) fetched via non-authenticated endpoints before logging in.

### Security Architecture & RBAC
* **Privilege Separation:** Separate endpoints handle auth for students (`/auth/login`) and admins (`/admin/login`), generating distinct tokens (`placerra_token` vs `admin_token`) to prevent cross-contamination or privilege escalation attacks.
* **State Verification:** Instead of blindly trusting decoded JWT payloads, protected routes re-query the database on every lifecycle event to catch revoked, suspended, or demoted accounts in real time.
* **Cryptographic Storage:** Passwords undergo asynchronous hashing via `bcrypt` using 10 salt rounds.

### Pipeline Analytics & Job Tracking
* **Data Visualization:** Aggregated data feeds into responsive dashboards built with Chart.js, rendering year-over-year bar charts, branch placement distributions via pie charts, and filtered analytical tables.
* **Application Kanban:** Applications proceed through state changes: Applied -> Assessment -> Interview -> Selected/Rejected.
* **State Permission Split:** To model real-world business constraints, job-linked application nodes can only be mutated by the Placement Admin. Students retain absolute control only over custom, manually added personal trackers.

### Content Moderation Engine
* **Submission Workflow:** Interview profiles submitted by students default to an unverified state (`approved: false`).
* **Granular Admin Auditing:** Admins review details across chronological interview rounds, specialized questions, and core tips within a dedicated moderation desk before opening visibility to the wider student pool.

### Resume & Profile Engineering
* **Structured Resume Builder:** Multi-step form state machine with persistence loops that compiles down into standard, print-ready CSS layouts for PDF generation.
* **Profile Safeguards:** Core educational values (Name, Branch, CGPA) are read-only for students and locked behind placement-cell controls to guarantee data veracity.
* **Asset Handling:** Handles resume uploads using Multer with strict binary filter constraints (5MB limits, PDF MIME validation) and isolated file hashing techniques.

---

## Complete Technology Stack

| Layer | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 19, React Router v7 | Modern single-page mechanics leveraging advanced nested layouts. |
| **Styling** | Tailwind CSS, shadcn/ui | Accelerated style prototyping built over accessible Radix primitives. |
| **Charts** | Chart.js, react-chartjs-2 | Interactive client-side placement analytic metrics rendering. |
| **Backend** | Node.js, Express 5 | Asynchronous, low-overhead REST architecture. |
| **Database** | MongoDB + Mongoose | Highly flexible Document schemas designed for progressive iteration. |
| **Validation**| Zod v4 | Runtime type-safety ensuring fail-fast edge boundaries. |
| **State** | React Context API | Lean global state management (Auth/College) avoiding heavy Redux setup. |

---

## Architectural Evolution (How Development Happened)

* **Phase 1: Single-Tenant Monolith**
  * Monolithic schema, Passport.js session stores, single-college logic.
* **Phase 2: Multi-Tenant Core Migration**
  * Created Institute schema, compound user indices, slug routing. Switched to stateless JWT architecture. Managed zero-downtime data migration via `migrate.js`.
* **Phase 3: Production Hardening & Optimization**
  * Codebase refactored to eliminate technical debt: Eradicated legacy single-tenant paths, non-scoped code blocks, and boilerplate. Implemented a unified centralized Error Handling Framework + `asyncHandler` wrappers. Injected strict Zod type schemas across all active write routes. Locked down open endpoints behind auth gates and built the Admin Application Control feature. Shifted frontend guards to layout-level route boundaries.

---

## Production Security Matrix

* **Multi-Tenant Gateway:** Enforces isolated data streams via the custom `tenantResolver` middleware wrapper.
* **Cross-Tenant Prevention:** Compares embedded JWT payload attributes directly with resolved route IDs before data lookup.
* **Data Sanitization:** Strict Zod formatting rules discard undeclared parameters to neutralize injection strategies.
* **Storage Guardrails:** Implements size cap triggers (5MB) along with explicit file signature validation filters.

---

## Limitations & Future Roadmap
* **Caching Layer:** Database lookups run on every lifecycle request. Adding a Redis layer would offload session metadata reads.
* **Distributed Object Stores:** Local disk storage handles current file uploads. Shifting to an AWS S3/Cloudinary bucket system would be the clear move for high-scale horizontal deployment.
* **Rate-Limiting Guards:** Lacks traffic shaping mechanisms; adding `express-rate-limit` policies per-tenant would shield endpoints from brute-force scripts.