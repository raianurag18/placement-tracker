const User = require('../models/User');
const Institute = require('../models/Institute');
const bcrypt = require('bcryptjs');
require('dotenv').config();

/**
 * createDummyAdmin
 *
 * Purpose: On every server start, ensure BIT Mesra has at least one admin.
 * This prevents the situation where you have no way to log in after a fresh setup.
 *
 * Business Logic:
 * 1. Find BIT Mesra college (the default tenant)
 * 2. Check if an admin user already exists for that college
 * 3. If not, create one with hashed password
 *
 * ⚠️ INTERVIEW TIP: We now use the User model (not the Admin model) because
 * the admin login route (routes/admin.js) queries User.findOne({ role: 'admin' }).
 * The Admin.js model was disconnected — it stored admins that the login route
 * never even looked at! This fixes that architectural inconsistency.
 */
const createDummyAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@bitmesra.edu';

        // Step 1: Find BIT Mesra college to get the instituteId
        const institute = await Institute.findOne({ slug: 'bitmesra' });

        if (!institute) {
            // College doesn't have a slug yet — migration hasn't run
            console.log('⚠️ BIT Mesra college not found with slug. Run migrate.js first.');
            return;
        }

        // Step 2: Check if admin already exists for this college
        const existingAdmin = await User.findOne({
            email: adminEmail,
            institute: institute._id,
            role: 'admin'
        });

        if (!existingAdmin) {
            // Step 3: Hash the password before saving (NEVER store plain text)
            const rawPassword = process.env.ADMIN_PASSWORD || 'admin123';
            const hashedPassword = await bcrypt.hash(rawPassword, 10);

            const newAdmin = new User({
                name: 'BIT Mesra Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                institute: institute._id  // Tied to BIT Mesra — this is multi-tenant!
            });

            await newAdmin.save();
            console.log(`🟢 Dummy admin created for BIT Mesra: ${adminEmail}`);
        } else {
            // Admin already exists — no action needed
        }
    } catch (err) {
        console.error('❌ Error creating dummy admin:', err.message);
    }
};

module.exports = createDummyAdmin;

