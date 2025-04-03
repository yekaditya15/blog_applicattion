import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreatePost.css";
import Spinner from "../components/Spinner";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [textBody, setTextBody] = useState("");
  const [image, setImage] = useState("");
  const [topic, setTopic] = useState(""); // Added topic state
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  if (loading) return <Spinner />;

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Reset error message

    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        "https://blog-applicattionserver.vercel.app/api/blog/createBlog",
        { title, textBody, topic, image }, // Sending topic along with other post details
        {
          headers: { "x-auth-token": token },
        }
      );
      setLoading(false); // Stop loading
      navigate("/"); // Redirect to home page after successful creation
    } catch (err) {
      setLoading(false); // Stop loading
      setError("Failed to create post. Please try again."); // Show error message
      console.error(err);
    }
  };

  const wordCount = textBody.trim().split(/\s+/).length;

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h2>Create Your Story</h2>
        <p>Share your thoughts, experiences, and insights with the world</p>
      </div>

      <form onSubmit={handleCreatePost} className="create-post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a captivating title..."
            required
            className="title-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="topic">Topic</label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className="topic-select"
          >
            <option value="">Select a topic</option>
            <option value="Politics">Politics</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={textBody}
            onChange={(e) => setTextBody(e.target.value)}
            placeholder="Start writing your story..."
            required
            className="content-editor"
          />
          <div className="word-count">{wordCount} words</div>
        </div>

        <div className="form-group">
          <label htmlFor="image">Cover Image URL</label>
          <input
            id="image"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter an image URL for your story..."
            className="image-input"
          />
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Publishing..." : "Publish Story"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
