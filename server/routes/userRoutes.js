const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const AccessCode = require('../models/AccessCode');
const Viewer = require('../models/Viewer');
const router = express.Router();

const generateUserToken = (name) => {
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
  const sub = crypto.randomUUID();

  return jwt.sign({ sub, name, type: 'user' }, jwtSecret, {
    expiresIn: '30d',
  });
};

// @route   POST /api/user/login
// @desc    User login with name, access code, and source (viewer tracking)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { name, code, source } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: 'Please provide name and access code' });
    }

    if (!source || !['instagram', 'snapchat', 'friends'].includes(source)) {
      return res.status(400).json({ message: 'Please select how you found us (Instagram, Snapchat, or Friends)' });
    }

    const access = await AccessCode.findOne({
      code: String(code).trim(),
      active: true,
    });

    if (!access) {
      return res.status(401).json({ message: 'Invalid access code' });
    }

    try {
      await Viewer.create({
        name: String(name).trim(),
        source,
      });
    } catch (viewerErr) {
      console.error('Viewer save error:', viewerErr.message);
    }

    const token = generateUserToken(String(name).trim());

    res.json({
      token,
      user: {
        name: String(name).trim(),
      },
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/user/register
// @desc    Register new user (legacy — optional)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: 'Please provide name and code' });
    }

    const existingUser = await User.findOne({
      name: name.trim(),
      code: code.trim(),
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this name and code already exists' });
    }

    const user = new User({
      name: name.trim(),
      code: code.trim(),
    });

    await user.save();

    const token = generateUserToken(user.name);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
