const mongoose = require('mongoose');
const Institute = require('../models/Institute');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const topColleges = [
    { name: 'IIT Bombay', city: 'Mumbai' },
    { name: 'IIT Delhi', city: 'Delhi' },
    { name: 'IIT Madras', city: 'Chennai' },
    { name: 'IIT Kanpur', city: 'Kanpur' },
    { name: 'IIT Kharagpur', city: 'Kharagpur' },
    { name: 'IIT Roorkee', city: 'Roorkee' },
    { name: 'IIT Guwahati', city: 'Guwahati' },
    { name: 'NIT Trichy', city: 'Tiruchirappalli' },
    { name: 'NIT Warangal', city: 'Warangal' },
    { name: 'NIT Surathkal', city: 'Mangalore' },
    { name: 'BIT Mesra', city: 'Ranchi' }, // Ensuring our default is here
    { name: 'BITS Pilani', city: 'Pilani' },
    { name: 'BITS Goa', city: 'Goa' },
    { name: 'BITS Hyderabad', city: 'Hyderabad' },
    { name: 'IIIT Hyderabad', city: 'Hyderabad' },
    { name: 'IIIT Bangalore', city: 'Bangalore' },
    { name: 'DTU', city: 'Delhi' },
    { name: 'NSUT', city: 'Delhi' },
    { name: 'Jadavpur University', city: 'Kolkata' },
    { name: 'Anna University', city: 'Chennai' },
    { name: 'Manipal Institute of Technology', city: 'Manipal' },
    { name: 'Vellore Institute of Technology', city: 'Vellore' },
    { name: 'SRM University', city: 'Chennai' },
    { name: 'Thapar University', city: 'Patiala' }
];

const seedInstitutes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        for (const college of topColleges) {
            // Upsert (Insert if not exists)
            await Institute.updateOne(
                { name: college.name, city: college.city },
                { $set: college },
                { upsert: true }
            );
        }

        console.log(`✅ Seeded ${topColleges.length} Institutes`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding Failed:', err);
        process.exit(1);
    }
};

seedInstitutes();
