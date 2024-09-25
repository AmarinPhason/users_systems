import express from "express";
import {
  deleteMyAccountCtrl,
  deleteUserByIdCtrl,
  forgotPasswordCtrl,
  getAllUsersCtrl,
  getMyProfileCtrl,
  getUserByIdCtrl,
  getUsername,
  getUsersNameAndProfileImageCtrl,
  googleOAuthCtrl,
  loginCtrl,
  logoutCtrl,
  nameAndImage,
  registerCtrl,
  resetPasswordCtrl,
  updateProfileCtrl,
} from "../controllers/users.controller.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/authMiddleware.js";
import { singleUpload } from "../utils/multer.js";
const userRouter = express.Router();
// methods GET
userRouter.get("/all-users", authMiddleware, getAllUsersCtrl);
userRouter.get("/my-profile", authMiddleware, getMyProfileCtrl);
userRouter.get("/user/:id", authMiddleware, getUserByIdCtrl);
userRouter.get("/all-username-and-profile", getUsersNameAndProfileImageCtrl);
userRouter.get("/user-image", nameAndImage);
userRouter.get("/username", authMiddleware, getUsername);

// methods POST
userRouter.post("/register", registerCtrl);
userRouter.post("/login", loginCtrl);
userRouter.post("/logout", logoutCtrl);
userRouter.post("/forgot-password", forgotPasswordCtrl);
userRouter.post("/google", googleOAuthCtrl);
// methods PUT
userRouter.put(
  "/update-profile",
  authMiddleware,
  singleUpload,
  updateProfileCtrl
);
userRouter.put("/reset-password/:token", resetPasswordCtrl);
// methods DELETE
userRouter.delete(
  "/delete-user/:id",
  authMiddleware,
  adminMiddleware,
  deleteUserByIdCtrl
);

userRouter.delete("/delete-account", authMiddleware, deleteMyAccountCtrl);
export default userRouter;
