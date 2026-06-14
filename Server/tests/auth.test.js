import request from "supertest";
import app from "../app.js";

describe("Auth Routes", () => {
  test("Register with missing fields", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({});

    expect(res.status).toBe(400);
  });

  test("Login with missing fields", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({});

    expect(res.status).toBe(400);
  });

  test("Get current user without token", async () => {
    const res = await request(app).get("/api/v1/auth/me");

    expect(res.status).toBe(401);
  });

  test("Forgot password invalid email", async () => {
    const res = await request(app).post("/api/v1/auth/password/forgot").send({
      email: "doesnotexist@gmail.com",
    });

    expect([404, 429]).toContain(res.status);
  });

  test("Reset password invalid token", async () => {
    const res = await request(app)
      .put("/api/v1/auth/password/reset/fakeToken")
      .send({
        password: "Password123",
        confirmPassword: "Password123",
      });

    expect(res.status).toBe(400);
  });
});
