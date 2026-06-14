import request from "supertest";
import app from "../app.js";

describe("Products API", () => {
  test("Fetch all products", async () => {
    const res = await request(app).get("/api/v1/product");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("Fetch single product invalid id", async () => {
    const res = await request(app).get(
      "/api/v1/product/singleProduct/invalid-id",
    );

    expect([200, 404, 500]).toContain(res.status);
  });

  test("Create product without login", async () => {
    const res = await request(app).post("/api/v1/product/admin/create");

    expect(res.status).toBe(401);
  });
});
