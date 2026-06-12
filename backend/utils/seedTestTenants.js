require('dotenv').config(); // Load .env from the current working directory (backend/)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Institute = require('../models/Institute');
const User = require('../models/User');
const Placement = require('../models/Placement');
const Experience = require('../models/Experience');
const Job = require('../models/Job');

const MOCK_COLLEGES = [
    { name: 'BITS Goa', city: 'Goa', slug: 'bitsgoa' },
    { name: 'IIT Bombay', city: 'Mumbai', slug: 'iitbombay' },
    { name: 'NIT Trichy', city: 'Tiruchirappalli', slug: 'nittrichy' }
];

const seedTestTenants = async () => {
    try {
        console.log('🔗 Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.');

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD , 10);
        const studentPassword = await bcrypt.hash(process.env.STUDENT_PASSWORD , 10);

        for (const collegeData of MOCK_COLLEGES) {
            console.log(`\n--- Seeding Test Data for ${collegeData.name} ---`);
            
            // 1. Create or Find Institute
            let institute = await Institute.findOne({ slug: collegeData.slug });
            if (!institute) {
                institute = new Institute({
                    name: collegeData.name,
                    city: collegeData.city,
                    slug: collegeData.slug,
                    isActive: true
                });
                await institute.save();
                console.log(`✅ Created Institute: ${collegeData.name}`);
            } else {
                console.log(`ℹ️ Institute ${collegeData.name} already exists. Skipping creation.`);
            }

            const instId = institute._id;

            // 2. Create Admin
            const adminEmail = `admin@${collegeData.slug}.edu`;
            let admin = await User.findOne({ email: adminEmail, institute: instId });
            if (!admin) {
                admin = new User({
                    name: `${collegeData.name} Admin`,
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'admin',
                    institute: instId
                });
                await admin.save();
                console.log(`✅ Created Admin: ${adminEmail}`);
            }

            // 3. Create Student
            const studentEmail = `student@${collegeData.slug}.edu`;
            let student = await User.findOne({ email: studentEmail, institute: instId });
            if (!student) {
                student = new User({
                    name: `${collegeData.name} Student`,
                    email: studentEmail,
                    password: studentPassword,
                    role: 'student',
                    branch: 'Computer Science',
                    cgpa: 8.5,
                    institute: instId
                });
                await student.save();
                console.log(`✅ Created Student: ${studentEmail}`);
            }

            // 4. Create Dummy Placements (Only if none exist for this college)
            const placementCount = await Placement.countDocuments({ institute: instId });
            if (placementCount === 0) {
                const placements = [
                    { companyName: 'Google', role: 'Software Engineer', package: 45, year: 2024, branch: 'Computer Science', institute: instId },
                    { companyName: 'Amazon', role: 'SDE 1', package: 32, year: 2024, branch: 'Information Technology', institute: instId },
                    { companyName: 'Atlassian', role: 'Frontend Engineer', package: 40, year: 2023, branch: 'Computer Science', institute: instId }
                ];
                await Placement.insertMany(placements);
                console.log(`✅ Created ${placements.length} dummy Placements`);
            } else {
                console.log(`ℹ️ Placements already exist for ${collegeData.name}.`);
            }

            // 5. Create Dummy Experiences
            const expCount = await Experience.countDocuments({ institute: instId });
            if (expCount === 0) {
                const experiences = [
                    {
                        name: student.name,
                        company: 'Google',
                        role: 'Software Engineer',
                        package: '45 LPA',
                        experience: 'Focus heavily on dynamic programming and system design basics.',
                        difficulty: 'Hard',
                        verdict: 'Selected',
                        rounds: [
                            { name: 'Online Assessment', description: '2 DSA questions', questions: ['Graph traversal', 'DP'] }
                        ],
                        tips: ['Practice Leetcode Hard'],
                        approved: true,
                        institute: instId
                    },
                    {
                        name: student.name,
                        company: 'Amazon',
                        role: 'SDE 1',
                        package: '32 LPA',
                        experience: 'Standard Amazon leadership principles combined with graph algorithms.',
                        difficulty: 'Medium',
                        verdict: 'Selected',
                        rounds: [
                            { name: 'Technical Interview', description: 'Trees and Graphs', questions: ['Lowest Common Ancestor'] }
                        ],
                        tips: ['Have good stories for LPs'],
                        approved: true,
                        institute: instId
                    }
                ];
                await Experience.insertMany(experiences);
                console.log(`✅ Created 2 dummy Experiences`);
            }

            // 6. Create Dummy Job
            const jobCount = await Job.countDocuments({ institute: instId });
            if (jobCount === 0) {
                const job = new Job({
                    company: 'Microsoft',
                    role: 'Software Engineer',
                    location: 'Hyderabad',
                    ctc: '40 LPA',
                    deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                    type: 'Full-time',
                    description: 'We are hiring SDEs for the Azure team.',
                    eligibility: 'B.Tech CS/IT with >8 CGPA',
                    institute: instId
                });
                await job.save();
                console.log(`✅ Created 1 dummy Job`);
            }
        }

        console.log('\n🎉 Test Data Seeding Complete!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error seeding test data:', err);
        process.exit(1);
    }
};

seedTestTenants();
