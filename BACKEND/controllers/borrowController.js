import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { Book } from "../models/bookandmangaModel.js";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { email, dueDate } = req.body;

  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("No user found with that email.", 404));
  }
  if (!user.accountVerified) {
    return next(new ErrorHandler("User account is not verified.", 400));
  }
  if (book.quantity <= 0) {
    return next(new ErrorHandler("Book is currently unavailable.", 400));
  }

  const alreadyBorrowed = user.borrowedBook.find(
    (b) => b.bookId && b.bookId.toString() === id.toString() && b.returned === false
  );
  if (alreadyBorrowed) {
    return next(new ErrorHandler("User already has this book borrowed.", 400));
  }

  const finalDueDate = dueDate
    ? new Date(dueDate)
    : new Date(Date.now() + 8 * 24 * 60 * 60 * 1000);

  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  user.borrowedBook.push({
    bookId: book._id,
    bookTitle: book.title,
    returned: false,
    borrowedDate: new Date(),
    dueDate: finalDueDate,
  });
  await user.save();

  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    book: book._id,
    borrowedAt: new Date(),
    returned: false,
    dueDate: finalDueDate,
    price: book.price,
  });

  res.status(200).json({
    success: true,
    message: "Book borrowed successfully.",
  });
});

export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

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

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const borrowedEntry = user.borrowedBook.find(
    (b) => b.bookId.toString() === borrow.book._id.toString() && b.returned === false
  );
  if (borrowedEntry) {
    borrowedEntry.returned = true;
    borrowedEntry.returnedAt = new Date();
  }
  await user.save();

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
    message:
      borrow.fine === 0
        ? "Book returned successfully. No fine."
        : `Book returned. Total fine: ₹${borrow.fine}`,
    fine: borrow.fine,
  });
});

export const getMyBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = await Borrow.find({ "user.id": req.user._id }).populate("book");
  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

export const getAllBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = await Borrow.find().populate("book");
  res.status(200).json({
    success: true,
    borrowBook: borrowedBooks,
  });
});
