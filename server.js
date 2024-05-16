import cors from "cors";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

import Thought from "./models/Thought";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts";
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

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

// Get all thoughts
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .exec();
  res.json(thoughts);
});

// Post a thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    if (message) {
      const newThought = await new Thought({ message }).save();
      res.status(201).json(newThought);
    } else {
      throw new Error("No message input...");
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      message: "Could not save the thought...",
    });
  }
});

// Like a post
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const post = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $inc: { hearts: 1 },
      },
      { new: true }
    ).exec();
    res.status(201).json(post);
  } catch (error) {
    if (error.name === "CastError") {
      error.message = `There's no post matching id:${thoughtId}`;
    }
    res.status(400).json({
      success: false,
      error: error.message,
      message: "Could not like the thought...",
    });
  }
});

//unlike a post
app.post("/thoughts/:thoughtId/unlike", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const post = await Thought.findOneAndUpdate(
      { _id: thoughtId, hearts: { $gte: 1 } },
      {
        $inc: { hearts: -1 },
      },
      { new: true, runValidators: true }
    ).exec();
    if (post) {
      res.status(201).json(post);
    } else {
      throw new Error("The post's like is 0 hence cannot be unliked");
    }
  } catch (error) {
    if (error.name === "CastError") {
      error.message = `There's no post matching id:${thoughtId}`;
    }
    res.status(400).json({
      success: false,
      error: error.message,
      message: "Could not like the thought...",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
