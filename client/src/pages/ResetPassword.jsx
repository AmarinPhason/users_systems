import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate and useParams

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams(); // Get token from URL parameters
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    // Optionally, validate token or show a message if the token is invalid or expired
    if (!token) {
      toast.error("Invalid or missing token");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://users-systems-server.onrender.com/api/v1/users/reset-password/${token}`,
        {
          newPassword,
        }
      );

      toast.success(response.data.message); // Show success toast
      navigate("/login"); // Navigate to login page after successful password reset
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message); // Show error toast
      } else {
        toast.error("Something went wrong"); // General error message
      }
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="newPassword"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
