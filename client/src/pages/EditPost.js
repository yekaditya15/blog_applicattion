import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateBlog } from "../redux/slices/blogSlice";
import axios from "axios";
import "../styles/CreatePost.css"; // Reusing CreatePost styles

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
        const response = await axios.get(
          `https://blog-applicattionserver.vercel.app/api/blog/readBlog/${id}`
        );
        // Access the blog data correctly from the response
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        updateBlog({
          blogId: id,
          title,
          textBody,
          topic,
          image,
        })
      ).unwrap();
      navigate(`/blog/${id}`);
    } catch (err) {
      setError("Failed to update blog");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="create-post-container">
      <h2>Edit Blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />

        <textarea
          value={textBody}
          onChange={(e) => setTextBody(e.target.value)}
          placeholder="Content"
          required
        />

        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        >
          <option value="">Select Topic</option>
          <option value="Politics">Politics</option>
          <option value="Technology">Technology</option>
          <option value="Sports">Sports</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Entertainment">Entertainment</option>
        </select>

        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL"
        />

        <button type="submit">Update Blog</button>
      </form>
    </div>
  );
};

export default EditPost;
