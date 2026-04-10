import { jest, expect, describe, test, it, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import { app } from "../../app.js";
import { setupDB, teardownDB, clearDB } from "../setup.js";
import { User } from "../../models/userModel.js";
import pkg from "jsonwebtoken";
const { sign } = pkg;

beforeAll(async () => await setupDB());
afterAll(async () => await teardownDB());
beforeEach(async () => await clearDB());

describe("Middleware/Common - Intensive", () => {
  const createT = async (role = "User") => {
    const u = new User({
      name: role,
      email: `${role.toLowerCase()}@e.com`,
      password: "h@",
      role,
      accountVerified: true,
    });
    await u.save();
    return jwt.sign({ id: u._id }, process.env.JWT_SECRET_KEY);
  };

  test("Error-400-CastError", async () => {
    const res = await request(app).get(
      "/api/v1/bookandmanga/delete/invalid_id",
    );
    expect(res.statusCode).toBe(400);
  });

  test("Origin-Allowed", async () => {
    process.env.FRONTEND_URL = "http://localhost:5173";
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("Origin", "http://localhost:5173");
    expect(res.statusCode).not.toBe(403);
  });

  test("Origin-Forbidden", async () => {
    process.env.FRONTEND_URL = "http://localhost:5173";
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("Origin", "http://evil.com");
    expect(res.statusCode).toBe(403);
  });

  test("Referer-Forbidden", async () => {
    process.env.FRONTEND_URL = "http://localhost:5173";
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("Referer", "http://evil.com/");
    expect(res.statusCode).toBe(403);
  });

  test("Auth-MissingToken", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.statusCode).toBe(401);
  });

  test("Auth-BadToken", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", ["token=bad.jwt.format"]);
    expect(res.statusCode).toBe(400);
  });

  test("RateLimit-Headers", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.header["x-ratelimit-limit"]).toBeDefined();
  });

  test("Validation-BadOTP-MissingData", async () => {
    const res = await request(app)
      .post("/api/v1/auth/verify-otp")
      .send({ otp: "123456" });
    expect(res.statusCode).toBe(400);
  });

  test("Validation-Book-TitleTooLong", async () => {
    const t = await createT("Admin");
    const res = await request(app)
      .post("/api/v1/bookandmanga/admin/add")
      .set("Cookie", [`token=${t}`])
      .send({ title: "a".repeat(201), author: "A" });
    expect(res.statusCode).toBe(400);
  });

  test("Validation-Book-AuthorTooShort", async () => {
    const t = await createT("Admin");
    const res = await request(app)
      .post("/api/v1/bookandmanga/admin/add")
      .set("Cookie", [`token=${t}`])
      .send({ title: "T", author: "A" });
    expect(res.statusCode).toBe(400);
  });

  test("Validation-Book-InvalidPrice", async () => {
    const t = await createT("Admin");
    const res = await request(app)
      .post("/api/v1/bookandmanga/admin/add")
      .set("Cookie", [`token=${t}`])
      .send({ title: "T", author: "Author", price: "NaN" });
    expect(res.statusCode).toBe(400);
  });

  test("Error-404-Catchall", async () => {
    const res = await request(app).get("/api/v1/not-a-route");
    expect(res.statusCode).toBe(404);
  });

  test("Validation-User-Register-MissingPwd", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "N", email: "n@e.com" });
    expect(res.statusCode).toBe(400);
  });

  test("Validation-User-Register-Mismatch", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      name: "N",
      email: "n@e.com",
      password: "123456",
      confirmPassword: "X",
    });
    expect(res.statusCode).toBe(400);
  });

  test("Validation-Book-QtyFloat", async () => {
    const t = await createT("Admin");
    const res = await request(app)
      .post("/api/v1/bookandmanga/admin/add")
      .set("Cookie", [`token=${t}`])
      .send({ title: "T", author: "Auth", quantity: 1.5 });
    expect(res.statusCode).toBe(400);
  });
});
