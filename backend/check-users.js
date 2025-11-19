const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find({}).select('-password');
    
    console.log(`=== FOUND ${users.length} USERS ===\n`);
    
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Username: ${user.username || 'NOT SET'}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Email Verified: ${user.isEmailVerified ? '✅' : '❌'}`);
      console.log(`  Phone: ${user.phoneNumber || 'NOT SET'}`);
      console.log(`  University: ${user.university || 'NOT SET'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

checkUsers();
