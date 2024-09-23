import express from "express";
import {
  createTask,
  myTasks,
  assignedTasks,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../utils/multer.js";
const taskRouter = express.Router();
// methods GET
taskRouter.get("/my-tasks", authMiddleware, myTasks);
taskRouter.get("/assigned-tasks", authMiddleware, assignedTasks);

// methods POST
taskRouter.post("/create", authMiddleware, singleUpload, createTask);
export default taskRouter;

// methods PUT
taskRouter.put("/update/:id", authMiddleware, singleUpload, updateTask);
// methods DELETE
taskRouter.delete("/delete/:id", authMiddleware, deleteTask);
