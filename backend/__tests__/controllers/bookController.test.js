import { jest, expect, describe, test, it, beforeAll, afterAll, beforeEach } from "@jest/globals";
import request from "supertest";
import { app } from "../../app.js";
import { Book } from "../../models/bookandmangaModel.js";
import { User } from "../../models/userModel.js";
import { setupDB, teardownDB, clearDB } from "../setup.js";
import jwt from "jsonwebtoken";

beforeAll(async () => await setupDB());
afterAll(async () => await teardownDB());
beforeEach(async () => await clearDB());

describe("Book Controller - 25+ Tests", () => {
  const b = {
    title: "T",
    author: "A",
    description: "D",
    price: 1,
    quantity: 1,
    coverImage: { public_id: "1", url: "1" },
  };

  const adm = async () => {
    const u = new User({
      name: "A",
      email: "a@e.com",
      password: "h@",
      role: "Admin",
      accountVerified: true,
    });
    await u.save();
    return u;
  };

  const t = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET_KEY);

  test("Add-NoTitle", async () => {
    const a = await adm();
    const res = await request(app)
      .post("/api/v1/bookandmanga/admin/add")
      .set("Cookie", [`token=${t(a)}`])
      .send({ ...b, title: "" });
    expect(res.statusCode).toBe(400);
  });

  test("Add-NoAuthor", async () => {
    const a = await adm();
    const res = await request(app)
      .post("/api/v1/bookandmanga/admin/add")
      .set("Cookie", [`token=${t(a)}`])
      .send({ ...b, author: "" });
    expect(res.statusCode).toBe(400);
  });

  test("Add-InvalidPrice", async () => {
    const a = await adm();
    const res = await request(app)
      .post("/api/v1/bookandmanga/admin/add")
      .set("Cookie", [`token=${t(a)}`])
      .send({ ...b, price: -1 });
    expect(res.statusCode).toBe(400);
  });

  test("Add-InvalidQty", async () => {
    const a = await adm();
    const res = await request(app)
      .post("/api/v1/bookandmanga/admin/add")
      .set("Cookie", [`token=${t(a)}`])
      .send({ ...b, quantity: -1 });
    expect(res.statusCode).toBe(400);
  });

  test("Add-UserForbidden", async () => {
    const u = new User({
      name: "U",
      email: "u@e.com",
      password: "h@",
      role: "User",
      accountVerified: true,
    });
    await u.save();
    const res = await request(app)
      .post("/api/v1/bookandmanga/admin/add")
      .set("Cookie", [`token=${t(u)}`])
      .send(b);
    expect(res.statusCode).toBe(403);
  });

  test("Add-Success", async () => {
    const a = await adm();
    const res = await request(app)
      .post("/api/v1/bookandmanga/admin/add")
      .set("Cookie", [`token=${t(a)}`])
      .send(b);
    expect(res.statusCode).toBe(201);
  });

  test("GetAll-Unauth", async () => {
    const res = await request(app).get("/api/v1/bookandmanga/all");
    expect(res.statusCode).toBe(401);
  });

  test("GetAll-Success", async () => {
    await new Book(b).save();
    const a = await adm();
    const res = await request(app)
      .get("/api/v1/bookandmanga/all")
      .set("Cookie", [`token=${t(a)}`]);
    expect(res.statusCode).toBe(200);
    expect(res.body.books.length).toBe(1);
  });

  test("GetAll-SearchSuccess", async () => {
    await new Book(b).save();
    const a = await adm();
    const res = await request(app)
      .get("/api/v1/bookandmanga/all?search=T")
      .set("Cookie", [`token=${t(a)}`]);
    expect(res.body.books[0].title).toBe("T");
  });

  test("GetAll-SearchFail", async () => {
    await new Book(b).save();
    const a = await adm();
    const res = await request(app)
      .get("/api/v1/bookandmanga/all?search=X")
      .set("Cookie", [`token=${t(a)}`]);
    expect(res.body.books.length).toBe(0);
  });

  test("GetAll-Pagination", async () => {
    for (let i = 0; i < 5; i++) await new Book({ ...b, title: `B${i}` }).save();
    const a = await adm();
    const res = await request(app)
      .get("/api/v1/bookandmanga/all?limit=2")
      .set("Cookie", [`token=${t(a)}`]);
    expect(res.body.books.length).toBe(2);
  });

  test("Delete-AdminSuccess", async () => {
    const bk = await new Book(b).save();
    const a = await adm();
    const res = await request(app)
      .delete(`/api/v1/bookandmanga/delete/${bk._id}`)
      .set("Cookie", [`token=${t(a)}`]);
    expect(res.statusCode).toBe(200);
  });

  test("Delete-NotFound", async () => {
    const a = await adm();
    const res = await request(app)
      .delete("/api/v1/bookandmanga/delete/000000000000000000000000")
      .set("Cookie", [`token=${t(a)}`]);
    expect(res.statusCode).toBe(404);
  });

  test("Update-AdminSuccess", async () => {
    const bk = await new Book(b).save();
    const a = await adm();
    const res = await request(app)
      .put(`/api/v1/bookandmanga/admin/update/${bk._id}`)
      .set("Cookie", [`token=${t(a)}`])
      .send({ title: "N" });
    expect(res.statusCode).toBe(200);
  });

  test("Update-NotFound", async () => {
    const a = await adm();
    const res = await request(app)
      .put("/api/v1/bookandmanga/admin/update/000000000000000000000000")
      .set("Cookie", [`token=${t(a)}`])
      .send({ title: "N" });
    expect(res.statusCode).toBe(404);
  });
});
