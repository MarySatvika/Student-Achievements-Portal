import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import achievementRoutes from './routes/achievements.js';
import userRoutes from './routes/users.js';
import notificationRoutes from './routes/notifications.js';
import verificationRoutes from './routes/verification.js';

// Import database connection
import connectDB from './config/db.js';

// Handle __dirname and __filename in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5002'],
  credentials: true
}));
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/verify', verificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Server is running!',
    dbConnected: mongoose.connection.readyState
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message
  });
});

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
        console.log(`📦 MongoDB connection state: ${mongoose.connection.readyState}`);
      });
    }
  })
  .catch((error) => {
    console.error('❌ Failed to connect to MongoDB:', error);
  });

// Export app for testing or serverless setups
export default app;
