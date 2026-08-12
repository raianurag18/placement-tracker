const rateLimit = require('express-rate-limit');

// 🛡️ API Limiter: Protects general data-fetching routes (placements, jobs, stats).
// This prevents the backend database from being overwhelmed if users spam refresh.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 200, // Limit each IP address to 200 requests per window
    message: {
        message: 'Too many requests from this IP. Please try again after 15 minutes.'
    },
    standardHeaders: true, // Send standard rate limit status in headers
    legacyHeaders: false, // Disable older X-RateLimit headers
});

// 🔑 Auth Limiter: Protects authentication paths (Student & Admin Login).
// This acts as a security barrier to block automated brute-force login attacks.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 10, // Limit each IP to 10 login attempts per window
    message: {
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter
};
