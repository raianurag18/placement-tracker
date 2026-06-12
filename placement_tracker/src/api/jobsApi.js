/**
 * api/jobsApi.js
 *
 * Purpose: All API calls related to job listings and student applications.
 *
 * ⚠️ INTERVIEW TIP: Notice how admin and student calls use different
 * fetch wrappers (adminFetch vs tenantFetch). This is intentional:
 * - Students use their placerra_token
 * - Admins use their admin_token
 * Keeping these separate prevents privilege escalation bugs.
 */

import { tenantFetch, adminFetch } from './client';

// ─── Student Job Functions ────────────────────────────────────────────────────

/**
 * getJobs
 * Fetch all available job listings for a college
 *
 * @param {string} slug          - College slug
 * @param {AbortSignal} signal   - Optional cancel signal (to prevent stale requests)
 */
export const getJobs = (slug, signal) =>
    tenantFetch(slug, '/jobs', { signal });

/**
 * checkApplicationStatus
 * Check if the current student has already applied to a specific job
 * Called on every JobCard mount to show the correct button state
 *
 * @param {string} slug  - College slug
 * @param {string} jobId - The job document _id
 */
export const checkApplicationStatus = (slug, jobId) =>
    tenantFetch(slug, `/applications/check/${jobId}`);

/**
 * applyToJob
 * Submit an application for a specific job listing
 *
 * @param {string} slug  - College slug
 * @param {string} jobId - The job document _id
 */
export const applyToJob = (slug, jobId) =>
    tenantFetch(slug, `/applications/apply/${jobId}`, { method: 'POST' });

// ─── Student Application Tracker Functions ───────────────────────────────────

/**
 * getMyApplications
 * Fetch all manually-tracked applications for the logged-in student
 *
 * @param {string} slug          - College slug
 * @param {AbortSignal} signal   - Optional cancel signal
 */
export const getMyApplications = (slug, signal) =>
    tenantFetch(slug, '/applications/my', { signal });

/**
 * createApplication
 * Manually add an application to the student's tracking board
 *
 * @param {string} slug - College slug
 * @param {object} data - { company, role, status, notes }
 */
export const createApplication = (slug, data) =>
    tenantFetch(slug, '/applications/create', {
        method: 'POST',
        body: JSON.stringify(data),
    });

/**
 * updateApplication
 * Update an existing tracked application (status change, notes, etc.)
 *
 * @param {string} slug - College slug
 * @param {string} id   - Application document _id
 * @param {object} data - Fields to update
 */
export const updateApplication = (slug, id, data) =>
    tenantFetch(slug, `/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });

/**
 * deleteApplication
 * Remove a tracked application from the student's board
 *
 * @param {string} slug - College slug
 * @param {string} id   - Application document _id
 */
export const deleteApplication = (slug, id) =>
    tenantFetch(slug, `/applications/${id}`, { method: 'DELETE' });

// ─── Admin Job Functions ──────────────────────────────────────────────────────

/**
 * getAdminJobs
 * Admin only: Fetch all job listings (includes inactive ones)
 *
 * @param {string} slug - College slug
 */
export const getAdminJobs = (slug) =>
    adminFetch(slug, '/jobs');

/**
 * createJob
 * Admin only: Create a new job listing / placement drive
 *
 * @param {string} slug - College slug
 * @param {object} data - Job listing data
 */
export const createJob = (slug, data) =>
    adminFetch(slug, '/jobs', {
        method: 'POST',
        body: JSON.stringify(data),
    });

/**
 * updateJob
 * Admin only: Update an existing job listing
 *
 * @param {string} slug - College slug
 * @param {string} id   - Job document _id
 * @param {object} data - Updated job data
 */
export const updateJob = (slug, id, data) =>
    adminFetch(slug, `/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

/**
 * deleteJob
 * Admin only: Delete a job listing
 *
 * @param {string} slug - College slug
 * @param {string} id   - Job document _id
 */
export const deleteJob = (slug, id) =>
    adminFetch(slug, `/jobs/${id}`, { method: 'DELETE' });
