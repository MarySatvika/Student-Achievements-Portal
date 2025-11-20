import express from 'express';
import {
  createAchievement,
  getMyAchievements,
  getAllAchievements,
  updateAchievementStatus,
  getAchievementStats,
  getUserStats
} from '../controllers/achievementController.js';
import { auth, facultyAuth } from '../middleware/auth.js';


const router = express.Router();

// Student routes - GET /my should come before GET /:id to avoid conflicts
router.get('/my', auth, getMyAchievements);
router.get('/stats', auth, facultyAuth, getAchievementStats);
router.get('/user-stats', auth, getUserStats);

// Main routes
router.route('/')
  .post(auth, createAchievement)
  .get(auth, facultyAuth, getAllAchievements);

// Faculty/Admin routes
router.put('/:id/status', auth, facultyAuth, updateAchievementStatus);

export default router;
