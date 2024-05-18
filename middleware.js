// middleware.js
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

// Middleware to enable CORS
export const corsMiddleware = cors();

// Middleware to parse JSON bodies
export const jsonMiddleware = express.json();

// Middleware to check MongoDB connection status
export const mongoConnectionMiddleware = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable." });
  }
};
