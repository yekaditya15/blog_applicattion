import React, { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import Spinner from "../components/Spinner";
import "../styles/Home.css";
import { BASE_URL } from "../utils/api";

const Home = ({ isAuthenticated }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Home");
  const [categories] = useState([
    "Home",
    "Politics",
    "Technology",
    "Sports",
    "Health",
    "Education",
    "Entertainment",
  ]);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/blog/readAllBlogs`);
        // Shuffle the blogs before setting them
        const shuffledBlogs = shuffleArray(response.data);
        setBlogs(shuffledBlogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <Spinner />;

  // Filter blogs based on the selected category
  const filteredBlogs =
    selectedCategory === "Home"
      ? blogs
      : blogs.filter((blog) => blog.topic === selectedCategory);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="home-container">
      <div className="category-nav">
        {categories.map((category) => (
          <div
            key={category}
            className={`category-link ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </div>
        ))}
      </div>

      <div className="blogs-container">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        ) : (
          <p>No blogs found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
