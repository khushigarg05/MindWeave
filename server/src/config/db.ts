import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("MongoDB Connected");
    console.log(
      "MongoDB Database:",
      mongoose.connection.name
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}