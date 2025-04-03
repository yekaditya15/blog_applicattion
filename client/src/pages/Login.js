import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/slices/authSlice";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="left-image-container">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/portfolio-c5c0a.appspot.com/o/Screenshot%202025-04-02%20113842.png?alt=media&token=b0732217-99e8-4fd4-85f6-be775c46351a"
            alt="Login Page"
            className="login-left-image"
          />
        </div>
      </div>

      <div className="login-right">
        <h2>Welcome Back!</h2>
        <p className="login-subtitle">Please enter your details to sign in</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
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
