const Admin = require('../models/Admin');
require('dotenv').config();

const createDummyAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@college.com';
        const existingAdmin = await Admin.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const newAdmin = new Admin({
                email: adminEmail,
                password: process.env.ADMIN_PASSWORD || 'admin123',
                role: 'admin',
            });

            await newAdmin.save();
            console.log('🟢 Dummy admin created');
        } else {
            // console.log('🟢 Admin already exists');
        }
    } catch (err) {
        console.error('❌ Error creating dummy admin:', err);
    }
};

module.exports = createDummyAdmin;
