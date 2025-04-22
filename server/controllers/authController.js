import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const registerUser = async (req, res) => {
  const { name, email, username, password, gender } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      username,
      password,
      gender,
      authProvider: "local",
    });
    user.password = await bcrypt.hash(password, 10); // Encrypt password
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Return response with token and username
    res.status(201).json({
      message: "User registered successfully",
      token,
      username: user.username,
    });
  } catch (err) {
    console.error(err); // Log errors for debugging
    res.status(400).json({ message: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password"); // Include password in query

    // Check if the user exists and if the password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return response with token and username
    res.json({ message: "Login successful", token, username: user.username });
  } catch (err) {
    console.error(err); // Log errors for debugging
    res.status(400).json({ message: err.message });
  }
};

// Google authentication success handler
export const googleAuthSuccess = (req, res) => {
  console.log("Google authentication success handler called");
  console.log("req.user:", req.user);

  // If this function is called, authentication was successful
  // req.user contains the authenticated user
  if (!req.user) {
    console.log("No user found in request");
    return res.status(401).json({ message: "Authentication failed" });
  }

  // Generate JWT token
  const token = generateToken(req.user._id);
  console.log("Generated token for user:", req.user.username);

  // Redirect to frontend with token
  // In production, you should use a more secure method to pass the token
  const redirectUrl = `${process.env.CLIENT_URL}/google-auth-callback?token=${token}&username=${req.user.username}`;
  console.log("Redirecting to:", redirectUrl);
  res.redirect(redirectUrl);
};

// Google authentication failure handler
export const googleAuthFailure = (req, res) => {
  console.log("Google authentication failure handler called");
  res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
};

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userID: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    // Get the user ID from the token (attached by the authMiddleware)
    const user = await User.findById(req.user.userID).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Return user details
  } catch (err) {
    console.error(err); // Log errors for debugging
    res.status(400).json({ message: err.message });
  }
};
