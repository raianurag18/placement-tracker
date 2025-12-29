const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'admin@bit.edu' }).select('+password');
        console.log('Admin User:', user);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUser();
