/**
 * api/experienceApi.js
 *
 * Purpose: All API calls related to interview experiences.
 * Components import functions from here, never raw fetch().
 *
 * ⚠️ INTERVIEW TIP: Domain-specific API files are a great pattern.
 * If the backend renames /experiences to /interview-experiences,
 * you fix it in ONE file, not in every component that uses it.
 */

import { tenantFetch, adminFetch } from './client';

/**
 * getExperiences
 * Fetch all APPROVED experiences for a college (public, no auth needed for list)
 *
 * @param {string} slug - College slug
 * @param {AbortSignal} signal - Optional AbortController signal to cancel the request
 */
export const getExperiences = (slug, signal) =>
    tenantFetch(slug, '/experiences', { signal });

/**
 * getExperienceById
 * Fetch a single experience by its MongoDB ID
 *
 * @param {string} slug - College slug
 * @param {string} id   - The experience document _id
 */
export const getExperienceById = (slug, id) =>
    tenantFetch(slug, `/experiences/${id}`);

/**
 * submitExperience
 * Post a new interview experience (student must be logged in)
 *
 * @param {string} slug - College slug
 * @param {object} data - The experience form data
 */
export const submitExperience = (slug, data) =>
    tenantFetch(slug, '/experiences', {
        method: 'POST',
        body: JSON.stringify(data),
    });

// ─── Admin Experience Functions ──────────────────────────────────────────────

/**
 * getPendingExperiences
 * Admin only: Get all experiences pending moderation
 *
 * @param {string} slug - College slug
 */
export const getPendingExperiences = (slug) =>
    adminFetch(slug, '/admin/pending-experiences');

/**
 * approveExperience
 * Admin only: Approve a pending experience
 *
 * @param {string} slug - College slug
 * @param {string} id   - Experience _id
 */
export const approveExperience = (slug, id) =>
    adminFetch(slug, `/admin/approve/${id}`, { method: 'PATCH' });

/**
 * deleteExperience
 * Admin only: Delete an experience entirely
 *
 * @param {string} slug - College slug
 * @param {string} id   - Experience _id
 */
export const deleteExperience = (slug, id) =>
    adminFetch(slug, `/admin/experience/${id}`, { method: 'DELETE' });
