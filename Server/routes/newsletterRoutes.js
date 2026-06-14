import express from "express";

import {
  subscribeNewsletter,
  fetchAllSubscribers,
  removeSubscriber,
} from "../controllers/newsletterController.js";

import {
  isAuthenticated,
  authorizedRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);

router.get(
  "/all",
  isAuthenticated,
  authorizedRoles("Admin"),
  fetchAllSubscribers,
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  removeSubscriber,
);

export default router;
