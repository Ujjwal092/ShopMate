import pkg from "pg";
const { Client } = pkg; // Destructuring Client from pg module
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
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
