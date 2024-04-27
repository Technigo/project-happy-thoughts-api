import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"; // Import CORS module
import thoughtsRouter from "./routes/ThoughtsRoutes";

// Load environment variables
dotenv.config();

// Initialize express application
const app = express();
const port = process.env.PORT || 9090;

// Set mongoose options
mongoose.set("strictQuery", false);

// CORS Configuration
// Adjust the 'origin' to match the URL of your frontend when deployed
app.use(
  cors({
    origin: "http://localhost:5173", // This allows your frontend to make requests to your backend
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

// Middleware
app.use(express.json());
// Middleware to parse URL-encoded forms
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", thoughtsRouter);

// Importing listEndpoints using CommonJS syntax
const listEndpoints = require("express-list-endpoints");

// Test to see if it logs correctly
console.log(listEndpoints); // Should now log the function

// Root endpoint to list all endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app); // Pass the app instance
  res.json({ endpoints });
});

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URI;
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

/*import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import thoughtsRouter from "./routes/ThoughtsRoutes";

// Load environment variables
dotenv.config();

// Initialize express application
const app = express();
const port = process.env.PORT || 9090;

// Set mongoose options
mongoose.set("strictQuery", false);

// Middleware
app.use(express.json());

// Routes
app.use("/", thoughtsRouter);

// Importing listEndpoints using CommonJS syntax
const listEndpoints = require("express-list-endpoints");

// Test to see if it logs correctly
console.log(listEndpoints); // Should now log the function

// Root endpoint to list all endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app); // Pass the app instance
  res.json({ endpoints });
});

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URI;
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
*/
