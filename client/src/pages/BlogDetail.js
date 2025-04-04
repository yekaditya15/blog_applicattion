import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/BlogDetail.css";
import Spinner from "../components/Spinner";
import { showToast } from "../utils/toast";
// Import icons
import {
  FaEdit,
  FaTrash,
  FaPaperPlane,
  FaReply,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  // Add this new state for currentUserID
  const [currentUserID, setCurrentUserID] = useState(null);

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
          setCurrentUserID(userId); // Set the currentUserID
          setIsOwner(response.data.blog.userID._id === userId);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        showToast.error("Failed to fetch blog details");
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

  const handleReply = async (commentId, replyText) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      showToast.error("Please login to reply");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `https://blog-applicattionserver.vercel.app/api/blog/comment/${commentId}/reply`,
        { text: replyText },
        { headers: { "x-auth-token": token } }
      );

      // Update comments state to include the new reply
      setComments((prevComments) => {
        return prevComments.map((comment) => {
          if (comment._id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), response.data],
            };
          }
          return comment;
        });
      });

      showToast.success("Reply added successfully");
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to add reply");
    }
  };

  const handleLike = async (commentId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      showToast.error("Please login to like");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `https://blog-applicattionserver.vercel.app/api/blog/comment/${commentId}/like`,
        {},
        { headers: { "x-auth-token": token } }
      );

      updateCommentLikes(commentId, response.data.likeCount, true);
    } catch (err) {
      showToast.error(err.response?.data?.message || "Failed to like comment");
    }
  };

  const handleUnlike = async (commentId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await axios.delete(
        `https://blog-applicattionserver.vercel.app/api/blog/comment/${commentId}/like`,
        { headers: { "x-auth-token": token } }
      );

      updateCommentLikes(commentId, response.data.likeCount, false);
    } catch (err) {
      showToast.error(
        err.response?.data?.message || "Failed to unlike comment"
      );
    }
  };

  const updateCommentLikes = (commentId, likeCount, isLiked) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            likeCount,
            likes: isLiked
              ? [...comment.likes, currentUserID]
              : comment.likes.filter((id) => id !== currentUserID),
          };
        }
        return comment;
      });
    });
  };

  const Comment = ({ comment, onReply, onLike, onUnlike, currentUserID }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleReplySubmit = (e) => {
      e.preventDefault();
      onReply(comment._id, replyText);
      setReplyText("");
      setShowReplyForm(false);
    };

    const isLiked = comment.likes?.includes(currentUserID);

    return (
      <div className="comment-card">
        <div className="comment-user-avatar">
          <img
            src={defaultAvatars[comment.userID.gender] || defaultAvatars.Other}
            alt="User Avatar"
          />
        </div>
        <div className="comment-content">
          <div className="comment-header">
            <span className="comment-author">{comment.userID.username}</span>
            <div className="comment-actions">
              <button onClick={() => setShowReplyForm(!showReplyForm)}>
                <FaReply /> Reply
              </button>
              <button
                onClick={() =>
                  isLiked ? onUnlike(comment._id) : onLike(comment._id)
                }
                className={`like-button ${isLiked ? "liked" : ""}`}
              >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
                <span>{comment.likeCount}</span>
              </button>
            </div>
          </div>
          <p className="comment-text">{comment.text}</p>

          {showReplyForm && (
            <form onSubmit={handleReplySubmit} className="reply-form">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                required
              />
              <button type="submit">Reply</button>
            </form>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="replies-section">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply._id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  onUnlike={onUnlike}
                  currentUserID={currentUserID}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
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
              <Comment
                key={comment._id}
                comment={comment}
                onReply={handleReply}
                onLike={handleLike}
                onUnlike={handleUnlike}
                currentUserID={currentUserID} // Pass currentUserID as prop
              />
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
