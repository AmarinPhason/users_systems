import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ชี้ไปที่ User Model
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled", "on-hold"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      default: () => {
        const now = new Date();
        return new Date(now.setDate(now.getDate() + 3)); // เพิ่ม 7 วันจากวันที่ปัจจุบัน
      },
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ผู้สร้างงาน
      required: true,
    },
    image: {
      public_id: {
        type: String,
        default: null,
      },
      url: {
        type: String,
        default: "https://via.placeholder.com/150", // ค่า default สำหรับงานที่ไม่มีรูป
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model("Task", taskSchema, "tasks");
