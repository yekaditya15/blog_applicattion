import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateBlog, deleteBlog } from "../redux/slices/blogSlice";
import axios from "axios";
import "../styles/CreatePost.css";
import Spinner from "../components/Spinner";
import { showToast } from "../utils/toast";
import { BASE_URL } from "../utils/api";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [textBody, setTextBody] = useState("");
  const [topic, setTopic] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/blog/readBlog/${id}`);
        const blog = response.data.blog;
        setTitle(blog.title);
        setTextBody(blog.textBody);
        setTopic(blog.topic);
        setImage(blog.image || "");
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch blog details");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateBlog({
          id,
          title,
          textBody,
          topic,
          image,
        })
      ).unwrap();
      showToast.success("Blog updated successfully!");
      navigate(`/blog/${id}`);
    } catch (error) {
      showToast.error(error.message || "Failed to update blog");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await dispatch(deleteBlog(id)).unwrap();
        showToast.success("Blog deleted successfully!");
        navigate("/");
      } catch (error) {
        showToast.error(error.message || "Failed to delete blog");
      }
    }
  };

  if (loading) return <Spinner />;

  const wordCount = textBody.trim().split(/\s+/).length;

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h2>Edit Your Story</h2>
        <p>Make changes to your story and share your updated perspective</p>
      </div>

      <form onSubmit={handleUpdatePost} className="create-post-form">
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
          {loading ? "Updating..." : "Update Story"}
        </button>
      </form>
    </div>
  );
};

export default EditPost;
