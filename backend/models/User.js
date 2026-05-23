const mongoose = require('mongoose');

/**
 * User Model — Serves both Students and Admins
 *
 * ⚠️ INTERVIEW TIP: In this multi-tenant architecture, the same email
 * (e.g., john@gmail.com) can exist in multiple colleges.
 * That's why we have a COMPOUND unique index on { email + institute }
 * instead of just { email }. This is critical for SaaS design.
 *
 * Roles:
 * - student    → tied to one college (institute field)
 * - admin      → tied to one college, can manage that college's data
 * - superadmin → NOT tied to any college, manages the entire platform
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    select: false // Don't return password by default in queries
  },
  googleId: String,
  role: {
    type: String,
    enum: ['student', 'admin', 'superadmin'], // superadmin = platform-level, no college
    default: 'student'
  },
  // institute: The college this user belongs to.
  // Null for superadmin (they manage all colleges).
  // Required for student and admin.
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute'
  },
  // Profile Fields (student-specific)
  branch: String,
  cgpa: Number,
  phone: String,
  resume: String // Path to uploaded PDF file
});

// ⚠️ INTERVIEW TIP: Compound unique index is the KEY to multi-tenancy.
// It means: "email must be unique PER college" (not globally unique).
// e.g., john@gmail.com at BIT Mesra and john@gmail.com at BITS Goa
// are TWO DIFFERENT USER ACCOUNTS. This is correct SaaS behavior.
userSchema.index(
  { email: 1, institute: 1 },
  { unique: true, sparse: true } // sparse: allows superadmins (no institute)
);

module.exports = mongoose.model('User', userSchema);

