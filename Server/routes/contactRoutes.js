import express from "express";
import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

router.post("/send", submitContactForm);

export default router;
