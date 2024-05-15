import cors from "cors";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

import Thought from "./models/Thoughts";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({
      success: false,
      message: "Service unavailable",
    });
  }
});

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

// Get all thoughts
app.get("/thoughts", async (req, res) => {
  try {
    // Sort by createdAt in descending order & limit the results to 20
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);

    if (thoughts.length > 0) {
      res.status(200).json({
        success: true,
        response: thoughts,
        message: "Thoughts retrieved successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        response: error,
        message: "No thoughts found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Internal server error",
    });
  }
});

// Post a thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json({
      success: true,
      response: newThought,
      message: "Thought created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Thought could not be created",
    });
  }
});

// Like a post
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    // Find the thought by ID and increment its hearts property by one
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (updatedThought) {
      res.status(201).json({
        success: true,
        response: updatedThought,
        message: "Thought liked successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        response: error,
        message: "No thought was found with that ID",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Internal server error",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
