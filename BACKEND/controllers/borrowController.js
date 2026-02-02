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
    return next(new ErrorHandler("Book not found", 404));
  }

  // const user = req.user;
  /* 
     Check if user exists first, then check verification status 
     to provide more specific error messages
  */
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User with this email not found", 404));
  }
  if (!user.accountVerified) {
    return next(new ErrorHandler("User account is not verified", 400));
  }
  if (book.quantity <= 0) {
    return next(new ErrorHandler("Book is currently unavailable", 400));
  }
  const isAlreadyBorrowed = user.borrowedBook.find(
    (b) => b.bookId && b.bookId.toString() === id.toString() && b.returned === false,
  );
  if (isAlreadyBorrowed) {
    return next(
      new ErrorHandler(
        "User has already borrowed this book and not returned it yet",
        400,
      ),
    );
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
    message: "Book borrowed successfully",
  });
});

// RETURNED_BOOK_FUNCTION

export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  console.log("Return Request:", { id, email });

  const borrow = await Borrow.findById(id).populate("book");
  if (!borrow) {
    return next(new ErrorHandler("Borrow record not found", 404));
  }

  if (borrow.returned) {
    console.log("Borrow record already returned");
    return next(new ErrorHandler("Book already returned", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log("User not found for email:", email);
    return next(new ErrorHandler("User not found", 404));
  }
  
  if (!borrow.book) {
     return next(new ErrorHandler("Associated book not found in database", 404));
  }

  const borrowedBook = user.borrowedBook.find(
    (b) =>
      b.bookId.toString() === borrow.book._id.toString() &&
      b.returned === false,
  );
  
  if (borrowedBook) {
    borrowedBook.returned = true;
    borrowedBook.returnedAt = new Date();
  } else {
    console.warn(`Borrow synchronization issue: Book ${borrow.book._id} not found in user ${user._id} borrowed list.`);
  }
  await user.save();

  const { book } = borrow;
  book.quantity += 1;
  book.availability = true;
  await book.save();

  borrow.returned = true;
  borrow.returnedAt = new Date();
  const fine = calculateFine(borrow.dueDate);
  borrow.fine = fine;
  await borrow.save();

  res.status(200).json({
    success: true,
    message:
      fine === 0
        ? "Book returned successfully. No fine."
        : `Book returned successfully. Total fine: ₹${fine}`,
    fine,
  });
});

export const borrowBooks = catchAsyncErrors(async (req, res, next) => {
  const borrowBooks = await Borrow.find({ "user.id": req.user._id }).populate(
    "book",
  );
  res.status(200).json({
    success: true,
    borrowedBooks: borrowBooks,
  });
});

export const getBorrowedBooksForAdmin = catchAsyncErrors(
  async (req, res, next) => {
    const borrowBook = await Borrow.find().populate("book");
    res.status(200).json({
      success: true,
      borrowBook,
    });
  },
);
