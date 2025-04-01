import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/blog/readBlog/${id}`
        );
        setBlog(response.data.blog);
        setComments(response.data.comments); // Set the comments
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
        `http://localhost:5000/api/blog/comment/${id}`,
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

  // Loading state handling
  if (loading) return <div>Loading blog details...</div>;

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.textBody}</p>
      {blog.image && <img src={blog.image} alt="Blog" />}
      <p>
        <strong>Topic:</strong> {blog.topic}
      </p>
      <p>
        <strong>Author:</strong> {blog.userID.username}
      </p>
      <p>
        <strong>Created On:</strong>{" "}
        {new Date(blog.creationDateTime).toLocaleDateString()}
      </p>
      <p>
        <strong>Sentiment:</strong> {blog.sentiment || "Not analyzed"}{" "}
        {/* Display sentiment */}
      </p>

      <div>
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={comment._id}>
                <strong>{comment.userID.username}:</strong> {comment.text}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleCommentSubmit}>
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
