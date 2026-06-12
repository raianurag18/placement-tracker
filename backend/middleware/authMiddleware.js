const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @middleware protect
 *
 * Purpose: Verifies that the request comes from a logged-in user.
 * Also enforces cross-college access prevention for tenant routes.
 *
 * Logic Flow:
 * 1. Extract Bearer token from Authorization header
 * 2. Verify JWT signature
 * 3. Load the user from DB (always fresh data, not just token claims)
 * 4. ⭐ NEW: If req.college exists (tenant route), verify user belongs to that college
 * 5. Pass control to the next middleware/route handler
 *
 * ⚠️ INTERVIEW TIP: Why do we re-query the DB instead of trusting the JWT?
 * Because JWTs can't be invalidated before expiry. If a user is deleted or
 * their role changes, the JWT still "works." Re-querying DB ensures we always
 * have the current user state. For performance, you can add Redis caching here.
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Step 1: Extract token from "Bearer <token>" header
      token = req.headers.authorization.split(' ')[1];

      // Step 2: Verify token signature using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET );

      // Step 3: Load user from DB — always get fresh data
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found. Token may be invalid.' });
      }

      // ─────────────────────────────────────────────────────────────
      // Step 4: CROSS-COLLEGE ACCESS CHECK (The SaaS Security Layer)
      //
      // ⚠️ INTERVIEW TIP: This is "defense in depth."
      // Even if someone steals a BIT Mesra student's JWT and sends it to
      // /api/c/bitsgoa/placements, this check will reject it with 403.
      //
      // Without this check, the tenant system has a security hole:
      // a valid JWT from college A could access college B's data.
      // ─────────────────────────────────────────────────────────────
      if (req.college && req.user.institute) {
        const userCollegeId = req.user.institute.toString();
        const requestedCollegeId = req.college._id.toString();

        if (userCollegeId !== requestedCollegeId) {
          return res.status(403).json({
            message: 'Access denied: Your account does not belong to this college portal.'
          });
        }
      }

      next();

    } catch (error) {
      console.error('Auth middleware error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

/**
 * @middleware isAdmin
 * Purpose: Ensure only users with role 'admin' can access the route.
 * Must run AFTER the 'protect' middleware (which sets req.user).
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, isAdmin };

