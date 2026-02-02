import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { Book } from "../models/bookandmangaModel.js";
import { User } from "../models/userModel.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity } = req.body;
  if (!title || !author || !description || !price || !quantity) {
    return next(new ErrorHandler("All fields are required", 400));
  }
  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
  });
  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book,
  });
});

export const getAllBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.find();
  res.status(200).json({
    success: true,
    book,
  });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }
  await book.deleteOne();
  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});

export const updateBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    book,
  });
});
