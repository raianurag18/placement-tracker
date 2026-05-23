const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  package: {
    type: String, // Keeping as String to match form input like "12 LPA"
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  verdict: {
    type: String,
    enum: ['Selected', 'Rejected', 'Pending'],
    default: 'Selected'
  },
  rounds: [{
    name: String, // e.g., "Round 1: Online Assessment"
    description: String,
    questions: [String] // Array of specific questions asked
  }],
  tips: [String], // Array of tips for future aspirants
  date: {
    type: Date,
    default: Date.now
  },
  approved: {
    type: Boolean,
    default: false,
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute'
  }
});

module.exports = mongoose.model('Experience', ExperienceSchema);
