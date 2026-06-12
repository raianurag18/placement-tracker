const { validate, z } = require('./index');

const createApplicationSchema = z.object({
    company: z.string().min(2, "Company name must be at least 2 characters"),
    role: z.string().min(2, "Role must be at least 2 characters"),
    status: z.enum(['Applied', 'Assessment', 'Interview', 'Selected', 'Rejected']).default('Applied'),
    notes: z.string().optional(),
    appliedAt: z.string().optional(),
});

const updateApplicationSchema = z.object({
    company: z.string().min(2).optional(),
    role: z.string().min(2).optional(),
    status: z.enum(['Applied', 'Assessment', 'Interview', 'Selected', 'Rejected']).optional(),
    notes: z.string().optional(),
});

module.exports = {
    validateCreateApplication: validate(createApplicationSchema),
    validateUpdateApplication: validate(updateApplicationSchema)
};
