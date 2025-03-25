import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/blog/readBlog/${id}`
        );
        setBlog(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.textBody}</p>
      <p>
        <strong>Sentiment:</strong> {blog.sentiment}
      </p>
      {/* Display comments here */}
    </div>
  );
};

export default BlogDetail;
