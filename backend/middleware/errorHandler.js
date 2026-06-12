/**
 * Central Error Handling Middleware
 *
 * ⚠️ INTERVIEW TIP: Express identifies error-handling middleware by its
 * 4-parameter signature (err, req, res, next). This MUST come after all
 * route definitions in index.js.
 *
 * Benefits:
 * - Single place to format error responses (consistent API contract)
 * - No more try/catch in every route handler
 * - Easy to add logging, monitoring, or error reporting later
 * - Separates error formatting from business logic
 */

/**
 * Custom Error Class
 *
 * Usage in routes:
 *   throw new AppError('Job not found', 404);
 *   throw new AppError('Not authorized', 403);
 *
 * Without this, all errors would default to 500.
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Distinguishes expected errors from bugs
    }
}

/**
 * asyncHandler
 *
 * Wraps an async route handler so that any thrown error or rejected promise
 * is automatically passed to Express's next(err) — which triggers errorHandler.
 *
 * Usage:
 *   router.get('/', asyncHandler(async (req, res) => {
 *       const data = await Model.find();
 *       res.json(data);
 *   }));
 *
 * No more try/catch needed!
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * errorHandler
 *
 * Central middleware that catches ALL errors and sends a clean JSON response.
 * Mounted as the LAST middleware in index.js.
 */
const errorHandler = (err, req, res, next) => {
    // Default to 500 if no status code was set
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error (only full stack for unexpected errors)
    if (statusCode === 500) {
        console.error('❌ Unexpected Error:', err.stack);
    } else {
        console.error(`⚠️ ${statusCode}: ${message}`);
    }

    // Mongoose validation error (e.g., required field missing)
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            message: 'Validation Error',
            errors: messages
        });
    }

    // Mongoose bad ObjectId (e.g., /jobs/not-a-valid-id)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({
            message: 'Invalid ID format'
        });
    }

    // Mongoose duplicate key error (e.g., duplicate application)
    if (err.code === 11000) {
        return res.status(409).json({
            message: 'Duplicate entry. This record already exists.'
        });
    }

    // Send response
    res.status(statusCode).json({
        message,
        // Only include stack trace in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = { AppError, asyncHandler, errorHandler };
