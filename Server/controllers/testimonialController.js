import {
  createTestimonial,
  getFeaturedTestimonials,
  getAllTestimonials,
} from "../models/testimonialModel.js";

export const submitTestimonial = async (req, res) => {
  const { name, email, productId, rating, message } = req.body;
  if (!name || !email || !rating || !message) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  const testimonial = await createTestimonial(name, email, productId || null, rating, message);
  res.status(201).json({ success: true, testimonial, message: "Testimonial submitted" });
};

export const fetchFeaturedTestimonials = async (req, res) => {
  const testimonials = await getFeaturedTestimonials();
  res.status(200).json({ success: true, testimonials });
};

export const fetchAllTestimonials = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;
  const testimonials = await getAllTestimonials(limit, offset);
  res.status(200).json({ success: true, testimonials });
};

export default {
  submitTestimonial,
  fetchFeaturedTestimonials,
  fetchAllTestimonials,
};