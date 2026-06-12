const { validate, z } = require('./index');

const experienceSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    company: z.string().min(2, "Company name must be at least 2 characters"),
    role: z.string().min(2, "Role must be at least 2 characters"),
    package: z.string().min(1, "Package is required"),
    experience: z.string().min(10, "Experience must be at least 10 characters"),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium'),
    verdict: z.enum(['Selected', 'Rejected', 'Pending']).default('Selected'),
    rounds: z.array(z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        questions: z.array(z.string()).optional()
    })).optional(),
    tips: z.array(z.string()).optional(),
});

module.exports = { validateExperience: validate(experienceSchema) };
