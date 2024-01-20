import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getPlaces,
  getPlaceById,
  addPlace,
  updatePlace,
  deletePlace,
  addReview,
  updateReview,
  deleteReview,
  getReviews,
  getUserPlaces,
} from "../controllers/placeController.js";

const router = express.Router();

// Public routes
router.get("/", getPlaces);
router.get("/myPlaces", protect, getUserPlaces);
router.get("/:id", getPlaceById);

// Protected routes
router.post("/", protect, addPlace);
router.patch("/:id", protect, updatePlace);
router.delete("/:id", protect, deletePlace);
router.get("/place/:placeId/reviews", getReviews);
router.post("/:id/reviews", protect, addReview);
router.patch("/:id/reviews/:reviewId", protect, updateReview);
router.delete("/:id/reviews/:reviewId", protect, deleteReview);

export default router;
