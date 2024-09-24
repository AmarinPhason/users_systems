import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseURL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://users-systems.onrender.com";

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State สำหรับภาพที่ถูกเลือก

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/v1/tasks/assigned-tasks`,
          { withCredentials: true }
        );
        setTasks(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // ตั้งค่าภาพที่ถูกเลือก
  };

  const closeModal = () => {
    setSelectedImage(null); // ปิด modal
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="border p-4 rounded-lg shadow-md bg-white transition-transform transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <p className="mt-2">
                <strong>Assigned To:</strong> {task.assignedTo.username}
              </p>
              <p className="mt-2">
                <strong>Status:</strong> {task.status}
              </p>
              <p className="mt-2">
                <strong>Due Date:</strong>{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="mt-2">
                <strong>Priority:</strong> {task.priority}
              </p>
              <p className="mt-2">
                <strong>Created By:</strong> {task.createdBy.username}
              </p>
              {task.image && (
                <img
                  src={task.image.url}
                  alt={task.title}
                  className="mt-2 w-full h-40 object-cover rounded-md cursor-pointer"
                  onClick={() => handleImageClick(task.image.url)} // คลิกเพื่อดูภาพ
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {selectedImage && ( // แสดง modal เมื่อมีภาพที่ถูกเลือก
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal} // คลิกพื้นที่ว่างเพื่อปิด modal
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-[650px] object-cover" // กำหนดขนาดที่ 600x900
            />
            <button
              onClick={closeModal} // ปิด modal
              className="absolute top-2 right-2 bg-red-500 text-white rounded p-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedTasks;
