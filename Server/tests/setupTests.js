import database from "../database/db.js";
import { createTables } from "../utils/createTables.js";

beforeAll(async () => {
  await createTables();
});

afterAll(async () => {
  try {
    await database.end();
  } catch (error) {
    // If the database pool has already been closed, ignore the error.
    console.error("Error closing database in test teardown:", error);
  }
});
