import React, { useState } from "react";
import { toast } from "react-toastify"; // Import toast
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa"; // Import icons

const baseURL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://users-systems.onrender.com";

const CreateNote = () => {
  // State for title, content, loading, and error
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(""); // State for error

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear previous error

    try {
      const response = await axios.post(
        `${baseURL}/api/v1/notes/create`,
        {
          title,
          content,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Note created successfully!");

      // Reset form fields after submission
      setTitle("");
      setContent("");
    } catch (error) {
      // If there's an error from the server
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create note. Please try again.";
      setError(errorMessage);

      toast.error(errorMessage);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">✍️Create New Note</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
            disabled={loading} // Disable input when loading
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
            required
            disabled={loading} // Disable input when loading
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            "Creating Note..."
          ) : (
            <>
              <FaCheckCircle className="inline mr-2" />
              Create Note
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateNote;
