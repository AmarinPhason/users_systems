import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
  const { isAuthenticated, logout, profilePicture, username } = useAuth();
  const navigate = useNavigate();
  const [usernameState, setUsername] = useState("");
  const [profilePictureUrl, setProfilePicture] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/v1/users/my-profile",
            {
              withCredentials: true,
            }
          );
          setProfilePicture(response.data.data.profilePicture.url);
          setUsername(response.data.data.username);
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      };

      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl flex items-center">
          <Link to="/" className="flex items-center">
            <FaHome className="mr-2" />
            MyWebsite
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <div
              className="relative group"
              onMouseEnter={() => setIsAuthDropdownOpen(true)}
              onMouseLeave={() => setIsAuthDropdownOpen(false)}
            >
              <button className="text-white hover:bg-blue-700 px-4 py-2 rounded-md transition duration-300 flex items-center">
                <FaSignInAlt className="mr-2" />
                Login
              </button>

              <div
                className={`absolute top-full right-0 mt-1 w-40 bg-white text-black shadow-lg rounded-md z-10 transition-opacity duration-300 ${
                  isAuthDropdownOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-blue-100 flex items-center text-sm"
                  onClick={() => setIsAuthDropdownOpen(false)}
                >
                  <FaSignInAlt className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 hover:bg-blue-100 flex items-center text-sm"
                  onClick={() => setIsAuthDropdownOpen(false)}
                >
                  <FaUserPlus className="mr-2" />
                  Register
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Profile Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsProfileDropdownOpen(true)}
                onMouseLeave={() => setIsProfileDropdownOpen(false)}
              >
                <button className="flex items-center space-x-2 text-white hover:bg-blue-700 px-4 py-2 rounded-md transition duration-300">
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{username}</span>
                </button>

                <div
                  className={`absolute top-full right-0 mt-1 w-40 bg-white text-black shadow-lg rounded-md z-10 transition-opacity duration-300 ${
                    isProfileDropdownOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-blue-100 flex items-center text-sm"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <FaUser className="mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-blue-100 flex items-center text-sm"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
