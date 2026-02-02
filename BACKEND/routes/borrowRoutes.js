import express from "express";
import {
  borrowBooks,
  recordBorrowedBook,
  getBorrowedBooksForAdmin,
  returnBorrowBook,
} from "../controllers/borrowController.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/record-borrow-book/:id",
  isAuthenticated,
  isAuthorized("Admin","User"),
  recordBorrowedBook
);

router.get(
  "/borrowed-books-by-users",
  isAuthenticated,
  isAuthorized("Admin"),
  getBorrowedBooksForAdmin
);

router.get(
  "/my-borrowed-books",
  isAuthenticated,
  borrowBooks
);

router.put(
  "/return/:id",
  isAuthenticated,
  isAuthorized("Admin","User"),
  returnBorrowBook
); 


export default router; 