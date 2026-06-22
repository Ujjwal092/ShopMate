import database from "../database/db.js";
import {
  getPendingStockAlertsForProduct,
  markStockAlertsNotified,
} from "../models/stockAlertModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateStockAlertEmailTemplate } from "../utils/generateStockAlertEmailTemplate.js";

// Test endpoint to manually trigger stock alert
export const testStockAlert = async (req, res) => {
  try {
    const { productId, productName } = req.body;

    if (!productId || !productName) {
      return res.status(400).json({
        success: false,
        message: "Please provide productId and productName",
      });
    }

    // console.log("\n🧪 TESTING STOCK ALERT SYSTEM");
    // console.log("================================");
    // console.log(`Product ID: ${productId}`);
    // console.log(`Product Name: ${productName}`);

    // Step 1: Get pending alerts
    // console.log("\n Step 1: Fetching pending alerts...");
    const alertResult = await getPendingStockAlertsForProduct(productId);
    const alerts = alertResult.rows;
    console.log(`Found ${alerts.length} subscribers`);
    if (alerts.length === 0) {
      console.log(" No subscribers found!");
      return res.status(200).json({
        success: true,
        message: "No subscribers for this product",
        alerts: [],
      });
    }

    alerts.forEach((alert, idx) => {
      console.log(`  ${idx + 1}. Email: ${alert.email}, ID: ${alert.id}`);
    });

    // Step 2: Get product details
    console.log("\n Step 2: Fetching product details...");
    const productResult = await database.query(
      `SELECT images, price FROM products WHERE id = $1`,
      [productId],
    );

    if (productResult.rows.length === 0) {
      console.error("❌ Product not found!");
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const productImage = productResult.rows[0]?.images?.[0]?.url || null;
    const productPrice = productResult.rows[0]?.price || "N/A";
    console.log(`Price: ${productPrice}`);
    console.log(`Image: ${productImage ? "Available" : "Not Available"}`);

    // Step 3: Send emails
    console.log("\n Step 3: Sending emails...");
    let sentCount = 0;
    let failedCount = 0;

    for (const alert of alerts) {
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
        console.log(`  ✅ Sent to ${alert.email}`);
      } catch (error) {
        failedCount++;
        console.log(`  ❌ Failed to send to ${alert.email}: ${error.message}`);
      }
    }

    // Step 4: Mark as notified
    console.log("\n Step 4: Marking alerts as notified...");
    const alertIds = alerts.map((alert) => alert.id);
    await markStockAlertsNotified(alertIds);
    console.log(`Marked ${alertIds.length} alerts as notified`);

    console.log("\n================================");
    console.log(`📊 SUMMARY: Sent: ${sentCount}, Failed: ${failedCount}`);
    console.log("================================\n");

    res.status(200).json({
      success: true,
      message: "Stock alert test completed",
      summary: {
        totalSubscribers: alerts.length,
        emailsSent: sentCount,
        emailsFailed: failedCount,
        subscribers: alerts.map((a) => ({
          email: a.email,
          id: a.id,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Error in stock alert test:", error.message);
    res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};
