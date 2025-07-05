const express = require('express');
const Snapshot = require('../models/Snapshot');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const latestSnapshot = await Snapshot.findOne().sort({ timestamp: -1 });
    
    if (!latestSnapshot) {
      return res.json({
        status: 'No data available',
        lastChecked: null,
        changed: false
      });
    }

    res.json({
      status: 'Monitoring active',
      lastChecked: latestSnapshot.timestamp,
      changed: latestSnapshot.changed
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 