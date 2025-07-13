const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  package: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Experience', ExperienceSchema);
