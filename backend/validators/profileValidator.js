const { validate, z } = require('./index');

const updateProfileSchema = z.object({
    phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits").optional(),
});

module.exports = { validateProfile: validate(updateProfileSchema) };
