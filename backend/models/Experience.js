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
  approved: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Experience', ExperienceSchema);
