require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const createDummyAdmin = require('./utils/adminSeeder');
const path = require('path');

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
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', process.env.CLIENT_URL],
  credentials: true,
}));
app.use(express.json());

// Serve static files (Uploaded Resumes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ──────────────────────────────────────────────
// MongoDB Connection
// ──────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('✅ MongoDB connected');
    createDummyAdmin();
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

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

// ──────────────────────────────────────────────
// Central Error Handler (must be LAST middleware)
// ──────────────────────────────────────────────
app.use(errorHandler);

// ──────────────────────────────────────────────
// Start Server
// ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Tenant routes active: /api/c/:collegeSlug/...`);
});

