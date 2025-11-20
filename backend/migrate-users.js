const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const migrateUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users
    const allUsers = await User.find({});

    console.log(`Found ${allUsers.length} users to migrate\n`);

    if (allUsers.length === 0) {
      console.log('✅ No users found!');
      process.exit(0);
    }

    // Update each user
    for (const user of allUsers) {
      console.log('-------------------');
      console.log(`Processing: ${user.email}`);
      
      const updates = {};

      // Add username if missing
      if (!user.username) {
        const emailUsername = user.email.split('@')[0];
        let username = emailUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        let count = 1;
        let finalUsername = username;
        while (await User.findOne({ username: finalUsername, _id: { $ne: user._id } })) {
          finalUsername = `${username}${count}`;
          count++;
        }
        updates.username = finalUsername;
        console.log(`→ Added username: ${finalUsername}`);
      }

      // Add firstName and lastName if missing
      if (!user.firstName && user.name) {
        const nameParts = user.name.split(' ');
        updates.firstName = nameParts[0] || user.name;
        updates.lastName = nameParts.slice(1).join(' ') || nameParts[0];
        console.log(`→ Added firstName: ${updates.firstName}, lastName: ${updates.lastName}`);
      }

      // Add phoneNumber if missing
      if (!user.phoneNumber) {
        updates.phoneNumber = '0000000000';
        console.log('→ Added default phone: 0000000000 (Please update!)');
      }

      // Add university if missing
      if (!user.university) {
        updates.university = 'VFSTR';
        console.log('→ Added university: VFSTR');
      }

      // Add course if missing
      if (!user.course && user.role !== 'admin') {
        updates.course = 'B.Tech';
        console.log('→ Added default course: B.Tech');
      }

      // Set default values for students
      if (user.role === 'student') {
        if (!user.branch) updates.branch = user.department || 'Computer Science Engineering (CSE)';
        if (!user.department) updates.department = user.branch || 'Computer Science Engineering (CSE)';
        if (!user.year) updates.year = '1st Year';
        if (!user.section) updates.section = 1;
      }

      // Set default values for faculty
      if (user.role === 'faculty') {
        if (!user.branch) updates.branch = user.department || 'Computer Science Engineering (CSE)';
        if (!user.department) updates.department = user.branch || 'Computer Science Engineering (CSE)';
        if (!user.facultyId && user.studentId) {
          updates.facultyId = user.studentId;
        }
      }

      // Verify email for all users
      if (!user.isEmailVerified) {
        updates.isEmailVerified = true;
        updates.emailVerificationToken = undefined;
        updates.emailVerificationExpires = undefined;
        console.log('→ ✅ Email verified');
      }

      // Update user if there are changes
      if (Object.keys(updates).length > 0) {
        await User.findByIdAndUpdate(user._id, updates);
        console.log('✅ User updated successfully');
      } else {
        console.log('✅ User already up to date');
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('All users can now login with email OR username');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

migrateUsers();
