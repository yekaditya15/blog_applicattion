import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/BlogDetail.css";
import Spinner from "../components/Spinner";
import { showToast } from "../utils/toast";
// Import icons
import { FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const defaultAvatars = {
    Male: "https://firebasestorage.googleapis.com/v0/b/portfolio-c5c0a.appspot.com/o/male.jpg?alt=media&token=a497fca7-8a82-47fd-ab59-71fbbd99df96",
    Female:
      "https://firebasestorage.googleapis.com/v0/b/portfolio-c5c0a.appspot.com/o/female.jpg?alt=media&token=db327b94-dc57-4e2f-b785-bde33a4764ce",
    Other:
      "https://firebasestorage.googleapis.com/v0/b/portfolio-c5c0a.appspot.com/o/other.jpg?alt=media&token=4a5d916a-14c5-4fbe-b417-4dd6cfa524e2",
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `https://blog-applicattionserver.vercel.app/api/blog/readBlog/${id}`
        );
        setBlog(response.data.blog);
        setComments(response.data.comments);

        const token = localStorage.getItem("authToken");
        if (token) {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          const userId = decodedToken.userID;
          setIsOwner(response.data.blog.userID._id === userId);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        alert("Failed to fetch blog details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      showToast.error("Please login to comment");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `https://blog-applicattionserver.vercel.app/api/blog/comment/${id}`,
        { text: newComment },
        { headers: { "x-auth-token": token } }
      );

      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment("");
      showToast.success("Comment added successfully");
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to post comment");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const token = localStorage.getItem("authToken");
        await axios.delete(
          `https://blog-applicattionserver.vercel.app/api/blog/deleteBlog/${id}`,
          { headers: { "x-auth-token": token } }
        );
        showToast.success("Blog deleted successfully");
        navigate("/");
      } catch (err) {
        showToast.error(err.response?.data?.message || "Failed to delete blog");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/editBlog/${id}`);
  };

  if (loading) return <Spinner />;
  if (!blog) return <div>Blog not found</div>;

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toUpperCase()) {
      case "POSITIVE":
        return "#28a745";
      case "NEGATIVE":
        return "#dc3545";
      case "NEUTRAL":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="blog-detail-container">
      <article className="article-content">
        <h1 className="blog-title">{blog.title}</h1>
        <div className="blog-meta">
          <span className="author">By {blog.userID.username}</span>
          <span className="date">
            {new Date(blog.creationDateTime).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="topic">Topic: {blog.topic}</span>
        </div>

        {isOwner && (
          <div className="blog-actions">
            <button className="edit-btn" onClick={handleEdit}>
              <FaEdit className="action-icon" /> Edit
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              <FaTrash className="action-icon" /> Delete
            </button>
          </div>
        )}

        <p className="content-paragraph">{blog.textBody}</p>

        {blog.image && (
          <img className="blog-image" src={blog.image} alt="Blog" />
        )}

        <p
          className="blog-sentiment"
          style={{ color: getSentimentColor(blog.sentiment) }}
        >
          <strong>Sentiment: </strong>
          {blog.sentiment
            ? blog.sentiment.charAt(0).toUpperCase() +
              blog.sentiment.slice(1).toLowerCase()
            : "Not analyzed"}
        </p>
      </article>

      <div className="discussion-divider">
        <span>Discussion</span>
      </div>

      <section className="comments-section">
        <h3>Comments ({comments.length})</h3>

        {comments.length === 0 ? (
          <p className="no-comments">Be the first to share your thoughts!</p>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment-card">
                <div className="comment-user-avatar">
                  <img
                    src={
                      defaultAvatars[comment.userID.gender] ||
                      defaultAvatars.Other
                    }
                    alt="User Avatar"
                  />
                </div>
                <div className="comment-content">
                  <span className="comment-author">
                    {comment.userID.username}:
                  </span>
                  <span className="comment-text">
                    {comment.text.charAt(0).toUpperCase() +
                      comment.text.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="comment-form-section">
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              required
              aria-label="Comment text"
            />
            <button type="submit" aria-label="Post comment">
              <FaPaperPlane className="send-icon" /> Post
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
