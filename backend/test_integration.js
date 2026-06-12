const testBackend = async () => {
    try {
        console.log('--- STARTING BACKEND INTEGRATION TESTS ---');
        
        // 1. Test public route (Institute Search)
        console.log('\n[TEST 1] Public Route - /api/institutes/search?q=BIT');
        const res1 = await fetch('http://localhost:5000/api/institutes/search?q=BIT');
        const data1 = await res1.json();
        console.log(`Status: ${res1.status}`);
        console.log(`Found: ${data1.length} institutes (Expected > 0)`);
        if (data1.length > 0) console.log(`First slug: ${data1[0].slug}`);

        // 2. Test invalid tenant route
        console.log('\n[TEST 2] Invalid Tenant - /api/c/fakecollege/placements/stats');
        const res2 = await fetch('http://localhost:5000/api/c/fakecollege/placements/stats');
        console.log(`Status: ${res2.status} (Expected 404)`);

        // 3. Test valid tenant but unauthenticated
        console.log('\n[TEST 3] Unauthenticated Valid Tenant - /api/c/bitmesra/placements/stats');
        const res3 = await fetch('http://localhost:5000/api/c/bitmesra/placements/stats');
        console.log(`Status: ${res3.status} (Expected 200 or 401 depending on route protection)`);

        // 4. Test admin login for BIT Mesra
        console.log('\n[TEST 4] Admin Login - /api/c/bitmesra/admin/login');
        const loginRes = await fetch('http://localhost:5000/api/c/bitmesra/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@bitmesra.edu', password: 'admin' }) // Note: we don't know the exact password, might be admin123
        });
        console.log(`Status: ${loginRes.status}`);
        
        const loginRes2 = await fetch('http://localhost:5000/api/c/bitmesra/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@bitmesra.edu', password: 'admin123' })
        });
        console.log(`Status (admin123): ${loginRes2.status}`);
        const loginData = await loginRes2.json();
        let token = null;
        if (loginData.token) {
            console.log('Admin login successful! Token received.');
            token = loginData.token;
        } else {
            console.log('Failed to get token.');
        }

        if (token) {
            // 5. Test protected admin route
            console.log('\n[TEST 5] Protected Admin Route - /api/c/bitmesra/placements/all');
            const res5 = await fetch('http://localhost:5000/api/c/bitmesra/placements/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(`Status: ${res5.status} (Expected 200)`);
            const data5 = await res5.json();
            console.log(`Placements fetched: ${data5.length}`);

            // 6. Test wrong tenant with valid token
            console.log('\n[TEST 6] Wrong Tenant with Valid Token - /api/c/bitsgoa/placements/all');
            const res6 = await fetch('http://localhost:5000/api/c/bitsgoa/placements/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(`Status: ${res6.status} (Expected 404 or 403)`);
        }

        console.log('\n--- TESTS COMPLETED ---');
    } catch (err) {
        console.error('Test failed:', err);
    }
};

testBackend();
