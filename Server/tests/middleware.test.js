import request from "supertest";
import app from "../app.js";

describe("Security Middleware", () => {
  test("Protected route requires authentication", async () => {
    const res = await request(app).get("/api/v1/auth/me");

    expect(res.status).toBe(401);
  });
});
