require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const createAdmin = async () => {
  try {
    // Use MONGO_URI from environment
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/manav-diary';
    
    if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
      console.warn('⚠️  Warning: No MONGO_URI found in environment variables.');
    }

    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to database
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    console.log(`   Database: ${mongoose.connection.name}`);

    const adminEmail = 'manavdiary@001.com'.toLowerCase();
    
    // Check if admin exists
    const adminExists = await Admin.findOne({ email: adminEmail });
    
    if (adminExists) {
      console.log('⚠️  Admin already exists');
      console.log(`   Email: ${adminExists.email}`);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create admin
    console.log('📝 Creating admin user...');
    const admin = new Admin({
      email: adminEmail,
      password: 'manav@123'
    });

    await admin.save();
    console.log('');
    console.log('✅ Admin created successfully!');
    console.log('📧 Email: manavdiary@001.com');
    console.log('🔑 Password: manav@123');
    console.log('');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('   Please check:');
    console.error('   1. MONGO_URI in .env file');
    console.error('   2. MongoDB Atlas connection');
    console.error('   3. Network connectivity');
    console.error('');
    process.exit(1);
  }
};

createAdmin();

