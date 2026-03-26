const express = require('express');
const router = express.Router();
const Poetry = require('../models/Poetry');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');
const { userAuth } = require('../middleware/userAuth');
const { categorySlugExists } = require('../utils/categoryValidation');

// @route   GET /api/poetry/categories
// @desc    List all categories (public, for homepage)
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).select('name slug createdAt');
    res.json(categories);
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

    poetry.likes = (poetry.likes || 0) + 1;
    await poetry.save();

    res.json({ likes: poetry.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/poetry/:category
// @desc    Get poetry by category slug (only approved)
// @access  Private (User authentication required)
router.get('/:category', userAuth, async (req, res) => {
  try {
    const slug = req.params.category.trim().toLowerCase();

    if (slug === 'categories') {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const exists = await categorySlugExists(slug);
    if (!exists) {
      return res.status(400).json({ message: 'Unknown category' });
    }

    const poetry = await Poetry.find({
      category: slug,
      approved: true,
      status: 'approved',
    }).sort({ createdAt: -1 });

    res.json(poetry);
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
      author: author || 'Manav',
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
