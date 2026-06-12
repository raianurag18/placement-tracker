const { validate, z } = require('./index');

const jobSchema = z.object({
    company: z.string().min(2, "Company name must be at least 2 characters"),
    role: z.string().min(2, "Role must be at least 2 characters"),
    ctc: z.string().min(1, "CTC is required"),
    description: z.string().optional(),
    eligibility: z.string().default("All Branches"),
    deadline: z.string().min(1, "Deadline is required"), // Date string from frontend
    logo: z.string().url("Logo must be a valid URL").optional().or(z.literal('')),
    applyLink: z.string().url("Apply link must be a valid URL").optional().or(z.literal('')),
});

module.exports = { validateJob: validate(jobSchema) };
