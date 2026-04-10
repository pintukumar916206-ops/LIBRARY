import express from "express";
import {
  getMyBorrowedBooks,
  recordBorrowedBook,
  getAllBorrowedBooks,
  returnBorrowedBook,
} from "../controllers/borrowController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/record-borrow-book/:id",
  isAuthenticated,
  recordBorrowedBook
);

router.get(
  "/borrowed-books-by-users",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllBorrowedBooks
);

router.get("/my-borrowed-books", isAuthenticated, getMyBorrowedBooks);

router.put(
  "/return/:id",
  isAuthenticated,
  isAuthorized("Admin", "User"),
  returnBorrowedBook
);

export default router;