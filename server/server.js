import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import { dirname } from "path";
import path from "path";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import { dbConnect } from "./database/dbConnect.js";
import { errorHandler, routeNotFound } from "./middlewares/errorHandler.js";
import userRouter from "./routes/user.route.js";
import helmet from "helmet";
import noteRouter from "./routes/note.rote.js";
import taskRouter from "./routes/task.route.js";
dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 50 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : "https://users-systems.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"], // อนุญาตเฉพาะ HTTP methods ที่ระบุ
  allowedHeaders: ["Content-Type", "Authorization"], // อนุญาตเฉพาะ headers ที่ระบุ
  credentials: true, // อนุญาตให้ส่ง credentials (เช่น cookies) ข้าม origin
  optionsSuccessStatus: 200,
};
const PORT = process.env.PORT || 8080;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(limiter);
app.use(cors(corsOptions));
// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes", noteRouter);
app.use("/api/v1/tasks", taskRouter);

app.get("/test", (req, res) => {
  res.send("Hello World2!");
});
app.get("/test2", (req, res) => {
  res.send("Hello World2!");
});
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Error Handler
app.use(routeNotFound);
app.use(errorHandler);

// Start Server
const StartServer = async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`server in running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
StartServer();
