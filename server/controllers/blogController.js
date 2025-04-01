import Blog from "../models/Blog.js"; // Import Blog model
import Comment from "../models/Comment.js";
import { analyzeSentiment } from "../services/sentimentService.js";
// Create Blog with Sentiment Analysis
export const createBlog = async (req, res) => {
  const { title, textBody, image, topic } = req.body;
  const creationDateTime = new Date().toISOString();
  const userID = req.user.userID;

  try {
    // Analyze sentiment of the blog content
    const sentimentResult = await analyzeSentiment(textBody); // Get sentiment result
    const sentiment = sentimentResult[0].label; // Get sentiment label (e.g., "POSITIVE", "NEGATIVE", "NEUTRAL")

    // Create new blog with the sentiment
    const newBlog = new Blog({
      title,
      textBody,
      image,
      creationDateTime,
      userID,
      topic,
      sentiment,
    });

    await newBlog.save();
    res.status(201).json(newBlog); // Send the created blog in response
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors
  }
};

// Get All Blogs
export const readAllBlogs = async (req, res) => {
  try {
    // Find all blogs and populate the userID field to get user details for each blog
    const blogs = await Blog.find().populate("userID");
    res.json(blogs); // Send all blogs as the response
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors
  }
};
// Edit Blog with Sentiment Analysis
export const editBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogID);

    // Check if the logged-in user is the owner of the blog
    if (blog.userID._id.toString() !== req.user.userID) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this blog" });
    }

    // Analyze sentiment of the updated blog content
    const sentimentResult = await analyzeSentiment(req.body.textBody); // Get sentiment result
    const sentiment = sentimentResult[0].label; // Get sentiment label (e.g., "POSITIVE", "NEGATIVE", "NEUTRAL")

    // Update the blog with the new data and sentiment
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.blogID,
      { ...req.body, sentiment },
      { new: true }
    );

    res.json(updatedBlog); // Return the updated blog
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    // Find the blog by ID
    const blog = await Blog.findById(req.params.blogID);

    // Check if the logged-in user is the owner of the blog
    if (blog.userID._id.toString() !== req.user.userID) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this blog" });
    }

    // Delete the blog from the database
    await Blog.findByIdAndDelete(req.params.blogID);
    res.status(204).send(); // Send 204 (No Content) response
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors
  }
};

// Get Blog by ID with Comments
export const readBlogById = async (req, res) => {
  try {
    // Find blog by ID and populate the userID field to get user details
    const blog = await Blog.findById(req.params.blogID).populate("userID");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Fetch comments for the blog
    const comments = await Comment.find({ blogID: req.params.blogID }).populate(
      "userID"
    );

    // Return the blog with comments
    res.json({ blog, comments });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Create Comment
export const createComment = async (req, res) => {
  const { text } = req.body;
  const { blogID } = req.params;
  const userID = req.user.userID; // Get userID from the authenticated user

  try {
    // Create a new comment
    const newComment = new Comment({
      text,
      blogID,
      userID,
    });

    await newComment.save(); // Save the comment to the database

    res.status(201).json(newComment); // Return the newly created comment
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
