const mongoose = require('mongoose');

const accessCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

accessCodeSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model('AccessCode', accessCodeSchema);
