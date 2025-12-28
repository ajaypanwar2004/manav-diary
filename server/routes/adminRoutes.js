const express = require('express');
const router = express.Router();
const Poetry = require('../models/Poetry');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

// @route   POST /api/admin/add-poetry
// @desc    Add new poetry (admin only) - automatically approved
// @access  Private
router.post('/add-poetry', protect, async (req, res) => {
  try {
    const { title, content, category, date } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Please provide title, content, and category' });
    }

    const validCategories = ['sad', 'romantic', 'broken', 'mother', 'love'];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const poetry = new Poetry({
      title,
      content,
      category: category.toLowerCase(),
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
    
    if (category && category !== 'all') {
      query.category = category.toLowerCase();
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
      const validCategories = ['sad', 'romantic', 'broken', 'mother', 'love'];
      if (validCategories.includes(category.toLowerCase())) {
        poetry.category = category.toLowerCase();
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

module.exports = router;


