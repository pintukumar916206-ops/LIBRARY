import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";
import {
  addBook,
  deleteBook,
  getAllBooks,
  updateBook,
} from "../controllers/bookandmangaController.js";
import express from "express";

const router = express.Router();

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.get("/all", isAuthenticated, getAllBooks);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);
router.put("/admin/update/:id", isAuthenticated, isAuthorized("Admin"), updateBook);

export default router;
