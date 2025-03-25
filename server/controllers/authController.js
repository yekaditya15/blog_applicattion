import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const registerUser = async (req, res) => {
  const { name, email, username, password, gender, topics } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({ name, email, username, password, gender, topics });
    user.password = await bcrypt.hash(password, 10); // Encrypt password
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password"); // Include password in query

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userID: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
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
    res.status(400).json({ message: err.message });
  }
};
