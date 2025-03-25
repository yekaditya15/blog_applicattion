import React, { useState, useEffect } from "react";
import axios from "axios";

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

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Gender: {user.gender}</p>
      <p>Topics: {user.topics.join(", ")}</p>
    </div>
  );
};

export default UserProfile;
