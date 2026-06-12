const { z } = require('zod');

/**
 * validate(schema)
 *
 * Factory function that returns an Express middleware.
 * Pass any Zod schema and it will validate req.body against it.
 *
 * Usage:
 *   const { validate } = require('../validators');
 *   router.post('/', validate(jobSchema), handler);
 *
 * Benefits:
 * - Reusable across all routes (DRY)
 * - Replaces req.body with clean, coerced data (no extra fields leak through)
 * - Consistent 400 error format across all endpoints
 *
 * ⚠️ INTERVIEW TIP: This is the "Middleware Factory" pattern.
 * A function that RETURNS a middleware function, allowing configuration
 * (the schema) to be injected at definition time.
 */
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation Error',
                errors: error.issues.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        next(error);
    }
};

module.exports = { validate, z };
