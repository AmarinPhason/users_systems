import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const baseURL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://users-systems.onrender.com";

const AllMyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/v1/notes/my-notes`, {
          withCredentials: true,
        });
        setNotes(response.data.data);
      } catch (error) {
        setError("Failed to fetch notes");
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const updateNote = async (id, title, content, isCompleted) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/v1/notes/note/${id}`,
        { title, content, isCompleted },
        { withCredentials: true }
      );
      const updatedNote = { ...response.data.data, updatedAt: new Date() };
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? updatedNote : note))
      );
      setEditingNote(null);
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) return;

    try {
      const response = await axios.delete(
        `${baseURL}/api/v1/notes/note/${id}`,
        { withCredentials: true }
      );
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEditClick = (note) => {
    setEditingNote(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const isCompleted =
      document.getElementById(`select-${editingNote}`).value === "completed";
    updateNote(editingNote, title, content, isCompleted);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">📒My Notes</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {notes.map((note) => (
          <li
            key={note._id}
            className="border p-4 rounded shadow w-full bg-gray-100"
          >
            {editingNote === note._id ? (
              <form
                onSubmit={handleUpdateSubmit}
                className="flex flex-col w-full h-full bg-white p-4 rounded"
              >
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="border rounded p-2 mb-2 h-12 w-full"
                  required
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Content"
                  className="border rounded p-2 mb-2 w-full h-64 overflow-y-auto resize-none"
                  required
                />
                <select
                  id={`select-${note._id}`}
                  defaultValue={
                    note.isCompleted ? "completed" : "not-completed"
                  }
                  className="border rounded p-2 mb-2 w-full"
                >
                  <option value="not-completed">Not Completed</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded p-2"
                >
                  Update Note
                </button>
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="bg-gray-300 text-black rounded p-2 mt-2"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{note.title}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(note)}
                      className="bg-yellow-500 text-white rounded p-1"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="bg-red-500 text-white rounded p-1"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <hr className="my-4 border-t border-gray-400" />
                <p className="mt-2 text-left whitespace-pre-wrap">
                  {note.content}
                </p>
                <p
                  className={`${
                    note.isCompleted ? "text-green-500" : "text-red-500"
                  } mt-2`}
                >
                  Note Status:{" "}
                  {note.isCompleted ? " ☑️Completed" : "❌Not Completed"}
                </p>
                <div className="flex justify-between text-gray-500 mt-2">
                  <p>Created by: {note.user.username}</p>
                  <p>Created at: {new Date(note.createdAt).toLocaleString()}</p>
                </div>
                {note.updatedAt && (
                  <p className="text-gray-500">
                    Updated at: {new Date(note.updatedAt).toLocaleString()}
                  </p>
                )}
                <hr className="my-4 border-t border-gray-400" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllMyNotes;
