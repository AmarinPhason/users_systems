import { AppError } from "../middlewares/errorHandler.js";
import { Note } from "../models/note.model.js";

// Create Note
export const createNote = async (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  try {
    if (!title || !content) {
      return next(new AppError("Title and content are required", 400));
    }
    const note = await Note.create({ title, content, user: userId });
    const newNote = await Note.findById(note._id).populate({
      path: "user",
      select: "username",
    });

    res.status(201).json({
      message: "Note created successfully",
      data: newNote,
    });
  } catch (error) {
    next(error);
  }
};

// Get My Notes
export const getMyNotes = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const notes = await Note.find({ user: userId }).populate({
      path: "user",
      select: "username",
    });
    const countDoc = await Note.countDocuments();
    res.status(200).json({
      message: "Notes fetched successfully",
      count: countDoc,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

// Get note by ID
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id).populate({
      path: "user",
      select: "username",
    });
    if (!note) {
      return next(new AppError("Note not found", 404));
    }
    res.status(200).json({
      message: "Note fetched successfully",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

// Update Note
export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!note) {
      return next(new AppError("Note not found", 404));
    }

    const updatedNote = await Note.findById(note._id).populate({
      path: "user",
      select: "username",
    });
    res.status(200).json({
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Note
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return next(new AppError("Note not found", 404));
    }
    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
