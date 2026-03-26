const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Poetry = require('../models/Poetry');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const AccessCode = require('../models/AccessCode');
const Viewer = require('../models/Viewer');
const HomeHero = require('../models/HomeHero');
const { protect } = require('../middleware/auth');
const { categorySlugExists } = require('../utils/categoryValidation');

// @route   POST /api/admin/add-poetry
// @desc    Add new poetry (admin only) - automatically approved
// @access  Private
router.post('/add-poetry', protect, async (req, res) => {
  try {
    const { title, content, category, date } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Please provide title, content, and category' });
    }

    const slug = category.trim().toLowerCase();
    const valid = await categorySlugExists(slug);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const poetry = new Poetry({
      title,
      content,
      category: slug,
      approved: true, // Admin posts are automatically approved
      status: 'approved',
      date: date ? new Date(date) : new Date()
    });

    const createdPoetry = await poetry.save();
    res.status(201).json(createdPoetry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/all-poetry
// @desc    Get all poetry (admin only) - for admin dashboard
// @access  Private
router.get('/all-poetry', protect, async (req, res) => {
  try {
    const { sortBy = 'date', order = 'desc', category } = req.query;
    let query = {};
    
    if (category && category !== 'all' && String(category).trim() !== '') {
      query.category = category.trim().toLowerCase();
    }
    
    let sortQuery = {};
    if (sortBy === 'date') {
      sortQuery.createdAt = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'category') {
      sortQuery.category = order === 'asc' ? 1 : -1;
    }
    
    const poetry = await Poetry.find(query).sort(sortQuery);
    res.json(poetry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/pending-poetry
// @desc    Get all pending poetry (admin only)
// @access  Private
router.get('/pending-poetry', protect, async (req, res) => {
  try {
    const poetry = await Poetry.find({ 
      $or: [{ approved: false }, { status: 'pending' }]
    }).sort({ createdAt: -1 });
    res.json(poetry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/edit-poetry/:id
// @desc    Edit poetry (admin only)
// @access  Private
router.put('/edit-poetry/:id', protect, async (req, res) => {
  try {
    const { title, content, category, date } = req.body;
    const poetry = await Poetry.findById(req.params.id);

    if (!poetry) {
      return res.status(404).json({ message: 'Poetry not found' });
    }

    if (title) poetry.title = title;
    if (content) poetry.content = content;
    if (category) {
      const slug = category.trim().toLowerCase();
      const valid = await categorySlugExists(slug);
      if (valid) {
        poetry.category = slug;
      } else {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }
    if (date) poetry.date = new Date(date);
    poetry.updatedAt = Date.now();

    const updatedPoetry = await poetry.save();
    res.json(updatedPoetry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/delete-poetry/:id
// @desc    Delete poetry (admin only)
// @access  Private
router.delete('/delete-poetry/:id', protect, async (req, res) => {
  try {
    const poetry = await Poetry.findById(req.params.id);

    if (!poetry) {
      return res.status(404).json({ message: 'Poetry not found' });
    }

    // Also delete all comments associated with this poetry
    await Comment.deleteMany({ poetryId: req.params.id });
    await poetry.deleteOne();
    
    res.json({ message: 'Poetry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/approve-poetry/:id
// @desc    Approve poetry (admin only)
// @access  Private
router.put('/approve-poetry/:id', protect, async (req, res) => {
  try {
    const poetry = await Poetry.findById(req.params.id);

    if (!poetry) {
      return res.status(404).json({ message: 'Poetry not found' });
    }

    poetry.approved = true;
    poetry.status = 'approved';
    poetry.updatedAt = Date.now();

    const updatedPoetry = await poetry.save();
    res.json(updatedPoetry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/reject-poetry/:id
// @desc    Reject poetry (admin only)
// @access  Private
router.put('/reject-poetry/:id', protect, async (req, res) => {
  try {
    const poetry = await Poetry.findById(req.params.id);

    if (!poetry) {
      return res.status(404).json({ message: 'Poetry not found' });
    }

    poetry.status = 'rejected';
    poetry.updatedAt = Date.now();

    const updatedPoetry = await poetry.save();
    res.json(updatedPoetry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/poetry/:id/comments
// @desc    Get comments for a poetry (admin only)
// @access  Private
router.get('/poetry/:id/comments', protect, async (req, res) => {
  try {
    const comments = await Comment.find({ poetryId: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/comment/:id
// @desc    Delete a comment (admin only)
// @access  Private
router.delete('/comment/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Categories ---

router.post('/category', protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Please provide a category name' });
    }
    const category = new Category({ name: name.trim() });
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A category with this slug already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/category', protect, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/category/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid category id' });
    }
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: 'Please provide a category name' });
    }
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    category.name = name.trim();
    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/category/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid category id' });
    }
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const inUse = await Poetry.exists({ category: category.slug });
    if (inUse) {
      return res.status(400).json({
        message: 'Cannot delete category while poetry is assigned to it',
      });
    }
    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Access codes ---

router.post('/access-code', protect, async (req, res) => {
  try {
    const { code, active } = req.body;
    if (!code || !String(code).trim()) {
      return res.status(400).json({ message: 'Please provide a code' });
    }
    const doc = new AccessCode({
      code: code.trim(),
      active: active !== false,
    });
    const saved = await doc.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This code already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/access-code', protect, async (req, res) => {
  try {
    const codes = await AccessCode.find().sort({ createdAt: -1 });
    res.json(codes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/access-code/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const { code, active } = req.body;
    const doc = await AccessCode.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Access code not found' });
    }
    if (code !== undefined) {
      if (!String(code).trim()) {
        return res.status(400).json({ message: 'Code cannot be empty' });
      }
      doc.code = String(code).trim();
    }
    if (active !== undefined) {
      doc.active = Boolean(active);
    }
    const updated = await doc.save();
    res.json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This code already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Viewers ---

router.get('/viewers', protect, async (req, res) => {
  try {
    const viewers = await Viewer.find().sort({ createdAt: -1 });
    res.json(viewers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Home hero (taglines under main heading) ---

router.get('/home-hero', protect, async (req, res) => {
  try {
    const doc = await HomeHero.getDocument();
    res.json({ lines: doc.lines, updatedAt: doc.updatedAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/home-hero', protect, async (req, res) => {
  try {
    const { lines } = req.body;
    if (!Array.isArray(lines)) {
      return res.status(400).json({ message: 'lines must be an array of strings' });
    }
    const cleaned = lines
      .map((l) => String(l ?? '').trim())
      .filter(Boolean);
    if (cleaned.length === 0) {
      return res.status(400).json({ message: 'Add at least one non-empty line' });
    }
    let doc = await HomeHero.findOne();
    if (!doc) {
      doc = await HomeHero.create({ lines: cleaned });
    } else {
      doc.lines = cleaned;
      await doc.save();
    }
    res.json({ lines: doc.lines, updatedAt: doc.updatedAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


