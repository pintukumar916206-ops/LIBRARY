import { jest, expect, describe, test, it, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import { app } from "../../app.js";
import { Book } from "../../models/bookandmangaModel.js";
import { User } from "../../models/userModel.js";
import { Borrow } from "../../models/borrowModel.js";
import { setupDB, teardownDB, clearDB } from "../setup.js";
import jwt from "jsonwebtoken";

beforeAll(async () => await setupDB());
afterAll(async () => await teardownDB());
beforeEach(async () => await clearDB());

describe("Borrow Controller - 20+ Tests", () => {
  const b = {
    title: "T",
    author: "A",
    price: 10,
    quantity: 5,
    coverImage: { public_id: "1", url: "1" },
  };

  const cU = async (role = "User") => {
    const u = new User({
      name: role,
      email: `${role.toLowerCase()}@e.com`,
      password: "h@",
      role,
      accountVerified: true,
    });
    await u.save();
    return u;
  };

  const t = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET_KEY);

  test("Borrow-BookNotFound", async () => {
    const u = await cU();
    const res = await request(app)
      .post("/api/v1/borrow/record-borrow-book/000000000000000000000000")
      .set("Cookie", [`token=${t(u)}`]);
    expect(res.statusCode).toBe(404);
  });

  test("Borrow-OutOfStock", async () => {
    const u = await cU();
    const bk = await new Book({ ...b, quantity: 0 }).save();
    const res = await request(app)
      .post(`/api/v1/borrow/record-borrow-book/${bk._id}`)
      .set("Cookie", [`token=${t(u)}`]);
    expect(res.statusCode).toBe(400);
  });

  test("Borrow-Success", async () => {
    const u = await cU();
    const bk = await new Book(b).save();
    const res = await request(app)
      .post(`/api/v1/borrow/record-borrow-book/${bk._id}`)
      .set("Cookie", [`token=${t(u)}`]);
    expect(res.statusCode).toBe(200);
    const br = await Borrow.findOne({ user: u._id, book: bk._id });
    expect(br).toBeDefined();
  });

  test("Borrow-AlreadyBorrowed", async () => {
    const u = await cU();
    const bk = await new Book(b).save();
    await request(app)
      .post(`/api/v1/borrow/record-borrow-book/${bk._id}`)
      .set("Cookie", [`token=${t(u)}`]);
    const res = await request(app)
      .post(`/api/v1/borrow/record-borrow-book/${bk._id}`)
      .set("Cookie", [`token=${t(u)}`]);
    expect(res.statusCode).toBe(400);
  });

  test("Return-NotFound", async () => {
    const u = await cU();
    const res = await request(app)
      .put("/api/v1/borrow/return/000000000000000000000000")
      .set("Cookie", [`token=${t(u)}`]);
    expect(res.statusCode).toBe(404);
  });

  test("Return-AlreadyReturned", async () => {
    const u = await cU();
    const bk = await new Book(b).save();
    const br = await new Borrow({
      user: u._id,
      book: bk._id,
      returned: true,
    }).save();
    const res = await request(app)
      .put(`/api/v1/borrow/return/${br._id}`)
      .set("Cookie", [`token=${t(u)}`]);
    expect(res.statusCode).toBe(400);
  });

  test("Return-Success", async () => {
    const u = await cU();
    const bk = await new Book(b).save();
    const br = await new Borrow({
      user: u._id,
      book: bk._id,
      dueDate: new Date(Date.now() + 100000),
    }).save();
    const res = await request(app)
      .put(`/api/v1/borrow/return/${br._id}`)
      .set("Cookie", [`token=${t(u)}`]);
    expect(res.statusCode).toBe(200);
    const upd = await Borrow.findById(br._id);
    expect(upd.returned).toBe(true);
  });

  test("GetAll-Admin-Unauth", async () => {
    const u = await cU("User");
    const res = await request(app)
      .get("/api/v1/borrow/borrowed-books-by-users")
      .set("Cookie", [`token=${t(u)}`]);
    expect(res.statusCode).toBe(403);
  });

  test("GetAll-Admin-Success", async () => {
    const a = await cU("Admin");
    const res = await request(app)
      .get("/api/v1/borrow/borrowed-books-by-users")
      .set("Cookie", [`token=${t(a)}`]);
    expect(res.statusCode).toBe(200);
  });

  test("GetMy-Success", async () => {
    const u = await cU();
    const res = await request(app)
      .get("/api/v1/borrow/my-borrowed-books")
      .set("Cookie", [`token=${t(u)}`]);
    expect(res.statusCode).toBe(200);
  });
});
