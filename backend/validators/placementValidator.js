const { validate, z } = require('./index');

const placementSchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    role: z.string().min(2, "Role must be at least 2 characters"),
    package: z.coerce.number().positive("Package must be a positive number"),
    year: z.coerce.number().int().min(2000).max(2030),
    branch: z.string().min(2, "Branch is required"),
});

module.exports = { validatePlacement: validate(placementSchema) };
