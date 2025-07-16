// ✅ Import Core Modules
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const cors = require('cors');

// ✅ Import Routes
const serviceRoutes = require('./routes/ServiceRoutes');
const otpRoutes = require('./routes/otpRoutes');

// ✅ Load .env
dotenv.config();

// ✅ Create App
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors()); // Dev only, same domain in production

// ✅ API Routes
app.use('/api/services', serviceRoutes);
app.use('/api/otp', otpRoutes);

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api.ping()
  .then(result => console.log('✅ Cloudinary Connected:', result))
  .catch(err => console.error('❌ Cloudinary Error:', err));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Serve Frontend (Vite build output)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ✅ React Router fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
