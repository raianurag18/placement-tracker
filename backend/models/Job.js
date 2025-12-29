const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    ctc: {
        type: String, // Stored as string to allow "10-12 LPA" format
        required: true
    },
    description: {
        type: String
    },
    eligibility: {
        type: String,
        default: "All Branches"
    },
    deadline: {
        type: Date,
        required: true
    },
    logo: {
        type: String // URL to company logo
    },
    applyLink: {
        type: String // Optional external link
    },
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);
