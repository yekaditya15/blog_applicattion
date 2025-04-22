import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import BlogDetail from "./pages/BlogDetail";
import EditPost from "./pages/EditPost";
import UserProfile from "./components/UserProfile";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/create"
          element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />}
        />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route
          path="/editBlog/:id"
          element={isAuthenticated ? <EditPost /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />}
        />
        <Route path="/google-auth-callback" element={<GoogleAuthCallback />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
};

export default App;
