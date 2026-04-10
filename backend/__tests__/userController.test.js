import { jest } from "@jest/globals";
import { mockRequest, mockResponse, mockNext } from "./helpers/testSetup.js";


jest.unstable_mockModule("../models/userModel.js", () => ({
  User: {
    find: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue([]) }) }),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    countDocuments: jest.fn().mockResolvedValue(0),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));

jest.unstable_mockModule("cloudinary", () => ({
  v2: {
    uploader: {
      upload: jest.fn().mockResolvedValue({
        public_id: "mock_avatar_id",
        secure_url: "https:,
      }),
    },
  },
}));

jest.unstable_mockModule("fs/promises", () => ({
  unlink: jest.fn().mockResolvedValue(true),
}));

describe("User Controller Unit Tests", () => {
  let req, res, next;
  let getAllUsers, deleteUser, registerNewAdmin, User;

  beforeAll(async () => {
    const userCtrlMod = await import("../controllers/userController.js");
    getAllUsers = userCtrlMod.getAllUsers;
    deleteUser = userCtrlMod.deleteUser;
    registerNewAdmin = userCtrlMod.registerNewAdmin;

    const userMod = await import("../models/userModel.js");
    User = userMod.User;
  });

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    jest.clearAllMocks();
  });

  describe("Get All Users", () => {
    test("should return all users with pagination", async () => {
      req.query = { page: "1", limit: "10" };
      const mockUsers = [{ name: "User 1" }, { name: "User 2" }];
      
      User.countDocuments.mockResolvedValue(2);
      User.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockUsers),
        }),
      });

      await getAllUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ users: mockUsers }));
    });
  });

  describe("Register New Admin", () => {
    test("should register a new admin successfully", async () => {
      req.body = {
        name: "Admin User",
        email: "admin@example.com",
        password: "adminPassword123",
      };
      req.files = {
        avatar: {
          tempFilePath: "temp/avatar.jpg",
          mimetype: "image/jpeg",
        },
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ ...req.body, role: "Admin", _id: "admin_id" });

      await registerNewAdmin(req, res, next);

      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Admin registered successfully." }));
    });

    test("should fail if avatar is missing", async () => {
      req.body = { name: "Admin" };
      req.files = null;

      await registerNewAdmin(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Avatar image is required." }));
    });
  });
});
