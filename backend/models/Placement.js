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
});

module.exports = mongoose.model('Placement', PlacementSchema);
