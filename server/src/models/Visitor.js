const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: String,
  country: { type: String, default: 'Unknown' },
  device: String,
  browser: String,
  path: String,
  duration: Number
});

module.exports = mongoose.model('Visitor', visitorSchema);
