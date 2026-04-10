import { jest, expect, describe, test, it, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import { app } from "../../app.js";
import { User } from "../../models/userModel.js";
import { setupDB, teardownDB, clearDB } from "../setup.js";
import jwt from "jsonwebtoken";

beforeAll(async () => await setupDB());
afterAll(async () => await teardownDB());
beforeEach(async () => await clearDB());

describe("User Controller - Admin Tasks", () => {
  const t = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET_KEY);

  const cAdm = async () => {
    const u = new User({
      name: "Admin",
      email: "admin@e.com",
      password: "h@",
      role: "Admin",
      accountVerified: true,
    });
    await u.save();
    return u;
  };

  test("GetAllUsers-Success", async () => {
    const a = await cAdm();
    const res = await request(app)
      .get("/api/v1/user/get-all-users")
      .set("Cookie", [`token=${t(a)}`]);
    expect(res.statusCode).toBe(200);
    expect(res.body.users).toBeDefined();
  });

  test("RegisterAdmin-Unauth", async () => {
    const u = new User({
      name: "U",
      email: "u@e.com",
      password: "h@",
      role: "User",
      accountVerified: true,
    });
    await u.save();
    const res = await request(app)
      .post("/api/v1/user/register-new-admin")
      .set("Cookie", [`token=${t(u)}`]);
    expect(res.statusCode).toBe(403);
  });
});
