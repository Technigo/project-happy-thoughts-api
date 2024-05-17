import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import Thought from "./models/Thought";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-happy-thought-mongo";
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

// Get Thoughts - return a maximum of 20 thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Post Thoughts - create a new thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  if (!message || message.length < 5 || message.length > 140) {
    return res
      .status(400)
      .json({ message: "Message must be between 5 and 140 characters" });
  }

  try {
    const thought = new Thought({ message });
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    res.status(500).json({ message: "Interal server error" });
  }
});

// Post Thought/ThoughtId/like - heart count for a specific thought
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found " });
    }

    thought.hearts += 1;
    const updatedThought = await thought.save();
    res.status(200).json(updatedThought);
  } catch (error) {
    res.status(500).json({ message: "Internal server error " });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
