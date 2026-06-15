import express from "express";
import {
  createProduct,
  fetchAllProducts,
  updateProduct,
  deleteProduct,
  fetchSingleProduct,
  postProductReview,
  deleteReview,
  fetchAIFilteredProducts,
  bulkCreateProducts,
  chatWithBot,
  fetchSimilarProducts,
} from "../controllers/productController.js";
import {
  authorizedRoles,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

//role should be admin coz only admin can created
router.post(
  "/admin/create",
  isAuthenticated,
  authorizedRoles("Admin"),
  createProduct,
);

router.get("/", fetchAllProducts);

router.get("/singleProduct/:productId", fetchSingleProduct);
router.put("/post-new/review/:productId", isAuthenticated, postProductReview);
router.delete("/delete/review/:productId", isAuthenticated, deleteReview);

router.put(
  "/admin/update/:productID",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateProduct,
);

router.delete(
  "/admin/delete/:productId",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteProduct,
);

router.post(
  "/admin/bulk",
  isAuthenticated,
  authorizedRoles("Admin"),
  bulkCreateProducts,
);

router.post("/ai-search", isAuthenticated, fetchAIFilteredProducts);
router.post("/chat", chatWithBot);
router.get("/similar/:productId", fetchSimilarProducts);
export default router;
