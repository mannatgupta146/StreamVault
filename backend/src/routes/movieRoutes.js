import express from 'express';
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.js';
import { protect, admin } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(getMovies)
  .post(protect, admin, createMovie);

router.route('/:id')
  .put(protect, admin, updateMovie)
  .delete(protect, admin, deleteMovie);

export default router;
