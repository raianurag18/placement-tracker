/**
 * api/profileApi.js
 *
 * Purpose: All API calls related to student profile and resume.
 *
 * ⚠️ INTERVIEW TIP: Note the resume upload function — it uses FormData
 * (multipart/form-data), not JSON. Our tenantFetch() in client.js
 * detects FormData and skips setting Content-Type, because the browser
 * needs to set it automatically with the multipart boundary string.
 * This is a common interview "gotcha" with file uploads.
 */

import { tenantFetch } from './client';

/**
 * updateProfile
 * Update the student's editable profile fields (phone, etc.)
 *
 * @param {string} slug - College slug
 * @param {object} data - { phone, ... }
 */
export const updateProfile = (slug, data) =>
    tenantFetch(slug, '/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
        credentials: 'include', // Keep existing cookie behavior
    });

/**
 * uploadResume
 * Upload a PDF resume file for the student's profile.
 * Uses FormData (multipart), NOT JSON — so Content-Type is NOT set manually.
 *
 * @param {string}   slug       - College slug
 * @param {FormData} formData   - FormData object containing the 'resume' file
 */
export const uploadResume = (slug, formData) =>
    tenantFetch(slug, '/profile/resume', {
        method: 'POST',
        body: formData, // FormData object — client.js handles Content-Type automatically
        credentials: 'include',
    });

// ─── Resume Builder Functions ─────────────────────────────────────────────────

/**
 * getMyResume
 * Fetch the student's structured resume data from the resume builder
 *
 * @param {string} slug          - College slug
 * @param {AbortSignal} signal   - Optional cancel signal
 */
export const getMyResume = (slug, signal) =>
    tenantFetch(slug, '/resume/my', { signal });

/**
 * updateResume
 * Save/update the student's structured resume data
 *
 * @param {string} slug - College slug
 * @param {object} data - The full resume data object
 */
export const updateResume = (slug, data) =>
    tenantFetch(slug, '/resume/update', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
