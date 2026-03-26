const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { protect } = require('../middleware/auth');

// @route   POST /api/visitors
// @desc    Create a new visitor entry
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, source } = req.body;

    if (!name || !source) {
      return res.status(400).json({ message: 'Please provide name and source' });
    }

    const visitor = new Visitor({
      name: name.trim(),
      source
    });

    const savedVisitor = await visitor.save();

    return res.status(201).json({
      message: 'Visitor saved successfully',
      visitor: savedVisitor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/visitors
// @desc    Get all visitors (admin only)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.json(visitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;







