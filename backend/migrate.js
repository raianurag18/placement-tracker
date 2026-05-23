require('dotenv').config();
const mongoose = require('mongoose');
const Institute = require('./models/Institute');
const User = require('./models/User');
const Placement = require('./models/Placement');
const Experience = require('./models/Experience');
const Job = require('./models/Job');
const Application = require('./models/Application');

/**
 * Safe Migration Script for BIT Mesra → Multi-Tenant SaaS
 *
 * ⚠️ IMPORTANT: Run `mongodump` BEFORE running this script.
 *
 * What this script does:
 * 1. Finds the existing BIT Mesra Institute document
 * 2. Adds slug: 'bitmesra' to it (the URL identifier for /c/bitmesra)
 * 3. Sets isActive: true
 * 4. Migrates all existing Users, Placements, Experiences, Jobs, Applications
 *    that have no institute field → assigns them to BIT Mesra
 *
 * ⚠️ INTERVIEW TIP: This is "zero-downtime migration" strategy.
 * We use $exists: false as the filter so we only update records that
 * haven't been migrated yet. Running this script multiple times is SAFE.
 */
const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        // ──────────────────────────────────────────────
        // STEP 1: Find or Create BIT Mesra Institute
        // ──────────────────────────────────────────────
        let institute = await Institute.findOne({ name: 'BIT Mesra', city: 'Ranchi' });

        if (!institute) {
            institute = new Institute({
                name: 'BIT Mesra',
                city: 'Ranchi',
                slug: 'bitmesra',
                isActive: true
            });
            await institute.save();
            console.log('✅ Created Default Institute: BIT Mesra (slug: bitmesra)');
        } else {
            // Business Logic: Add slug to existing institute if missing
            // This is safe — it only updates if slug is not already set
            if (!institute.slug) {
                institute.slug = 'bitmesra';
                institute.isActive = true;
                await institute.save();
                console.log('✅ Updated BIT Mesra Institute with slug: bitmesra');
            } else {
                console.log(`ℹ️ BIT Mesra already has slug: '${institute.slug}' — skipping`);
            }
        }

        const instituteId = institute._id;

        // ──────────────────────────────────────────────
        // STEP 2: Migrate Users missing institute field
        // ──────────────────────────────────────────────
        const userResult = await User.updateMany(
            { institute: { $exists: false } },
            { $set: { institute: instituteId } }
        );
        console.log(`✅ Migrated ${userResult.modifiedCount} Users → BIT Mesra`);

        // ──────────────────────────────────────────────
        // STEP 3: Migrate Placements missing institute field
        // ──────────────────────────────────────────────
        const placementResult = await Placement.updateMany(
            { institute: { $exists: false } },
            { $set: { institute: instituteId } }
        );
        console.log(`✅ Migrated ${placementResult.modifiedCount} Placements → BIT Mesra`);

        // ──────────────────────────────────────────────
        // STEP 4: Migrate Experiences missing institute field
        // ──────────────────────────────────────────────
        const experienceResult = await Experience.updateMany(
            { institute: { $exists: false } },
            { $set: { institute: instituteId } }
        );
        console.log(`✅ Migrated ${experienceResult.modifiedCount} Experiences → BIT Mesra`);

        // ──────────────────────────────────────────────
        // STEP 5: Migrate Jobs missing institute field
        // (These were missed in the original migrate.js)
        // ──────────────────────────────────────────────
        const jobResult = await Job.updateMany(
            { institute: { $exists: false } },
            { $set: { institute: instituteId } }
        );
        console.log(`✅ Migrated ${jobResult.modifiedCount} Jobs → BIT Mesra`);

        // ──────────────────────────────────────────────
        // STEP 6: Migrate Applications missing institute field
        // ──────────────────────────────────────────────
        const applicationResult = await Application.updateMany(
            { institute: { $exists: false } },
            { $set: { institute: instituteId } }
        );
        console.log(`✅ Migrated ${applicationResult.modifiedCount} Applications → BIT Mesra`);

        console.log('\n🎉 Migration Complete! BIT Mesra is now accessible at /c/bitmesra');
        console.log('📡 Test URL: http://localhost:5000/api/c/bitmesra/placements/stats');
        process.exit(0);

    } catch (err) {
        console.error('❌ Migration Failed:', err);
        process.exit(1);
    }
};

migrate();

