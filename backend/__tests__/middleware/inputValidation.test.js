import { jest, expect, describe, it } from "@jest/globals";
import {
  validateRegisterInput,
  validateLoginInput,
  validateOTPInput,
  validatePaginationInput,
} from "../../middleware/inputValidationMiddleware.js";

describe("Input Validation Middleware", () => {
  describe("validateRegisterInput", () => {
    it("should validate correct register data", () => {
      const req = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          password: "Password123",
          confirmPassword: "Password123",
        },
      };
      const res = {};
      const next = jest.fn();

      validateRegisterInput(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should reject missing fields", () => {
      const req = {
        body: { name: "John", email: "john@example.com" },
      };
      const res = {};
      let error;
      const next = (err) => {
        error = err;
      };

      validateRegisterInput(req, res, next);

      expect(error).toBeDefined();
      expect(error.statusCode).toBe(400);
    });

    it("should reject mismatched passwords", () => {
      const req = {
        body: {
          name: "John",
          email: "john@example.com",
          password: "Pass123",
          confirmPassword: "Pass456",
        },
      };
      const res = {};
      let error;
      const next = (err) => {
        error = err;
      };

      validateRegisterInput(req, res, next);

      expect(error).toBeDefined();
    });

    it("should reject invalid email", () => {
      const req = {
        body: {
          name: "John",
          email: "notanemail",
          password: "Pass123",
          confirmPassword: "Pass123",
        },
      };
      const res = {};
      let error;
      const next = (err) => {
        error = err;
      };

      validateRegisterInput(req, res, next);

      expect(error).toBeDefined();
    });

    it("should reject short password", () => {
      const req = {
        body: {
          name: "John",
          email: "john@example.com",
          password: "12345",
          confirmPassword: "12345",
        },
      };
      const res = {};
      let error;
      const next = (err) => {
        error = err;
      };

      validateRegisterInput(req, res, next);

      expect(error).toBeDefined();
    });
  });

  describe("validateLoginInput", () => {
    it("should validate correct login data", () => {
      const req = {
        body: {
          email: "john@example.com",
          password: "Password123",
        },
      };
      const res = {};
      const next = jest.fn();

      validateLoginInput(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should reject missing email or password", () => {
      const req = {
        body: { email: "john@example.com" },
      };
      const res = {};
      let error;
      const next = (err) => {
        error = err;
      };

      validateLoginInput(req, res, next);

      expect(error).toBeDefined();
    });
  });

  describe("validateOTPInput", () => {
    it("should validate correct OTP data", () => {
      const req = {
        body: {
          email: "john@example.com",
          otp: "123456",
        },
      };
      const res = {};
      const next = jest.fn();

      validateOTPInput(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should reject invalid OTP length", () => {
      const req = {
        body: {
          email: "john@example.com",
          otp: "12345",
        },
      };
      const res = {};
      let error;
      const next = (err) => {
        error = err;
      };

      validateOTPInput(req, res, next);

      expect(error).toBeDefined();
    });
  });

  describe("validatePaginationInput", () => {
    it("should validate correct pagination", () => {
      const req = {
        query: { page: "1", limit: "20" },
      };
      const res = {};
      const next = jest.fn();

      validatePaginationInput(req, res, next);

      expect(req.validated).toEqual({ page: 1, limit: 20 });
      expect(next).toHaveBeenCalled();
    });

    it("should reject invalid page", () => {
      const req = {
        query: { page: "0", limit: "20" },
      };
      const res = {};
      let error;
      const next = (err) => {
        error = err;
      };

      validatePaginationInput(req, res, next);

      expect(error).toBeDefined();
    });

    it("should reject limit over 100", () => {
      const req = {
        query: { page: "1", limit: "200" },
      };
      const res = {};
      let error;
      const next = (err) => {
        error = err;
      };

      validatePaginationInput(req, res, next);

      expect(error).toBeDefined();
    });

    it("should use defaults for missing params", () => {
      const req = {
        query: {},
      };
      const res = {};
      const next = jest.fn();

      validatePaginationInput(req, res, next);

      expect(req.validated).toEqual({ page: 1, limit: 20 });
    });
  });
});
