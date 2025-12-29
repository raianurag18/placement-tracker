const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    logoUrl: {
        type: String, // Optional URL for the institute logo
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique institute per city (optional but good practice)
instituteSchema.index({ name: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('Institute', instituteSchema);
