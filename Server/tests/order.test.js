import request from "supertest";
import app from "../app.js";

describe("Orders API", () => {
  test("Place order without login", async () => {
    const res = await request(app).post("/api/v1/order/new");

    expect(res.status).toBe(401);
  });

  test("Fetch my orders without login", async () => {
    const res = await request(app).get("/api/v1/order/orders/me");

    expect(res.status).toBe(401);
  });
});
