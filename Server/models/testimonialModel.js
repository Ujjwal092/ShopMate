import database from "../database/db.js";

export const createTestimonialTable = async () => {
  try {
    await database.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        product_id UUID,
        rating INTEGER,
        message TEXT,
        verified BOOLEAN DEFAULT false,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Created testimonials table.");
  } catch (error) {
    console.error("❌ Failed To Create testimonials Table.", error);
  }
};

export const createTestimonial = async (name, email, product_id, rating, message) => {
  const res = await database.query(
    `INSERT INTO testimonials (name, email, product_id, rating, message, verified, featured) VALUES ($1,$2,$3,$4,$5,false,false) RETURNING *`,
    [name, email, product_id, rating, message],
  );
  return res.rows[0];
};

export const getFeaturedTestimonials = async () => {
  const res = await database.query(`SELECT * FROM testimonials WHERE featured = true ORDER BY created_at DESC LIMIT 10`);
  return res.rows;
};

export const getAllTestimonials = async (limit = 20, offset = 0) => {
  const res = await database.query(`SELECT * FROM testimonials ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
  return res.rows;
};

export default {
  createTestimonialTable,
  createTestimonial,
  getFeaturedTestimonials,
  getAllTestimonials,
};