import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

// Add logging middleware for debugging
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', auth, getUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;