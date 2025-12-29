const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: {
    type: String,
    select: false // Don't return password by default
  },
  googleId: String,
  role: {
    type: String,
    default: 'student'
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute'
  },
  // Profile Fields
  branch: String,
  cgpa: Number,
  phone: String,
  resume: String // Path to uploaded file
});

module.exports = mongoose.model('User', userSchema);
