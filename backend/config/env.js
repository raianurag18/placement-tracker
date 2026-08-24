/**
 * config/env.js — Boot-time environment contract
 *
 * ⚠️ INTERVIEW TIP: Fail fast at startup, not on the first user request.
 * A production process that boots without MONGO_URI or JWT_SECRET will
 * "look healthy" then leak insecure tokens or crash mid-traffic.
 *
 * This module is the SINGLE place that:
 *  1. Loads .env (local only — hosts inject real env vars)
 *  2. Validates required secrets
 *  3. Exports a typed-enough config object for CORS, port, and NODE_ENV
 */
require('dotenv').config();

const REQUIRED = ['MONGO_URI', 'JWT_SECRET'];

function assertEnv() {
    const missing = REQUIRED.filter((key) => !process.env[key] || !String(process.env[key]).trim());
    if (missing.length) {
        console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
        console.error('   Copy backend/.env.example to backend/.env and fill in values.');
        process.exit(1);
    }

    if (process.env.JWT_SECRET === 'your-secret-key-123') {
        console.error('❌ JWT_SECRET is using the insecure placeholder. Generate a long random secret.');
        process.exit(1);
    }
}

assertEnv();

/**
 * Allowed browser origins for CORS.
 * CLIENT_URL can be a single origin or a comma-separated list
 * (useful for Vercel production + preview URLs).
 */
function getAllowedOrigins() {
    const fromEnv = String(process.env.CLIENT_URL || '')
        .split(',')
        .map((origin) => origin.trim().replace(/\/$/, ''))
        .filter(Boolean);

    return [...new Set([
        'http://localhost:3000',
        'http://localhost:3001',
        ...fromEnv,
    ])];
}

module.exports = {
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: (process.env.NODE_ENV || 'development') === 'production',
    port: Number(process.env.PORT) || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    allowedOrigins: getAllowedOrigins(),
};
