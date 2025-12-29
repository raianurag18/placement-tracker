const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
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
  branch: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute'
  }
});

module.exports = mongoose.model('Placement', PlacementSchema);
