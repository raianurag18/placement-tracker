const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
    institute: { type: String, required: true },
    degree: { type: String, required: true }, // e.g., B.Tech, M.Tech
    fieldOfStudy: { type: String }, // e.g., Computer Science
    startDate: { type: Date },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    score: { type: String } // CGPA or Percentage
});

const ExperienceSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    description: { type: String } // Bullet points or summary
});

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String }, // GitHub or Live Link
    description: { type: String },
    technologies: [String] // Array of tech strings
});

const ResumeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // One resume per student
    },
    personalInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        linkedin: { type: String },
        github: { type: String },
        website: { type: String },
        summary: { type: String } // Professional Summary
    },
    education: [EducationSchema],
    experience: [ExperienceSchema],
    projects: [ProjectSchema],
    skills: [String], // Simple array of strings
    achievements: [String],

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the 'updatedAt' timestamp on save
ResumeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Resume', ResumeSchema);
