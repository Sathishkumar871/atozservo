const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const SendOtp = require('../utils/sendotp'); // ✅ Correct path!
require('dotenv').config();

// OTP generator
const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();


// ✅ Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = generateOtp();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 min expiry

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, otp, otpExpiry: expiry });
    } else {
      user.otp = otp;
      user.otpExpiry = expiry;
    }
    await user.save();

    await SendOtp(email, otp); // ✅ Call working sendotp!

    res.json({ message: 'OTP sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email & OTP are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No user found' });

    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (Date.now() > user.otpExpiry) return res.status(400).json({ message: 'OTP expired' });

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'OTP verified!', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ JWT check
router.post('/check-session', (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, email: decoded.email });
  } catch {
    res.json({ valid: false });
  }
});

// ✅ Get user
router.post('/get-user', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ user });
});

module.exports = router;
