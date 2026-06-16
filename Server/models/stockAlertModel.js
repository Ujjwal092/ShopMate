import database from "../database/db.js";

export const createStockAlertsTable = async () => {
  await database.query(`
    CREATE TABLE IF NOT EXISTS stock_alerts (
      id SERIAL PRIMARY KEY,
      product_id UUID NOT NULL,
      email VARCHAR(255) NOT NULL,
      is_notified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (product_id, email),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);
};

export const createStockAlert = async (productId, email) => {
  return await database.query(
    `
      INSERT INTO stock_alerts(product_id, email)
      VALUES ($1, $2)
      ON CONFLICT (product_id, email) DO NOTHING
      RETURNING *
    `,
    [productId, email],
  );
};

export const getPendingStockAlertsForProduct = async (productId) => {
  return await database.query(
    `
      SELECT * FROM stock_alerts
      WHERE product_id = $1 AND is_notified = false
    `,
    [productId],
  );
};

export const markStockAlertsNotified = async (alertIds) => {
  if (!alertIds || alertIds.length === 0) return;
  return await database.query(
    `
      UPDATE stock_alerts
      SET is_notified = true
      WHERE id = ANY($1::int[])
    `,
    [alertIds],
  );
};