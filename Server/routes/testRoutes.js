import express from "express";
import { testStockAlert } from "../controllers/testStockAlertController.js";

const router = express.Router();

// Test endpoint for debugging stock alerts
router.post("/test", testStockAlert);

export default router;
