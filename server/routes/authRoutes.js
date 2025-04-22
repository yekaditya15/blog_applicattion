import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  googleAuthSuccess,
  googleAuthFailure,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import passport from "passport";

const router = express.Router();

// Local authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/google/failure",
    session: false,
  }),
  googleAuthSuccess
);

router.get("/google/failure", googleAuthFailure);

// Protected route to get user profile
router.get("/profile", authMiddleware, getUserProfile);

// Get Gender Options (Static Array)
router.get("/genderOptions", (req, res) => {
  const genderOptions = ["Male", "Female", "Other"]; // You can store these options in a database if needed
  res.json(genderOptions); // Send the options as the response
});

export default router;
