const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ✅ Import OTP/User routes
const otpRoutes = require('./routes/otpRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connect
mongoose
  .connect('mongodb://localhost:27017/yourdbname') // 👉 LOCAL Mongo URL
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.use('/api/otp', otpRoutes);
app.use('/api/user', otpRoutes); // same file handles /get-user & /check-session

// ✅ Server Start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
