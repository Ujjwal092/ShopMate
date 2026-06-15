import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
// import { createTables } from "./utils/createTables.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import Stripe from "stripe";
import database from "./database/db.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import newsletterRouter from "./routes/newsletterRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import dotenv from "dotenv";
import wishlistRouter from "./routes/wishlistRoutes.js";
dotenv.config({ path: "./.env" });

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = Stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error.message || error}`);
    }

    // Handling the Event

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent_client_secret = event.data.object.client_secret;
      try {
        // FINDING AND UPDATED PAYMENT
        const updatedPaymentStatus = "Paid";
        const paymentTableUpdateResult = await database.query(
          `UPDATE payments SET payment_status = $1 WHERE payment_intent_id = $2 RETURNING *`,
          [updatedPaymentStatus, paymentIntent_client_secret],
        );
        await database.query(
          `UPDATE orders SET paid_at = NOW() WHERE id = $1 RETURNING *`,
          [paymentTableUpdateResult.rows[0].order_id],
        );

        // Reduce Stock For Each Product
        const orderId = paymentTableUpdateResult.rows[0].order_id;

        const { rows: orderedItems } = await database.query(
          `
            SELECT product_id, quantity FROM order_items WHERE order_id = $1
          `,
          [orderId],
        );

        // For each ordered item, reduce the product stock
        for (const item of orderedItems) {
          await database.query(
            `UPDATE products SET stock = stock - $1 WHERE id = $2`,
            [item.quantity, item.product_id],
          );
        }
      } catch (error) {
        return res
          .status(500)
          .send(`Error updating paid_at timestamp in orders table.`);
      }
    }
    res.status(200).send({ received: true });
  },
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    tempFileDir: "./uploads",
    useTempFiles: true,
  }),
);
console.log(
  "File upload middleware configured with temp directory './uploads'",
);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/newsletter", newsletterRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/wishlist", wishlistRouter);
// console.log(app._router?.stack?.length);
// createTables();
//creating all tables jo hmne model m prepare kiya tha phr utils m usko async await m lekr aaye the and wo arrow fn createTable wla usko yha call kiye h

//toh aab sare tables create honge and await m eacgh table ko dala h mtlb ek table ke baad he dusra table create hoga and agar koi error aaya toh catch m aa jaega and console m print ho jaega

app.use(errorMiddleware);

export default app;
