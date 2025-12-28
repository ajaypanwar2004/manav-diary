const mongoose = require('mongoose');

const poetrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['sad', 'romantic', 'broken', 'mother', 'love'],
    lowercase: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    default: 'Manav'
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: String // Store IP or user identifier
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

poetrySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Poetry', poetrySchema);

