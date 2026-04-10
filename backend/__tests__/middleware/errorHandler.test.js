import { jest, expect, describe, it } from "@jest/globals";
import { errorMiddleware } from "../../middleware/errorMiddleware.js";
import ErrorHandler from "../../middleware/errorMiddleware.js";

describe("Error Middleware", () => {
  it("should handle ErrorHandler instances", () => {
    const err = new ErrorHandler("Test error", 400);
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Test error",
    });
  });

  it("should handle duplicate key errors", () => {
    const err = { code: 11000, statusCode: 500 };
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorMiddleware(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "A record with that value already exists.",
    });
  });

  it("should handle JsonWebTokenError", () => {
    const err = { name: "JsonWebTokenError", statusCode: 500 };
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorMiddleware(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid token. Please log in again.",
    });
  });

  it("should handle TokenExpiredError", () => {
    const err = { name: "TokenExpiredError", statusCode: 500 };
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorMiddleware(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Session expired. Please log in again.",
    });
  });

  it("should return 500 for unknown errors", () => {
    const err = { message: "Unknown error" };
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
