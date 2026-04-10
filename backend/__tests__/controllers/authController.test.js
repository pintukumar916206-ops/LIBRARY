import { jest, expect, describe, test, it, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import { app } from "../../app.js";
import { User } from "../../models/userModel.js";
import { setupDB, teardownDB, clearDB } from "../setup.js";
import jwt from "jsonwebtoken";

beforeAll(async () => await setupDB());
afterAll(async () => await teardownDB());
beforeEach(async () => await clearDB());

describe("Auth Controller - Intensive", () => {
  const u = {
    name: "T",
    email: "t@e.com",
    password: "P123456",
    confirmPassword: "P123456",
  };

  const createV = async (role = "User") => {
    const user = new User({
      name: "V",
      email: `${role.toLowerCase()}@e.com`,
      password: "h@",
      role,
      accountVerified: true,
    });
    await user.save();
    return user;
  };

  const tok = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  test("Reg-NoName", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...u, name: "" });
    expect(res.statusCode).toBe(400);
  });

  test("Reg-NoEmail", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...u, email: "" });
    expect(res.statusCode).toBe(400);
  });

  test("Reg-InvalidEmail", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...u, email: "bad" });
    expect(res.statusCode).toBe(400);
  });

  test("Reg-ShortPwd", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...u, password: "1", confirmPassword: "1" });
    expect(res.statusCode).toBe(400);
  });

  test("Reg-Mismatch", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ ...u, confirmPassword: "X" });
    expect(res.statusCode).toBe(400);
  });

  test("Reg-Duplicate-Resend", async () => {
    await request(app).post("/api/v1/auth/register").send(u);
    const res = await request(app).post("/api/v1/auth/register").send(u);
    expect(res.statusCode).toBe(200);
  });

  test("Reg-Success", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(u);
    expect(res.statusCode).toBe(200);
  });

  test("Login-NoEmail", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ password: "1" });
    expect(res.statusCode).toBe(400);
  });

  test("Login-NoPwd", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "1@e.com" });
    expect(res.statusCode).toBe(400);
  });

  test("Login-Unverified", async () => {
    await request(app).post("/api/v1/auth/register").send(u);
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: u.email, password: u.password });
    expect(res.statusCode).toBe(401);
  });

  test("Login-WrongEmail", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "x@e.com", password: "1" });
    expect(res.statusCode).toBe(401);
  });

  test("Login-Success", async () => {
    const v = await createV();
    v.password = await (await import("bcrypt")).default.hash("P123456", 10);
    await v.save();
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: v.email, password: "P123456" });
    expect(res.statusCode).toBe(200);
  });

  test("Verify-Success", async () => {
    await request(app).post("/api/v1/auth/register").send(u);
    const user = await User.findOne({ email: u.email });
    const res = await request(app)
      .post("/api/v1/auth/verify-otp")
      .send({ email: u.email, otp: user.verificationCode.toString() });
    expect(res.statusCode).toBe(200);
  });

  test("Verify-WrongOTP", async () => {
    await request(app).post("/api/v1/auth/register").send(u);
    const res = await request(app)
      .post("/api/v1/auth/verify-otp")
      .send({ email: u.email, otp: "0" });
    expect(res.statusCode).toBe(400);
  });

  test("Me-Success", async () => {
    const v = await createV();
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", [`token=${tok(v)}`]);
    expect(res.statusCode).toBe(200);
  });

  test("Logout-Success", async () => {
    const v = await createV();
    const res = await request(app)
      .get("/api/v1/auth/logout")
      .set("Cookie", [`token=${tok(v)}`]);
    expect(res.statusCode).toBe(200);
  });

  test("Forgot-Success", async () => {
    await createV();
    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "user@e.com" });
    expect(res.statusCode).toBe(200);
  });

  test("UpdateProfile-Success", async () => {
    const v = await createV();
    const res = await request(app)
      .put("/api/v1/auth/update-profile")
      .set("Cookie", [`token=${tok(v)}`])
      .send({ name: "N" });
    expect(res.statusCode).toBe(200);
  });

  test("UpdatePwd-Success", async () => {
    const v = await createV();
    v.password = await (await import("bcrypt")).default.hash("Old123", 10);
    await v.save();
    const res = await request(app)
      .put("/api/v1/auth/password/update")
      .set("Cookie", [`token=${tok(v)}`])
      .send({
        oldPassword: "Old123",
        newPassword: "New123",
        confirmPassword: "New123",
      });
    expect(res.statusCode).toBe(200);
  });

  test("ResetPwd-NotFound", async () => {
    const res = await request(app)
      .put("/api/v1/auth/reset-password/x")
      .send({ password: "1", confirmPassword: "1" });
    expect(res.statusCode).toBe(400);
  });

  test("Token-ExpiredMock-400", async () => {
    const v = await createV();
    const token = jwt.sign({ id: v._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "0s",
    });
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", [`token=${token}`]);
    expect(res.statusCode).toBe(400);
  });
});
