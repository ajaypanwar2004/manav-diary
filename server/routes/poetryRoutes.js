const express = require('express');
const router = express.Router();
const Poetry = require('../models/Poetry');
const { protect } = require('../middleware/auth');

// @route   GET /api/poetry/:category
// @desc    Get poetry by category (only approved)
// @access  Public
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = ['sad', 'romantic', 'broken', 'mother', 'love'];
    
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const poetry = await Poetry.find({ 
      category: category.toLowerCase(),
      approved: true,
      status: 'approved'
    }).sort({ createdAt: -1 });
    
    res.json(poetry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/poetry/:id/like
// @desc    Like a poetry (public)
// @access  Public
router.post('/:id/like', async (req, res) => {
  try {
    const poetry = await Poetry.findById(req.params.id);
    
    if (!poetry || !poetry.approved) {
      return res.status(404).json({ message: 'Poetry not found or not approved' });
    }

    // Simple like increment (can be enhanced with IP/user tracking)
    poetry.likes = (poetry.likes || 0) + 1;
    await poetry.save();
    
    res.json({ likes: poetry.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/poetry
// @desc    Create new poetry
// @access  Private (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    const poetry = new Poetry({
      title,
      content,
      author: author || 'Manav'
    });

    const createdPoetry = await poetry.save();
    res.status(201).json(createdPoetry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/poetry/:id
// @desc    Update poetry
// @access  Private (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content, author } = req.body;

    const poetry = await Poetry.findById(req.params.id);

    if (!poetry) {
      return res.status(404).json({ message: 'Poetry not found' });
    }

    poetry.title = title || poetry.title;
    poetry.content = content || poetry.content;
    poetry.author = author || poetry.author;
    poetry.updatedAt = Date.now();

    const updatedPoetry = await poetry.save();
    res.json(updatedPoetry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/poetry/:id
// @desc    Delete poetry
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const poetry = await Poetry.findById(req.params.id);

    if (!poetry) {
      return res.status(404).json({ message: 'Poetry not found' });
    }

    await poetry.deleteOne();
    res.json({ message: 'Poetry removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

