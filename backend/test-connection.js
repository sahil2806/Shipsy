const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📡 Connection URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/shipsy');
    
    // Test connection
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shipsy', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connection successful!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));
    
    // Test if we can query the database
    const User = require('./models/User');
    const Ship = require('./models/Ship');
    
    const userCount = await User.countDocuments();
    const shipCount = await Ship.countDocuments();
    
    console.log('👥 Users in database:', userCount);
    console.log('🚢 Ships in database:', shipCount);
    
    console.log('\n🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection test failed:');
    console.error('Error:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Make sure MongoDB service is running');
      console.log('2. Check if MongoDB is accessible on port 27017');
      console.log('3. Verify your .env file has correct MONGODB_URI');
      console.log('4. Try: Get-Service -Name MongoDB (in PowerShell)');
    }
    
  } finally {
    // Close connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Connection closed');
    }
    process.exit(0);
  }
}

// Run the test
testConnection(); 