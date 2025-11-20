import express from 'express';
import { getUsers, getUserById, updateUser } from '../controllers/userController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(auth, adminAuth, getUsers);

router.route('/:id')
  .get(auth, adminAuth, getUserById)
  .put(auth, adminAuth, updateUser);

export default router;
