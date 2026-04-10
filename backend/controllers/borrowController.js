import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { Book } from "../models/bookandmangaModel.js";
import { Borrow } from "../models/borrowModel.js";
import { calculateFine } from "../utils/fineCalculator.js";
import { validatePagination, sanitizeInput } from "../utils/validation.js";
import { recordBorrowSchema } from "../schemas/borrowSchema.js";

export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  const result = recordBorrowSchema.safeParse(req.body);
  if (!result.success) {
    return next(new ErrorHandler(result.error.errors[0].message, 400));
  }
  if (!user.accountVerified) {
    return next(new ErrorHandler("User account is not verified.", 400));
  }
  const alreadyBorrowed = await Borrow.findOne({
    user: user._id,
    book: id,
    returned: false,
  });
  if (alreadyBorrowed) {
    return next(new ErrorHandler("User already has this book borrowed.", 400));
  }
  const book = await Book.findOneAndUpdate(
    { _id: id, quantity: { $gt: 0 } },
    { $inc: { quantity: -1 } },
    { new: true },
  );
  if (!book) {
    return next(new ErrorHandler("Book not found or currently unavailable.", 404));
  }
  book.availability = book.quantity > 0;
  await book.save();
  const finalDueDate = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000);
  try {
    await Borrow.create({
      user: user._id,
      book: book._id,
      borrowedAt: new Date(),
      returned: false,
      dueDate: finalDueDate,
      price: book.price,
    });
  } catch (error) {
    await Book.findByIdAndUpdate(id, { $inc: { quantity: 1 } });
    return next(new ErrorHandler("Failed to create borrow record. Transaction rolled back.", 500));
  }
  res.status(200).json({
    success: true,
    message: "Book borrowed successfully.",
  });
});

export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const borrow = await Borrow.findById(id).populate("book");
  if (!borrow) {
    return next(new ErrorHandler("Borrow record not found.", 404));
  }
  if (borrow.returned) {
    return next(new ErrorHandler("Book has already been returned.", 400));
  }
  if (!borrow.book) {
    return next(new ErrorHandler("Associated book record not found.", 404));
  }
  const { book } = borrow;
  book.quantity += 1;
  book.availability = true;
  await book.save();
  borrow.returned = true;
  borrow.returnedAt = new Date();
  borrow.fine = calculateFine(borrow.dueDate);
  await borrow.save();
  res.status(200).json({
    success: true,
    message: borrow.fine === 0 ? "Book returned successfully. No fine." : `Book returned. Total fine: ₹${borrow.fine}`,
    fine: borrow.fine,
  });
});

export const getMyBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = await Borrow.find({ user: req.user._id })
    .populate("book")
    .populate("user", "name email");
  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

export const getAllBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { page, limit } = validatePagination(req.query.page, req.query.limit);
  const skip = (page - 1) * limit;
  const total = await Borrow.countDocuments();
  const borrowedBooks = await Borrow.find()
    .populate("book")
    .populate("user", "name email")
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    borrowedBooks,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  });
});
