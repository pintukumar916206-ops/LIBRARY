import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { Book } from "../models/bookandmangaModel.js";
import ErrorHandler from "../middleware/errorMiddleware.js";

export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity } = req.body;
  if (!title || !author || !description || !price || !quantity) {
    return next(new ErrorHandler("All fields are required.", 400));
  }
  if (!req.files || !req.files.coverImage) {
    return next(new ErrorHandler("Cover image is required.", 400));
  }
  const { coverImage } = req.files;
  const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedFormats.includes(coverImage.mimetype)) {
    return next(new ErrorHandler("Only jpg, jpeg, and png formats are allowed.", 400));
  }

  const { v2: cloudinary } = await import("cloudinary");
  const fs = await import("fs");

  let uploadResult;
  try {
    uploadResult = await cloudinary.uploader.upload(coverImage.tempFilePath, {
      folder: "BOOK_COVERS",
    });
  } catch (error) {
    return next(new ErrorHandler("Cover image upload failed.", 500));
  } finally {
    if (coverImage.tempFilePath) {
      fs.unlinkSync(coverImage.tempFilePath);
    }
  }

  if (!uploadResult || !uploadResult.secure_url) {
    return next(new ErrorHandler("Cover image upload failed.", 500));
  }

  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
    coverImage: {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Book added successfully.",
    book,
  });
});

export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json({
    success: true,
    book: books,
  });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }
  await book.deleteOne();
  res.status(200).json({
    success: true,
    message: "Book deleted successfully.",
  });
});

export const updateBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }
  res.status(200).json({
    success: true,
    message: "Book updated successfully.",
    book,
  });
});
