const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyAllUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    
    console.log(`\nFound ${users.length} users:\n`);
    
    for (const user of users) {
      console.log('-------------------');
      console.log(`Email: ${user.email}`);
      console.log(`Username: ${user.username || 'NOT SET'}`);
      console.log(`Email Verified: ${user.isEmailVerified ? '✅ YES' : '❌ NO'}`);
      console.log(`Role: ${user.role}`);
      
      // Auto-verify all users
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
        console.log('→ ✅ EMAIL NOW VERIFIED!');
      }
    }
    
    console.log('\n🎉 All users are now verified and can login!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

verifyAllUsers();
