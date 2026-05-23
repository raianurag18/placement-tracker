/**
 * api.js — Centralized API URL Generator
 *
 * Purpose: Instead of hardcoding `/api/c/bitmesra/placements` everywhere,
 * use these helper functions to generate tenant-aware API URLs cleanly.
 *
 * ⚠️ INTERVIEW TIP: Centralizing API URLs is a best practice called
 * "Single Source of Truth" for URLs. If the API base path ever changes,
 * you update ONE file instead of 25+ files.
 *
 * Usage:
 *   import { tenantApi, globalApi } from '../utils/api';
 *
 *   // For college-specific routes:
 *   fetch(tenantApi('bitmesra', '/placements/stats'))
 *   // → http://localhost:5000/api/c/bitmesra/placements/stats
 *
 *   // For global routes:
 *   fetch(globalApi('/institutes/search?q=BIT'))
 *   // → http://localhost:5000/api/institutes/search?q=BIT
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * tenantApi
 * Generates a URL for a tenant-specific (college-scoped) API endpoint.
 *
 * @param {string} collegeSlug - The college slug (e.g., 'bitmesra')
 * @param {string} path - The API path (e.g., '/placements/stats')
 * @returns {string} Full API URL
 */
export const tenantApi = (collegeSlug, path) => {
    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}/api/c/${collegeSlug}${cleanPath}`;
};

/**
 * globalApi
 * Generates a URL for a global (non-tenant) API endpoint.
 *
 * @param {string} path - The API path (e.g., '/institutes/search?q=BIT')
 * @returns {string} Full API URL
 */
export const globalApi = (path) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}/api${cleanPath}`;
};

/**
 * getAuthHeaders
 * Returns the Authorization header with the current user's JWT token.
 * Reads from localStorage where AuthContext stores the token.
 *
 * @returns {Object} Headers object with Authorization and Content-Type
 */
export const getAuthHeaders = () => {
    const token = localStorage.getItem('placerra_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

/**
 * getAdminAuthHeaders
 * Returns the Authorization header with the admin's JWT token.
 * Admin token is stored separately from student token.
 *
 * @returns {Object} Headers object with Authorization and Content-Type
 */
export const getAdminAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};
