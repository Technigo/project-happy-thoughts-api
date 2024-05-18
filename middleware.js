// middleware.js
import mongoose from "mongoose";

// Middleware to check MongoDB connection status
export const mongoConnectionMiddleware = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable." });
  }
};
