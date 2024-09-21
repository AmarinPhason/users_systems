import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const baseURL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://users-systems.onrender.com";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    try {
      const response = await axios.post(
        `${baseURL}/api/v1/users/forgot-password`,
        { email }
      );
      toast.success(response.data.message); // Show success toast

      // Show a message instructing the user to check their email
      toast.info("Check your email for a password reset link.");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message); // Show error toast
      } else {
        toast.error("Something went wrong"); // General error message
      }
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Sending..." : "Send Password Reset Link"}
        </button>
      </form>
    </div>
  );
}
