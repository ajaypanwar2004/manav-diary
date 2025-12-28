const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  poetryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poetry',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    default: 'Anonymous'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', commentSchema);





