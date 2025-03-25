import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [textBody, setTextBody] = useState("");
  const [image, setImage] = useState("");
  const [topic, setTopic] = useState(""); // Added topic state

  const handleCreatePost = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    try {
      await axios.post(
        "http://localhost:5000/api/blog/createBlog",
        { title, textBody, topic, image }, // Sending topic along with other post details
        {
          headers: { "x-auth-token": token },
        }
      );
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleCreatePost}>
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

        {/* Topic dropdown */}
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
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreatePost;
