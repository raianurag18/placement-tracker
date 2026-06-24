const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');
const Institute = require('../models/Institute');
const User = require('../models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * seedJobs
 *
 * Clears ALL existing jobs, then creates the SAME 3 dummy jobs for every
 * functional institute (those with a slug):
 *   1. Google    → ACTIVE (deadline in the future, students can apply)
 *   2. Microsoft → EXPIRED (deadline already passed)
 *   3. TCS       → EXPIRED (deadline already passed)
 *
 * Run:  node utils/seedJobs.js
 */
const DAY = 24 * 60 * 60 * 1000;

// Template for the 3 jobs. deadlineOffsetDays is relative to "now"
// (positive = future/active, negative = past/expired).
const jobTemplates = [
    {
        company: 'Google',
        role: 'Software Development Engineer',
        ctc: '32 LPA',
        description: 'Join the Google Cloud team to build scalable infrastructure.',
        eligibility: 'B.Tech CSE/IT, 8.0+ CGPA',
        deadlineOffsetDays: 14, // ACTIVE — 14 days from now
    },
    {
        company: 'Microsoft',
        role: 'SDE-1',
        ctc: '45 LPA',
        description: 'Work on Azure and AI services.',
        eligibility: 'All Branches, 7.5+ CGPA',
        deadlineOffsetDays: -3, // EXPIRED — 3 days ago
    },
    {
        company: 'TCS',
        role: 'System Engineer',
        ctc: '7 LPA',
        description: 'Digital transformation projects.',
        eligibility: 'All Branches',
        deadlineOffsetDays: -7, // EXPIRED — 7 days ago
    },
];

const seedJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('✅ Connected to MongoDB');

        // Only the functional institutes (the ones with a slug)
        const institutes = await Institute.find({ slug: { $exists: true, $ne: null } });

        if (institutes.length === 0) {
            console.error('❌ No functional institutes found.');
            process.exit(1);
        }

        // Wipe all existing jobs first
        const cleared = await Job.deleteMany({});
        console.log(`🗑️  Cleared ${cleared.deletedCount} existing jobs.`);

        const allJobs = [];

        for (const institute of institutes) {
            // Prefer an admin of this institute as the poster; fall back to any user
            const poster =
                (await User.findOne({ institute: institute._id, role: 'admin' })) ||
                (await User.findOne({ institute: institute._id }));

            for (const tpl of jobTemplates) {
                allJobs.push({
                    company: tpl.company,
                    role: tpl.role,
                    ctc: tpl.ctc,
                    description: tpl.description,
                    eligibility: tpl.eligibility,
                    deadline: new Date(Date.now() + tpl.deadlineOffsetDays * DAY),
                    institute: institute._id,
                    postedBy: poster ? poster._id : null,
                });
            }

            console.log(`   • Prepared 3 jobs for ${institute.name}`);
        }

        await Job.insertMany(allJobs);

        console.log(`\n✅ Seeded ${allJobs.length} jobs (${jobTemplates.length} per institute × ${institutes.length} institutes).`);
        console.log('   Google = ACTIVE | Microsoft & TCS = EXPIRED');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

seedJobs();
