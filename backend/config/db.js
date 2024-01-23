import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();

// Define an asynchronous function 'connectDB' to connect to the MongoDB database.
export const connectDB = asyncHandler(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to mongoDB 🟢`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the Node.js process with an exit code of 1 to indicate an error.
  }
});
