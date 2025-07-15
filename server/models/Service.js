const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  description: String,
  image: String,
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;