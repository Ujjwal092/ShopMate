import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { createTables } from "./utils/createTables.js";
import {errorMiddleware} from "./middlewares/errorMiddleware.js"
import authRouter from "./routes/authRoutes.js"
import productRoutes  from "./routes/productRoutes.js"
const app = express();

// Setting up config file
config({ path: "./config/config.env" });

// Middleware to parse JSON requests
app.use(express.json());

//CORS IS used to allow requests from frontend and dashboard
app.use(cors({
    origin : [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods : ["GET", "POST", "PUT", "DELETE"],
    credentials : true,
}));

app.use(cookieParser()); // Middleware to parse cookies and cookies are small pieces of data stored on the client side
app.use(express.json()); // Middleware to parse JSON data from requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data like data is in which format

// Middleware to handle file uploads
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/temp", // Directory to store temporary files
})); 

app.use("/api/v1/auth" , authRouter); //mounting
app.use("/api/v1/product",productRoutes)

createTables();

app.use(errorMiddleware); // Custom error handling middleware

export default app;