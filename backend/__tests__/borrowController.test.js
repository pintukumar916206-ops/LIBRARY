import { jest } from "@jest/globals";
import { mockRequest, mockResponse, mockNext } from "./helpers/testSetup.js";


jest.unstable_mockModule("../models/bookandmangaModel.js", () => ({
  Book: {
    findOneAndUpdate: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.unstable_mockModule("../models/borrowModel.js", () => ({
  Borrow: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue([]) }) }) }) }),
    countDocuments: jest.fn().mockResolvedValue(0),
  },
}));

jest.unstable_mockModule("../utils/fineCalculator.js", () => ({
  calculateFine: jest.fn().mockReturnValue(0),
}));

describe("Borrow Controller Unit Tests", () => {
  let req, res, next;
  let recordBorrowedBook, returnBorrowedBook, getMyBorrowedBooks, Book, Borrow, calculateFine;

  beforeAll(async () => {
    const borrowCtrlMod = await import("../controllers/borrowController.js");
    recordBorrowedBook = borrowCtrlMod.recordBorrowedBook;
    returnBorrowedBook = borrowCtrlMod.returnBorrowedBook;
    getMyBorrowedBooks = borrowCtrlMod.getMyBorrowedBooks;

    const bookMod = await import("../models/bookandmangaModel.js");
    Book = bookMod.Book;

    const borrowMod = await import("../models/borrowModel.js");
    Borrow = borrowMod.Borrow;

    const fineCalcMod = await import("../utils/fineCalculator.js");
    calculateFine = fineCalcMod.calculateFine;
  });

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    jest.clearAllMocks();
    req.user = { _id: "user_id", accountVerified: true };
  });

  describe("Record Borrowed Book", () => {
    test("should borrow a book successfully", async () => {
      req.params = { id: "book_id" };
      
      Borrow.findOne.mockResolvedValue(null);
      const mockBook = { _id: "book_id", price: 10, quantity: 5, save: jest.fn().mockResolvedValue(true) };
      Book.findOneAndUpdate.mockResolvedValue(mockBook);
      Borrow.create.mockResolvedValue({ _id: "borrow_id" });

      await recordBorrowedBook(req, res, next);

      expect(Borrow.findOne).toHaveBeenCalled();
      expect(Book.findOneAndUpdate).toHaveBeenCalled();
      expect(Borrow.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should fail if user account is not verified", async () => {
      req.user.accountVerified = false;
      await recordBorrowedBook(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    test("should fail if book is already borrowed", async () => {
      req.params = { id: "book_id" };
      Borrow.findOne.mockResolvedValue({ _id: "existing_borrow" });
      await recordBorrowedBook(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "User already has this book borrowed." }));
    });
  });

  describe("Return Borrowed Book", () => {
    test("should return book successfully", async () => {
      req.params = { id: "borrow_id" };
      const mockBook = { quantity: 5, save: jest.fn().mockResolvedValue(true) };
      const mockBorrow = {
        _id: "borrow_id",
        returned: false,
        book: mockBook,
        dueDate: new Date(),
        save: jest.fn().mockResolvedValue(true),
      };
      
      Borrow.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockBorrow),
      });

      calculateFine.mockReturnValue(0);

      await returnBorrowedBook(req, res, next);

      expect(mockBorrow.returned).toBe(true);
      expect(mockBook.quantity).toBe(6);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ fine: 0 }));
    });
  });
});
