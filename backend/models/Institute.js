const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    // ⚠️ INTERVIEW TIP: The 'slug' is the URL-safe identifier for a college.
    // e.g., "BIT Mesra" → slug: "bitmesra"
    // This is the CORE of route-based multi-tenancy: /c/:collegeSlug
    slug: {
        type: String,
        unique: true,
        sparse: true, // allows null for existing docs during migration
        lowercase: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    logoUrl: {
        type: String,
        default: ''
    },
    // Purpose: Allows deactivating a college without deleting its data
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure unique institute per city
instituteSchema.index({ name: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('Institute', instituteSchema);

