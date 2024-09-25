import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/Sky.png";

const baseURL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://users-systems.onrender.com";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // เก็บหน้าปัจจุบัน
  const [totalPages, setTotalPages] = useState(1); // เก็บจำนวนหน้าทั้งหมด
  const limit = 5; // จำนวนผู้ใช้ที่จะแสดงต่อหน้า

  // ฟังก์ชันสำหรับดึงข้อมูลตามหน้าที่เลือก
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/api/v1/users/all-username-and-profile?page=${page}&limit=${limit}`
      );
      setUsers(response.data.data);
      setTotalUsers(response.data.count);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage); // ดึงข้อมูลตามหน้าปัจจุบันเมื่อโหลดหน้า
  }, [currentPage]);

  // ฟังก์ชันสำหรับการเปลี่ยนหน้า
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="py-8 max-w-screen-xl mx-auto text-center bg-cover bg-center min-h-screen"
      style={{
        backgroundImage:
          'url("https://your-image-url.com/your-background.jpg")', // เปลี่ยน URL ของรูปภาพตามต้องการ
      }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Users System</h1>
        <p className="text-lg mb-8">
          Manage your user accounts and settings efficiently with our system.
          Explore features and start managing your users now!
        </p>
        <h2 className="text-2xl font-semibold mb-8">
          Total Users: {totalUsers}
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {users.map((user) => (
            <div
              className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md p-4 max-w-xs w-full"
              key={user._id}
            >
              <img
                src={
                  user.profilePicture.url || "https://via.placeholder.com/100"
                }
                alt={`${user.username}'s profile`}
                className="w-24 h-24 rounded-full mr-4"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{user.username}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ปุ่ม Pagination */}
        <div className="flex justify-center mt-6">
          <button
            className="px-4 py-2 mx-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 mx-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
