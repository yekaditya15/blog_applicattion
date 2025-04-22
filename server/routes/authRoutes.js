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
  (req, res, next) => {
    console.log("Google callback received");
    passport.authenticate(
      "google",
      {
        failureRedirect: "/api/auth/google/failure",
        session: false,
      },
      (err, user, info) => {
        console.log("Passport authenticate callback");
        if (err) {
          console.error("Passport authentication error:", err);
          return res
            .status(500)
            .json({ message: "Authentication error", error: err.message });
        }
        if (!user) {
          console.error("No user returned from authentication");
          return res.redirect("/api/auth/google/failure");
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  },
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
