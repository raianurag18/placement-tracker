const config = require('./config/env');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

// ──────────────────────────────────────────────
// Middleware Imports
// ──────────────────────────────────────────────
const tenantResolver = require('./middleware/tenantResolver');
const { errorHandler } = require('./middleware/errorHandler');

// ──────────────────────────────────────────────
// Route Imports
// ──────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const placementRoutes = require('./routes/placements');
const experienceRoutes = require('./routes/experiences');
const adminRoutes = require('./routes/admin');
const instituteRoutes = require('./routes/institutes');
const profileRoutes = require('./routes/profile');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const resumeRoutes = require('./routes/resume');

const app = express();

// ──────────────────────────────────────────────
// Global Middleware
// ──────────────────────────────────────────────
// ⚠️ INTERVIEW TIP: Behind Render/Nginx, Express must trust the proxy so
// express-rate-limit reads the real client IP from X-Forwarded-For.
app.set('trust proxy', 1);

// Protects the server by setting secure HTTP headers (defends against XSS, clickjacking, etc.)
// API-only server: disable CSP here — the React host (Vercel) owns page CSP.
// cross-origin CORP lets the frontend fetch uploaded files from this API origin.
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin(origin, callback) {
    // Non-browser clients (health checks, server-to-server) send no Origin
    if (!origin) return callback(null, true);
    if (config.allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Mount the general API rate limiter to defend against excessive database queries
const { apiLimiter } = require('./middleware/rateLimiter');
app.use('/api', apiLimiter);

// Serve static files (Uploaded Resumes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ──────────────────────────────────────────────
// Health check — used by Render / load balancers (no tenant, no auth)
// ──────────────────────────────────────────────
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbOk = dbState === 1;
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'ok' : 'degraded',
    db: dbOk ? 'connected' : 'disconnected',
  });
});

// ──────────────────────────────────────────────
// PHASE A — GLOBAL ROUTES (No tenant needed)
// These serve all colleges or the landing page
// ──────────────────────────────────────────────

// College/Institute discovery — used by the landing page search bar
app.use('/api/institutes', instituteRoutes);

// ──────────────────────────────────────────────
// PHASE B — TENANT-AWARE ROUTES (NEW SaaS Routes)
// Pattern: /api/c/:collegeSlug/<resource>
// tenantResolver runs first → attaches req.college → route handler runs
//
// ⚠️ INTERVIEW TIP: The :collegeSlug in the route IS the tenant identifier.
// tenantResolver validates it and populates req.college so every
// downstream handler knows which college's data to read/write.
// ──────────────────────────────────────────────

// Student authentication — tenant aware
app.use('/api/c/:collegeSlug/auth', tenantResolver, authRoutes);

// Admin authentication + admin operations — tenant aware
app.use('/api/c/:collegeSlug/admin', tenantResolver, adminRoutes);

// Placement stats — tenant aware
app.use('/api/c/:collegeSlug/placements', tenantResolver, placementRoutes);

// Interview experiences — tenant aware
app.use('/api/c/:collegeSlug/experiences', tenantResolver, experienceRoutes);

// Job listings — tenant aware
app.use('/api/c/:collegeSlug/jobs', tenantResolver, jobRoutes);

// Job applications — tenant aware
app.use('/api/c/:collegeSlug/applications', tenantResolver, applicationRoutes);

// Student profile — tenant aware
app.use('/api/c/:collegeSlug/profile', tenantResolver, profileRoutes);

// Resume management — tenant aware
app.use('/api/c/:collegeSlug/resume', tenantResolver, resumeRoutes);

// Unknown API paths → consistent JSON 404 (not an HTML Express default)
app.use('/api', (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// ──────────────────────────────────────────────
// Central Error Handler (must be LAST middleware)
// ──────────────────────────────────────────────
app.use(errorHandler);

// ──────────────────────────────────────────────
// Start Server — connect DB first so we never accept traffic on a dead database
// ──────────────────────────────────────────────
async function start() {
  await mongoose.connect(config.mongoUri);
  console.log('✅ MongoDB connected');

  app.listen(config.port, () => {
    console.log(`🚀 Server is running on http://localhost:${config.port}`);
    console.log(`📡 Tenant routes active: /api/c/:collegeSlug/...`);
    console.log(`🌍 NODE_ENV=${config.nodeEnv}`);
  });
}

start().catch((err) => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});
