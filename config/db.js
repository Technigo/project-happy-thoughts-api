import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = asyncHandler(async () => {
  try {
    // Attempt to connect to the MongoDB database using the URL from the environment variables
    // Mongoose Method: mongoose.connect()
    // Description: This line of code serves the crucial purpose of connecting the Node.js application to the MongoDB database specified by the URL provided in the environment variable MONGO_URL. Once this connection is established, the application can perform various database operations, such as querying and modifying data in the MongoDB database. It's a critical step in setting up the database connection for the application to work with MongoDB.
    const connect = await mongoose.connect(process.env.MONGO_URL);

    // If the connection is successful, log a message indicating that the MongoDB is connected
    console.log(`Mongo DB Connected: ${connect.connection.host}`);
  } catch (error) {
    // If an error occurs during the connection attempt, log the error message
    console.log(error);

    // Exit the Node.js process with an exit code of 1 to indicate an error
    process.exit(1);
  }
});
