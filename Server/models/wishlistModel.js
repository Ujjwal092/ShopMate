import database from "../database/db.js";

export async function createWishlistTable() {
  try {
    const query = `
        CREATE TABLE IF NOT EXISTS wishlist (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            product_id UUID NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (user_id, product_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        );
    `;
    await database.query(query);
  } catch (error) {
    console.error("❌ Failed To Create Wishlist Table.", error);
    process.exit(1);
  }
}

// UNIQUE (user_id, product_id) ensures a user can't add the same product twice
