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
  const [existingDueDate, setExistingDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    assignedTo: "",
    dueDate: "",
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [fullImage, setFullImage] = useState(null); // State for full image
  const [isUploadingImage, setIsUploadingImage] = useState(false); // State for uploading image
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
        toast.error("Error fetching tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [loadingImage]); // รีโหลดหน้าหลังการอัปโหลดรูปภาพเสร็จสิ้น

  // Handle input changes
  const handleChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({
      ...formData,
      [e.target.name]: file ? file : e.target.value,
    });
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // สร้างตัวอย่างรูปใหม่
    }
  };

  // Handle task update
  const handleUpdateTask = async (taskId) => {
    setUpdating(true);
    setLoadingImage(true);
    const updateURL = `${baseURL}/api/v1/tasks/update/${taskId}`;
    const data = new FormData();
    const dueDateValue = formData.dueDate === "null" ? null : formData.dueDate;

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("dueDate", formData.dueDate || existingDueDate);
    data.append("priority", formData.priority);
    data.append("status", formData.status);
    data.append("assignedTo", formData.assignedTo);
    if (formData.image) data.append("image", formData.image);

    try {
      // ตั้งค่าสถานะการอัพโหลดเป็น true
      setIsUploadingImage(true); // สถานะสำหรับอัพโหลดภาพ

      const response = await axios.put(updateURL, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // รีเฟรชข้อมูลหรืออัพเดต UI ที่นี่หลังจากอัพโหลดเสร็จ
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, ...response.data.data } : task
        )
      );

      toast.success("Task updated successfully");
    } catch (error) {
      console.log(error);

      toast.error("Error updating task");
    } finally {
      setUpdating(false);
      setLoadingImage(false);
      setIsUploadingImage(false); // รีเซ็ตสถานะการอัพโหลดภาพ
    }
  };

  const handleEditClick = (task) => {
    setExistingDueDate(task.dueDate);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo._id,
      image: null,
    });
    setImagePreview(task.image.url); // ตั้งค่าตัวอย่างรูปจากเซิร์ฟเวอร์
    setEditingTaskId(task._id);
    setIsEditing(true);
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
    setImagePreview(null); // รีเซ็ตตัวอย่างรูป
    setIsEditing(false);
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
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault(); // ป้องกันการรีเฟรชหน้า
            handleUpdateTask(editingTaskId); // เรียกใช้ฟังก์ชันเพื่ออัพเดตงาน
          }}
          className="bg-gray-100 p-4 rounded shadow-md mb-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Edit Task</h2>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-black rounded px-4 py-2 hover:bg-gray-400 transition duration-200"
            >
              ❌
            </button>
          </div>

          {/* Title Field */}
          <label className="block mb-1">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full mb-4"
            placeholder="Task Title"
          />

          {/* Description Field */}
          <label className="block mb-1">Task Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full mb-4"
            placeholder="Task Description"
          />

          {/* Priority Field */}
          <label className="block mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full mb-4"
          >
            <option value="" disabled>
              Select Priority
            </option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Status Field */}
          <label className="block mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full mb-4"
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Assigned To Field */}
          <label className="block mb-1">Assign To</label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full mb-4"
          >
            <option value="" disabled>
              Select User
            </option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>

          {/* Due Date Field */}
          <label className="block mb-1">Due Date</label>
          <input
            type="date"
            required
            name="dueDate"
            value={formData.dueDate || ""} // ถ้าไม่มีค่า จะใช้ empty string เป็นค่าเริ่มต้น
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full mb-4"
          />

          {/* Image Upload Field */}
          <label className="block mb-1">Upload Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full mb-4"
          />

          {/* Submit and Cancel Buttons */}
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-200"
          >
            Update Task
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="ml-2 bg-gray-300 text-black rounded px-4 py-2 hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
        </form>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded shadow-md mb-4">
            {/* แสดงข้อมูลของ task */}
          </div>
        ))
      )}

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
              className="max-w-full max-h-full object-contain" // ปรับให้ใหญ่ขึ้น
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
