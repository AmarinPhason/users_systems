import { AppError } from "../middlewares/errorHandler.js";
import { Task } from "../models/task.model.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/feature.js";
import path from "path";

// Create Task

export const createTask = async (req, res, next) => {
  const { title, description, assignedTo, dueDate, priority } = req.body;

  try {
    let image = {
      public_id: null,
      url: "https://via.placeholder.com/150", // ค่า default สำหรับงานที่ไม่มีรูป
    };

    if (req.file) {
      const file = getDataUri(req.file);
      const publicId = `users/${req.user.username}/tasks_images/${
        path.parse(req.file.originalname).name
      }`;

      const cdb = await cloudinary.v2.uploader.upload(file.content, {
        public_id: publicId, // กำหนด public_id พร้อมโฟลเดอร์เฉพาะ
        resource_type: "image",
        overwrite: true,
      });

      // อัปเดตค่า image จากข้อมูลที่อัปโหลดสำเร็จ
      image = {
        public_id: cdb.public_id,
        url: cdb.secure_url,
      };
    }

    // สร้าง Task ใหม่พร้อมข้อมูลที่ได้รับ
    const newTask = new Task({
      title,
      description,
      assignedTo,
      image, // เก็บเป็น object ที่มี public_id และ url
      dueDate,
      priority,
      createdBy: req.user.id,
    });

    const savedTask = await newTask.save();
    const populateCreatedBy = await Task.findById(savedTask._id).populate(
      "createdBy", // ชื่อ field ที่ต้องการ populate
      "username" // เฉพาะ field ที่ต้องการดึงมาแสดง เช่น username
    );

    // ส่งผลลัพธ์กลับไป
    res.status(201).json({
      message: "Task created successfully",
      data: populateCreatedBy,
    });
  } catch (error) {
    next(error);
  }
};

// My Tasks
export const myTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id }).populate(
      "assignedTo",
      "username"
    );
    res.status(200).json({
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};
// Assigned Tasks

export const assignedTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate({
        path: "assignedTo",
        select: "username",
      })
      .populate("createdBy", "username");
    res.status(200).json({
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};
// Update Task

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, dueDate, priority, status } =
      req.body;

    // ค้นหางานที่ต้องการอัปเดต
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    let image = task.image; // เก็บค่า image เก่าของงาน
    if (req.file) {
      const file = getDataUri(req.file);

      // ตรวจสอบว่า public_id ของภาพเก่ามีอยู่หรือไม่
      if (image && image.public_id) {
        await cloudinary.v2.uploader.destroy(image.public_id);
      } else {
        console.log("No previous image to delete.");
      }

      const publicId = `users/${req.user.username}/tasks_images/${
        path.parse(req.file.originalname).name
      }`;
      const cdb = await cloudinary.v2.uploader.upload(file.content, {
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
      });

      // อัปเดตค่า image จากข้อมูลที่อัปโหลดสำเร็จ
      image = {
        public_id: cdb.public_id,
        url: cdb.secure_url,
      };
    }

    // อัปเดตงานในฐานข้อมูล
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        assignedTo,
        dueDate,
        priority,
        status,
        image, // ใช้ค่า image ที่อัปเดต
      },
      { new: true } // ส่งคืนเอกสารที่อัปเดตแล้ว
    );

    res.status(200).json({
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Task

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ตรวจสอบว่า public_id ของภาพเก่ามีอยู่หรือไม่
    if (task.image && task.image.public_id) {
      await cloudinary.v2.uploader.destroy(task.image.public_id);
    } else {
      console.log("No previous image to delete.");
    }

    // ลบงานในฐานข้อมูล
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
