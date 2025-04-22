import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/UserProfile.css";
import BlogCard from "../components/BlogCard";
import Spinner from "../components/Spinner";
import { showToast } from "../utils/toast";
import { BASE_URL } from "../utils/api";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultAvatars = {
    Male: "https://firebasestorage.googleapis.com/v0/b/portfolio-c5c0a.appspot.com/o/male.jpg?alt=media&token=a497fca7-8a82-47fd-ab59-71fbbd99df96",
    Female:
      "https://firebasestorage.googleapis.com/v0/b/portfolio-c5c0a.appspot.com/o/female.jpg?alt=media&token=db327b94-dc57-4e2f-b785-bde33a4764ce",
    Other:
      "https://firebasestorage.googleapis.com/v0/b/portfolio-c5c0a.appspot.com/o/other.jpg?alt=media&token=4a5d916a-14c5-4fbe-b417-4dd6cfa524e2",
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const userResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
          headers: { "x-auth-token": token },
        });
        setUser(userResponse.data);

        const blogsResponse = await axios.get(
          `${BASE_URL}/api/blog/readAllBlogs`
        );
        const userBlogs = blogsResponse.data.filter(
          (blog) => blog.userID._id === userResponse.data._id
        );
        setUserBlogs(userBlogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <Spinner />;
  if (!user) return <div className="error">User not found</div>;

  return (
    <div className="profile-page-container">
      {/* Left Section - User Profile */}
      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-container">
              <img
                src={defaultAvatars[user.gender]}
                alt="Profile Avatar"
                className="profile-avatar"
              />
            </div>
            <h2>{user.name.toUpperCase()}</h2>
          </div>

          <div className="profile-info">
            <div className="info-item">
              <i className="fas fa-envelope"></i>
              <div>
                <label>Email</label>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="info-item">
              <i className="fas fa-venus-mars"></i>
              <div>
                <label>Gender</label>
                <p>{user.gender}</p>
              </div>
            </div>

            {user.topics && user.topics.length > 0 && (
              <div className="info-item">
                <i className="fas fa-tags"></i>
                <div>
                  <label>Interests</label>
                  <div className="topics-container">
                    {user.topics.map((topic, index) => (
                      <span key={index} className="topic-tag">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Section - User Blogs */}
      <div className="blogs-section">
        <div className="blogs-header">
          <h3>
            <i className="fas fa-pencil-alt"></i> My Blogs
          </h3>
          <Link to="/create" className="create-blog-btn">
            Create New Blog
          </Link>
        </div>

        {userBlogs.length === 0 ? (
          <div className="no-blogs">
            <div className="no-blogs-content">
              <i className="fas fa-pencil-alt"></i>
              <p>You haven't written any blogs yet.</p>
              <Link to="/create" className="create-first-blog-btn">
                Create Your First Blog
              </Link>
            </div>
          </div>
        ) : (
          <div className="blogs-grid">
            {userBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={{
                  ...blog,
                  title: blog.title.toUpperCase(), // Remove the title truncation
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
