import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa"; // Home icon import
import { FaCaretDown } from "react-icons/fa"; // Dropdown icon import
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice"; // Logout action import
import "../styles/Navbar.css"; // Make sure the correct CSS is imported

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, username } = useSelector((state) => state.auth); // Fetch authentication and username from Redux
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility

  // Logout function
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    setIsDropdownOpen(false); // Close dropdown after logout
  };

  // Toggle dropdown menu visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Home link with Home icon */}
        <Link to="/" className="navbar-logo">
          <FaHome size={24} color="#333" />
          <span className="brand-name">WriteHub</span>
        </Link>
      </div>

      <div className="navbar-right">
        {/* Display links if the user is authenticated */}
        {isAuthenticated ? (
          <>
            {/* Link to create blog */}
            <Link to="/create" className="create-post-link">
              Create Post
            </Link>
            {/* Username with dropdown */}
            <div className="user-menu">
              <span className="username" onClick={toggleDropdown}>
                {username} <FaCaretDown size={12} />
              </span>
              {isDropdownOpen && (
                <div className="dropdown">
                  <Link to="/profile" className="dropdown-item">
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
          // Display login and register links if not authenticated
          <div className="auth-links">
            <Link to="/login" className="login-button">
              Log in
            </Link>
            <Link to="/register" className="signup-button">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
