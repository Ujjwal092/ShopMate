import pkg from "pg";
const { Client } = pkg; // Destructuring Client from pg module
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const database = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "mern_ecommerce_store",
  password: String(process.env.DB_PASSWORD),
  port: process.env.DB_PORT,
});

// console.log({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: "mern_ecommerce_store",
//   port: process.env.DB_PORT,
//   passwordExists: !!process.env.DB_PASSWORD,
// });

try {
  await database.connect();
  console.log("Database connected successfully 😀");
} catch (err) {
  console.error("Database connection error 😞", err);
  process.exit(1);
}

export default database;
