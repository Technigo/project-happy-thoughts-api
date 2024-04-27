import express from "express";
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
app.use("/api", thoughtsRouter);

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
