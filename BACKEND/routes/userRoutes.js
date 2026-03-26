import express from "express";
import { getAllUsers, registerNewAdmin } from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.post("/add/new/admin", isAuthenticated, isAuthorized("Admin"), registerNewAdmin);

export default router;