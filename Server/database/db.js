import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const database = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME ?? "mern_ecommerce_store",
  password: String(process.env.DB_PASSWORD),
  port: Number(process.env.DB_PORT),
});

export const connectDatabase = async () => {
  try {
    await database.query("SELECT 1");
    console.log("Database connected successfully 😀");
  } catch (err) {
    console.error("Database connection error 😞", err);
    process.exit(1);
  }
};

export const closeDatabase = async () => {
  try {
    await database.end();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
};

export default database;
