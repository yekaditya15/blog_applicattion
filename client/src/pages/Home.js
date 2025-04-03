import React, { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import Spinner from "../components/Spinner";
import "../styles/Home.css";

const Home = ({ isAuthenticated }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Home"); // For topic filtering
  const [categories] = useState([
    "Home",
    "Politics",
    "Technology",
    "Sports",
    "Health",
    "Education",
    "Entertainment",
  ]); // Categories for filtering

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://blog-applicattionserver.vercel.app/api/blog/readAllBlogs"
        );
        setBlogs(response.data);
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
      ? blogs // Show all blogs if Home is selected
      : blogs.filter((blog) => blog.topic === selectedCategory);

  // Function to change category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="home-container">
      {/* Category Navigation */}
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

      {/* Blogs Display */}
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
