import express from "express";
import {
  createNote,
  deleteNote,
  getMyNotes,
  getNoteById,
  updateNote,
} from "../controllers/note.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const noteRouter = express.Router();
// methods GET
noteRouter.get("/my-notes", authMiddleware, getMyNotes);
noteRouter.get("/note/:id", authMiddleware, getNoteById);
// methods POST
noteRouter.post("/create", authMiddleware, createNote);
// methods PUT
noteRouter.put("/note/:id", authMiddleware, updateNote);
// methods DELETE
noteRouter.delete("/note/:id", authMiddleware, deleteNote);
export default noteRouter;
