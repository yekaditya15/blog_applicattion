import express from "express";
import {
  createBlog,
  readBlogById,
  readAllBlogs,
  editBlog,
  deleteBlog,
  createComment,
  createReply,
  likeComment,
  unlikeComment,
  summarizeBlog,
} from "../controllers/blogController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect the route for creating blogs
router.post("/createBlog", authMiddleware, createBlog);
router.get("/readBlog/:blogID", readBlogById);
router.get("/readAllBlogs", readAllBlogs);
router.patch("/editBlog/:blogID", authMiddleware, editBlog);
router.delete("/deleteBlog/:blogID", authMiddleware, deleteBlog);
// Comment Routes
router.post("/comment/:blogID", authMiddleware, createComment); // Route to create a comment

// New routes for comment replies and likes
router.post("/comment/:commentID/reply", authMiddleware, createReply);
router.post("/comment/:commentID/like", authMiddleware, likeComment);
router.delete("/comment/:commentID/like", authMiddleware, unlikeComment);

// Add this route
router.post("/:id/summarize", authMiddleware, summarizeBlog);

export default router;
