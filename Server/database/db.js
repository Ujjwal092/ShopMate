import pkg from 'pg';
const {Client} = pkg; // Destructuring Client from pg module
const database = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
try{
    await database.connect();
    console.log("Database connected successfully 😀");
}catch(err){
    console.error("Database connection error 😞", err);
    process.exit(1);
}
export default database;