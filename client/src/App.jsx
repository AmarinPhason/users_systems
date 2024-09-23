// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styling
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import CreateNote from "./pages/CreateNote";
import AllMyNotes from "./pages/AllMyNotes";
import CreateTask from "./pages/CreateTask";
import AssignedTasks from "./pages/AssignedTasks";
import MyTasks from "./pages/MyTasks";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <ToastContainer /> {/* Add ToastContainer here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/profile"
            element={<PrivateRoute element={<Profile />} />}
          />
          <Route
            path="/create-note"
            element={<PrivateRoute element={<CreateNote />} />}
          />
          <Route
            path="/all-my-notes"
            element={<PrivateRoute element={<AllMyNotes />} />}
          />
          <Route
            path="/create-task"
            element={<PrivateRoute element={<CreateTask />} />}
          />
          <Route
            path="/assigned-tasks"
            element={<PrivateRoute element={<AssignedTasks />} />}
          />
          <Route
            path="/my-tasks"
            element={<PrivateRoute element={<MyTasks />} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
