import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"; // Make sure to add this CSS

const Register = ({ setIsAuthenticated, setUsername }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, username, password, gender }
      );
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("username", response.data.username); // Store the username
      setIsAuthenticated(true);
      setUsername(response.data.username); // Update state with the username
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="left-image-container">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/portfolio-c5c0a.appspot.com/o/4957136.jpg?alt=media&token=5319a184-fefa-4b8b-b569-5d98051af6c5"
            alt="Register Page"
            className="register-left-image"
          />
        </div>
      </div>

      <div className="register-right">
        <h2>Create your account</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
        <div className="login-prompt">
          <span>Already have an account?</span>
          <a href="/login">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
