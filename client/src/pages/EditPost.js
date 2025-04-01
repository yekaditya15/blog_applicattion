import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [textBody, setTextBody] = useState("");
  const [topic, setTopic] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/blog/readBlog/${id}`
        );
        const blog = response.data;
        setTitle(blog.title);
        setTextBody(blog.textBody);
        setTopic(blog.topic);
        setImage(blog.image);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken"); // Get the auth token from localStorage
    if (!token) {
      return alert("You must be logged in to update this post.");
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/blog/editBlog/${id}`,
        { title, textBody, topic, image },
        { headers: { "x-auth-token": token } } // Send token in request headers
      );
      navigate(`/blog/${id}`); // Redirect to the updated blog page
    } catch (err) {
      console.error(err);
      alert("Failed to update the blog");
    }
  };

  return (
    <div>
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditPost;
