import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { createTables } from "./utils/createTables.js";
import {errorMiddleware} from "./middlewares/errorMiddleware.js"

import authRouter from "./routes/authRoutes.js"
import productRouter  from "./routes/productRoutes.js"
import adminRouter from "./routes/adminRoutes.js"
import orderRouter from "./routes/orderRoutes.js"
import Stripe from "stripe";

const app = express();

// Setting up config file
config({ path: "./config/config.env" });

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies and cookies are small pieces of data stored on the client side
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data like data is in which format

//CORS IS used to allow requests from frontend and dashboard
app.use(cors({
    origin : [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods : ["GET", "POST", "PUT", "DELETE"],
    credentials : true,
}));

//payment integration ..
//webhook -> real time data push when event occur unlike api
app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }), // function is a built-in middleware in Express.js 
                                             //that parses incoming request payloads into a Buffer
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = Stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error.message || error}`);
    }
     // Handling the Event

    if (event.type === "payment_intent.succeeded") {
     
        const paymentIntent_client_secret = event.data.object.client_secret;
      
      try {
        // FINDING AND UPDATED PAYMENT
        const updatedPaymentStatus = "Paid"; //if payment sucess
        //set payment status
        const paymentTableUpdateResult = await database.query(
          `UPDATE payments SET payment_status = $1 WHERE payment_intent_id = $2 RETURNING *`,
          [updatedPaymentStatus, paymentIntent_client_secret]
        );
        //update paid_at time to now 
        await database.query(
          `UPDATE orders SET paid_at = NOW() WHERE id = $1 RETURNING *`,
          [paymentTableUpdateResult.rows[0].order_id]
        );
 
        // Reduce Stock For Each Product
        const orderId = paymentTableUpdateResult.rows[0].order_id;

        const { rows: orderedItems } = await database.query(
          `
            SELECT product_id, quantity FROM order_items WHERE order_id = $1
          `,
          [orderId]
        );

        // For each ordered item, reduce the product stock
        for (const item of orderedItems) {
          await database.query(
            `UPDATE products SET stock = stock - $1 WHERE id = $2`,
            [item.quantity, item.product_id]
          );
        }
      } catch (error) {
        return res
          .status(500)
          .send(`Error updating paid_at timestamp in orders table.`);
      }
    }
    res.status(200).send({ received: true }); //payment received successfully

  }
);


// Middleware to handle file uploads
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/temp", // Directory to store temporary files
})); 

app.use("/api/v1/auth" , authRouter); //mounting
app.use("/api/v1/product",productRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/order", orderRouter)
createTables();

app.use(errorMiddleware); // Custom error handling middleware

export default app;