const mongoose = require('mongoose');

const viewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  source: {
    type: String,
    required: true,
    enum: ['instagram', 'snapchat', 'friends'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Viewer', viewerSchema);
