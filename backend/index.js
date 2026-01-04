require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const createDummyAdmin = require('./utils/adminSeeder');

// Routes
const authRoutes = require('./routes/auth');
const placementRoutes = require('./routes/placements');
const experienceRoutes = require('./routes/experiences');
const adminRoutes = require('./routes/admin');
const instituteRoutes = require('./routes/institutes');
const profileRoutes = require('./routes/profile');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const resumeRoutes = require('./routes/resume');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', process.env.CLIENT_URL], // Add Client URL from env
  credentials: true,
}));
app.use(express.json());
// Serve static files (Uploaded Resumes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('✅ MongoDB connected');
    createDummyAdmin();
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes Configuration
app.use('/api/placements', placementRoutes);
app.use('/auth', authRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/resume', resumeRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
