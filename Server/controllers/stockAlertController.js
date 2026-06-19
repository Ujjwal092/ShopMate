import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  createStockAlert,
  getPendingStockAlertsForProduct,
  markStockAlertsNotified,
} from "../models/stockAlertModel.js";
import { generateStockAlertEmailTemplate } from "../utils/generateStockAlertEmailTemplate.js";

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
    message: `✅ You'll be notified when ${product.rows[0].name} is back in stock!`,
  });
});

export const notifyStockAlertSubscribers = async (productId, productName) => {
  try {
    const alertResult = await getPendingStockAlertsForProduct(productId);
    const alerts = alertResult.rows;
    
    if (alerts.length === 0) {
      console.log(`ℹ️ No pending stock alerts for product: ${productName}`);
      return;
    }

    console.log(
      `📧 Found ${alerts.length} subscribers for product: ${productName}`,
    );

    const alertIds = alerts.map((alert) => alert.id);

    // Fetch product details for the email template
    const productResult = await database.query(
      `SELECT images, price FROM products WHERE id = $1`,
      [productId],
    );

    if (productResult.rows.length === 0) {
      console.error(
        `❌ Product not found for stock alert notification: ${productId}`,
      );
      return;
    }

    const productImage = productResult.rows[0]?.images?.[0]?.url || null;
    const productPrice = productResult.rows[0]?.price || "N/A";

    console.log(
      `📦 Product Details - Name: ${productName}, Price: ${productPrice}, Image: ${
        productImage ? "Available" : "Not Available"
      }`,
    );

    let sentCount = 0;
    let failedCount = 0;

    await Promise.all(
      alerts.map(async (alert) => {
        try {
          const emailTemplate = generateStockAlertEmailTemplate(
            productName,
            productImage,
            productPrice,
            productId,
          );

          await sendEmail({
            email: alert.email,
            subject: `🎉 ${productName} is back in stock!`,
            message: emailTemplate,
          });
          sentCount++;
          console.log(
            `✅ Stock alert email sent to ${alert.email} for "${productName}"`,
          );
        } catch (error) {
          failedCount++;
          console.error(
            `❌ Failed to send stock alert to ${alert.email}:`,
            error.message,
          );
        }
      }),
    );

    console.log(
      `📊 Stock Alert Summary - Sent: ${sentCount}, Failed: ${failedCount}`,
    );

    await markStockAlertsNotified(alertIds);
  } catch (error) {
    console.error(
      `❌ Error in notifyStockAlertSubscribers for product ${productId}:`,
      error.message,
    );
  }
};
