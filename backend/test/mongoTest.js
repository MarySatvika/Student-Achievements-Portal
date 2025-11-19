const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Achievement = require('../models/Achievement');

// Test MongoDB connection and data insertion
const testMongoDB = async () => {
  try {
    console.log('Testing MongoDB connection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB successfully!');
    console.log('Connection state:', mongoose.connection.readyState);
    console.log('Database name:', mongoose.connection.name);
    
    // Test user creation
    console.log('\nTesting user creation...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student',
      department: 'Computer Science',
      studentId: 'CS123456'
    });
    
    const savedUser = await testUser.save();
    console.log('User created successfully:', savedUser._id);
    
    // Test achievement creation
    console.log('\nTesting achievement creation...');
    const testAchievement = new Achievement({
      title: 'Test Achievement',
      description: 'This is a test achievement',
      date: new Date(),
      category: 'academic',
      level: 'college',
      student: savedUser._id,
      department: 'Computer Science'
    });
    
    const savedAchievement = await testAchievement.save();
    console.log('Achievement created successfully:', savedAchievement._id);
    
    // Test data retrieval
    console.log('\nTesting data retrieval...');
    const users = await User.find({});
    console.log('Total users:', users.length);
    
    const achievements = await Achievement.find({});
    console.log('Total achievements:', achievements.length);
    
    // Clean up test data
    console.log('\nCleaning up test data...');
    await User.deleteOne({ _id: savedUser._id });
    await Achievement.deleteOne({ _id: savedAchievement._id });
    console.log('Test data cleaned up successfully');
    
    // Close connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Run the test
testMongoDB();