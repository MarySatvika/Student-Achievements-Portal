import express from 'express';
const router = express.Router();
import { 
  getNotifications, 
  markAsRead, 
  getUnreadCount 
} from '../controllers/notificationController.js';
import { auth } from '../middleware/auth.js';

router.get('/', auth, getNotifications);
router.get('/unread-count', auth, getUnreadCount);
router.put('/:id/read', auth, markAsRead);

export default router;