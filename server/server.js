// Load environment variables FIRST - before any other imports
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/poetry', require('./routes/poetryRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

// Initialize admin user if it doesn't exist
const initializeAdmin = async () => {
  try {
    console.log('🔄 Checking for admin user...');
    
    // Ensure database is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('⏳ Waiting for database connection...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    const adminEmail = (process.env.ADMIN_EMAIL || 'manavdiary@001.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'manav@123';
    
    // Check if admin exists
    const adminExists = await Admin.findOne({ email: adminEmail });
    
    if (!adminExists) {
      console.log('📝 Creating admin user...');
      
      const admin = new Admin({
        email: adminEmail,
        password: adminPassword
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully!');
      console.log('📧 Admin Credentials:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log('   ⚠️  Please change the password in production!');
    } else {
      console.log('✅ Admin user already exists');
      console.log(`   Email: ${adminExists.email}`);
    }
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
    console.error('   Stack:', error.stack);
    
    // Retry after delay
    console.log('🔄 Retrying admin initialization in 3 seconds...');
    setTimeout(initializeAdmin, 3000);
  }
};

// Connect to database and initialize admin
const startServer = async () => {
  try {
    // Verify environment variables are loaded
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('🔍 Environment Variables Check:');
    
    if (process.env.MONGO_URI) {
      const maskedURI = process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@');
      console.log(`   ✅ MONGO_URI: ${maskedURI}`);
    } else {
      console.log('   ❌ MONGO_URI: NOT FOUND');
    }
    
    if (process.env.JWT_SECRET) {
      const maskedSecret = process.env.JWT_SECRET.substring(0, 4) + '****';
      console.log(`   ✅ JWT_SECRET: ${maskedSecret}`);
    } else {
      console.log('   ⚠️  JWT_SECRET: Using default (not recommended for production)');
    }
    
    console.log(`   ✅ PORT: ${process.env.PORT || 5000}`);
    console.log('═══════════════════════════════════════');
    console.log('');
    
    // Connect to MongoDB Atlas
    await connectDB();
    
    // Wait a moment for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Initialize admin user
    await initializeAdmin();
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
      console.log('═══════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('');
    console.error('❌ Failed to start server:', error.message);
    console.error('');
    process.exit(1);
  }
};

startServer();

