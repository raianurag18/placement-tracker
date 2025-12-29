const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');
const Institute = require('../models/Institute');
const User = require('../models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

mongoose.connect(process.env.MONGO_URI, {})
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        // Find the first institute (assuming BIT)
        const institute = await Institute.findOne();
        if (!institute) {
            console.error('❌ No institute found. Please run onboard first.');
            process.exit(1);
        }

        // Find a user (Admin/Student) to be the "poster"
        const user = await User.findOne({ institute: institute._id });

        const jobs = [
            {
                company: 'Google',
                role: 'Software Development Engineer',
                ctc: '32 LPA',
                description: 'Join the Google Cloud team to build scalable infrastructure.',
                eligibility: 'B.Tech CSE/IT, 8.0+ CGPA',
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                institute: institute._id,
                postedBy: user ? user._id : null
            },
            {
                company: 'Microsoft',
                role: 'SDE-1',
                ctc: '45 LPA',
                description: 'Work on Azure and AI services.',
                eligibility: 'All Branches, 7.5+ CGPA',
                deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                institute: institute._id,
                postedBy: user ? user._id : null
            },
            {
                company: 'TCS',
                role: 'System Engineer',
                ctc: '7 LPA',
                description: 'Digital transformation projects.',
                eligibility: 'All Branches',
                deadline: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday (Expired)
                institute: institute._id,
                postedBy: user ? user._id : null
            }
        ];

        await Job.deleteMany({}); // Clear old jobs
        await Job.insertMany(jobs);

        console.log('✅ Dummy Jobs Seeded Successfully!');
        process.exit();
    })
    .catch((err) => {
        console.error('❌ Error:', err);
        process.exit(1);
    });
