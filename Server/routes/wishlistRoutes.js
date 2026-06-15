import express from "express";
import {
  toggleWishlist,
  fetchWishlist,
  fetchWishlistIds,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All wishlist routes require login
router.post("/toggle/:productId", isAuthenticated, toggleWishlist);
router.get("/", isAuthenticated, fetchWishlist);
router.get("/ids", isAuthenticated, fetchWishlistIds);
router.delete("/remove/:productId", isAuthenticated, removeFromWishlist);

export default router;
