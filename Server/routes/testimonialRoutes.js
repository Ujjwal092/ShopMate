import express from "express";
import { submitTestimonial, fetchFeaturedTestimonials, fetchAllTestimonials } from "../controllers/testimonialController.js";

const router = express.Router();

// Public: submit a testimonial (could be reviewed by admin later)
router.post("/", submitTestimonial);
// Get featured testimonials for homepage carousel
router.get("/featured", fetchFeaturedTestimonials);
// Get all testimonials (pagination)
router.get("/", fetchAllTestimonials);

export default router;