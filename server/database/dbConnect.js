import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB connected ${conn.connection.host} `);
    } else {
      const conn = await mongoose.connect("mongodb://localhost:27017/users");
      console.log(`MongoDB connected ${conn.connection.host} `);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
