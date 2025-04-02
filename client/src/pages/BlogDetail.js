import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles//BlogDetail.css";
const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state
  const [isOwner, setIsOwner] = useState(false); // To track if the user is the owner of the blog

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `https://blog-applicattionserver.vercel.app/api/blog/readBlog/${id}`
        );
        setBlog(response.data.blog);
        setComments(response.data.comments); // Set the comments

        // Check if the logged-in user is the owner
        const token = localStorage.getItem("authToken");
        if (token) {
          const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the JWT token
          const userId = decodedToken.userID; // Extract userID from the token
          setIsOwner(response.data.blog.userID._id === userId); // Check if the user is the owner
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        alert("Failed to fetch blog details.");
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchBlog();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken"); // Get the auth token
    if (!token) {
      return alert("You must be logged in to comment");
    }

    try {
      const response = await axios.post(
        `https://blog-applicattionserver.vercel.app/api/blog/comment/${id}`,
        { text: newComment },
        { headers: { "x-auth-token": token } }
      );

      setComments((prevComments) => [...prevComments, response.data]); // Add new comment to the list
      setNewComment(""); // Clear comment input field
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post the comment");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("authToken");
        await axios.delete(
          `https://blog-applicattionserver.vercel.app/api/blog/deleteBlog/${id}`,
          {
            headers: { "x-auth-token": token },
          }
        );
        alert("Blog deleted successfully");
        navigate("/"); // Redirect to home page
      } catch (err) {
        console.error("Error deleting blog:", err);
        alert("Failed to delete the blog");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/editBlog/${id}`); // Redirect to the edit page with blog ID
  };

  // Loading state handling
  if (loading) return <div>Loading blog details...</div>;

  return (
    <div className="blog-detail-container">
      <h2 className="blog-title">{blog.title}</h2>
      <p className="blog-body">{blog.textBody}</p>
      {blog.image && <img className="blog-image" src={blog.image} alt="Blog" />}
      <div className="blog-meta">
        <span>Topic: {blog.topic}</span>
        <span>Author: {blog.userID.username}</span>
        <span className="date">
          Created On: {new Date(blog.creationDateTime).toLocaleDateString()}
        </span>
      </div>
      <p className="blog-sentiment">
        <strong>Sentiment: </strong> {blog.sentiment || "Not analyzed"}
      </p>

      {/* Edit and Delete buttons if the user is the owner */}
      {isOwner && (
        <div className="blog-action-buttons">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}

      <div className="comment-section">
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment._id} className="comment-item">
                <strong>{comment.userID.username}:</strong> {comment.text}
              </li>
            ))}
          </ul>
        )}

        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      </div>
    </div>
  );
};

export default BlogDetail;
