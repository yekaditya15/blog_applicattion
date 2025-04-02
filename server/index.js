import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import cors from "cors";

dotenv.config();

// Initialize app
const app = express();
app.use(express.json());

// Connect to the database
connectDB();

app.use(
  cors({
    origin: "http://localhost:3000", // Allow only requests from localhost:3000
  })
);

// ✅ **Home Route (Check Deployment)**
app.get("/", (req, res) => {
  res.send("🚀 Backend is successfully deployed and running!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
