import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username"); // Clear username from localStorage
    setIsAuthenticated(false);
  };

  const username = localStorage.getItem("username"); // Get the username from localStorage

  return (
    <nav>
      <Link to="/">Home</Link>
      {isAuthenticated ? (
        <>
          <span>Welcome, {username}</span>
          <Link to="/create">Create Post</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
