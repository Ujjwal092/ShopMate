import express from "express";
import { subscribeStockAlert } from "../controllers/stockAlertController.js";

const router = express.Router();

router.post("/subscribe", subscribeStockAlert);

export default router;
