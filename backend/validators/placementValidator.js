const { z } = require('zod');

// Schema Definition
const placementSchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    role: z.string().min(2, "Role must be at least 2 characters"),
    package: z.coerce.number().positive("Package must be a positive number"), // coerce handles "12" -> 12
    year: z.coerce.number().int().min(2000).max(2030),
    branch: z.string().min(2, "Branch is required"),
});

// Middleware Function
const validatePlacement = (req, res, next) => {
    try {
        // Parse checks req.body against schema. If fail, throws error.
        // parse returns the clean data (with coercions applied)
        const cleanData = placementSchema.parse(req.body);

        // Optional: Replace req.body with cleanData to ensure no extra fields pass through
        req.body = cleanData;

        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation Error",
                errors: error.errors.map(e => e.message)
            });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { validatePlacement };
