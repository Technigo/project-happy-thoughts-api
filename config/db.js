import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

dotenv.config();

// Try to follow the class example and breakdown this part

// Keeping the following comment from the example for my reference in the future
// Attempt to connect to the MongoDB database using the URL from the environment variables
// Mongoose Method: mongoose.connect()
// Description: This line of code serves the crucial purpose of connecting the Node.js application to the MongoDB database specified by the URL provided in the environment variable MONGO_URL. Once this connection is established, the application can perform various database operations, such as querying and modifying data in the MongoDB database. It's a critical step in setting up the database connection for the application to work with MongoDB.

export const connectDB = asyncHandler(async () => {
  try {
    mongoose.set("strictQuery", false);
    const mongoUrl =
      process.env.MONGO_URI ||
      "mongodb://localhost/project-happy-thoughts-backend";
    mongoose.Promise = Promise;

    const connect = await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Mongo DB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);

    process.exit(1);
  }
});
