import database from "../database/db.js";

export const createContactMessagesTable = async () => {
  await database.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
export const createMessage = async (name, email, subject, message) => {
  return await database.query(
    `INSERT INTO contact_messages
    (name,email,subject,message)
    VALUES($1,$2,$3,$4)
    RETURNING *`,
    [name, email, subject, message],
  );
};

export const getAllMessages = async () => {
  return await database.query(
    `SELECT * FROM contact_messages
     ORDER BY created_at DESC`,
  );
};

export const deleteMessage = async (id) => {
  return await database.query(
    `DELETE FROM contact_messages
     WHERE id=$1
     RETURNING *`,
    [id],
  );
};
