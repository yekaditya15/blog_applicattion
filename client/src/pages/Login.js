import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  clearError,
  initiateGoogleLogin,
} from "../redux/slices/authSlice";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPen,
  FaUsers,
  FaComments,
  FaHeart,
  FaGoogle,
} from "react-icons/fa";
import "../styles/Login.css";
import { showToast } from "../utils/toast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap();
      showToast.success("Login successful!");
      navigate("/");
    } catch (error) {
      showToast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="brand-section">
          <h1>WriteHub</h1>
          <p>Your space to connect, create, and inspire</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <FaPen className="feature-icon" />
            <h3>Create</h3>
            <p>Share your stories and ideas with the world</p>
          </div>
          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h3>Connect</h3>
            <p>Join a community of passionate writers</p>
          </div>
          <div className="feature-card">
            <FaComments className="feature-icon" />
            <h3>Engage</h3>
            <p>Participate in meaningful discussions</p>
          </div>
          <div className="feature-card">
            <FaHeart className="feature-icon" />
            <h3>Inspire</h3>
            <p>Touch lives through your words</p>
          </div>
        </div>

        <div className="testimonial">
          <p>
            "WriteHub has transformed how I share my thoughts with the world."
          </p>
          <span>- Featured Writer</span>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">
            Sign in to continue your writing journey
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className="input-field"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle-btn"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="or-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="google-login-btn"
            onClick={initiateGoogleLogin}
            disabled={loading}
          >
            <FaGoogle className="google-icon" />
            Sign in with Google
          </button>

          <div className="signup-prompt">
            <span>New to WriteHub?</span>
            <Link to="/register" className="signup-link">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
