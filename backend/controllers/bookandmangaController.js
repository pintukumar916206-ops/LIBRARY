import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { Book } from "../models/bookandmangaModel.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import {
  validateFileUpload,
  validatePagination,
  sanitizeInput,
} from "../utils/validation.js";
import { promises as fsPromises } from "fs";
import { addBookSchema, updateBookSchema } from "../schemas/bookSchema.js";

export const addBook = catchAsyncErrors(async (req, res, next) => {
  const result = addBookSchema.safeParse(req.body);
  if (!result.success) {
    return next(new ErrorHandler(result.error.errors[0].message, 400));
  }
  const { title, author, description, price, quantity } = result.data;

  if (!req.files || !req.files.coverImage) {
    return next(new ErrorHandler("Cover image is required.", 400));
  }

  const { coverImage } = req.files;
  const fileValidation = validateFileUpload(coverImage);
  if (!fileValidation.valid) {
    if (coverImage.tempFilePath) {
      await fsPromises.unlink(coverImage.tempFilePath).catch(() => {});
    }
    return next(new ErrorHandler(fileValidation.error, 400));
  }

  const { v2: cloudinary } = await import("cloudinary");
  let uploadResult;
  try {
    uploadResult = await cloudinary.uploader.upload(coverImage.tempFilePath, {
      folder: "BOOK_COVERS",
    });
  } catch (error) {
    return next(new ErrorHandler("Cover image upload failed.", 500));
  } finally {
    if (coverImage.tempFilePath) {
      await fsPromises.unlink(coverImage.tempFilePath).catch(() => {});
    }
  }

  if (!uploadResult || !uploadResult.secure_url) {
    return next(new ErrorHandler("Cover image upload failed.", 500));
  }

  const book = await Book.create({
    title: sanitizeInput(title),
    author: sanitizeInput(author),
    description: sanitizeInput(description),
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
  const { page, limit } = validatePagination(req.query.page, req.query.limit);
  const skip = (page - 1) * limit;
  const total = await Book.countDocuments();
  const books = await Book.find().skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    books,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
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
  const result = updateBookSchema.safeParse(req.body);
  if (!result.success) {
    return next(new ErrorHandler(result.error.errors[0].message, 400));
  }

  const book = await Book.findByIdAndUpdate(id, result.data, {
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
