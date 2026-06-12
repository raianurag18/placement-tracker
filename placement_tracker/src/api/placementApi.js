/**
 * api/placementApi.js
 *
 * Purpose: All API calls related to placement records and statistics.
 *
 * ⚠️ INTERVIEW TIP: Stats/analytics APIs are the MOST dangerous place
 * for tenant leakage in a SaaS app. By routing through adminFetch() and
 * tenantFetch(), every query is scoped to the correct college automatically.
 */

import { tenantFetch, adminFetch } from './client';

/**
 * getPlacementStats
 * Fetch summary stats (highest package, total offers, etc.) for the dashboard
 *
 * @param {string} slug   - College slug
 * @param {AbortSignal} signal - Optional cancel signal
 */
export const getPlacementStats = (slug, signal) =>
    tenantFetch(slug, '/placements/stats', { signal });

/**
 * getAllPlacements
 * Fetch the full placement records list (used for Stats page with filters)
 *
 * @param {string} slug   - College slug
 * @param {AbortSignal} signal - Optional cancel signal
 */
export const getAllPlacements = (slug, signal) =>
    tenantFetch(slug, '/placements/all', { signal });

/**
 * getCompaniesList
 * Fetch the list of unique companies that visited this college
 *
 * @param {string} slug - College slug
 */
export const getCompaniesList = (slug) =>
    tenantFetch(slug, '/placements/companies');

/**
 * getCompanyPlacements
 * Fetch all placement records for a specific company
 *
 * @param {string} slug        - College slug
 * @param {string} companyName - The URL-encoded company name
 */
export const getCompanyPlacements = (slug, companyName) =>
    tenantFetch(slug, `/placements/companies/${companyName}`);

/**
 * getBranchStats
 * Fetch branch-wise placement statistics
 *
 * @param {string} slug - College slug
 */
export const getBranchStats = (slug) =>
    tenantFetch(slug, '/placements/stats/branch');

/**
 * getBranchPlacements
 * Fetch all placements for a specific branch
 *
 * @param {string} slug       - College slug
 * @param {string} branchName - The branch name (e.g., "CSE")
 */
export const getBranchPlacements = (slug, branchName) =>
    tenantFetch(slug, `/placements/branch/${branchName}`);

/**
 * getHighestPackageBranch
 * Fetch highest package data per branch
 *
 * @param {string} slug - College slug
 */
export const getHighestPackageBranch = (slug) =>
    tenantFetch(slug, '/placements/stats/branch/highest');

// ─── Admin Placement Functions ────────────────────────────────────────────────

/**
 * addPlacement
 * Admin only: Add a new placement record
 *
 * @param {string} slug - College slug
 * @param {object} data - Placement data { companyName, role, studentName, package, branch, year }
 */
export const addPlacement = (slug, data) =>
    adminFetch(slug, '/placements', {
        method: 'POST',
        body: JSON.stringify(data),
    });

/**
 * updatePlacement
 * Admin only: Update an existing placement record
 *
 * @param {string} slug - College slug
 * @param {string} id   - Placement document _id
 * @param {object} data - Updated placement data
 */
export const updatePlacement = (slug, id, data) =>
    adminFetch(slug, `/placements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

/**
 * deletePlacement
 * Admin only: Delete a placement record
 *
 * @param {string} slug - College slug
 * @param {string} id   - Placement document _id
 */
export const deletePlacement = (slug, id) =>
    adminFetch(slug, `/placements/${id}`, { method: 'DELETE' });
