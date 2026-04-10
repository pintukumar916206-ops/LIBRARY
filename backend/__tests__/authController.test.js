import { jest } from "@jest/globals";
import { mockRequest, mockResponse, mockNext } from "./helpers/testSetup.js";

jest.unstable_mockModule("../models/userModel.js", () => {
  const mockUserInstance = {
    generateVerificationCode: jest.fn().mockReturnValue("12345"),
    save: jest.fn().mockResolvedValue(true),
    _id: "mock_id",
    name: "Test User",
    email: "test@example.com",
    accountVerified: true,
  };
  const MockUser = jest.fn(() => mockUserInstance);
  MockUser.findOne = jest.fn();
  MockUser.find = jest.fn();
  return { User: MockUser };
});

jest.unstable_mockModule("../utils/sendVerificationCode.js", () => ({
  sendVerificationCode: jest.fn().mockResolvedValue(true),
}));

jest.unstable_mockModule("../utils/sendToken.js", () => ({
  sendToken: jest.fn(),
}));

jest.unstable_mockModule("bcrypt", () => {
  const mockBcrypt = {
    hash: jest.fn().mockResolvedValue("hashed_password"),
    compare: jest.fn().mockResolvedValue(true),
  };
  return { ...mockBcrypt, default: mockBcrypt };
});

jest.unstable_mockModule("../utils/sendEmail.js", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

describe("Auth Controller Unit Tests", () => {
  let req, res, next;
  let register, login, verifyOTP, User, sendVerificationCode, sendToken, bcrypt;

  beforeAll(async () => {
    const authMod = await import("../controllers/authController.js");
    register = authMod.register;
    login = authMod.login;
    verifyOTP = authMod.verifyOTP;

    const userMod = await import("../models/userModel.js");
    User = userMod.User;

    const svcMod = await import("../utils/sendVerificationCode.js");
    sendVerificationCode = svcMod.sendVerificationCode;

    const stMod = await import("../utils/sendToken.js");
    sendToken = stMod.sendToken;

    const bcryptMod = await import("bcrypt");
    bcrypt = bcryptMod.default;
  });

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    jest.clearAllMocks();
  });

  describe("Register Function", () => {
    test("should register a new user successfully", async () => {
      req.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      User.findOne.mockResolvedValue(null);

      await register(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(User).toHaveBeenCalled();
      expect(sendVerificationCode).toHaveBeenCalled();
    });

    test("should fail if user already exists and is verified", async () => {
      req.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      User.findOne.mockResolvedValue({ email: "test@example.com", accountVerified: true });

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User already registered. Please log in.",
          statusCode: 400,
        })
      );
    });
  });

  describe("Login Function", () => {
    test("should login successfully", async () => {
      req.body = {
        email: "test@example.com",
        password: "password123",
      };

      const mockUser = {
        email: "test@example.com",
        password: "hashed_password",
        accountVerified: true,
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await login(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(sendToken).toHaveBeenCalled();
    });

    test("should fail if user not found", async () => {
      req.body = { email: "wrong@example.com", password: "password123" };
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Invalid Email or Password",
          statusCode: 401,
        })
      );
    });
  });

  describe("Verify OTP Function", () => {
    test("should verify email with correct OTP", async () => {
      req.body = { email: "test@example.com", otp: "12345" };
      
      const mockUser = {
        email: "test@example.com",
        verificationCode: "12345",
        verificationCodeExpire: Date.now() + 10000,
        accountVerified: false,
        save: jest.fn().mockResolvedValue(true),
      };

      User.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([mockUser]),
      });

      await verifyOTP(req, res, next);

      expect(User.find).toHaveBeenCalled();
      expect(mockUser.accountVerified).toBe(true);
      expect(sendToken).toHaveBeenCalled();
    });

    test("should fail with incorrect OTP", async () => {
      req.body = {
        email: "test@example.com",
        otp: "99999",
      };
      
      const mockUser = {
        verificationCode: "12345",
        verificationCodeExpire: Date.now() + 10000,
        save: jest.fn().mockResolvedValue(true),
      };
      
      User.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([mockUser]),
      });

      await verifyOTP(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Invalid OTP.",
          statusCode: 400,
        })
      );
    });
  });
});
