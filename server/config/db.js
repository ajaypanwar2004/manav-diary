const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Require MONGO_URI from environment - no fallback
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.error('');
      console.error('❌ ERROR: MONGO_URI is not set in environment variables!');
      console.error('   Please create a .env file in the server directory with:');
      console.error('   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/manav-diary');
      console.error('');
      throw new Error('MONGO_URI environment variable is required');
    }

    // Mask and log MONGO_URI to confirm it's loaded (for debugging)
    const maskedURI = mongoURI.replace(/:([^:@]+)@/, ':****@');
    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log(`   Connection String: ${maskedURI}`);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Atlas Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    return conn;
  } catch (error) {
    console.error('');
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('   Please check:');
    console.error('   1. MONGO_URI is set in .env file');
    console.error('   2. Connection string format is correct');
    console.error('   3. Password is URL-encoded (e.g., @ becomes %40)');
    console.error('   4. MongoDB Atlas IP whitelist includes your IP');
    console.error('   5. Database user has correct permissions');
    console.error('');
    throw error;
  }
};

module.exports = connectDB;


