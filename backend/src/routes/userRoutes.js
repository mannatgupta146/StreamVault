import express from "express"
import { getUsers, deleteUser, banUser } from "../controllers/userController.js"
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getHistory,
  addToHistory,
  removeFromHistory,
} from "../controllers/userInteractionsController.js"
import { protect, admin } from "../middlewares/auth.js"

const router = express.Router()

// Personal User Routes (Favorites & History)
router.route("/favorites").get(protect, getFavorites).post(protect, addFavorite)

router.route("/favorites/:movieId").delete(protect, removeFavorite)

router.route("/history").get(protect, getHistory).post(protect, addToHistory)

router.route("/history/:movieId").delete(protect, removeFromHistory)

// Admin Routes (Moderation)
router.route("/").get(protect, admin, getUsers)

router.route("/:id").delete(protect, admin, deleteUser)

router.route("/:id/ban").put(protect, admin, banUser)

export default router
