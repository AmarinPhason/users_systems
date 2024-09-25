import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaImage, FaUser, FaTasks } from "react-icons/fa";

const baseURL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://users-systems.onrender.com";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [assignedTo, setAssignedTo] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [createdByUsername, setCreatedByUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // State สำหรับ loading
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/v1/users/user-image`, {
          withCredentials: true,
        });
        setUsers(response.data.data);
      } catch (error) {
        console.log(error);

        toast.error("Failed to fetch users");
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/v1/users/my-profile`, {
          withCredentials: true,
        });
        setCreatedByUsername(response.data.data.username);
        setCurrentUserId(response.data.data._id);
        setAssignedTo(response.data.data._id);
      } catch (error) {
        toast.error("Failed to fetch user profile");
      }
    };

    fetchUsers();
    fetchCurrentUser();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !assignedTo) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("assignedTo", assignedTo);
    formData.append("status", status);
    formData.append("priority", priority);
    formData.append("dueDate", dueDate);
    formData.append("createdBy", createdByUsername);
    formData.append("image", image);

    setLoading(true); // ตั้งค่า loading เป็น true ก่อนเริ่มส่งข้อมูล

    try {
      const response = await axios.post(
        `${baseURL}/api/v1/tasks/create`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Task created successfully!");

      // Clear form after successful submission
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setStatus("pending");
      setPriority("medium");
      setDueDate("");
      setImage(null);

      console.log("Created Task Data:", response.data.data);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create task");
      }
    } finally {
      setLoading(false); // ตั้งค่า loading เป็น false หลังจากส่งข้อมูลเสร็จ
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaTasks className="mr-2" />
        Create Task
      </h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            placeholder="Enter task title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            placeholder="Enter task description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Assigned To <FaUser className="inline ml-2" />
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            >
              {assignedTo
                ? users.find((user) => user._id === assignedTo)?.username ||
                  createdByUsername
                : "Select user"}
            </button>
            {dropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto">
                <li
                  onClick={() => {
                    setAssignedTo(currentUserId);
                    setDropdownOpen(false);
                  }}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={
                      users.find((user) => user._id === currentUserId)
                        ?.profilePicture?.url ||
                      "https://via.placeholder.com/100"
                    }
                    alt="Your profile"
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span>{createdByUsername}</span>
                </li>
                {users.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => {
                      setAssignedTo(user._id);
                      setDropdownOpen(false);
                    }}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={
                        user.profilePicture?.url ||
                        "https://via.placeholder.com/100"
                      }
                      alt={`${user.username}'s profile`}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span>{user.username}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Created By
          </label>
          <p className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
            {createdByUsername}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Image <FaImage className="inline ml-2" />
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading} // ปิดปุ่มเมื่อกำลังโหลด
        >
          {loading ? "Creating..." : "Create Task"}{" "}
          {/* แสดงข้อความที่เหมาะสม */}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
