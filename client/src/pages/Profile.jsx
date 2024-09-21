import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const baseURL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://users-systems.onrender.com";
const Profile = () => {
  const { updateProfilePicture, updateUsername, logout } = useAuth(); // Added logout function from context
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const [profile, setProfile] = useState({
    profilePicture: { url: "" },
    username: "",
    email: "",
  });

  const [formData, setFormData] = useState({
    image: null,
    username: "",
    oldPassword: "",
    newPassword: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // To navigate after account deletion

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/v1/users/my-profile`, {
          withCredentials: true,
        });
        setProfile(response.data.data);
        setFormData((prevData) => ({
          ...prevData,
          username: response.data.data.username,
        }));
        setIsLoading(false);
      } catch (error) {
        console.log(error);

        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Something went wrong!";
        toast.error(errorMessage);
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prevData) => ({ ...prevData, image: file }));

      const imageUrl = URL.createObjectURL(file);
      setTempImageUrl(imageUrl);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { image, username, oldPassword, newPassword } = formData;

    const updateData = new FormData();
    if (image) updateData.append("image", image);
    if (username) updateData.append("username", username);
    if (oldPassword) updateData.append("oldPassword", oldPassword);
    if (newPassword) updateData.append("newPassword", newPassword);

    try {
      const response = await axios.put(
        `${baseURL}/api/v1/users/update-profile`,
        updateData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.data.profilePicture.url) {
        updateProfilePicture(response.data.data.profilePicture.url);
      }
      if (response.data.data.username) {
        updateUsername(response.data.data.username); // Update username in context
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log(error);

      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        await axios.delete(`${baseURL}/api/v1/users/delete-account`, {
          withCredentials: true,
        });

        // Clear authentication context or state
        logout();

        // Redirect to home page
        toast.success("Account deleted successfully!");
        navigate("/");
      } catch (error) {
        console.log(error);

        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Something went wrong!";
        toast.error(errorMessage);
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <div className="mb-4 text-center">
          <img
            src={tempImageUrl || profile.profilePicture.url}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 cursor-pointer"
            onClick={handleImageClick}
          />
          <input
            type="file"
            name="image"
            ref={fileInputRef}
            onChange={handleInputChange}
            className="hidden"
            accept="image/jpeg, image/png, image/jpg, image/gif, image/webp, image/svg+xml" // เพิ่มตรงนี้
          />
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 transition duration-200"
              />
            </div>
            <div className="relative">
              <label className="block text-gray-700">Email</label>
              <input
                type="text"
                name="email"
                value={profile.email}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 transition duration-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 transition duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 text-white ${
              isSubmitting ? "bg-gray-500" : "bg-blue-600"
            } rounded-md transition duration-200`}
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </button>
        </form>
        <button
          onClick={handleDeleteAccount}
          className="mt-6 w-full px-4 py-2 text-white bg-red-600 rounded-md transition duration-200"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
