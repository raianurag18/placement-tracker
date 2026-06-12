const mongoose = require('mongoose');
const Institute = require('./models/Institute');
require('dotenv').config();

const createGoaAndTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        let goa = await Institute.findOne({ slug: 'bitsgoa' });
        if (!goa) {
            goa = new Institute({
                name: 'BITS Goa',
                slug: 'bitsgoa',
                city: 'Goa',
                isActive: true
            });
            await goa.save();
            console.log('Created BITS Goa');
        }

        const loginRes = await fetch('http://localhost:5000/api/c/bitmesra/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@bitmesra.edu', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        
        console.log('\n[TEST 6] Wrong Tenant with Valid Token - /api/c/bitsgoa/placements/all');
        const res6 = await fetch('http://localhost:5000/api/c/bitsgoa/placements/all', {
            headers: { 'Authorization': `Bearer ${loginData.token}` }
        });
        console.log(`Status: ${res6.status} (Expected 403)`);
        const data6 = await res6.json();
        console.log('Response:', data6);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createGoaAndTest();
