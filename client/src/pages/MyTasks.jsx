import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
const baseURL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://users-systems.onrender.com";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    assignedTo: "",
    image: null,
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [fullImage, setFullImage] = useState(null); // State for full image

  // Fetch users for assignedTo dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/v1/users/username`, {
          withCredentials: true,
        });
        setUsers(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/api/v1/tasks/my-tasks`, {
          withCredentials: true,
        });
        setTasks(response.data.data);
      } catch (error) {
        toast.error(
          "Error fetching tasks: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files ? e.target.files[0] : e.target.value,
    });
  };

  // Handle task update
  const handleUpdateTask = async (taskId) => {
    setUpdating(true);
    const updateURL = `${baseURL}/api/v1/tasks/update/${taskId}`;
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("priority", formData.priority);
    data.append("status", formData.status);
    data.append("assignedTo", formData.assignedTo);
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await axios.put(updateURL, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Task updated successfully");
      // Fetch tasks again after update
      const updatedTasks = await axios.get(`${baseURL}/api/v1/tasks/my-tasks`, {
        withCredentials: true,
      });
      setTasks(updatedTasks.data.data);
      setEditingTaskId(null);
      setFormData({
        title: "",
        description: "",
        priority: "",
        status: "",
        assignedTo: "",
        image: null,
      });
    } catch (error) {
      toast.error(
        "Error updating task: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleEditClick = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo._id,
      image: null,
    });
    setEditingTaskId(task._id);
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      priority: "",
      status: "",
      assignedTo: "",
      image: null,
    });
  };

  // Function to open full image
  const openFullImage = (imageUrl) => {
    setFullImage(imageUrl);
  };

  // Function to close full image
  const closeFullImage = () => {
    setFullImage(null);
  };
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return; // Exit if the user does not confirm

    try {
      await axios.delete(`${baseURL}/api/v1/tasks/delete/${taskId}`, {
        withCredentials: true,
      });
      toast.success("Task deleted successfully");
      // Fetch tasks again after delete
      const updatedTasks = await axios.get(`${baseURL}/api/v1/tasks/my-tasks`, {
        withCredentials: true,
      });
      setTasks(updatedTasks.data.data);
    } catch (error) {
      toast.error(
        "Error deleting task: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded shadow-md">
              <h2 className="text-xl font-semibold mt-2">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-sm">Assigned to: {task.assignedTo.username}</p>
              <p className="text-sm">Status: {task.status}</p>
              <p className="text-sm">
                Due Date: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm">Priority: {task.priority}</p>

              {/* Moved image to the bottom */}
              <img
                src={task.image.url || "https://via.placeholder.com/150"}
                alt={task.title}
                className="w-full h-32 object-cover rounded cursor-pointer mt-4"
                onClick={() => openFullImage(task.image.url)}
              />

              <div className="mt-4 flex justify-between items-center">
                {/* ปุ่มแก้ไข */}
                <button
                  onClick={() => handleEditClick(task)}
                  className="text-blue-500"
                >
                  <AiFillEdit size={20} /> {/* ไอคอนแก้ไข */}
                </button>

                {/* ปุ่มลบ */}
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-500"
                >
                  <FaTrash size={20} /> {/* ไอคอนลบ */}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </div>

      {/* Full Image Modal */}
      {fullImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeFullImage}
        >
          <div className="relative">
            <img
              src={fullImage}
              alt="Full View"
              className="max-w-sm max-h-full object-contain"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
            />
            <button
              className="absolute top-2 right-2 bg-white text-black rounded px-2 py-1"
              onClick={closeFullImage}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
