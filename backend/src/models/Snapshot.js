const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  changed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Snapshot', snapshotSchema); 