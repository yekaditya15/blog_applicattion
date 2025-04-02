import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa"; // Import home icon
import { FaCaretDown } from "react-icons/fa"; // Import down arrow icon
import "../styles/Navbar.css"; // Make sure you include the correct styles

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility

  /*************  ✨ Codeium Command ⭐  *************/
  /******  48eb3b76-7de6-4275-bc51-1232cdd6d0fc  *******/ const handleLogout =
    () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username"); // Clear username from localStorage
      setIsAuthenticated(false);
      setIsDropdownOpen(false); // Close the dropdown after logout
    };

  const username = localStorage.getItem("username"); // Get the username from localStorage

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Home icon acting as Home link */}
        <Link to="/" className="navbar-logo">
          <FaHome size={24} color="#333" /> {/* Home Icon */}
          <span className="brand-name">WriteHub</span> {/* Branding name */}
        </Link>
      </div>

      {/* Right side - Authentication Links */}
      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            {/* Create Blog button, placed to the right but left of the username */}
            <Link to="/create" className="create-post-link">
              Create Blog
            </Link>
            {/* Username in capital letters, on the far right with dropdown arrow */}
            <div className="user-menu">
              <span className="username" onClick={toggleDropdown}>
                {username.toUpperCase()} {/* Display username in uppercase */}
                <FaCaretDown size={12} /> {/* Down arrow icon */}
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
