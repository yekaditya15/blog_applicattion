import React, { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import TopicFilter from "./TopicFilter";
const Home = ({ isAuthenticated }) => {
  const [blogs, setBlogs] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(""); // For topic filtering
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/blog/readAllBlogs"
        );
        setBlogs(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlogs();

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Filter blogs based on the selected topic
  const filteredBlogs = selectedTopic
    ? blogs.filter((blog) => blog.topic === selectedTopic)
    : blogs;

  return (
    <div>
      <h2>Blog Posts</h2>
      {isAuthenticated && username && <h3>Welcome, {username}!</h3>}

      {/* Topic Filter Slider */}
      <TopicFilter
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
      />

      <div className="blogs-container">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        ) : (
          <p>No blogs found for this topic.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
