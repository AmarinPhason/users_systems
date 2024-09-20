import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://users-systems.onrender.com/api/v1/users/all-username-and-profile"
        );
        setUsers(response.data.data);
        setTotalUsers(response.data.count);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-screen-xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Users System</h1>
      <p className="text-lg mb-8">
        Manage your user accounts and settings efficiently with our system.
        Explore features and start managing your users now!
      </p>
      <h2 className="text-2xl font-semibold mb-8">Total Users: {totalUsers}</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {users.map((user) => (
          <div
            className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md p-4 max-w-xs w-full"
            key={user._id}
          >
            <img
              src={user.profilePicture.url || "https://via.placeholder.com/100"}
              alt={`${user.username}'s profile`}
              className="w-24 h-24 rounded-full mr-4"
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">{user.username}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
