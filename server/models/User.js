const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  otp: String,
  otpExpiry: Date,
  name: String,
  phone: String,
  address: String,
  profileCompleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
