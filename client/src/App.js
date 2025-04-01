import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import BlogDetail from "./pages/BlogDetail";
import EditPost from "./pages/EditPost"; // Import the EditPost component
import Navbar from "./components/Navbar";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");
    if (token) {
      setIsAuthenticated(true);
      setUsername(storedUsername); // Set username if logged in
    }
  }, []);

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setUsername={setUsername}
              />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Register
                setIsAuthenticated={setIsAuthenticated}
                setUsername={setUsername}
              />
            )
          }
        />
        <Route
          path="/create"
          element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />}
        />
        <Route
          path="/blog/:id"
          element={<BlogDetail isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/editBlog/:id" // Add route for editing blog
          element={isAuthenticated ? <EditPost /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
