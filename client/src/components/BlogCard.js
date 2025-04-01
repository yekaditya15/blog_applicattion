import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card">
      <h3>{blog.title}</h3>
      <p>{blog.textBody.slice(0, 100)}...</p>
      <Link to={`/blog/${blog._id}`}>Read More</Link>
    </div>
  );
};

export default BlogCard;
