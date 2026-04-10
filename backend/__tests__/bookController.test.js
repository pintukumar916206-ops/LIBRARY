import { jest } from "@jest/globals";
import { mockRequest, mockResponse, mockNext } from "./helpers/testSetup.js";


jest.unstable_mockModule("../models/bookandmangaModel.js", () => ({
  Book: {
    create: jest.fn(),
    find: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue([]) }) }),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    countDocuments: jest.fn().mockResolvedValue(0),
  },
}));

jest.unstable_mockModule("cloudinary", () => ({
  v2: {
    uploader: {
      upload: jest.fn().mockResolvedValue({
        public_id: "mock_public_id",
        secure_url: "https:,
      }),
    },
  },
}));

jest.unstable_mockModule("fs/promises", () => ({
  unlink: jest.fn().mockResolvedValue(true),
}));

describe("Book Controller Unit Tests", () => {
  let req, res, next;
  let addBook, getAllBooks, deleteBook, updateBook, Book;

  beforeAll(async () => {
    const bookCtrlMod = await import("../controllers/bookandmangaController.js");
    addBook = bookCtrlMod.addBook;
    getAllBooks = bookCtrlMod.getAllBooks;
    deleteBook = bookCtrlMod.deleteBook;
    updateBook = bookCtrlMod.updateBook;

    const bookMod = await import("../models/bookandmangaModel.js");
    Book = bookMod.Book;
  });

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    jest.clearAllMocks();
  });

  describe("Add Book Function", () => {
    test("should add a new book successfully", async () => {
      req.body = {
        title: "Test Book",
        author: "Test Author",
        description: "Test Description",
        price: 100,
        quantity: 10,
      };
      req.files = {
        coverImage: {
          tempFilePath: "mock/path/image.jpg",
          mimetype: "image/jpeg",
          size: 1024,
        },
      };

      const mockBook = { ...req.body, _id: "mock_id" };
      Book.create.mockResolvedValue(mockBook);

      await addBook(req, res, next);

      expect(Book.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Book added successfully.",
        })
      );
    });

    test("should fail if cover image is missing", async () => {
      req.body = { title: "Test Book" };
      req.files = {};

      await addBook(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Cover image is required.",
          statusCode: 400,
        })
      );
    });
  });

  describe("Get All Books", () => {
    test("should return all books with pagination", async () => {
      req.query = { page: "1", limit: "10" };
      const mockBooks = [{ title: "Book 1" }, { title: "Book 2" }];
      
      Book.countDocuments.mockResolvedValue(2);
      Book.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockBooks),
        }),
      });

      await getAllBooks(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          books: mockBooks,
        })
      );
    });
  });

  describe("Delete Book", () => {
    test("should delete book successfully", async () => {
      req.params = { id: "mock_id" };
      const mockBook = { deleteOne: jest.fn().mockResolvedValue(true) };
      Book.findById.mockResolvedValue(mockBook);

      await deleteBook(req, res, next);

      expect(mockBook.deleteOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should fail if book not found", async () => {
      req.params = { id: "non_existent_id" };
      Book.findById.mockResolvedValue(null);

      await deleteBook(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
        })
      );
    });
  });
});
