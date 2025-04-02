import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UserProfile.css"; // Import the custom CSS for User Profile

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: { "x-auth-token": token },
          }
        );
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-info">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Gender:</strong> {user.gender}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
