import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Import custom styles

const Login = ({ setIsAuthenticated, setUsername }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("username", response.data.username); // Store the username
      setIsAuthenticated(true);
      setUsername(response.data.username); // Update state with the username
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        {/* Left side image background */}
        <div className="left-image-container">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/portfolio-c5c0a.appspot.com/o/Screenshot%202025-04-02%20113842.png?alt=media&token=b0732217-99e8-4fd4-85f6-be775c46351a"
            alt="Login Page"
            className="login-left-image"
          />
        </div>
      </div>

      <div className="login-right">
        <h2>Sign in to WriteHub</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <div className="signup-prompt">
          <span>Don't have an account?</span>
          <a href="/register">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
