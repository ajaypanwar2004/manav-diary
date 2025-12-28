const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Poetry = require('../models/Poetry');

// @route   POST /api/comments
// @desc    Add a comment to poetry (public)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { poetryId, text, author } = req.body;

    if (!poetryId || !text) {
      return res.status(400).json({ message: 'Please provide poetryId and text' });
    }

    // Verify poetry exists and is approved
    const poetry = await Poetry.findById(poetryId);
    if (!poetry || !poetry.approved) {
      return res.status(404).json({ message: 'Poetry not found or not approved' });
    }

    const comment = new Comment({
      poetryId,
      text: text.trim(),
      author: author || 'Anonymous'
    });

    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;





