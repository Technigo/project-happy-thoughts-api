// Importing necessary modules and setting up Express app
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import thoughtRoutes from "./routes/thoughtRoutes"
import dotenv from "dotenv";
dotenv.config();// Load environment variables from the .env file
mongoose.set("strictQuery", false);//Addressing the deprecation warning

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Using the routes to handle API requests
app.use(thoughtRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
