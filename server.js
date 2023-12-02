import express from "express";// Express is a web framework for Node.js
import cors from "cors"; // CORS (Cross-Origin Resource Sharing) middleware for Express
import mongoose from "mongoose"; // Mongoose is an ODM (Object Data Modeling) library for MongoDB
import thoughtRoute from "./routes/thoughtRoute";// Importing the routes defined in thoughtRoute.js
import dotenv from "dotenv";// Load environment variables from a .env file

// Load environment variables from a .env file
dotenv.config();

// Set a configuration option for Mongoose to allow more flexible queries
mongoose.set("strictQuery", false);

// Define the MongoDB connection URL, default to a local database
const mongoUrl = process.env.MONGO_URI || "mongodb://localhost/project-mongo";

// Connect to the MongoDB database
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Use native promises with Mongoose
mongoose.Promise = Promise;

// Define the port the server will run on, default to 8080
const port = process.env.PORT || 8080;
// Create an instance of the Express application
const app = express();

// Enable CORS middleware to handle cross-origin requests
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Use the thought routes defined in thoughtRoute.js
app.use("/", thoughtRoute);

// Error handling middleware - this will catch and handle errors in the application
app.use((err, req, res, next) => {
  // Log the error to the console
  console.error(err.stack);

  // Send a 500 Internal Server Error response with a JSON object
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

