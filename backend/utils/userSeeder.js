const mongoose = require('mongoose');
const Institute = require('../models/Institute');
const User = require('../models/User');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        // 1. Get Institutes
        const bitMesra = await Institute.findOne({ name: 'BIT Mesra' });
        const iitBombay = await Institute.findOne({ name: 'IIT Bombay' });

        if (!bitMesra || !iitBombay) {
            console.error('❌ Institutes not found. Run instituteSeeder.js first.');
            process.exit(1);
        }

        // 2. Create Users
        const users = [
            {
                name: 'BIT Student',
                email: 'student@bit.edu',
                password: 'password123', // Will be hashed
                institute: bitMesra._id,
                role: 'student'
            },
            {
                name: 'BIT Admin',
                email: 'admin@bit.edu',
                password: 'password123',
                institute: bitMesra._id,
                role: 'admin'
            },
            {
                name: 'IIT Student',
                email: 'student@iit.edu',
                password: 'password123',
                institute: iitBombay._id,
                role: 'student'
            }
        ];

        for (const user of users) {
            // Hash password before saving
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const userWithHash = { ...user, password: hashedPassword };

            await User.updateOne(
                { email: user.email },
                { $set: userWithHash },
                { upsert: true }
            );
        }

        console.log('✅ Seeded Demo Users with Hashed Passwords');
        console.log('👉 BIT Student: student@bit.edu / password123');
        console.log('👉 BIT Admin: admin@bit.edu / password123');
        console.log('👉 IIT Student: student@iit.edu / password123');

        process.exit(0);

    } catch (err) {
        console.error('❌ Seeding Failed:', err);
        process.exit(1);
    }
};

seedUsers();
