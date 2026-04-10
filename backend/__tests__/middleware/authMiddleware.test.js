import { jest, expect, describe, test, it, beforeEach } from "@jest/globals";
import { isAuthenticated, isAuthorized } from "../../middleware/authMiddleware.js";
import { User } from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../../middleware/errorMiddleware.js";

jest.mock("jsonwebtoken");
jest.mock("../../models/userModel.js");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
      headers: {},
      user: {},
    };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("isAuthenticated", () => {
    it("should return error if no token is provided", async () => {
      await isAuthenticated(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
      expect(next.mock.calls[0][0].statusCode).toBe(401);
    });

    it("should allow access with valid token", async () => {
      req.cookies.token = "valid_token";
      const decoded = { id: "user_id" };
      jwt.verify.mockReturnValue(decoded);
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: "user_id", role: "User" }),
      });

      await isAuthenticated(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
    });

    it("should return error if token is invalid", async () => {
      req.cookies.token = "invalid_token";
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await isAuthenticated(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("isAuthorized", () => {
    it("should allow access if user has required role", () => {
      req.user.role = "Admin";
      const middleware = isAuthorized("Admin");
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("should return 403 if user does not have required role", () => {
      req.user.role = "User";
      const middleware = isAuthorized("Admin");
      middleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
      expect(next.mock.calls[0][0].statusCode).toBe(403);
    });
  });
});
