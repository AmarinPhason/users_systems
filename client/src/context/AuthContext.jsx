import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    JSON.parse(localStorage.getItem("isAuthenticated")) || false
  );
  const [profilePicture, setProfilePicture] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Update localStorage whenever the authentication state changes
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            "https://users-systems-server.onrender.com/api/v1/users/my-profile",
            {
              withCredentials: true,
            }
          );
          setProfilePicture(response.data.data.profilePicture.url);
          setUsername(response.data.data.username); // Set username from the response
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      };

      fetchProfile();
    }
  }, [isAuthenticated]);

  const login = (userData) => {
    setIsAuthenticated(true);
    if (userData) {
      setProfilePicture(userData.profilePicture);
      setUsername(userData.username);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "https://users-systems-server.onrender.com/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setProfilePicture(""); // Clear the profile picture on logout
      setUsername(""); // Clear the username on logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const updateProfilePicture = (url) => {
    setProfilePicture(url);
  };

  const updateUsername = (name) => {
    setUsername(name);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        profilePicture,
        username,
        login,
        logout,
        updateProfilePicture,
        updateUsername, // Provide updateUsername method
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
