import Blog from "../models/Blog.js";
//import { analyzeSentiment } from "../controllers/sentimentController.js"; // Import sentiment analysis

// Create Blog
export const createBlog = async (req, res) => {
  const { title, textBody, image, topic } = req.body;
  const creationDateTime = new Date().toISOString();
  const userID = req.user.userID;

  try {
    // Create new blog without sentiment analysis
    const newBlog = new Blog({
      title,
      textBody,
      image,
      creationDateTime,
      userID,
      topic,
    });

    await newBlog.save();
    res.status(201).json(newBlog); // Send the created blog in the response
  } catch (err) {
    res.status(400).json({ message: err.message }); // Ensure error message is captured correctly
  }
};

// Get Blog by ID
export const readBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogID).populate("userID");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Blogs
export const readAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("userID");
    res.json(blogs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Edit Blog
export const editBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.blogID,
      req.body,
      { new: true }
    );
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.blogID);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
