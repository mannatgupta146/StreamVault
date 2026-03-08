import express from 'express';
import {
  getUsers,
  deleteUser,
  banUser
} from '../controllers/userController.js';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getHistory,
  addToHistory
} from '../controllers/userInteractionsController.js';
import { protect, admin } from '../middlewares/auth.js';

const router = express.Router();

// Personal User Routes (Favorites & History)
router.route('/favorites')
  .get(protect, getFavorites);

router.route('/favorites/:movieId')
  .post(protect, addFavorite)
  .delete(protect, removeFavorite);

router.route('/history')
  .get(protect, getHistory);

router.route('/history/:movieId')
  .post(protect, addToHistory);

// Admin Routes (Moderation)
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser);

router.route('/:id/ban')
  .put(protect, admin, banUser);

export default router;
