import database from "../database/db.js";

export const createNewsletterTable = async () => {
  await database.query(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export const createSubscriber = async (email) => {
  return await database.query(
    `
      INSERT INTO newsletter_subscribers(email)
      VALUES($1)
      RETURNING *
    `,
    [email],
  );
};

export const getSubscriberByEmail = async (email) => {
  return await database.query(
    `
      SELECT *
      FROM newsletter_subscribers
      WHERE email = $1
    `,
    [email],
  );
};

export const getAllSubscribers = async () => {
  return await database.query(`
      SELECT *
      FROM newsletter_subscribers
      ORDER BY subscribed_at DESC
  `);
};

export const deleteSubscriber = async (id) => {
  return await database.query(
    `
      DELETE FROM newsletter_subscribers
      WHERE id = $1
      RETURNING *
    `,
    [id],
  );
};
