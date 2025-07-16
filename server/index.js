const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const serviceRoutes = require('./routes/ServiceRoutes.js');
const otpRoutes = require('./routes/otpRoutes');
 

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('frontend/dist'));

// ✅ Allow CORS (optional if frontend/backend are same origin)
const cors = require('cors');
app.use(cors());

// ✅ Routes
app.use('/api', serviceRoutes);
app.use('/api/otp', otpRoutes); 


// ✅ Cloudinary Configuration
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

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});