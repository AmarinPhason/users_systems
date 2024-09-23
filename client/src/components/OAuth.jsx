import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
const baseURL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://users-systems.onrender.com";

export default function OAuth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);

      // Extract user information
      const user = result.user;
      const userData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };

      // Send the user data to your backend server
      const response = await fetch(`${baseURL}/api/v1/users/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important if you're setting cookies in the response
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate with the server");
      }

      const data = await response.json();
      await login(data.user);
      // Optionally, show a success message
      toast.success("Login successful!");

      // Navigate to the home page after successful login
      navigate("/");
    } catch (error) {
      console.error(
        "Error signing in with Google or communicating with the server:",
        error
      );

      // Optionally, show an error message
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full bg-red-700 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-red-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-red-900"
    >
      Continue with Google
    </button>
  );
}
