const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

router.get('/services', async (req, res) => {
  const query = req.query.search || '';

  try {
    const results = await Service.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).limit(50);

    res.json(results);
  } catch (err) {
    console.error('❌ Error searching services:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;