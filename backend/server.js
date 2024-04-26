import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import thoughtRoutes from "./routes/thoughtRoutes.js";

const port = process.env.PORT;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
connectDB();

// Checks the state of your MongoDB connection
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    // 1 = Connected
    next();
  } else {
    // 0 = Disconnected
    res.status(503).json({ error: "Service unavailable" });
  }
});

// ROUTES
app.get("/", (req, res) => {
  res.json(listEndpoints(app)); // List all endpoints of the server
});

// Route definitions
app.use(thoughtRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} 🟢`);
});
