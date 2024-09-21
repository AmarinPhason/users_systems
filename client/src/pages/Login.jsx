import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
const baseURL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://users-systems.onrender.com";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${baseURL}/api/v1/users/login/`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      login(response.data.data);
      toast.success(response.data.message);
      navigate("/"); // Navigate to Home after successful login
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
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
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <div className="bg-gray-100 p-4 rounded-md shadow-md">
          <p className="text-sm mb-2">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 transition-all duration-300"
            >
              Register here
            </Link>
          </p>
          <p className="text-sm">
            Forgot your password?{" "}
            <Link
              to="/forgot-password"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 transition-all duration-300"
            >
              Reset it here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
