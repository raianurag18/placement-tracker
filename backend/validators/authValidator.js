const { validate, z } = require('./index');

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

module.exports = { validateLogin: validate(loginSchema) };
