import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  createStockAlert,
  getPendingStockAlertsForProduct,
  markStockAlertsNotified,
} from "../models/stockAlertModel.js";

export const subscribeStockAlert = catchAsyncErrors(async (req, res, next) => {
  const { productId, email } = req.body;

  if (!productId || !email) {
    return next(
      new ErrorHandler("Please provide a product ID and email address.", 400),
    );
  }

  const product = await database.query(
    `SELECT id, name FROM products WHERE id = $1`,
    [productId],
  );

  if (product.rows.length === 0) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  const response = await createStockAlert(productId, email);

  if (response.rows.length === 0) {
    return res.status(200).json({
      success: true,
      message: "You are already subscribed for alerts on this product.",
    });
  }

  res.status(201).json({
    success: true,
    message: `You will be notified when ${product.rows[0].name} is back in stock.`,
  });
});

export const notifyStockAlertSubscribers = async (productId, productName) => {
  const alertResult = await getPendingStockAlertsForProduct(productId);
  const alerts = alertResult.rows;
  if (alerts.length === 0) return;

  const alertIds = alerts.map((alert) => alert.id);

  await Promise.all(
    alerts.map(async (alert) => {
      try {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        await sendEmail({
          email: alert.email,
          subject: `${productName} is back in stock!`,
          message: `Good news! The product <strong>${productName}</strong> is back in stock. <br/><br/>Visit the product page to order now: <a href="${frontendUrl}/product/${productId}">View Product</a>`,
        });
      } catch (error) {
        console.error(`Failed to send stock alert to ${alert.email}:`, error);
      }
    }),
  );

  await markStockAlertsNotified(alertIds);
};