import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Ensure MongoDB URI is properly configured
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Log connection details for debugging
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('Make sure your MongoDB Atlas URI is correctly configured in .env file');
    console.error('Also check: 1) Internet connection, 2) MongoDB Atlas IP whitelist, 3) Correct username/password');
    process.exit(1);
  }
};

export default connectDB;