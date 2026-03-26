require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const createUser = async () => {
  try {
    await connectDB();
    
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.log('Usage: node createUser.js <name> <code>');
      console.log('Example: node createUser.js "John Doe" "ABC123"');
      process.exit(1);
    }
    
    const name = args[0];
    const code = args[1];
    
    // Check if user already exists
    const existingUser = await User.findOne({ name, code });
    
    if (existingUser) {
      console.log(`❌ User with name "${name}" and code "${code}" already exists`);
      process.exit(1);
    }
    
    // Create new user
    const user = new User({
      name: name.trim(),
      code: code.trim()
    });
    
    await user.save();
    
    console.log('✅ User created successfully!');
    console.log(`   Name: ${user.name}`);
    console.log(`   Code: ${user.code}`);
    console.log(`   ID: ${user._id}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    process.exit(1);
  }
};

createUser();



