import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const defaultImage =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop";

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  return (
    <div className="blog-card">
      <div className="blog-card-content">
        <div className="blog-card-left">
          <div className="blog-author">
            Written by {blog.userID?.username || "Anonymous"}
          </div>
          <h3 className="blog-title">
            {truncateText(blog.title.toUpperCase(), 50)}
          </h3>
          <div className="blog-footer">
            <span className="blog-date">
              {new Date(blog.creationDateTime).toLocaleDateString()}
            </span>
            <Link to={`/blog/${blog._id}`} className="read-more">
              Read More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
        <div className="blog-card-image">
          <img
            src={blog.image || defaultImage}
            alt={blog.title}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
