const User = require('../models/User');
const Institute = require('../models/Institute');
const bcrypt = require('bcryptjs');

/**
 * createDummyAdmin
 *
 * Purpose: On server start in development, ensure BIT Mesra has at least one admin.
 * This prevents the situation where you have no way to log in after a fresh setup.
 *
 * Only runs when ADMIN_EMAIL and ADMIN_PASSWORD are set in .env.
 * In production, admins should be created via a one-time script, not on every boot.
 */
const createDummyAdmin = async () => {
    // Only seed if credentials are explicitly configured in .env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        // No credentials in .env — skip seeding silently
        return;
    }

    try {
        const institute = await Institute.findOne({ slug: 'bitmesra' });

        if (!institute) {
            console.log('⚠️ BIT Mesra not found. Run migrate.js first.');
            return;
        }

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            email: adminEmail,
            institute: institute._id,
            role: 'admin'
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            await User.create({
                name: 'BIT Mesra Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                institute: institute._id
            });

            console.log(`🟢 Admin created for BIT Mesra: ${adminEmail}`);
        }
    } catch (err) {
        console.error('❌ Admin seeder error:', err.message);
    }
};

module.exports = createDummyAdmin;
