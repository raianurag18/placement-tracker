/**
 * api/client.js — Core API Fetch Layer
 *
 * Purpose: This is the SINGLE source of truth for all HTTP requests.
 * Every fetch in the app flows through here.
 *
 * ⚠️ INTERVIEW TIP: This pattern is called a "Service Layer" or "API Client".
 * Instead of writing fetch() 35 times with different headers, we write it ONCE
 * and let every component benefit. If the auth header format changes, we fix
 * it in ONE place instead of hunting through 35 files.
 *
 * Three exported functions:
 *  - tenantFetch()  → For all student-facing /api/c/:slug/* endpoints
 *  - adminFetch()   → For all admin-facing /api/c/:slug/admin/* endpoints
 *  - globalFetch()  → For global endpoints like /api/institutes/search
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * handleResponse
 * Internal helper: checks status codes and handles auth errors centrally.
 *
 * @param {Response} response - The raw fetch Response object
 * @param {string|null} slug  - College slug, needed to build the login redirect URL
 */
const handleResponse = async (response, slug) => {
    // 401 = Token expired or invalid. Clear auth and force re-login.
    if (response.status === 401) {
        localStorage.removeItem('placerra_user');
        localStorage.removeItem('placerra_token');
        // Redirect to the correct tenant login, not a global /login
        const loginPath = slug ? `/c/${slug}/login` : '/login';
        window.location.href = loginPath;
        throw new Error('Session expired. Please log in again.');
    }

    // 403 = Logged in, but not authorized for this resource (e.g., wrong role)
    if (response.status === 403) {
        throw new Error('Access denied. You do not have permission for this action.');
    }

    // For other non-OK responses, extract the server's error message
    if (!response.ok) {
        // Try to parse JSON error body, fall back to a generic message
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Request failed with status ${response.status}`);
    }

    // Check if there's actually a body to parse (204 No Content has no body)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return null; // For responses with no body (e.g., DELETE)
};

/**
 * tenantFetch
 * For all student-facing requests that are scoped to a college.
 * Automatically injects the student's JWT token.
 *
 * Example: tenantFetch('bitmesra', '/experiences')
 * → GET http://localhost:5000/api/c/bitmesra/experiences
 *      with Authorization: Bearer <student_token>
 *
 * @param {string} slug     - College slug (e.g., 'bitmesra')
 * @param {string} path     - API path (e.g., '/experiences')
 * @param {object} options  - Standard fetch options (method, body, signal, etc.)
 */
export const tenantFetch = async (slug, path, options = {}) => {
    const token = localStorage.getItem('placerra_token');

    // Build headers — skip Content-Type for FormData (browser sets it with boundary)
    const headers = {
        ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers, // Allow caller to override headers
    };

    const response = await fetch(`${BASE_URL}/api/c/${slug}${path}`, {
        ...options,
        headers,
    });

    return handleResponse(response, slug);
};

/**
 * adminFetch
 * For all admin-facing requests. Uses the admin's separate JWT token.
 * This keeps student and admin tokens completely separate.
 *
 * Example: adminFetch('bitmesra', '/admin/pending-experiences')
 *
 * @param {string} slug     - College slug
 * @param {string} path     - API path (should start with /admin/...)
 * @param {object} options  - Standard fetch options
 */
export const adminFetch = async (slug, path, options = {}) => {
    const token = localStorage.getItem('admin_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}/api/c/${slug}${path}`, {
        ...options,
        headers,
    });

    // On 401, redirect to the ADMIN login page (not the student login)
    if (response.status === 401) {
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('admin_token');
        window.location.href = slug ? `/c/${slug}/admin/login` : '/admin/login';
        throw new Error('Admin session expired.');
    }

    return handleResponse(response, slug);
};

/**
 * globalFetch
 * For non-tenant API calls that don't belong to a specific college.
 * Examples: /api/institutes/search, /api/institutes/:slug/meta
 *
 * @param {string} path     - API path (e.g., '/institutes/search?q=BIT')
 * @param {object} options  - Standard fetch options
 */
export const globalFetch = async (path, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}/api${path}`, {
        ...options,
        headers,
    });

    return handleResponse(response, null);
};
