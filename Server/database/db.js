import pkg from 'pg';
const {Client} = pkg; // Destructuring Client from pg module
import dotenv from "dotenv";
dotenv.config({ path: "config/config.env" });
const database = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: "mern_ecommerce_store",
    password: String(process.env.DB_PASSWORD),
    port:     process.env.DB_PORT,
});

//console.log("DB_PASSWORD =", process.env.DB_PASSWORD, typeof process.env.DB_PASSWORD);
//console.log("ENV DB_USER =", process.env.DB_USER);
try{
    await database.connect();
    console.log("Database connected successfully 😀");
}catch(err){
    console.error("Database connection error 😞", err);
    process.exit(1);
}
export default database;