import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiHomeModern } from "react-icons/hi2";
import { IoMdLogIn } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import {
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaStickyNote,
} from "react-icons/fa";
import axios from "axios";

const baseURL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://users-systems.onrender.com";

const Navbar = () => {
  const { isAuthenticated, logout, profilePicture, username } = useAuth();
  const navigate = useNavigate();
  const [usernameState, setUsername] = useState("");
  const [profilePictureUrl, setProfilePicture] = useState(
    "https://via.placeholder.com/150"
  );
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [isNoteDropdownOpen, setIsNoteDropdownOpen] = useState(false); // สถานะสำหรับ dropdown ของโน้ต

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            `${baseURL}/api/v1/users/my-profile`,
            {
              withCredentials: true,
            }
          );
          console.log(response.data);
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
    const auth = getAuth();
    await signOut(auth);
    // ล้างข้อมูลผู้ใช้ใน context และ localStorage ที่เกี่ยวข้อง
    logout(); // เรียกใช้ฟังก์ชัน logout ใน AuthContext
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl flex items-center">
          <Link to="/" className="flex items-center hover:text-gray-300">
            <HiHomeModern className="mr-2" />
            <h1>Users Systems</h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <div
              className="relative group"
              onMouseEnter={() => setIsAuthDropdownOpen(true)}
              onMouseLeave={() => setIsAuthDropdownOpen(false)}
            >
              <button className="text-white hover:bg-blue-900 hover:text-gray-100 px-4 py-2 rounded-md transition duration-300 flex items-center font-bold">
                <IoMdLogIn className="mr-2" />
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
                  <IoMdLogIn className="mr-2" />
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
              <div
                className="relative group"
                onMouseEnter={() => setIsNoteDropdownOpen(true)}
                onMouseLeave={() => setIsNoteDropdownOpen(false)}
              >
                <button className="flex items-center space-x-2 text-white hover:bg-blue-900 hover:text-gray-100 px-4 py-2 rounded-md transition duration-300">
                  <FaStickyNote className="mr-2" />
                  Note
                </button>
                <div
                  className={`absolute top-full right-0 mt-1 w-40 bg-white text-black shadow-lg rounded-md z-10 transition-opacity duration-300 ${
                    isNoteDropdownOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Link
                    to="/create-note"
                    className="block px-4 py-2 hover:bg-blue-100 flex items-center text-sm"
                    onClick={() => setIsNoteDropdownOpen(false)}
                  >
                    📝Create Note
                  </Link>
                  <Link
                    to="/all-my-notes"
                    className="block px-4 py-2 hover:bg-blue-100 flex items-center text-sm"
                    onClick={() => setIsNoteDropdownOpen(false)}
                  >
                    📒My Notes
                  </Link>
                </div>
              </div>

              <div
                className="relative group"
                onMouseEnter={() => setIsProfileDropdownOpen(true)}
                onMouseLeave={() => setIsProfileDropdownOpen(false)}
              >
                <button className="flex items-center space-x-2 text-white hover:bg-blue-900 hover:text-gray-100 px-4 py-2 rounded-md transition duration-300">
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
