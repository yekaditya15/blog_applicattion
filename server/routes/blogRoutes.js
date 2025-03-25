import express from "express";
import {
  createBlog,
  readBlogById,
  readAllBlogs,
  editBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect the route for creating blogs
router.post("/createBlog", authMiddleware, createBlog);
router.get("/readBlog/:blogID", readBlogById);
router.get("/readAllBlogs", readAllBlogs);
router.patch("/editBlog/:blogID", editBlog);
router.delete("/deleteBlog/:blogID", deleteBlog);

export default router;
