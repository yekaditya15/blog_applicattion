import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaCaretDown,
  FaBars,
  FaTimes,
  FaHandHoldingHeart,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import "../styles/Navbar.css";
import { showToast } from "../utils/toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, username } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    showToast.success("Logged out successfully");
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleDonate = () => {
    window.open("https://razorpay.me/@dy1487", "_blank");
    showToast.success("Thank you for your support!");
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <FaHome size={24} color="#333" />
          <span className="brand-name">WriteHub</span>
        </Link>
      </div>

      <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={`navbar-right ${isMobileMenuOpen ? "show" : ""}`}>
        <button className="donate-button" onClick={handleDonate}>
          <FaHandHoldingHeart className="donate-icon" /> Donate
        </button>

        {isAuthenticated ? (
          <>
            <Link
              to="/create"
              className="create-post-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create Post
            </Link>
            <div className="user-menu">
              <span className="username" onClick={toggleDropdown}>
                {username} <FaCaretDown size={12} />
              </span>
              {isDropdownOpen && (
                <div className="dropdown">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="auth-links">
            <Link
              to="/login"
              className="login-button"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="signup-button"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
