import express from 'express';
const router = express.Router();
import { verifyAchievement, getAchievementQRCode } from '../controllers/verificationController.js';
import { auth } from '../middleware/auth.js';

// Private route to get QR code for an achievement
router.get('/achievement/:id', auth, getAchievementQRCode);

// Public route for QR code verification
router.get('/:qrCode', verifyAchievement);

export default router;