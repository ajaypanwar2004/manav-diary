const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
  
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  Warning: Using default JWT_SECRET. Please set JWT_SECRET in .env for production!');
  }
  
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      console.log(`Login attempt failed: Admin not found for email ${email.toLowerCase()}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await admin.matchPassword(password);
    
    if (isPasswordMatch) {
      res.json({
        token: generateToken(admin._id),
        admin: {
          id: admin._id,
          email: admin.email
        }
      });
      console.log(`✅ Admin login successful: ${admin.email}`);
    } else {
      console.log(`Login attempt failed: Incorrect password for ${admin.email}`);
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

