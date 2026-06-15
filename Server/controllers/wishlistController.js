import database from "../database/db.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

// Toggle a product in/out of the logged-in user's wishlist
export const toggleWishlist = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user.id;

  // Check if product exists
  const product = await database.query(
    `SELECT id FROM products WHERE id = $1`,
    [productId],
  );

  if (product.rows.length === 0) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  // Check if already in wishlist
  const existing = await database.query(
    `SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2`,
    [userId, productId],
  );

  if (existing.rows.length > 0) {
    // Already in wishlist -> remove it
    await database.query(
      `DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2`,
      [userId, productId],
    );

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist.",
      inWishlist: false,
    });
  }

  // Not in wishlist -> add it
  await database.query(
    `INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)`,
    [userId, productId],
  );

  res.status(200).json({
    success: true,
    message: "Added to wishlist.",
    inWishlist: true,
  });
});

// Fetch all wishlist items for the logged-in user, with product details
export const fetchWishlist = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  const result = await database.query(
    `
      SELECT 
        w.id AS wishlist_id,
        w.created_at AS added_at,
        p.id,
        p.name,
        p.description,
        p.price,
        p.category,
        p.ratings,
        p.images,
        p.stock
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC
    `,
    [userId],
  );

  res.status(200).json({
    success: true,
    count: result.rows.length,
    wishlist: result.rows,
  });
});

// Return just the product IDs in the user's wishlist (lightweight, for showing filled/empty hearts across the app)
export const fetchWishlistIds = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;

  const result = await database.query(
    `SELECT product_id FROM wishlist WHERE user_id = $1`,
    [userId],
  );

  res.status(200).json({
    success: true,
    wishlistIds: result.rows.map((row) => row.product_id),
  });
});

// Remove a specific product from wishlist (explicit remove, used on wishlist page)
export const removeFromWishlist = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user.id;

  const deleted = await database.query(
    `DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2 RETURNING *`,
    [userId, productId],
  );

  if (deleted.rows.length === 0) {
    return next(new ErrorHandler("Item not found in wishlist.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Removed from wishlist.",
  });
});
