import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route to get user profile
router.get("/profile", authMiddleware, getUserProfile);

// Get Gender Options (Static Array)
router.get("/genderOptions", (req, res) => {
  const genderOptions = ["Male", "Female", "Other"]; // You can store these options in a database if needed
  res.json(genderOptions); // Send the options as the response
});

export default router;
