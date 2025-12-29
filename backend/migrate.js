const mongoose = require('mongoose');
const Institute = require('./models/Institute');
const User = require('./models/User');
const Placement = require('./models/Placement');
const Experience = require('./models/Experience');
require('dotenv').config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        // 1. Find or Create Default Institute
        let institute = await Institute.findOne({ name: 'BIT Mesra', city: 'Ranchi' });
        if (!institute) {
            institute = new Institute({ name: 'BIT Mesra', city: 'Ranchi' });
            await institute.save();
            console.log('✅ Created Default Institute: BIT Mesra');
        } else {
            console.log('ℹ️ Found Default Institute: BIT Mesra');
        }

        const instituteId = institute._id;

        // 2. Migrate Users
        const userResult = await User.updateMany(
            { institute: { $exists: false } }, // Filter: where institute is missing
            { $set: { institute: instituteId } } // Update: set institute
        );
        console.log(`✅ Migrated ${userResult.modifiedCount} Users`);

        // 3. Migrate Placements
        const placementResult = await Placement.updateMany(
            { institute: { $exists: false } },
            { $set: { institute: instituteId } }
        );
        console.log(`✅ Migrated ${placementResult.modifiedCount} Placements`);

        // 4. Migrate Experiences
        const experienceResult = await Experience.updateMany(
            { institute: { $exists: false } },
            { $set: { institute: instituteId } }
        );
        console.log(`✅ Migrated ${experienceResult.modifiedCount} Experiences`);

        console.log('🎉 Migration Complete!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Migration Failed:', err);
        process.exit(1);
    }
};

migrate();
